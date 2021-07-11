import React from "react";
import Chatter from "./components/Chats/Chatter";
import RecentChat from "./components/Chats/RecentChat";
import ChatsHeader from "./components/Chats/ChatsHeader";
import GroupFilter from "./components/Chats/GroupFilter/GroupFilter";
import { withRouter, Link } from "react-router-dom";
import firebase from "./init-firebase";
import * as geofirestore from "geofirestore";
//import settings33 from ".././Icons/Images/settings33.png";

import "./components/Icons/Headerstyles.css";
import "./components/Chats/Chats.css";

class Chats extends React.Component {
  constructor(props) {
    super(props);
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.state = {
      width,
      height,
      right: "0",
      topics: ["*"],
      spam: [],
      content: [],
      allcontents: [],
      number: 0,
      hideMore: true,
      lastVisible: 0,
      clubResults: [],
      chatFilterChosen: "users",
      n: 30,
      openGroupFilter: false,
      deletedMsgs: [],
      hiddenMsgs: [],
      userQuery: "",
      recentChats: [],
      openUser: "",
      allChats: [],
      doitonce: false,
      recentPeople: []
    };
  }
  moreMessages = () => {
    this.state.lastMessage &&
      firebase
        .firestore()
        .collection("chats")
        .where("threadId", "==", this.props.threadId)
        .orderBy("time", "desc")
        .startAfter(this.state.lastMessage)
        .limit(25)
        .onSnapshot(
          (querySnapshot) => {
            let p = 0;
            let f = [];
            let spam = [];
            if (querySnapshot.empty) {
              return null;
            } else {
              querySnapshot.docs.forEach((doc) => {
                p++;
                if (doc.exists) {
                  var foo = doc.data();
                  foo.id = doc.id;
                  foo.collection = "chats";
                  if (foo.entityType) {
                    if (
                      !this.props.user.mutedUsers ||
                      !this.props.user.mutedUsers.includes(foo.authorId)
                    ) {
                      f.push(foo);
                    } else {
                      spam.push(foo);
                    }
                  }
                }
              });
              if (p === querySnapshot.docs.length) {
                this.getMessages(f, spam);
              }
            }
          },
          (e) => console.log(e.message)
        );
  };
  againBackMessages = () => {
    this.state.againMessage &&
      firebase
        .firestore()
        .collection("chats")
        .where("threadId", "==", this.props.threadId)
        .orderBy("time", "desc")
        .startAfter(this.state.againMessage)
        .limit(25)
        .onSnapshot(
          (querySnapshot) => {
            let p = 0;
            let f = [];
            let spam = [];
            if (querySnapshot.empty) {
              return null;
            } else {
              querySnapshot.docs.forEach((doc) => {
                p++;
                if (doc.exists) {
                  var foo = doc.data();
                  foo.id = doc.id;
                  foo.collection = "chats";
                  if (foo.entityType) {
                    if (
                      !this.props.user.mutedUsers ||
                      !this.props.user.mutedUsers.includes(foo.authorId)
                    ) {
                      f.push(foo);
                    } else {
                      spam.push(foo);
                    }
                  }
                }
              });
              if (p === querySnapshot.docs.length) {
                this.getMessages(f, spam);
              }
            }
          },
          (e) => console.log(e.message)
        );
  };
  getMessages = (f, spam) => {
    this.setState({
      lastMessage: f[f.length - 1],
      againMessage: f[f.length + 25 - 1],
      lastRecipients: this.props.recipients,
      recentChats: f,
      topics: [],
      number:
        this.props.auth !== undefined &&
        f.filter(
          (chat) =>
            !chat.readUsers || !chat.readUsers.includes(this.props.auth.uid)
        ).length
    });
    let b = 0;
    let le = [];
    f.concat(spam);
    f.map((x) => {
      b++;
      if (x.contents) {
        le.push(x.contents);
        if (f.length === b && this.state.allcontents !== le) {
          this.setState({
            allcontents: le,
            content: le
          });
        }
      }
      return x;
    });
  };
  componentWillUnmount() {
    clearTimeout(this.resizeTimer);
    window.removeEventListener("resize", this.refresh);
  }
  refresh = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      let width = window.innerWidth; // * 0.01;
      let height = window.innerHeight; // * 0.01;
      this.setState({
        width,
        height
      });
    }, 200);
  };
  componentDidMount = () => {
    this.refresh();
    window.addEventListener("resize", this.refresh);
  };
  componentDidUpdate = (prevProps) => {
    if (
      this.props.auth !== undefined &&
      this.props.threadId !== prevProps.threadId
    ) {
      this.props.loadGreenBlue("getting thread " + this.props.threadId);
      this.props.entityId &&
        firebase
          .firestore()
          .collection(this.props.entityType)
          .doc(this.props.entityId)
          .get()
          .then((doc) => {
            var foo = doc.data();
            foo.id = doc.id;
            this.setState({ thisentity: foo });
          })
          .catch((err) => console.log(err.message));

      this.setState({
        recentChats: []
      });
      if (this.state.number !== 0) {
        this.setState({ number: 0 });
      }
      firebase
        .firestore()
        .collection("chats")
        .where("threadId", "==", this.props.threadId)
        .orderBy("time", "desc")
        .limit(25)
        .onSnapshot(
          async (querySnapshot) => {
            let f = [];
            let spam = [];
            let p = 0;
            if (querySnapshot.empty) {
              this.props.unloadGreenBlue();
              console.log("empty");
            } else {
              querySnapshot.docs.forEach((chat) => {
                p++;
                if (chat.exists) {
                  var foo = chat.data();
                  foo.id = chat.id;
                  foo.collection = "chats";
                  if (
                    !this.props.user.mutedUsers ||
                    !this.props.user.mutedUsers.includes(foo.authorId)
                  ) {
                    f.push(foo);
                  } else {
                    spam.push(foo);
                  }
                }
              });
              if (p === querySnapshot.docs.length) {
                Promise.all(
                  f[0].recipients.map(async (foo) => {
                    var recipient = await this.props.hydrateUser(foo);

                    return recipient && recipient;
                  })
                ).then(async (recipientsProfiled) => {
                  var author = await this.props.hydrateUser(f[0].authorId);
                  if (author) {
                    Promise.all(
                      f.map(async (foo) => {
                        foo.author = author;
                        foo.recipientsProfiled = recipientsProfiled;
                        foo.droppedPost =
                          foo.droppedId &&
                          (await this.props.getDrop(foo.droppedId));
                        foo.droppedPost && console.log(foo.droppedPost);
                        return foo;
                      })
                    ).then((f) => {
                      this.props.unloadGreenBlue();
                      this.getMessages(f, spam);
                    });
                  }
                });
              }
            }
          },
          (e) => console.log(e.message + "chats")
        );
    }
    if (
      this.state.recentChats !== [] &&
      this.state.lastRecentChats !== this.state.recentChats
    ) {
      let b = [];
      let p = 0;
      this.state.recentChats.forEach((x) => {
        p++;
        b.push(x.topic);
        if (p === this.state.recentChats.length) {
          var unique = [...new Set(b)];
          this.setState({
            topics: unique,
            lastRecentChats: this.state.recentChats
          });
        }
      });
    }
  };
  addUsertoRec = (x) => {
    var reg =
      this.props.recipients.constructor === Array
        ? [...this.props.recipients, x.id].sort()
        : [this.props.recipients, x.id].sort();
    var threadId = this.props.entityType + this.props.entityId + reg.sort();
    this.props.alterRecipients({
      entityId: null,
      entityType: "users",
      recipients: reg,
      threadId
    });
    this.props.setTopic("*");
    this.setState({
      topics: [],
      recentChats: []
    });
  };
  removeUserfromRec = (x) => {
    var shortenRecip = this.props.recipients.filter((e) => e !== x.id);
    var threadId =
      this.props.entityType + this.props.entityId + shortenRecip.sort();
    this.props.alterRecipients({
      entityId: null,
      entityType: "users",
      recipients: shortenRecip.sort(),
      threadId
    });
    this.setState({
      topics: [],
      recentChats: []
    });
  };
  render() {
    let threads = [];
    this.props.auth !== undefined &&
      this.props.recipients &&
      this.props.chats
        .sort((a, b) => b.time - a.time)
        .map((obj) => {
          return threads.push(obj.threadId);
        });

    let chatsWithinTopic1 = [];
    threads.map((obj) => {
      var topChat = this.props.chats.find((x) => x.threadId === obj);
      return chatsWithinTopic1.push(topChat);
    });
    let chatsWithinTopic = [];
    var test = this.state.openSpam ? this.state.spam : this.props.chats;
    //pushed
    test &&
      test.map((x) => {
        var thisfinal = chatsWithinTopic1.find((y) => x.id === y.id);
        return thisfinal && chatsWithinTopic.push(thisfinal);
      });
    let noteList = [];
    let noteTitles = [];
    //pushed
    this.props.notes &&
      this.props.notes.map((x) => {
        noteTitles.push(x.message);
        return noteList.push(x._id);
      });
    var usersThatHaventBlocked =
      this.props.auth &&
      this.props.users &&
      this.props.users.filter(
        (x) => !x.blockedUsers || !x.blockedUsers.includes(this.props.auth.uid)
      );
    return (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          transition: this.state.right
            ? "top .01s ease-out"
            : "top .3s ease-out",
          transform: `translateX(-${this.state.right}px)`,
          opacity:
            this.state.right / this.props.width < 0.8
              ? 1 - this.state.right / this.props.width
              : 1
        }}
      >
        <ChatsHeader
          standbyMode={this.props.standbyMode}
          setFoundation={this.props.setFoundation}
          setIndex={this.props.setIndex}
          forumOpen={this.props.forumOpen}
          getUserInfo={this.props.getUserInfo}
          clearQuery={() => this.setState({ userQuery: "" })}
          pushEntityResults={(clubResults) =>
            this.setState({
              clubResults: [...this.state.clubResults, clubResults]
            })
          }
          openCommsSort={() => this.setState({ openGroupFilter: true })}
          chatFilterChosen={this.state.chatFilterChosen}
          userQuery={this.state.userQuery}
          editUserQuery={(e) =>
            this.setState({ userQuery: e.target.value.toLowerCase() })
          }
          showsort={this.props.chatsopen && !this.props.profileOpen}
          showclear={this.props.chatsopen && !this.props.achatopen}
          width={this.props.width}
          auth={this.props.auth}
          profileOpener={this.props.profileOpener}
          user={this.props.user}
          chatsopen={this.props.chatsopen}
          achatisopen={this.props.achatisopen}
        />
        {/*
        
        
        // Chats page
        */}
        <div
          className={
            this.props.chatsopen && window.location.pathname !== "/login"
              ? "showchats"
              : "hidechats"
          }
        >
          <div
            className={
              this.props.openAChat ? "listedUserQueryfixed" : "listedUserQuery"
            }
            style={{ color: "#777" }}
          >
            {this.props.user === undefined
              ? ""
              : this.props.user.key && (
                  <div>
                    {this.state.showKey ? (
                      this.props.user.key
                    ) : (
                      <button>Show Key</button>
                    )}
                  </div>
                )}
            {this.props.undefined !== undefined && !this.props.user.key && (
              <button onClick={this.props.allowDeviceToRead}></button>
            )}
            <br />
            Data is encrypted in transit + cloud
            <br />
            Data is unencrypted in your browser's cache.
            <br />
            <br />
            So, make sure you only fashion end-to-end encryption on the private
            devices you would like to hold your keys, which you can delete
            quickly; however, to re-fashion them to see the e2e-encrypted
            messages require the devices with them, or your clip of the key.
            <br />
            <br />
            <div
              style={{
                backgroundColor: "rgb(40,40,90)",
                width: "100%",
                height: "70px",
                overflowY: "hidden",
                overflowX: "auto"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: "max-content",
                  height: "100%",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {this.props.user === undefined
                  ? "your list of devices once you login goes here."
                  : !this.props.user.devices ||
                    this.props.user.devices.length === 0
                  ? "you have no devices!"
                  : this.props.user.devices.map((x) => (
                      <div
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
                        {x.thisdevice && " (this)"}
                        {x.authorized ? (
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
                              if (!x.thisdevice) {
                                answer = window.confirm(
                                  `Are you sure you want to recind access to e2e-encrypted ` +
                                    `messages and files-shared? The next time this device signs in, ` +
                                    `they will have to request the account key again.`
                                );
                                if (answer) {
                                  firebase
                                    .firestore()
                                    .collection("devices")
                                    .doc(x.id)
                                    .update({ decommissioned: true })
                                    .then(() => {})
                                    .catch((err) => console.log(err.message));
                                }
                              } else {
                                var devicesInCommission = this.props.user.devices.filter(
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
                                  x.decommissioned ? "re" : ""
                                }authorize device: ` + x.name
                              );
                              if (answer) {
                                firebase
                                  .firestore()
                                  .collection("devices")
                                  .doc(x.id)
                                  .update({
                                    decommissioned: false,
                                    authorized: true
                                  })
                                  .then(() => {})
                                  .catch((err) => console.log(err.message));
                              }
                            }}
                          >
                            {x.decommissioned ? "recover" : "authorize"}
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
                      </div>
                    ))}
              </div>
            </div>
            {this.state.userQuery === "" ? (
              <p>
                Recent:
                {this.state.chatFilterChosen === "users"
                  ? "all"
                  : this.state.chatFilterChosen}
                ~
              </p>
            ) : (
              <p>
                {this.state.chatFilterChosen === "users"
                  ? "Username"
                  : this.state.chatFilterChosen === "clubs"
                  ? "Club"
                  : this.state.chatFilterChosen === "shops"
                  ? "Shop"
                  : this.state.chatFilterChosen === "restaurants"
                  ? "Restaurant"
                  : this.state.chatFilterChosen === "services"
                  ? "Services"
                  : this.state.chatFilterChosen === "classes"
                  ? "Classes"
                  : this.state.chatFilterChosen === "departments"
                  ? "Departments"
                  : "what?"}
                &nbsp; query results~
              </p>
            )}
            <br />
            {this.state.userQuery === "" ||
            this.props.user !== undefined ||
            this.state.chatFilterChosen !== "users"
              ? null
              : "Sign in to view other usernames"}
            {this.state.userQuery === "" &&
              chatsWithinTopic &&
              chatsWithinTopic
                .sort((a, b) => b.time - a.time)
                .map((ppl) => {
                  const permittedUsers = ppl.recipientsProfiled;
                  if (
                    ppl.message &&
                    !this.state.deletedMsgs.includes(ppl.id) &&
                    !this.state.hiddenMsgs.includes(ppl.id)
                  ) {
                    return (
                      <RecentChat
                        notes={this.props.notes}
                        noteList={noteList}
                        noteTitles={noteTitles}
                        recentChats={this.state.recentChats}
                        chats={this.props.chats}
                        user={this.props.user}
                        auth={this.props.auth}
                        ppl={ppl}
                        achatisopen={() => {
                          this.setState({
                            recipients: ppl.recipients,
                            entityId: ppl.entityId,
                            entityType: ppl.entityType
                          });
                          this.props.achatisopen({
                            chosenTopic: ppl.topic,
                            threadId:
                              ppl.entityType +
                              ppl.entityId +
                              ppl.recipients.sort(),
                            recipients: ppl.recipients,
                            entityId: ppl.entityId,
                            entityType: ppl.entityType
                          });
                        }}
                        key={ppl.id}
                        permittedUsers={permittedUsers}
                        users={this.props.users}
                      />
                    );
                  } else return null;
                })}
            {this.state.userQuery !== "" &&
              this.state.chatFilterChosen === "users" &&
              usersThatHaventBlocked &&
              usersThatHaventBlocked.map((user) => {
                if (user.username.includes(this.state.userQuery)) {
                  return (
                    <div
                      key={user.id}
                      className="chatname1"
                      onClick={() => {
                        var recipients = [];
                        if (user.id === this.props.auth.uid) {
                          recipients = [user.id];
                        } else {
                          recipients = [user.id, this.props.auth.uid];
                        }
                        this.setState({
                          recipients,
                          //this.props.user && this.props.user.username + "," + user.username,
                          entityId: null
                        });
                        this.props.achatisopen({
                          chosenTopic: "*",
                          threadId: "users" + null + recipients.sort(),
                          recipients,
                          //this.props.user && this.props.user.username + "," + user.username,
                          entityId: null
                        });
                        //this.openPeer(x);
                      }}
                    >
                      {user.username}
                      {/*<span className="connectionsignaloff">&#9675;</span>*/}
                    </div>
                  );
                } else return null;
              })}
            {this.state.userQuery !== "" &&
              this.state.chatFilterChosen !== "users" &&
              this.state.clubResults.map((club) => {
                if (
                  club.message &&
                  club.message.toLowerCase().includes(this.state.userQuery)
                ) {
                  if (
                    club.members.includes(this.props.auth.uid) ||
                    club.admin.includes(this.props.auth.uid) ||
                    club.members === this.props.auth.uid
                  ) {
                    return (
                      <div
                        key={club.id}
                        className="chatname1"
                        onClick={() => {
                          var recipp = club.members.concat(
                            club.admin.concat(club.authorId)
                          );
                          var recip = [...new Set(recipp)];
                          recip.constructor === Array && recip.sort();
                          this.setState({
                            recipients: recip,
                            entityTitle: club.message,
                            entityType: this.state.chatFilterChosen,
                            entityId: club.id
                          });
                          this.props.achatisopen({
                            chosenTopic: club.message,
                            threadId:
                              this.state.chatFilterChosen + club.id + recip,
                            recipients: recip,
                            entityTitle: club.message,
                            entityType: this.state.chatFilterChosen,
                            entityId: club.id
                          });
                        }}
                      >
                        {club.message}
                      </div>
                    );
                  } else {
                    var thisone = this.props.communities.find(
                      (x) => x.id === club.communityId
                    );
                    return (
                      <Link
                        key={club.id}
                        to={
                          thisone
                            ? `/clubs/${thisone.message}/${club.message}`
                            : `/clubs/${club.city}/${club.message}`
                        }
                      >
                        {club.message}&nbsp;
                        <div style={{ color: "grey" }}>
                          {thisone ? thisone.message : club.city}
                        </div>
                      </Link>
                    );
                  }
                } else return null;
              })}
            {this.state.hideMore ? null : (
              <div
                onClick={() => {
                  if (this.state.chatFilterChosen === "users") {
                    return false;
                  } else {
                    const firestore = firebase.firestore();
                    const GeoFirestore = geofirestore.initializeApp(firestore);
                    const geocollection = GeoFirestore.collection(
                      this.state.chatFilterChosen
                    );
                    const center = new firebase.firestore.GeoPoint(0, 0);
                    const center1 = new firebase.firestore.GeoPoint(0, 72);
                    const center2 = new firebase.firestore.GeoPoint(0, 144);
                    const center3 = new firebase.firestore.GeoPoint(0, -144);
                    const center4 = new firebase.firestore.GeoPoint(0, -72);
                    [center, center1, center2, center3, center4].map((x) => {
                      return geocollection
                        .near({ center: x, radius: 8587 })
                        .where(
                          "titleAsArray",
                          "array-contains",
                          this.state.userQuery
                        )
                        .orderBy("titleAsArray")
                        .limit(25)
                        .startAfter(this.state.lastVisible)
                        .onSnapshot((querySnapshot) => {
                          let f = [];
                          let p = 0;
                          if (querySnapshot.empty) {
                            console.log("empty");
                            this.setState({ hideMore: true });
                          } else {
                            this.setState({
                              lastVisible:
                                querySnapshot.docs[
                                  querySnapshot.docs.length - 1
                                ]
                            });
                            querySnapshot.docs.forEach((doc) => {
                              p++;
                              if (doc.exists) {
                                var foo = doc.data();
                                foo.id = doc.id;
                                f.push(foo);
                                if (p === querySnapshot.docs.length) {
                                  this.setState({
                                    clubResults: [
                                      ...this.state.clubResults,
                                      ...f
                                    ]
                                  });
                                }
                              }
                            });
                          }
                        });
                    });
                  }
                }}
              >
                More
              </div>
            )}
          </div>
        </div>
        <Chatter
          recipientsProfiled={this.props.recipientsProfiled}
          keyBoxes={this.props.keyBoxes}
          parent={this.props.parent}
          droppedPost={this.props.droppedPost}
          linkDrop={this.props.linkDrop}
          dropId={this.props.dropId}
          droppedCommentsOpen={this.props.droppedCommentsOpen}
          storageRef={this.props.storageRef}
          getUserInfo={this.props.getUserInfo}
          getVideos={this.props.getVideos}
          getFolders={this.props.getFolders}
          onDeleteVideo={this.props.onDeleteVideo}
          handleSaveVideo={this.props.handleSaveVideo}
          achatisopen={this.props.achatisopen}
          threadId={this.props.threadId}
          width={this.props.width}
          thisentity={this.props.thisentity}
          communities={this.props.communities}
          accessToken={this.props.accessToken}
          recipients={this.props.recipients}
          rangeChosen={this.props.rangeChosen}
          parlayRecip={this.props.parlayRecip}
          forumOpen={this.props.forumOpen}
          onDelete={this.props.onDelete}
          handleSave={this.props.handleSave}
          clearFilesPreparedToSend={this.props.clearFilesPreparedToSend}
          filePreparedToSend={this.props.filePreparedToSend}
          switchAccount={this.props.switchAccount}
          signOut={this.props.signOut}
          signedIn={this.props.signedIn}
          s={this.props.s}
          loadGapiApi={this.props.loadGapiApi}
          authResult={this.props.authResult}
          googlepicker={this.props.googlepicker}
          notes={this.props.notes}
          entityTitle={this.props.entityTitle}
          entityType={this.props.entityType}
          entityId={this.props.entityId}
          chatFilterChosen={this.state.chatFilterChosen}
          number={this.state.number}
          auth={this.props.auth}
          openAChat={this.props.openAChat}
          achatisopenfalse={(x) => {
            if (x === "erasequery") {
              this.setState({ userQuery: "" });
            }
            this.props.achatisopenfalse();
          }}
          cc={this.props.achatisopenfalse}
          user={this.props.user}
          recentChats={this.state.recentChats}
          users={this.props.users}
          addUsertoRec={this.addUsertoRec}
          removeUserfromRec={this.removeUserfromRec}
          chats={this.state.openSpam ? this.state.spam : this.props.chats}
          topics={this.state.topics}
          chatsopen={this.props.chatsopen}
          //clearall={() => this.setState({ topics: [], recentChats: [] })}
          chosenTopic={this.props.chosenTopic}
          listHiddenMsgs={this.props.listHiddenMsgs}
          listDeletedMsgs={this.props.listDeletedMsgs}
          chooseTopic={(x) => this.props.setTopic(x)}
          addThirty={() => this.setState({ n: this.state.n + 30 })}
          n={this.state.n}
          allcontents={this.state.allcontents}
          contents={this.state.content}
          hiddenMsgs={this.props.hiddenMsgs}
          deletedMsgs={this.props.deletedMsgs}
        />
        <GroupFilter
          notes={this.props.notes}
          user={this.props.user}
          openSpam={this.state.openSpam}
          chatFilterChanger={(e) => {
            var x = e.target.id;
            if (x === "spam") {
              x = "users";
              this.setState({ openSpam: true });
            } else {
              this.setState({ openSpam: false });
            }
            this.setState({ chatFilterChosen: x });
          }}
          show={this.state.openGroupFilter}
          close={() => this.setState({ openGroupFilter: false })}
          chatFilterChosen={this.state.chatFilterChosen}
        />
      </div>
    );
  }
}

export default withRouter(Chats);
/*
**"Show chats? We create an asymmetric key-pair for this device, " +
"then you can share your private user key, & then your thread keys, " +
"with this device securely. (a) 1. The first time you do this, you’ll " +
"have to visit your original device, 2. then come back. (b) You can also " +
"have the option to save the keyBoxes object-array in a file, then drop it " +
"into a new device.  IF YOU DO NOT DO EITHER OF THESE and lose all your " +
"devices with your rsaKeyPair, your messages will not be recoverable for " +
"about 10 years if you guess the prime private key. In contrast with other " +
"companies toting privacy these chats ACTUALLY retain end-to-end encryption " +
"when backed up (in the cloud)"
*/
