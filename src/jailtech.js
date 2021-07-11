//fuffer plugin, so smol
import firebase from "firebase/app";
import "firebase/firestore";
import { Jail } from "./jail";
import { arrayMessage } from "./widgets/authdb";

export const postIdToSubdocument = (postId, keepalive) => {
  //hydratePost (banned on Medium.com vianickcarducci.medium.com, 5/2021)
  if (!postId.startsWith("")) return null;
  const id = postId.replace(/^[a-zA-Z]/g, "");
  const collection = postId.substring(0, postId.indexOf(id));
  //return { id, collection };
  const free = Jail(
    //for each: foo = {...doc.data(),doc.id}
    firebase.firestore().collection(collection).doc(id),
    keepalive,
    null, //sort for firestore orderBy { order: "time", by: "desc" }
    null, //near for geofirestore { center: near.center, radius: near.distance }
    //sort && near => cannot be true (coexist, orderBy used by geohashing)
    14, //limit
    null, //startAfter
    null //endBefore
  );
  //Jail always returns an array, handle as such (here, single ".doc(")
  const doc = free.docs[0];
  if (doc.exists) {
    var foo = doc.data();
    foo.collection = collection;
    foo.id = id;
    foo.messageAsArray = foo.message ? arrayMessage(foo.message) : [];
    return foo;
  }
};
