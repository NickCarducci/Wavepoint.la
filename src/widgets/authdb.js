import PouchDB from "pouchdb";
import upsert from "pouchdb-upsert";

//for purpose of matching specialFormatting() with underscore
export const uriParser = (x) =>
  x &&
  //replace/regex exclude-negated [set-of-tokens], doesn't work/parse for (%[A-Fa-f0-9]{2})+
  //decodeURI() does the same I believe, but this will always return a string,
  //without an error object
  //a-z or A-Z includes underscore '_' but not space whitespace, nor (\r\n|\r|\n)+
  x.replace(/(%[A-Fa-f0-9]{2})+[^a-zA-Z0-9-+ ]+/g, "_");
export const standardCatch = (err) => console.log(err.message);
export const arrayMessage = (message) =>
  message
    .toLowerCase()
    //capture or, excluding set, match 2 or more of the preceding token
    .replace(/((\r\n|\r|\n)+[^a-zA-Z#]+_+[ ]{2,})+/g, " ")
    .split(" ");
export const specialFormatting = (x, numbersOk) =>
  x
    .toLowerCase()
    //replace or regex a-z or A-Z includes space whitespace
    .replace(!numbersOk ? /[^a-zA-Z,']+/g : /[^a-zA-Z0-9,']+/g, " ")
    .split(" ")
    .map((word) => {
      var end = word.substring(1);
      if (word.includes("'")) {
        var withapos = word.lastIndexOf("'");
        var beginning = word.substring(1, withapos);
        if (beginning.length === 1) {
          end =
            beginning +
            "'" +
            word.charAt(withapos + 1).toUpperCase() +
            word.substring(withapos + 2);
        }
      }
      var resword = word.charAt(0).toUpperCase() + end;
      return ["Of", "And", "The"].includes(resword)
        ? resword.toLowerCase()
        : arrayMessage(resword).join(" ");
    })
    .join(" ");
export const abbreviateNumber = (num) => {
  var newnum = String(num);
  var app = null;
  const suff = ["", "k", "m", "b", "t"];
  for (let i = 0; i < suff.length; i++) {
    if (newnum.length > 3) {
      newnum = newnum.substring(0, newnum.length - 3);
    } else {
      app = i;
      break;
    }
  }
  return newnum + suff[app];
};

export const randomString = (length, chars) => {
  var mask = "";
  if (chars.indexOf("a") > -1) mask += "abcdefghijklmnopqrstuvwxyz";
  if (chars.indexOf("A") > -1) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (chars.indexOf("#") > -1) mask += "0123456789";
  if (chars.indexOf("!") > -1) mask += "~`!@#$%^&*()_+-={}[]:\";'<>?,./|\\";
  var result = "";
  for (var i = length; i > 0; --i)
    result += mask[Math.floor(Math.random() * mask.length)];
  return result;
};

export const shortHandCollection = (collection) =>
  ["forum", "oldBudget"].includes(collection)
    ? collection
    : collection === "oldCases"
    ? "oldCases"
    : collection === "oldElections"
    ? "oldElection"
    : collection === "elections"
    ? "elections"
    : collection === "cases"
    ? "cases"
    : collection === "budget"
    ? "budget"
    : "forum";
export const shortHandId = (parent) => {
  return shortHandCollection(parent.collection) + parent.id;
};
const yes = (auth, foo, community) => {
  var isManager =
    foo &&
    ((foo.members && foo.members.includes(auth.uid)) ||
      (foo.admin && foo.admin.includes(auth.uid)) ||
      foo.authorId === auth.uid);
  var isOwner =
    (community.members && community.members.includes(auth.uid)) ||
    (community.faculty && community.faculty.includes(auth.uid)) ||
    (community.admin && community.admin.includes(auth.uid)) ||
    community.authorId === auth.uid;
  return isOwner || isManager;
};
export const canIView = (auth, foo, community) =>
  !community ||
  !(community.privateToMembers || (foo && foo.privateToCommunity)) ||
  yes(auth, foo, community);

/*navigator.permissions && navigator.permissions.query({name: 'geolocation'})
.then(function(PermissionStatus) {
  if (PermissionStatus.state == 'granted') {
        //allowed
  } else if (PermissionStatus.state == 'prompt') {
        // prompt - not yet grated or denied
  } else {
      //denied
  }
})*/
/*const getPermissions = () =>
navigator.permissions
.query({ name: "geolocation" })
.then((permissionStatus) => {
permissionStatus.onchange = (state) => {
  //'granted', 'denied', or 'prompt'.
  if (state === "denied") {
    this.setState({ deviceLocation: false });
  }
  console.log(state);
};
})
.catch(standardCatch);*/

const setByMapbox = async (latitude, longitude) =>
  await fetch(
    //`https://atlas.microsoft.com/search/address/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${latitude},${longitude}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
  )
    .then(async (response) => await response.json())
    .then((body) => {
      var city = body.features[0].place_name;
      if (city) {
        var center = body.features[0].center;
        return [city, center];
      } else return true;
    })
    .catch(() => true);

export const handleLocation = async (
  place_name,
  deviceLocation,
  lastCoords
) => {
  let getLoc = null;
  if (!deviceLocation) {
    if (!navigator.geolocation)
      return window.alert(
        "Geolocation is not supported by your browser " + navigator.userAgent
      );
    getLoc = true;
  } else if (deviceLocation === "red") {
    window.alert(
      "your browser-settings do not allow this site to access your location"
    );
    var answer = window.confirm(`travel to ${place_name}?`);
    //stops all processes, so...
    if (answer) return place_name;
    getLoc = true;
  } else {
    var answer1 = window.confirm(`travel to ${deviceLocation.place_name}?`);
    if (answer1) return true;

    answer1 = window.confirm("get location again?");
    if (!answer1) return null;
    getLoc = true;
  }
  if (getLoc) {
    return await new Promise((resolve) => {
      var opts = { enableHighAccuracy: true };
      opts.timeout = 5000;
      opts.maximumAge = Infinity;
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const strshortner = (str) =>
            Number(str.slice(0, str.lastIndexOf(".") + 4));
          var center = [
            strshortner(String(position.coords.longitude)),
            strshortner(String(position.coords.latitude))
          ];
          if (
            !lastCoords ||
            (Math.abs(lastCoords[0] - center[0]) > 0.01 &&
              Math.abs(lastCoords[1] - center[1]) > 0.01)
          ) {
            const sbm = await setByMapbox(...center);
            var bun = null; //promised object
            if (sbm) {
              bun = { deviceLocation: { place_name, center } };
              if (sbm !== true) {
                bun.mapbox = sbm;
                //["Fair Haven, New Jersey, United States", Array(2)]
                console.log("mapbox " + sbm);
              }
              return bun && resolve(JSON.stringify(bun));
            }
          } else {
            console.log("same place " + lastCoords);
            return resolve(JSON.stringify({ lastCoords }));
          }
        },
        (positionError) => resolve(JSON.stringify(positionError)),
        opts
      );
    });
  } else
    console.log(
      "your browser bypassed location by navigator.geolocation.getCurrentPosition"
    );
}; /*

export class PDB {
  constructor(name) {
    this.db = new PouchDB("thumbprint");
  }
  async getAllNotes() {
    let allNotes = await this.db
      .allDocs({ include_docs: true })
      .catch(standardCatch);
    let notes = {};

    allNotes.rows.forEach((n) => (notes[n.id] = n.doc));

    return notes;
  }

  async createNote(note) {
    note.createdAt = new Date();
    note.updatedAt = new Date();

    const res = note._id
      ? await this.db.put({ ...note }).catch((err) => {
          if (err.message === "Document update conflict") {
            this.updateNote(note);
          }
          console.log(err.message);
        })
      : await this.db
          .post({ ...note })
          .then(() => "success")
          .catch(standardCatch);

    return res;
  }
  async updateNote(note) {
    note.updatedAt = new Date();

    const res = await this.db.put({ ...note }).catch(standardCatch);
    return res;
  }

  async deleteNote(note) {
    await this.db.remove(note).catch(standardCatch);
  }
}*/

/**
 *
 * destroy, read, set pouch-db handler(s)
 */
const deletion = (d, db) => db.remove(d).catch(standardCatch);
const destroy = (db) => db.destroy();
const set = (db, c) =>
  !c._id
    ? window.alert(
        "pouchdb needs ._id key:value: JSON.parse= " + JSON.parse(c)
      ) &&
      db
        .destroy()
        .then(() => null)
        .catch(standardCatch)
    : db //has upsert plugin from class constructor
        .upsert(c._id, (copy) => {
          copy = { ...c }; //pouch-db \(construct, protocol)\
          return copy; //return a copy, don't displace immutable object fields
        })
        .then(
          () => null /*"success"*/
          /** or
          notes.find((x) => x._id === c._id)
            ? this.db
              .post(c)
              .then(() => null)
              .catch(standardCatch)
          : deletion(c) && set(db, c);  
          */
        )
        .catch(standardCatch);
const read = async (db, notes /*={}*/) =>
  //let notes = {};
  await db
    .allDocs({ include_docs: true })
    .then(
      (
        allNotes //new Promise cannot handle JSON objects, Promise.all() doesn't
      ) =>
        Promise.all(
          allNotes.rows.map(async (n) => await (notes[n.doc.key] = n.doc))
        )
      // && and .then() are functionally the same;
    )
    .catch(standardCatch);

const optsForPouchDB = {
  revs_limit: 1, //revision-history
  auto_compaction: true //zipped...
};
export class PDB {
  //Random Scope for API security
  constructor(name) {
    PouchDB.plugin(upsert);
    const title = "thumbprint";
    this.db = new PouchDB(title, optsForPouchDB);
  }
  deleteNote = (note) => deletion(note, this.db);
  deleteKeys = () => destroy(this.db);
  getAllNotes = async () =>
    //let notes = {};
    await read(this.db, {});
  createNote = async (note) => {
    const dated = async (copy = { ...note }) =>
      await read(this.db, {})
        .then((notes) => {
          /*var result = Object.keys(notes).map(key => {
        return notes[key];
        }); 
        this.props.setForumDocs({ notes, noteCount: result });*/
          if (notes.find((x) => x._id === copy._id))
            copy.createdAt = new Date();
          copy.updatedAt = new Date();
          return copy;
        })
        .catch(standardCatch);
    return await (dated &&
    !dated.STATUS /*||err.message === "Document update conflict"*/ &&
      set(this.db, dated));
  };
}
export class DODB {
  //Display Preferences
  constructor(name) {
    PouchDB.plugin(upsert);
    const title = "displayOptions";
    this.db = new PouchDB(title, optsForPouchDB);
  }
  deleteKeys = () => destroy(this.db);
  setPreferences = (key) => set(this.db, key);
  readPreferences = async (notes = {}) =>
    //let notes = {};
    await read(this.db, notes);
}

export class SDB {
  //Random Scope for API security
  constructor(name) {
    PouchDB.plugin(upsert);
    const title = "scopekey";
    this.db = new PouchDB(title, optsForPouchDB);
  }
  deleteKeys = () => destroy(this.db);
  setKey = (key) => set(this.db, key);
  readKey = async (notes = {}) =>
    //let notes = {};
    await read(this.db, notes);
}

export class RSA {
  //Key-Box device query Asymmetric-Encryption
  constructor(name) {
    PouchDB.plugin(upsert);
    const title = "rsaPrivateKeys";
    this.db = new PouchDB(title, optsForPouchDB);
  }
  deleteKey = (keybox) => deletion(keybox, this.db);

  //deleteKeys = async () => await destroy(this.db);
  setPrivateKey = (key) => set(this.db, key);
  readPrivateKeys = async (notes = {}) =>
    //let notes = {};
    await read(this.db, notes);
}

export class CDB {
  //Country caching for phone-input module-dependency
  constructor(name) {
    PouchDB.plugin(upsert);
    const title = "meCountry";
    this.db = new PouchDB(title, optsForPouchDB);
  }
  deleteKeys = () => destroy(this.db);
  setCountry = (key) => set(this.db, key);
  readCountry = async (notes = {}) =>
    //let notes = {};
    await read(this.db, notes);
}

export class ADB {
  constructor(name) {
    PouchDB.plugin(upsert);
    const title = "meAuth";
    this.db = new PouchDB(title, optsForPouchDB);
  }
  deleteKeys = () => destroy(this.db);
  store = (key) => set(this.db, key);
  readAuth = async (notes = {}) =>
    //let notes = {};
    await read(this.db, notes);
}

export const parseAuthObj = (meAuth) => {
  var {
    uid,
    displayName,
    photoURL,
    email,
    emailVerified,
    phoneNumber,
    isAnonymous,
    tenantId,
    providerData,
    apiKey,
    appName,
    authDomain,
    stsTokenManager,
    refreshToken,
    accessToken,
    expirationTime,
    redirectEventId,
    lastLoginAt,
    createdAt,
    multiFactor
  } = meAuth;
  return {
    _id: uid,
    uid,
    displayName,
    photoURL,
    email,
    emailVerified,
    phoneNumber,
    isAnonymous,
    tenantId,
    providerData,
    apiKey,
    appName,
    authDomain,
    stsTokenManager,
    refreshToken,
    accessToken,
    expirationTime,
    redirectEventId,
    lastLoginAt,
    createdAt,
    multiFactor: JSON.stringify(multiFactor)
  };
};
