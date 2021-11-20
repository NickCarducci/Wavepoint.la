import React from "react";
import PouchDB from "pouchdb";
import upsert from "pouchdb-upsert";
import firebase from "firebase/app";
import "firebase/firestore";
import rsa from "js-crypto-rsa";

class RSA {
  //Key-Box device query Asymmetric-Encryption
  constructor(name) {
    PouchDB.plugin(upsert);
    const title = "rsaPrivateKeys";
    this.db = new PouchDB(title, {});
  }
  deleteKey = async (objectWith_id) => {
    if (Object.keys(objectWith_id).length === 0) {
      return this.db
        .destroy()
        .then(() => "destoyed database")
        .catch(standardCatch);
    } else
      return await this.db
        .remove(objectWith_id)
        .then(() => "cleared errored key")
        .catch(standardCatch);
  };
  //deleteKeys = async () => await destroy(this.db);
  setPrivateKey = async (c) =>
    await this.db //has upsert plugin from class constructor
      .putIfNotExists(c);
  /**
       * 
  setPrivateKey = async (c) =>
    await this.db //has upsert plugin from class constructor
      .upsert(c._id, (c) => {
        console.log("setting key: ", c);
        var copy = { ...c }; //pouch-db \(construct, protocol)\
        return copy; //return a copy, don't displace immutable object fields
      });
       */
  readPrivateKeys = async (notes = {}) => {
    //let notes = {};
    return await this.db
      .allDocs({ include_docs: true })
      .then(
        (allNotes) => {
          //console.log(notes);
          allNotes.rows.forEach((n) => (notes[n.doc.id] = n.doc));
          return notes;
        }
        // && and .then() are functionally the same;
      )
      .catch(standardCatch);
  };
}
const standardCatch = (err) => console.log(err.message);
const arrayMessage = (message) =>
  message
    .toLowerCase()
    //capture or, excluding set, match 2 or more of the preceding token
    .replace(/((\r\n|\r|\n)+[^a-zA-Z]+_+[ ]{2,})+/g, " ")
    .split(" ");
const specialFormatting = (x, numbersOk) =>
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

const deleteFumbledKeys = (keybox, rsaPrivateKeys, deviceCollection) => {
  rsaPrivateKeys
    .readPrivateKeys()
    .then((keysOutput) => {
      const keyBoxes = Object.values(keysOutput);
      var keyboxResult = keyBoxes.find((x) => x.box === keybox.box);
      if (keyboxResult)
        firebase
          .firestore()
          .collection(deviceCollection)
          .doc(keybox._id)
          .delete()
          .then(() =>
            rsaPrivateKeys
              .deleteKey(keyboxResult)
              .then(() => {
                console.log("deleted plan from local " + keybox._id);
                //this.getNotes();
              })
              .catch(standardCatch)
          )
          .catch(standardCatch);
    })
    .catch(standardCatch);
};
class DDB {
  constructor(name) {
    PouchDB.plugin(upsert);
    const title = "deviceName";
    this.db = new PouchDB(title, {
      //revs_limit: 1, //revision-history
      //auto_compaction: true //zipped...
    });
  }
  deleteDeviceName = async (objectWith_id) =>
    await this.db
      .remove(objectWith_id)
      .then(() => {
        this.db.destroy().then(() => console.log("destoyed"));
      })
      .catch(standardCatch);

  destroy = () => this.db.destroy().then(() => console.log("destoyed"));
  storeDeviceName = async (c) =>
    await this.db //has upsert plugin from class constructor
      .putIfNotExists(c);
  readDeviceName = async (notes = {}) =>
    //let notes = {};
    {
      return await this.db
        .allDocs({ include_docs: true })
        .then(
          (allNotes) => {
            allNotes.rows.map((n) => (notes[n.doc.key] = n.doc));
            return notes;
          }
          // && and .then() are functionally the same;
        )
        .catch(standardCatch);
    };
}
class Vintages extends React.Component {
  constructor(props) {
    super(props);
    let ddb = new DDB();
    let rsaPrivateKeys = new RSA();
    this.state = {
      ddb,
      keyBoxes: [],
      devices: [],
      rsaPrivateKeys
    };
  }
  actualize = async (kbs) =>
    await Promise.all(
      kbs
        .map(async (keybox) => {
          if (
            keybox.constructor === Object &&
            (!keybox.box || !keybox.key || Object.keys(keybox).length === 0)
          ) {
            const answer = await this.state.rsaPrivateKeys
              .deleteKey(keybox)
              .catch(standardCatch);
            console.log(answer);
            if (answer === "destoyed database")
              this.setState({
                rsaPrivateKeys: new RSA()
              });
            return null;
          } else return keybox;
        })
        .filter((x) => x)
    );

  findKeys = async (vintage) =>
    await this.state.rsaPrivateKeys
      .readPrivateKeys()
      .then(async (keysOutput) => {
        const kbs = Object.values(keysOutput);
        if (kbs && kbs !== undefined) {
          const keyBoxes = await this.actualize(kbs);
          console.log("keyBoxOutputFilter: ", kbs);
          this.setState(
            {
              keyBoxes
            },
            () =>
              this.props.auth !== undefined &&
              firebase
                .firestore()
                .collection(this.props.deviceCollection)
                .where("authorId", "==", this.props.auth.uid)
                .get()
                .then(async (querySnapshot) => {
                  let devices = [];
                  let p = 0;
                  const deviceBox = keyBoxes.find(
                    (x) => x._id === "device" && vintage === x.vintage
                  );
                  const accountBox = keyBoxes.find(
                    (x) =>
                      x._id === this.props.auth.uid && vintage === x.vintage
                  );
                  querySnapshot.docs.forEach((doc) => {
                    p++;
                    if (doc.exists) {
                      var dev = doc.data();
                      dev.id = doc.id;
                      //thisacc = user.pendingDeviceBoxes.find(x=>x.n===dev.box.n)
                      if (deviceBox) dev.deviceBox = deviceBox;
                      if (accountBox) dev.accountBox = accountBox;
                      if (dev.decommissioned) {
                        var keybox = keyBoxes.find(
                          (x) => x.box.n === dev.box.n
                        );
                        if (keybox)
                          this.state.rsaPrivateKeys
                            .deleteKey(keybox)
                            .catch(standardCatch);
                      } else devices.push(dev);
                    }
                  });
                  if (querySnapshot.docs.length === p) {
                    //console.log(devices);
                    this.setState({ devices });
                  }
                }, standardCatch)
          );
        }
      });

  allowDeviceToRead = async () => {
    const {
      auth,
      user,
      usersPublicable,
      usersPrivate,
      deviceCollection
    } = this.props;
    const { vintageOfKeys, deviceName } = this.state;
    if (auth !== undefined) {
      console.log("FUMBLER");

      if (!deviceName) return window.alert(`please choose a device name`);
      if (!vintageOfKeys) return window.alert(`please choose a vintage name`);
      //https://stackoverflow.com/questions/52675190/firebase-cloud-firestore-initializing-a-collection
      return await this.fumbler(
        usersPublicable,
        usersPrivate,
        deviceName,
        auth.uid, //authorId:
        vintageOfKeys,
        deviceCollection
      );
    } else return window.alert("login you must");
  };
  componentDidMount = () => {
    const { vintageOfKeys, ddb } = this.state;
    const { user } = this.props;
    user !== undefined && this.readDevice(ddb, vintageOfKeys, user);
  };
  componentDidUpdate = (prevProps) => {
    const { vintageOfKeys } = this.state;
    /*if (user !== undefined && user !== prevProps.user) {
      this.readDevice(ddb, vintageOfKeys, user);
    }*/
    if (vintageOfKeys !== this.state.lastVintageName) {
      this.setState({ lastVintageName: vintageOfKeys }, () =>
        this.findKeys(vintageOfKeys)
      );
    }
  };
  readDevice = (ddb, vintageOfKeys, user) =>
    ddb
      .readDeviceName()
      .then((prenotes) => {
        const deviceName = Object.values(prenotes)[0];
        if (deviceName) {
          this.setState({ deviceName: deviceName._id }, () => {
            if (user.defaultVintage) {
              this.setState({
                //setParentState={x=>this.setState(x)}
                vintageOfKeys: user.defaultVintage
              });
            } else
              user.vintages &&
                this.setState({
                  vintageOfKeys: user.vintages[0]
                });
          });
        }
      })
      .catch((err) => console.log(err));

  fumbler = async (
    usersPublicable,
    usersPrivate,
    deviceName,
    authorId,
    vintageOfKeys,
    deviceCollection
  ) => {
    const usersprivate = firebase.firestore().collection(usersPrivate);
    const addVintage = (uid) =>
      usersprivate //private
        .doc(uid)
        .get()
        .then((barr) => {
          if (!barr.exists) {
            usersprivate //private
              .doc(barr.id)
              .set({
                vintages: firebase.firestore.FieldValue.arrayUnion(
                  vintageOfKeys
                ),
                defaultVintage: vintageOfKeys
              })
              .then(() => console.log("added vintage: " + vintageOfKeys))
              .catch(standardCatch);
          } else {
            var userDatasProps = barr.data();
            userDatasProps.id = barr.id;
            console.log(userDatasProps);
            this.setState({ userDatasProps }, () => {
              console.log("adding vintage to user object:", userDatasProps);
              if (
                userDatasProps &&
                (!userDatasProps.vintages ||
                  !userDatasProps.vintages.includes(vintageOfKeys))
              )
                usersprivate //private
                  .doc(userDatasProps.id)
                  .update({
                    vintages: firebase.firestore.FieldValue.arrayUnion(
                      vintageOfKeys
                    ),
                    defaultVintage: vintageOfKeys
                  })
                  .then(() => console.log("added vintage: " + vintageOfKeys))
                  .catch(standardCatch);
            });
          }
        })
        .catch(standardCatch);
    const { rsaPrivateKeys } = this.state;
    //hoisting promises makes cleaner code? make then with namespace?
    //then promises require hoisting, not new Promise constructor alone. .then is this hoisted nearly
    if (
      !(
        usersPublicable &&
        usersPrivate &&
        deviceName &&
        authorId &&
        vintageOfKeys
      )
    ) {
      console.log(`REACT-FUMBLER: requires ...[
      userDocRef,
      userDatasDocRef,
      devicesCollectionRef,
      deviceName[String],
      authorId[auth.uid],
      vintageOfKeys[partition for content:default desc[0]]] but got:`);
      return console.log([
        usersPublicable,
        usersPrivate,
        deviceName,
        authorId,
        vintageOfKeys
      ]);
    }
    /*var o = null;
    o = */
    const userspublicable = firebase.firestore().collection(usersPublicable);
    return await userspublicable //shared
      .doc(this.props.auth.uid)
      .get()
      .then(async (bar) => {
        var userProps = bar.data();
        userProps.id = bar.id;
        //console.log("user Object found for Fumbler to use: ", userProps);

        addVintage(this.props.auth.uid);
        return await rsaPrivateKeys
          .readPrivateKeys()
          .then(async (keysOutput) => {
            console.log("test");
            var kbs = Object.values(keysOutput);
            if (kbs) {
              const keyBoxes = await this.actualize(kbs);
              if (keyBoxes) {
                const devicecollection = firebase
                  .firestore()
                  .collection(deviceCollection);
                console.log("keyBoxes: ", keyBoxes);
                return await devicecollection
                  .where("authorId", "==", authorId)
                  .where("vintage", "==", vintageOfKeys)
                  .get()
                  .then(async (devs) => {
                    if (devs.docs.length > 0)
                      var devices = devs.docs
                        .map((doc) => {
                          if (doc.exists) {
                            var foo = doc.data();
                            foo.id = doc.id;
                            console.log("device:", foo);
                            if (foo.name !== deviceName) {
                              foo.name = deviceName;
                              devicecollection
                                .doc(foo.id)
                                .update({ name: deviceName })
                                .then(() => console.log("updated device name"))
                                .catch(standardCatch);
                            }
                            return foo;
                          } else return null;
                        })
                        .filter((x) => x);
                    const accountBox = keyBoxes.find(
                      (x) => x._id === authorId && vintageOfKeys === x.vintage
                    );
                    if (accountBox) {
                      return await new Promise((resolve) => {
                        //user keyBox found (locally), and useable
                        //salt the account-key stored on device,
                        //for all pendingDeviceBoxes, to syncPending
                        console.log("found account box: ", accountBox);
                        //getDevices = (user, usersPrivate, accountBox, vintage) =>

                        userProps["pendingDeviceBoxes" + vintageOfKeys] &&
                          userProps["pendingDeviceBoxes" + vintageOfKeys]
                            .length > 0 &&
                          userProps["pendingDeviceBoxes" + vintageOfKeys].map(
                            (deviceBox) =>
                              usersprivate //private
                                .doc(this.props.auth.uid)
                                .update({
                                  ["pendingDeviceBoxes" +
                                  vintageOfKeys]: firebase.firestore.FieldValue.arrayRemove(
                                    JSON.stringify(accountBox.box)
                                  ),
                                  ["deviceBox" + deviceBox]: rsa.encrypt(
                                    accountBox.key,
                                    deviceBox,
                                    "SHA-256",
                                    {
                                      name: "RSA-PSS"
                                    }
                                  )
                                })
                                .then(() =>
                                  console.log(
                                    "updated userDatas device-boxes (to send keys thru)"
                                  )
                                )
                                .catch(standardCatch)
                          );
                        //async await require stringify? if already then'd,
                        //it is already object

                        //hydrate keys
                        const output = {
                          userProps,
                          accountBox,
                          fumblingComplete: true,
                          devices
                        };
                        resolve(JSON.stringify(output));
                      });
                    } else {
                      const deviceBox = keyBoxes.find(
                        (x) => x._id === "device" && vintageOfKeys === x.vintage
                      );
                      if (deviceBox) {
                        const docDev = deviceBox.box.n.substring(0, 27);
                        //no user keyBox found (locally), but device-box has been
                        //provisioned/forged (locally). Next,
                        console.log("found device box: ", deviceBox);
                        //getKeys = async (
                        if (userProps["deviceBox" + docDev]) {
                          await rsaPrivateKeys
                            .setPrivateKey({
                              _id: authorId,
                              id: authorId,
                              key: rsa.decrypt(
                                userProps["deviceBox" + docDev],
                                deviceBox.key,
                                "SHA-256",
                                {
                                  name: "RSA-PSS"
                                }
                              ),
                              box: userProps.box,
                              vintage: vintageOfKeys
                            })
                            .then(
                              async () =>
                                await usersprivate //private
                                  .doc(this.props.auth.uid)
                                  .update({
                                    ["pendingDeviceBoxes" +
                                    vintageOfKeys]: firebase.firestore.FieldValue.arrayRemove(
                                      JSON.stringify(accountBox.box)
                                    ),
                                    ["deviceBox" +
                                    docDev]: firebase.firestore.FieldValue.delete()
                                  })
                                  .then(
                                    async () =>
                                      await devicecollection
                                        .where("authorId", "==", authorId)
                                        .where("box.n", "==", deviceBox.box.n)
                                        .get()
                                        .then((querySnapshot) => {
                                          querySnapshot.docs.forEach((doc) => {
                                            if (doc.exists) {
                                              var foo = doc.data();
                                              foo.id = doc.id;
                                              devicecollection
                                                .doc(foo.id)
                                                .update({
                                                  authorized: true
                                                })
                                                .catch(standardCatch);
                                            }
                                          });
                                        })
                                        .catch(standardCatch)
                                  )
                                  .catch(standardCatch)
                            )
                            .catch(standardCatch);
                        } /*else
                          await castFirestoreBox(
                            deviceBox,
                            deviceName,
                            usersPrivate,
                            devices,
                            authorId,
                            userProps,
                            rsaPrivateKeys,
                            vintage
                          );*/ //this shouldn't run unless interrupted

                        return null;
                      } else if (userProps.box || devs.docs.length === 0) {
                        //saveDevice = async (
                        return await rsa
                          .generateKey(2048)
                          .then(async (accountBox) => {
                            console.log("fashioned keys: ", accountBox);
                            const keybox = {
                              _id: devs.docs.length > 0 ? "device" : authorId,
                              key: accountBox.privateKey,
                              box: accountBox.publicKey,
                              vintage: vintageOfKeys
                            };
                            const docDev = keybox.box.n.substring(0, 27);
                            return await devicecollection
                              .doc(docDev)
                              .get()
                              .then(async (doc) => {
                                if (doc.exists) {
                                  window.alert(
                                    "try again: public box sequence 27 char substring already exists"
                                  );
                                } else {
                                  console.log("saving keybox: ", keybox);
                                  //with device-box, get account-key
                                  await rsaPrivateKeys.setPrivateKey(keybox);
                                  if (!userProps.box) {
                                    console.log("totally new account-box");
                                    //& device-box (same for first device)
                                    userspublicable
                                      .doc(userProps.id)
                                      .update({ box: keybox.box }) //keys are only on device
                                      .then(() =>
                                        console.log(
                                          "Establishing an original keybox for your account... success!  " +
                                            "Now you can copy this to access on-device, end-to-end encrypted chats"
                                        )
                                      )
                                      .catch(standardCatch);
                                    await devicecollection
                                      .doc(docDev)
                                      .set({
                                        vintage: vintageOfKeys,
                                        authorId,
                                        box: keybox.box,
                                        name: deviceName
                                      })
                                      .catch(standardCatch);
                                    return "awaitingAuthMode";
                                  } else {
                                    console.log(
                                      "adding as an additional device"
                                    );
                                    //castFirestoreBox = async (
                                    return devicecollection
                                      .where("authorId", "==", authorId)
                                      .get()
                                      .then(async (devs) => {
                                        if (
                                          devs.docs.length > 0 &&
                                          userProps.key
                                        ) {
                                          if (
                                            userProps[
                                              "pendingDeviceBoxes" +
                                                vintageOfKeys
                                            ] &&
                                            userProps[
                                              "pendingDeviceBoxes" +
                                                vintageOfKeys
                                            ] === JSON.stringify(keybox.box)
                                          ) {
                                            return console.log(
                                              "box is already pending approval"
                                            );
                                          } else {
                                            console.log(
                                              "casting box: ",
                                              keybox
                                            );
                                            await usersprivate //private
                                              .doc(this.props.auth.uid)
                                              .update({
                                                ["pendingDeviceBoxes" +
                                                vintageOfKeys]: firebase.firestore.FieldValue.arrayUnion(
                                                  JSON.stringify(keybox.box)
                                                )
                                              })
                                              .then(
                                                async () =>
                                                  await devicecollection
                                                    .doc(docDev)
                                                    .set({
                                                      authorId,
                                                      box: keybox.box,
                                                      name: specialFormatting(
                                                        deviceName
                                                      ),
                                                      vintage: vintageOfKeys
                                                    })
                                                    .catch(standardCatch)
                                              )
                                              .catch(standardCatch);
                                            return "awaitingAuthMode";
                                          }
                                        } else {
                                          //reset device given no devices online
                                          return rsaPrivateKeys
                                            .deleteKey(keybox)
                                            .then(
                                              async () =>
                                                await rsaPrivateKeys.setPrivateKey(
                                                  {
                                                    _id: authorId,
                                                    id: authorId,
                                                    box: keybox.box,
                                                    key: keybox.key,
                                                    vintage: vintageOfKeys
                                                  }
                                                )
                                            )
                                            .catch(standardCatch);
                                        }
                                      });
                                  }
                                }
                              })
                              .catch(standardCatch);

                            //randomString(4, "aA#")
                          })
                          .catch(standardCatch);
                      } else {
                        devicecollection
                          .where("authorId", "==", authorId)
                          .get()
                          .then((querySnapshot) => {
                            querySnapshot.docs.forEach((doc) => {
                              if (doc.exists) {
                                devicecollection
                                  .doc(doc.id)
                                  .delete()
                                  .then(() => {})
                                  .catch(standardCatch);
                              }
                            });
                            keyBoxes.forEach((x) =>
                              rsaPrivateKeys.deleteKey(x)
                            );
                          });
                        return null;
                      }
                    }
                  });
              }
            } else
              return null; /* else saveDevice(
            user,
            userProps,
            rsaPrivateKeys,
            deviceName,
            usersPrivate,
            devices,
            authorId
          );*/
          })
          .catch(standardCatch);
      })
      .then((obj) => {
        console.log("finished", JSON.parse(obj));
        this.findKeys(vintageOfKeys);
        var msg = null;
        if (obj) {
          if (obj.fumblingComplete) {
            this.setState(
              {
                devices: obj.devices
              },
              () =>
                this.props.setKey({
                  key: obj.accountBox.key,
                  box: obj.accountBox.box
                })
            );
          }
          msg = "";
        } else if (obj === "awaitingAuthMode")
          this.setState(
            {
              standbyMode: true
            },
            () => {
              window.alert(
                "STANDBY: Please login to " +
                  (obj.userProps.authorizedDevices.length > 1
                    ? "another one of "
                    : "") +
                  `your previous (${
                    obj.userProps.authorizedDevices.length
                  }) device${
                    obj.userProps.authorizedDevices.length > 1 ? "s" : ""
                  }, then come back.`
              );
              msg = "set reminder";
            }
          );
        return msg;
      });
  };
  getRoomKeys = async (
    room,
    recipientsProfiled,
    rooms,
    user,
    rsaPrivateKeys
  ) => {
    if (!room || !room.id) return console.log("no room: " + room);
    //same: room, or recipients && entityType + entityId
    if (room.publicRoomKey) {
      //updateMyKeys = async (room, user, rsaPrivateKeys) => {
      return await rsaPrivateKeys
        .readPrivateKeys()
        .then(async (keysOutput) => {
          const keyBoxes = Object.values(keysOutput);
          var msg = null;
          var keyBox = keyBoxes.find((x) => x._id === room.id);
          if (keyBox) {
            const saltedKeys = room["saltedKeys" + this.props.authorId];
            saltedKeys &&
              rsa
                .decrypt(saltedKeys, user.key, "SHA-256", {
                  name: "RSA-PSS"
                })
                .then(async (privateRoomKey) => {
                  if (keyBox.key !== privateRoomKey) {
                    const keyBoxConfirmed = await rsaPrivateKeys.setPrivateKey({
                      _id: room.id,
                      id: room.id,
                      key: keyBox.key,
                      box: room.box,
                      vintage: keyBox.vintage
                    });
                    msg =
                      keyBoxConfirmed &&
                      "keyBox established locally for " + room.id;
                  } else
                    msg = "there is a keyBox already registered for " + room.id;
                });
          } else {
            //add saltedKey to pouchDB (local-storage)
          }
          return msg && console.log(msg);
        })
        .catch((err) => console.log(err.message));
    } else {
      //new: room, or new recipients (or threadId from entity)
      return await rsa.generateKey(2048).then(async (roomBox) => {
        if (
          await rsaPrivateKeys.setPrivateKey({
            _id: room.id,
            id: room.id,
            key: roomBox.key,
            box: roomBox.box,
            vintage: roomBox.vintage
          })
        ) {
          return Promise.all(
            recipientsProfiled.map(
              (user) =>
                new Promise((resolve, reject) => {
                  const saltedKey = room["saltedKeys" + user.id];

                  if (saltedKey) {
                    resolve(saltedKey); //String
                  } else {
                    const saltedKey = rsa.encrypt(
                      roomBox.key,
                      user.box,
                      "SHA-256",
                      {
                        name: "RSA-PSS"
                      }
                    );
                    saltedKey && resolve(user.id + saltedKey);
                  }
                })
            )
          ).then((saltedKeys) => {
            let p = 0;
            var rm = { ...room };
            saltedKeys.map((out, p) => {
              p++;
              const user = recipientsProfiled.find((x) => out.startsWith(x.id));
              return (rm["saltedKeys" + user.id] =
                user && out.substring(user.id.length, out.length));
            });
            delete rm.id;
            rm.box = roomBox.box;
            if (p === saltedKeys.length) rooms.doc(room.id).update(rm);
          });
        }
      });
    }
  };

  render() {
    const { user } = this.props;
    const { vintageOfKeys, keyBoxes, devices, deviceName } = this.state;
    const keyboxContStyle = {
      borderBottom: "2px solid grey",
      backgroundColor: "rgb(40,40,90)",
      width: "calc(100% - 30px)",
      color: "red",
      padding: "10px",
      paddingTop: "6px",
      display: "flex",
      alignItems: "center"
    };
    return (
      <div
        ref={this.props.Vintages}
        style={{
          display: this.props.show ? "block" : "none",
          color: "white",
          boxShadow: "0px 0px 10px 2px blue",
          borderRadius: "2px",
          border: "2px rgb(200,200,200) solid",
          backgroundColor: "rgb(100,170,210)",
          margin: "6px",
          padding: "4px"
        }}
      >
        <div
          style={{
            backgroundColor: "rgb(10,17,100)",
            fontSize: "10px",
            display: "inline-block",
            lineHeight: "11px",
            padding: "2px"
          }}
        >
          On-device keybox
          <br />
          nationalsecuritycasino.com
          <br />
          login.gov convict-intranet
        </div>
        <br />
        current: {"{"}
        {deviceName ? (
          <div
            onClick={() => {
              const answer = window.confirm("edit name?");
              if (answer) this.setState({ deviceName: null });
            }}
          >
            device: {deviceName}
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();

              firebase
                .firestore()
                .collection(this.props.deviceCollection)
                .doc(this.state.deviceNameSetter)
                .get()
                .then((doc) => {
                  if (!doc.exists) {
                    this.state.ddb.storeDeviceName({
                      _id: this.state.deviceNameSetter
                    });
                    this.readDevice(this.state.ddb, vintageOfKeys, user);

                    //!user.key && this.allowDeviceToRead();
                  } else {
                    window.alert("another device of yours use this name");
                    this.setState({ deviceNameSetter: "" });
                  }
                });
            }}
          >
            <input
              className="input"
              placeholder="device name"
              onChange={(e) =>
                this.setState({ deviceNameSetter: e.target.value })
              }
            />
          </form>
        )}
        {
          //vintage name year for content encrypted
          !vintageOfKeys ? (
            <form
              style={{ display: "flex" }}
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  !user.vintages ||
                  !user.vintages.includes(this.state.vintageYearSetter)
                ) {
                  this.setState({
                    vintageOfKeys: this.state.vintageYearSetter
                  });
                } else this.setState({ errVintage: "already" });
              }}
            >
              <input
                className="input"
                placeholder="vintage name"
                onChange={(e) =>
                  this.setState({
                    vintageYearSetter: e.target.value.toLowerCase()
                  })
                }
              />
              {this.state.errVintage}
              {user !== undefined && user.vintages && user.vintages.length > 0 && (
                <button
                  onClick={() =>
                    this.setState({
                      vintageOfKeys: user.vintages[0]
                    })
                  }
                >
                  &times;
                </button>
              )}
            </form>
          ) : (
            <div>
              <div
                onClick={() => {
                  const answer = window.confirm("add vintage?");
                  if (answer) this.setState({ vintageOfKeys: null });
                }}
              >
                vintage: {vintageOfKeys}
              </div>
              {user.vintages && (
                <select
                  onChange={(e) =>
                    this.setState({ vintageOfKeys: e.target.value })
                  }
                >
                  {user.vintages.map((x) => (
                    <option key={"vintage" + x}>{x}</option>
                  ))}
                </select>
              )}
            </div>
          )
        }
        {"}"}
        <br />
        {
          //load
          !deviceName && vintageOfKeys ? (
            "loading"
          ) : !deviceName ? (
            "name your first device"
          ) : user === undefined || !vintageOfKeys ? (
            ""
          ) : user.key ? (
            this.state.showKey ? (
              <span onClick={() => this.setState({ showKey: false })}>
                {user.key}
              </span>
            ) : (
              <button onClick={() => this.setState({ showKey: true })}>
                Show Key
              </button>
            )
          ) : (
            <button onClick={this.allowDeviceToRead}>
              {user.box ? "load key" : "modulo keybox"}
            </button>
          )
        }
        {keyBoxes.length > 0 && (
          <div style={keyboxContStyle}>
            <div>
              {keyBoxes.length}&nbsp;
              <span>
                <i
                  className="fas fa-key"
                  style={{
                    margin: "1px",
                    zIndex: "7",
                    position: "absolute",
                    color: "rgb(150,150,250)"
                  }}
                ></i>
                &nbsp;
                <i className="fas fa-box" style={{ fontSize: "20px" }}></i>
              </span>
            </div>
            {user === undefined
              ? "your list of keyboxes once you login goes here."
              : keyBoxes.map((x) => {
                  const masterkey = devices.find((p) => p.authorId === x._id);
                  if (masterkey) {
                    return (
                      <div key={"keyboxpouched" + x._id}>
                        masterkey&nbsp;
                        <span
                          role="img"
                          aria-label="trash can"
                          onClick={() => {
                            const answer = window.confirm(
                              "would you like to delete master key?"
                            );
                            if (answer) {
                              this.state.rsaPrivateKeys.deleteKey(x);
                            }
                          }}
                        >
                          &#128465;
                        </span>
                      </div>
                    );
                  } else {
                    const thisdevice = devices.find((p) => p.id === x._id);
                    //if (!thisdevice) {
                    //console.log(x);
                    if (!thisdevice) {
                      return (
                        <div key={"keyboxpouched" + x._id}>
                          unrecognized key in pouch&nbsp;
                          <span
                            role="img"
                            aria-label="trash can"
                            onClick={() => {
                              const answer = window.confirm(
                                "would you like to delete master key?"
                              );
                              if (answer) {
                                this.state.rsaPrivateKeys.deleteKey(x);
                              }
                            }}
                          >
                            &#128465;
                          </span>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={"keyboxpouched" + x._id}
                          style={{
                            alignItems: "center",
                            padding: "4px 10px",
                            display: "flex",
                            borderRadius: "12px",
                            width: "max-content",
                            backgroundColor: !thisdevice
                              ? ""
                              : thisdevice.authorized
                              ? "white"
                              : thisdevice.decommissioned
                              ? "red"
                              : "yellow"
                          }}
                        >
                          {thisdevice && thisdevice.name}
                          {thisdevice && thisdevice.thisdevice && " (this)"}
                          &nbsp;/&nbsp; ({x.vintage}){x._id}
                        </div>
                      );
                    }
                  }
                })}
          </div>
        )}
        {keyBoxes.length > 0 && (
          <div style={keyboxContStyle}>
            <div>
              {devices.length}&nbsp;<i className="fas fa-laptop"></i>&nbsp;
              <i className="fas fa-tablet-alt"></i>
            </div>
            {user === undefined
              ? "your list of active devices once you login goes here."
              : devices.map((x, i) => {
                  const masterkey = keyBoxes.find((p) => p._id === x.authorId);
                  if (masterkey) {
                    return (
                      <div key={"device" + x.id}>
                        masterkey&nbsp;
                        <span
                          role="img"
                          aria-label="trash can"
                          onClick={() => {
                            const answer = window.confirm(
                              "would you like to delete master key?"
                            );
                            if (answer) {
                              if (
                                this.state.userDatasProps &&
                                this.state.userDatasProps.box === x.box
                              ) {
                                firebase
                                  .firestore()
                                  .collection(this.props.usersPublicable)
                                  .doc(this.props.auth.uid)
                                  .update({ box: null })
                                  .catch(standardCatch);
                              }
                              firebase
                                .firestore()
                                .collection(this.props.deviceCollection)
                                .doc(x.id)
                                .delete()
                                .then(() => {})
                                .catch(standardCatch);
                            }
                          }}
                        >
                          &#128465;
                        </span>
                      </div>
                    );
                  } else {
                    const thisdevice = keyBoxes.find((p) => p._id === "device");
                    if (!thisdevice) {
                      return (
                        <div
                          key={"device" + x.id}
                          style={{
                            alignItems: "center",
                            padding: "4px 10px",
                            display: "flex",
                            borderRadius: "12px",
                            width: "max-content",
                            backgroundColor: x.authorized
                              ? "white"
                              : x.decommissioned
                              ? "red"
                              : "yellow"
                          }}
                        >
                          {x.name}
                          &nbsp;/&nbsp;
                          {/*x._id*/}({x.vintage})
                        </div>
                      );
                    } else {
                      const thispendbox =
                        user["pendingDeviceBoxes" + vintageOfKeys] &&
                        user["pendingDeviceBoxes" + vintageOfKeys].find(
                          async (p) => {
                            const prsd = await JSON.parse(x);
                            return p.n === prsd.box.n;
                          }
                        );
                      return (
                        <div
                          key={"device" + x.id}
                          style={{
                            alignItems: "center",
                            padding: "4px 10px",
                            display: "flex",
                            borderRadius: "12px",
                            width: "max-content",
                            backgroundColor: thisdevice.authorized
                              ? "white"
                              : thisdevice.decommissioned
                              ? "red"
                              : "yellow"
                          }}
                        >
                          {thisdevice.name}
                          {thisdevice.thisdevice && " (this)"}
                          {thisdevice.authorized ? (
                            <div
                              style={{
                                fontSize: "10px",
                                margin: "0px 3px",
                                border: "1px solid black",
                                padding: "4px 10px",
                                display: "flex",
                                borderRadius: "12px",
                                width: "max-content",
                                backgroundColor: "white"
                              }}
                              onClick={() => {
                                var answer = null;
                                if (!thisdevice.thisdevice) {
                                  answer = window.confirm(
                                    `Are you sure you want to recind access to e2e-encrypted ` +
                                      `messages and files-shared? The next time this device signs in, ` +
                                      `they will have to request the account key again.`
                                  );
                                  if (answer) {
                                    const device = firebase
                                      .firestore()
                                      .collection(this.props.deviceCollection)
                                      .doc(thisdevice.id);
                                    device
                                      .update({ decommissioned: true })
                                      .then(() => {})
                                      .catch(standardCatch);
                                  }
                                } else {
                                  var devicesInCommission = user.devices.filter(
                                    (x) => !x.decommissioned
                                  );
                                  if (devicesInCommission.length === 1) {
                                    answer = window.confirm(
                                      `this is your last device, if you do not copy your key ` +
                                        `no one will be able to practically uncover your boxes`
                                    );
                                  } else {
                                    answer = window.confirm(
                                      `Are you sure you want to relinquish this device's access to e2e-encrypted ` +
                                        `messages and files-shared? You will have to request the account key again.`
                                    );
                                  }
                                  if (answer) {
                                    this.props.manualDeleteKeyBox(x);
                                  }
                                }
                              }}
                            >
                              remove
                            </div>
                          ) : (
                            <div
                              style={{
                                fontSize: "10px",
                                margin: "0px 3px",
                                border: "1px solid black",
                                padding: "4px 10px",
                                display: "flex",
                                borderRadius: "12px",
                                width: "max-content",
                                backgroundColor: "white"
                              }}
                              onClick={() => {
                                var answer = window.confirm(
                                  `Are you sure you want to ${
                                    thisdevice.decommissioned ? "re" : ""
                                  }authorize device: ` + thisdevice.name
                                );
                                if (answer) {
                                  firebase
                                    .firestore()
                                    .collection(this.props.deviceCollection)
                                    .doc(thisdevice.id)
                                    .update({
                                      decommissioned: false,
                                      authorized: true
                                    })
                                    .then(() => {})
                                    .catch(standardCatch);
                                }
                              }}
                            >
                              {thisdevice.decommissioned
                                ? "recover"
                                : "authorize"}
                              {/*x.decommissioned && (
                          <img
                            onClick={() => {
                              var answer = window.confirm(
                                "hide outstanding key"
                              );
                            }}
                            src={settings33}
                            style={{ width: "20px", height: "20px" }}
                            alt="error"
                          />
                          )*/}
                            </div>
                          )}
                          {thispendbox && <div className="loader" />}(
                          {x.vintage})
                        </div>
                      );
                    }
                  }
                })}
          </div>
        )}
      </div>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <Vintages Vintages={ref} {...props} />
));
