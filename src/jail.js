import { useEffect, useRef, useState, useCallback } from "react";
import { postIdToSubdocument } from "./jailtech";
import { arrayMessage } from "./widgets/authdb";
import JailClass from "./jailClass";

const functions = [];
const functionRefs = new Set();
const Jail = (
  snapshotQuery,
  keepalive,
  sort,
  near, //sort && near cannot be true (coexist, orderBy used by geohashing)
  limit,
  startAfter,
  endBefore,
  verbose //REFER TO Readme.md
) => {
  keepalive = keepalive ? keepalive : 3600000;
  //no need for async await here in database-jail. React.funcs seem to abstract
  //___(not-Promises) for that async await is unneccesary functions run once,
  //insofarthatso [async/await, Promises] aren't handled
  var jail = useRef(false); //Object.values(functionRefs).length > 0
  //references "this." function
  const match =
    snapshotQuery._delegate._query.path.segments.join(",") +
    "/" +
    snapshotQuery._delegate._query.path.fields
      .map((x) => x.segments.join(""))
      .join(","); //String(snapshotQuery);
  var current = functionRefs.find((f) => f.id === match);
  if (!functions.includes(match)) {
    functions.push(match);
    if (!current) {
      jail = current; //otherwise, use functionRefs.remove(jail.current);,
      functionRefs.add(jail.current);
    }
  }
  //const thisFunc = functionRefs.find(x=>x.id===String(snapshotQuery))
  // is exported from outside this()/jail/"JailFunction"
  //The purpose of this func is [non-scalar, linear], idle longpolling, or to
  //restart keepalive/buffer-if-time-is-more-than-exponentially-related
  //How to use firebase-firestore's official experiment for this:
  /*firebase.initializeApp(firebaseConfig);
    firebase.firestore().settings({ experimentalForceLongPolling: true });*/
  //const close = onSnapshot() will not depreciate, as an experiment might
  //Description by me is: long-polling for react, [as abstracted] as "keepalive" is in python,
  //+/which is(?) how firestore.settings({longPolling}))'s for firebase firestore "onSnapshot"
  //also & primarily to lessen concurrent snapshot listeners whilst maintaining live data
  const [close, joist] = useState(null); //closeSnapshot, function-in-state
  //to close:()=>{}; in "useState"/updateState, update-state
  //close /*ready*/ &&
  //variables must be defined inside useEffect, if used in it...
  const [docs, updateSet] = useState(null);
  const query = near
    ? snapshotQuery.near(near)
    : sort && sort.order
    ? snapshotQuery.orderBy(sort.order, sort.by ? sort.by : "desc")
    : snapshotQuery;
  const queryWithFixins = startAfter
    ? query.startAfter(startAfter).limit(limit)
    : endBefore
    ? query.endBefore(endBefore).limitToLast(limit)
    : query.limit(limit);
  const save =
    //hoist in-hoist (here, state)// this isn't tested, I would think this would be automated
    //is saved as function-in-state, runs once
    //easterEgg: classless-functions aren't running Promises (returns or breaks) like classes; so,
    //no need to use Promises, & thense: resolve without waiting. ever.
    //randomEasterEgg: data hydrateUser shows how to snapshot by running twice
    //to notify && get() for subcollectioning/nesting-an-object on the ui/device
    queryWithFixins.onSnapshot(
      (qs /*querySnapshot*/) => {
        //mean: no waiting for update responses to get from,
        //like it as for subobjects/"subdocuments"/subdocument
        let p = 0;
        let dol = [];
        (!match.includes(".doc(") ? qs.docs : [qs]).forEach((doc) => {
          p++;
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            const inx = match.indexOf("collection(");
            foo.collection = match
              .substring(
                inx,
                inx + "collection(".length //_+10
              )
              .substring(
                0,
                foo.collection.indexOf(")") //_+10
              );
            //subdocuments work as snapshot without promises here! forget data.js hydrateUser
            foo.drop = postIdToSubdocument(foo.dropId, keepalive);
            foo.drops = foo.dropIds.map((f) =>
              postIdToSubdocument(f, keepalive)
            );
            foo.messageAsArray = foo.message ? arrayMessage(foo.message) : [];
            dol.push(foo);
          }
        });
        if (qs.docs.length === p) {
          startAfter = qs.docs[qs.docs.length - 1];
          endBefore = qs.docs[0];
          updateSet(dol);
        }
      },
      (err) => console.log(err.message)
    );
  joist(save);

  //timeoutRemountFirebaseSnapshot/"keepalive"
  const [reset, resetCancel] = useState(false);
  const Counting = () => {
    const [result, update] = useState(false);
    useEffect(() => {
      jail.seconds && clearInterval(jail.seconds);
      jail.seconds = setInterval(() => update(keepalive - 1000), 1000);
      return () => clearInterval(jail.seconds);
    }, []);
    return result;
  };
  let aliveFor = Counting();
  if (reset) {
    //aliveFor = Counting();
    this(
      snapshotQuery, //1
      keepalive, //2
      sort, //3
      near, //sort && near => cannot be true (coexist, orderBy used by geohashing)
      limit, //5
      startAfter, //6
      endBefore, //7
      verbose //8
    ); //resetCancel(false)
  } //reset onSnapshot if reset/"reset", with same ref (same String(snapshotQuery)/"match"/JailFunction.id)

  //React: "If your effect returns a function, React will run it
  //[as it would to] clean up" 86*'when it is time to'
  useEffect(() => {
    /**Assignments to the ___ variable from inside React Hook
     * useEffect will be lost after each render. */
    //clearInterval(this.ref) runs when called,
    //restarts keep-alive for "are you still there?" response
    verbose && console.log(docs.length + " results");
    //long-polling for react, [as abstracted] as "keepalive" is in python,
    jail.murder && clearTimeout(jail.murder);
    jail.murder = setTimeout((e) => close(), keepalive); //1hr
    return () => clearTimeout(jail.murder);
  }, [close, docs, keepalive, verbose]); //when call this(), reset/resets count until close()

  //useEffect([foo,bar],effect) should be the firstly-inputted "props" for
  //useEffect(()=>effect(),[foo,bar])
  //effect(() => {return () => {/*componentWillUnmount*/;};});
  //runs when [mounting func-component ["this." or useRef()], [foo,bar]]
  //"[one interpolation begets all of 'props' object anyway]"

  verbose && console.log(functions);
  return {
    docs,
    refresh: useCallback(() => resetCancel(true), []),
    id: match,
    aliveFor,
    startAfter,
    endBefore,
    verbose
  };
};
const fic = Object.values(functionRefs);
const functionCount = fic.length > 0;
export {
  functionRefs,
  functions,
  functionCount,
  Jail,
  JailClass,
  arrayMessage
};

/*const myFunc = forwardRef((props,ref)=>{
  //only takes (props,ref), like:
  useEffect(() => {//not really optional
    clearInterval(ref.current);
    ref.current = setInterval(props.close, keepalive);
    return () => clearInterval(ref.current);//unmount cleanup
  }, [foo,bar]);//when [these change] update, other than onmount mount
})*/

//snapshotQuery._delegate._query.path.segments
