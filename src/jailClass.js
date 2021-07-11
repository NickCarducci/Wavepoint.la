import React from "react";
import { postIdToSubdocument } from "./jailtech";
import { arrayMessage } from "./jail";
const standardCatch = (err) => console.log(err.message);
const fooize = (doc, match, keepalive) => {
  var foo = doc.data();
  foo.id = doc.id;
  const inx = match.indexOf("collection(");
  foo.collection = match.substring(inx, inx + "collection(".length);
  foo.collection.substring(0, foo.collection.indexOf(")"));
  foo.drop = foo.dropId ? postIdToSubdocument(foo.dropId, keepalive) : null;
  foo.drops = foo.dropIds
    ? foo.dropIds.map((f) => postIdToSubdocument(f, keepalive))
    : [];
  foo.messageAsArray = foo.message ? arrayMessage(foo.message) : [];
  return foo;
};
//pass thru forwardRef object of onSnapshot response for Class
/*var functionRefs = new Set();
const fic = Object.values(functionRefs);
const functionCount = fic.length > 0;*/
//window.fuffer = { fmFUFFER: [] };

//snapFuncs = new Set();
class JailClass extends React.Component {
  state = {};

  componentDidUpdate = (prevProps) => {
    if (this.props.jailclasses !== prevProps.jailclasses) {
      this.props.jailclasses.map((x) => {
        const {
          snapshotQuery,
          keepalive,
          sort,
          near, //sort && near cannot be true (coexist, orderBy used by geohashing)
          limit,
          startAfter,
          endBefore,
          verbose, //REFER TO Readme.md
          whenOn
        } = x;
        var alivefor = keepalive ? keepalive : 3600000;
        var seconds = null;
        clearInterval(seconds);
        seconds = setInterval(() => (alivefor = alivefor - 1000), 1000);
        //var jail = useRef(false);
        //var jail = this
        const match =
          snapshotQuery._delegate._query.path.segments.join(",") +
          "/" +
          snapshotQuery._delegate._query.filters
            .map((x) => x.field.segments.join(""))
            .join(",");
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
        var close = queryWithFixins.onSnapshot((qs) => {
          let p = 0;
          let docs = [];
          (!match.includes(".doc(") ? qs.docs : [qs]).forEach((doc) => {
            p++;
            if (doc.exists) {
              var foo = fooize(doc, match, keepalive);
              docs.push(foo);
            }
          });
          if (qs.docs.length === p) {
            //functional-matching match func "fuffer"
            this.props.updateLiberty({
              state: x.state,
              docsOutputLabel: x.docsOutputLabel,
              alivefor,
              match,
              close,
              docs,
              startAfter: qs.docs[qs.docs.length - 1],
              endBefore: qs.docs[0]
            });
          }
          /*if (!window.fuffer.fmFUFFER.includes(match)) {
        console.log(docs);
        console.log(match);
        window.fuffer.fmFUFFER.push(match);
      }*/
        }, standardCatch);
        return null;
      });
    }
    /*if (this.state.reset) {
      this.setState({reset:false},()=>{
      JailClass(
        snapshotQuery,
        keepalive,
        sort,
        near, //sort && near => cannot be true (coexist, orderBy used by geohashing)
        limit,
        startAfter,
        endBefore,
        verbose,
        whenOn
      ); //resetCancel(false)
      })
    }*/
  };
  render() {
    /*const {
      //connection,
      queryWithFixins,
      match,
      keepalive,
      verbose,
      whenOn
    } = this.props;*/
    //const { jailclasses } = this.props;

    //  //long-polling for react, [as abstracted] as "keepalive" is in python,
    //
    //refresh / reset resores keepalive = 1hr with this in new Set of funcs
    //still allows firestore to disconnect as it does its abstracted long polling
    //verbose && console.log(fmFUFFER);

    //RTCDataChannel also requires JSON objects to be strings
    //return product;

    /*await new Promise((resolve) => {
      clearInterval(current.poll);
      current.poll = setInterval(() => {
        product.sendableDocs &&
          resolve(
            JSON.stringify({
              startAfter: product.startAfter,
              endBefore: product.endBefore,
              docs: product.sendableDocs,
              refresh: () => (reset = true),
              id: match,
              alivefor,
              verbose,
              whenOn,
              close: product.close
            })
          );
      }, 6732);
    });*/

    //const snapFuncs = snapFuncs;
    //let first = false;
    //arrow functions are like tiny react apps!, they bind this, et. al
    //var currentExists = Object.values(snapFuncs).find((f) => f.id === match);

    //clearIntervall() && setInterval() would have been useful here
    //to pass the object through a {dataChannel:RTCDataChannel,close:()=>close()}
    //WRONG: but window => dom access is fine, or this page... var(s) at top of page outside
    //default makeshitSnapshot = null
    //REASON: the value is lost, must use RTCDataChannel
    //var current = { id: match };
    /*var current = Object.values(functionRefs).find((f) => f.id === match);
  if (!current) {
    //so this probably always !current
    current = { id: match };
    functionRefs.add(current);
  }*/
    return null;
  }
}
export default JailClass;
//snapshotQuery._delegate._query.path.segments

/*if (first) {
        localizedDocs = docs; //renders on mount
        first = true;
      } else {
        const w2319 = docs.find((x) => {
          const newDoc = dbFUFFER[match].find((y) => y.id === x.id);
          return newDoc !== x;
        });
        if (w2319) localizedDocs.push(w2319);
      }*/

/**
       * 
      clearInterval(dataParent.cancel);
      dataParent.cancel = setInterval(() => {
        var rumble;
        clearInterval(rumble);
        rumble = setInterval(() => {
          if (localizedDocs && localizedDocs.length === 0) {
            return whenOn && console.log(match + " running, nothing new..");
          } else {
            verbose &&
              console.log(
                `upFUFFER upFUFFER hold on we got something (localizedDocs ${match})`
              );
            localizedDocs.map((one) => {
              const rest = sendableDocs.filter((x) => x.id !== one.id);
              verbose && console.log([...rest, one]);
              verbose && console.log("_loading into sendableDocs (docs Array)");
              sendableDocs = [...rest, one]; //window.fuffer.dbFUFFER[match]
              verbose && console.log(sendableDocs);
              //.send thru RTCDataChannel
              return (localizedDocs = localizedDocs.filter(
                (x) => x.id !== one.id
              ));
            });
          }
        }, 3000);
      }, 10000);
       */
/*var receivers = connection.getReceivers();
      console.log(
        receivers.length + " DataChannel-receivers on this RTCPeerConnection"
      );
      const peerId = 65534 - receivers.length;
      const opts = { negotiated: true, id: peerId };
      var datachannel = connection.createDataChannel(
        `label for channel ${match}`,
        opts
      );*/
