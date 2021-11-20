import React from "react";
import { Link } from "react-router-dom";
import rsa from "js-crypto-rsa";
import back from "../../Icons/Images/back777.png";
import firebase from "../../.././init-firebase";
//import RSA from "../../.././widgets/authdb";
import Recorder from "../.././Media/Recorder";
import MessageMap from "./MessageMap";
import TopicsVids from "./TopicsVids";
import ChatAccessories from "./ChatAccessories";
import ChatterHeader from "./ChatterHeader";
import CheckProfiler from "./CheckProfiler";
import ChatterSender from "./ChatterSender";
import ChatPolls from "./ChatPolls";
import EmbeddedRebeat from "../.././New/EmbeddedRebeat";
import NewDrop from "../.././Post/NewDrop";

class Chatter extends React.Component {
  constructor(props) {
    super(props);
    //let rsaPrivateKeys = new RSA();
    this.state = {
      chats: [],
      //rsaPrivateKeys,
      closeDrop: true,
      selectedFolder: "*",
      folders: [],
      videos: [],
      lastFiles: [],
      files: [],
      roomOpen: true,
      message: "",
      closeHeader: false,
      answers: [],
      sidemenuWidth: "0",
      openWhat: "topics",
      accessToken: "",
      authorizedScopes: false,
      filteredSenders: [],
      deletedMsgs: [],
      users: [],
      userQuery: "",
      lastUserQuery: "",
      lastRecipients: [],
      authorCount: 0,
      s: "",
      filePreparedToSend: [],
      gapiReady: false,
      signedIn: false
    };
    this.grabbottomofchat = React.createRef();
  }
  componentDidMount = () => {
    this.move();
  };
  componentWillUnmount = () => {
    clearTimeout(this.snos);
  };
  move = () => {
    clearTimeout(this.snos);
    this.snos = setTimeout(() => {
      this.grabbottomofchat &&
        this.grabbottomofchat.current &&
        this.grabbottomofchat.current.scrollIntoView({ behavior: "smooth" });
    }, 1000);
  };
  findRoom = () => {
    firebase
      .firestore()
      .collection("rooms")
      .doc(this.props.threadId)
      .onSnapshot(
        async (doc) => {
          if (doc.exists) {
            var room = doc.data();
            room.id = doc.id;

            this.setState({ room });
            if (room.here && room.here.length === 0) {
              firebase
                .firestore()
                .collection("candidates")
                .where("roomId", "==", room.id)
                .where("authorId", "==", this.props.auth.uid)
                .get()
                .then((docs) => {
                  docs.forEach((doc) => {
                    if (doc.exists) {
                      firebase
                        .firestore()
                        .collection("candidates")
                        .doc(doc.id)
                        .delete()
                        .then(() => console.log("candidate cleared " + room.id))
                        .catch((e) => console.log(e.message));
                    }
                  });
                })
                .catch((e) => console.log(e.message));
            }
          } else {
            firebase
              .firestore()
              .collection("rooms")
              .doc(this.props.threadId)
              .set({
                publicKey: ""
              });
            this.setState({ room: { id: this.props.threadId } });
          }
        },
        (e) => console.log(e.message)
      );
  };
  handleDelete = () => {
    firebase
      .firestore()
      .collection("chats")
      .doc(this.state.parent.id)
      .delete()
      .then(() => {
        //this.props.cancelRebeat({ rebeat: null });
        this.setState({ parent: null });
        console.log("deleted progress");
      })
      .catch((e) => console.log(e.message));
  };
  handleKeysForRoom = (room) => {
    const { recipientsProfiled, threadId, user } = this.props;
    const { rsaPrivateKeys } = this.state;
    //const rooms = firebase.firestore().collection("rooms");
    this.props.getRoomKeys(
      room,
      rsaPrivateKeys,
      threadId,
      recipientsProfiled,
      "rooms", //roomsCollection,
      user
    );
  };
  componentDidUpdate = (prevProps) => {
    if (
      this.props.user !== undefined &&
      this.props.user.key &&
      this.props.recentChats &&
      this.props.recipientsProfiled &&
      this.props.recipientsProfiled.length > 0 &&
      this.props.recipientsProfiled.length === this.props.recipients.length &&
      this.state.room &&
      this.state.room !== this.state.lastRoom
    ) {
      this.handleKeysForRoom(this.state.room);
      this.setState({ lastRoom: this.state.room }, () => {
        const { room } = this.state;

        /*
        room = {
          id: collection + doc.id,
          ["saltedKeys" + userId]: roomKeyInBox,
          ...,
          ["saltedKeys" + userId]: roomKeyInBox
        }
        */
        const roomKey = room["saltedKey" + this.props.auth.uid];
        this.setState({ roomKey }, () => {
          let p = 0;
          let chats = [];
          this.props.recentChats.map(async (x) => {
            p++;
            var foo = { ...x };
            const message = await rsa.decrypt(
              x.message,
              this.props.user.key,
              "SHA-256",
              {
                name: "RSA-PSS"
              }
            );
            if (message) {
              foo.message = message;
              chats.push(foo);
            }
          });
          if (p === this.props.recentChats.length) {
            this.setState({ chats });
          }
        });
      });
    }
    if (
      this.props.threadId !== "" &&
      this.props.threadId !== prevProps.threadId
    ) {
      this.move();
      this.setState({ gotFirstBatch: false });
      this.findRoom();
    }
    if (
      this.props.users &&
      (prevProps.users !== this.props.users ||
        this.state.lastUserQuery !== this.state.userQuery) &&
      this.state.userQuery !== ""
    ) {
      this.setState({
        usersforaddrem: this.props.users.filter((x) =>
          x.username.toLowerCase().includes(this.state.userQuery.toLowerCase())
        ),
        lastUserQuery: this.state.userQuery
      });
    }
    if (this.props.achatisopen !== prevProps.achatisopen) {
      this.move();
    }
  };
  handleNewParent = () => {
    if (this.props.auth !== undefined) {
      var add = {
        time: new Date(),
        authorId: this.props.auth.uid,
        message: "",
        recipients: this.props.recipients,
        entityId: this.props.entityId,
        entityType: this.props.entityType,
        threadId: this.props.threadId,
        topic: this.props.chosenTopic
      };

      firebase
        .firestore()
        .collection("chats")
        .add(add)
        .then((doc) => {
          console.log("parent made " + JSON.stringify(add));
          this.setState({
            parent: { id: doc.id, ...add, collection: "chats" }
          });
          firebase
            .firestore()
            .collection("chats")
            .doc(doc.id)
            .onSnapshot(
              (doc) => {
                if (doc.exists) {
                  var parent = doc.data();
                  parent.id = doc.id;
                  parent.collection = "chats";
                  this.setState({ parent });
                }
              },
              (e) => console.log(e.message)
            );
        })
        .catch((e) => console.log(e.message));
    } else {
      var answer = window.confirm("want to sign in?");
      if (answer) {
        this.props.getUserInfo();
      }
    }
  };
  openDrop = (x) => {
    this.setState(x);
    if (!this.state.parent) {
      this.handleNewParent();
    } else if (this.state.parent) {
      console.log("parent deleted");
      this.handleDelete();
    } else {
      window.alert("unhandled");
    }
  };
  handleClose = () => {
    const { parent } = this.state;
    if (parent.droppedPost) {
      var answer = window.confirm(
        "all progress will be lost for " + JSON.stringify(parent)
      );
      if (answer) {
        this.handleDelete();
        this.handleClose2();
      }
    } else this.handleClose2();
  };
  handleClose2 = () => {
    if (this.state.videoRecorderOpen) {
      var answer = window.confirm("close video? video will be lost");
      if (answer) this.setState({ videoRecorderOpen: false });
    } else if (this.state.profileChecker) {
      this.setState({ profileChecker: false });
    } else if (this.state.openusersearch) {
      this.setState({ openusersearch: false });
    } else if (this.state.sidemenuWidth === "0") {
      this.props.cc();
      this.props.achatisopenfalse();
    } else {
      this.setState({ sidemenuWidth: "0" });
    }
  };
  render() {
    const { answers, chats } = this.state;
    var filteredSenders = this.props.recipients;
    let noteList = [];
    let noteTitles = [];
    this.props.notes &&
      this.props.notes.map((x) => {
        noteTitles.push(x.message);
        return noteList.push(x._id);
      });
    return (
      <div
        style={{
          height: "100%",
          display:
            this.props.chatsopen && this.props.openAChat ? "flex" : "none",
          position: "fixed",
          bottom: "0px",
          width: "100%",
          top: "0px",
          zIndex: "5",
          backgroundColor: "rgb(10, 10, 10)",
          flexDirection: "column",
          transition: ".01s ease-in"
        }}
      >
        <ChatterHeader
          recentChats={this.props.recentChats}
          files={this.state.files}
          closeHeader={this.state.closeHeader}
          width={this.props.width}
          thisentity={this.props.thisentity}
          sidemenuWidth={this.state.sidemenuWidth}
          entityTitle={this.props.entityTitle}
          entityType={this.props.entityType}
          entityId={this.props.entityId}
          number={this.props.number}
          chats={this.props.chats}
          auth={this.props.auth}
          checkProfilesOpen={() => this.setState({ profileChecker: true })}
          users={this.props.users}
          recipients={this.props.recipients}
          chooseTopic={this.props.chooseTopic}
          chosenTopic={this.props.chosenTopic}
          openWhat={this.state.openWhat}
          openTopics={() => {
            if (
              this.state.openWhat === "docs" ||
              this.state.sidemenuWidth === "0"
            ) {
              this.setState({
                sidemenuWidth: "40vw",
                openWhat: "topics"
              });
            } else this.setState({ sidemenuWidth: "0", openWhat: "topics" });
          }}
          openDocs={() => {
            if (
              this.state.sidemenuWidth === "0" ||
              this.state.openWhat === "topics"
            ) {
              this.setState({ sidemenuWidth: "40vw", openWhat: "docs" });
            } else this.setState({ openWhat: "topics" });
          }}
        />
        <div
          style={{
            margin: "0px",
            height: "calc(100% - 56px)",
            display: "grid",
            gridTemplateColumns: "min-content min-content 10fr",
            position: "relative",
            width: `100%`,
            wordBreak: "break-all",
            gridTemplateAreas: `"sidebar content"`,
            transition: "transform 0.3s ease-out"
          }}
        >
          <div
            style={{
              display: "flex",
              height: "max-content",
              minWidth: this.state.sidemenuWidth === "0" ? "0px" : "120px",
              width: this.state.sidemenuWidth,
              transition: ".1s ease-in"
            }}
          >
            <TopicsVids
              selectedFolder={this.state.selectedFolder}
              handleFolder={(e) =>
                this.setState({ selectedFolder: e.target.value })
              }
              videos={this.state.videos}
              folders={this.state.folders}
              threadId={this.props.threadId}
              sidemenuWidth={this.state.sidemenuWidth}
              recentChats={this.props.recentChats}
              auth={this.props.auth}
              recipients={this.props.recipients}
              chats={this.props.chats}
              openDocs={() => this.setState({ openWhat: "docs" })}
              openWhat={this.state.openWhat}
              allcontents={this.props.allcontents}
              chosenTopic={this.props.chosenTopic}
              chooseLink={(link) => this.setState({ chosenLink: link.content })}
              chosenLink={this.state.chosenLink}
              topics={this.props.topics}
              contents={this.props.contents}
              chooseTopic={this.props.chooseTopic}
            />
          </div>
          <div
            draggable={true}
            onClick={() => {
              if (this.state.sidemenuWidth === "0") {
                this.setState({ sidemenuWidth: "40vw" });
              } else this.setState({ sidemenuWidth: "0" });
            }}
            onDrag={() =>
              !this.state.dragging &&
              this.setState({ dragging: true, sidemenuWidth: "40vw" })
            }
            onDragEnd={(e) => {
              this.state.dragging && this.setState({ dragging: false });
              var no = e.screenX;
              this.setState({ sidemenuWidth: no });
            }}
            style={
              this.state.dragging
                ? {
                    display: "flex",
                    position: "relative",
                    width: "16px",
                    top: "6px",
                    bottom: "206px",
                    backgroundColor: "green"
                  }
                : this.state.sidemenuWidth === "0"
                ? {
                    display: "flex",
                    position: "relative",
                    width: "0px",
                    top: "10px",
                    height: "calc(100% - 66.4px)",
                    backgroundColor: "grey"
                  }
                : {
                    display: "flex",
                    position: "relative",
                    width: "16px",
                    top: "6px",
                    bottom: "206px",
                    backgroundColor: "rgb(80,80,80)"
                  }
            }
          />
          <div
            style={{
              display: "flex",
              position: "relative",
              flexDirection: "column",
              overflowY: "auto",
              overflowX: "hidden",
              color: "white",
              alignItems: "center",
              backgroundColor: "rgb(240,250,250)",
              boxShadow:
                this.state.sidemenuWidth === "0"
                  ? ""
                  : "inset 0px -8px 5px 3px rgb(200,200,200)",
              width: "100%"
            }}
          >
            <div
              style={{
                display: "flex",
                position: "absolute",
                flexDirection: "column",
                width: "100%",
                height: "min-content"
              }}
            >
              <MessageMap
                noteList={noteList}
                noteTitles={noteTitles}
                parent={this.props.parent}
                droppedPost={this.props.droppedPost}
                linkDrop={this.props.linkDrop}
                dropId={this.props.dropId}
                droppedCommentsOpen={this.props.droppedCommentsOpen}
                communities={this.props.communities}
                threadId={this.props.threadId}
                openTopics={() =>
                  this.state.sidemenuWidth === "0" &&
                  this.setState({ sidemenuWidth: "40vw" })
                }
                //closeTheTopics=//{//() =>//!this.state.sidemenuWidth &&//this.setState({ sidemenuWidth: true })}
                chosenTopic={this.props.chosenTopic}
                onDelete={this.props.onDelete}
                handleSave={this.props.handleSave}
                notes={this.props.notes}
                openAChat={this.props.openAChat}
                shareDoc={(x) => {
                  if (!this.props.s) {
                    this.loadYoutubeApi();
                  }
                  if (this.props.s) {
                    //console.log(this.gapi.auth2);
                    //console.log(this.s);
                    this.props.s.setItemIds([x]);
                    this.props.s.showSettingsDialog();
                  }
                }}
                sidemenuWidth={this.state.sidemenuWidth}
                signedIn={this.state.signedIn}
                recentChats={chats}
                filteredSenders={filteredSenders}
                deletedMsgs={this.props.deletedMsgs}
                hiddenMsgs={this.props.hiddenMsgs}
                listHiddenMsgs={this.props.listHiddenMsgs}
                listDeletedMsgs={this.props.listDeletedMsgs}
                auth={this.props.auth}
                n={this.props.n}
                addThirty={this.props.addThirty}
                recipients={this.props.recipients}
                users={this.props.users}
                contents={this.props.contents}
                /*contentLinker={content =>
                  !this.state.content.includes(content) &&
                  this.setState({ content: [...this.state.content, content] })
                }*/
              />
              {this.state.parent && this.state.parent.droppedPost ? (
                <EmbeddedRebeat
                  linkDrop={this.props.linkDrop}
                  dropId={this.props.dropId}
                  rebeat={this.state.parent.droppedPost}
                  parent={this.state.parent}
                  setStatee={(x) => this.setState(x)}
                  post={this.post}
                  userofReefer={this.state.reefer.author}
                  setDelete={() => {
                    var answer = window.confirm("remove drop?");
                    if (answer) {
                      this.props.cancelRebeat({ rebeat: null });
                      firebase
                        .firestore()
                        .collection("forum")
                        .doc(this.state.parent.id)
                        .delete()
                        .then(() => this.setState({ reefer: null }))
                        .catch((e) => console.log(e.message));
                    }
                  }}
                  userMe={this.props.user}
                  auth={this.props.auth}
                  community={this.props.community} //
                  etypeChanger={this.props.etypeChanger}
                  chosenPostId={this.state.chosenPostId}
                  yes={
                    this.state.openNewComment &&
                    this.state.chosenPostId === this.state.reefer.id
                  }
                  helper2={() => this.setState({ postHeight: 0 })}
                  helper={() => this.props.helper2()}
                  thiscommunity={this.props.community}
                  delete={() =>
                    this.setState({
                      deletedForumPosts: [
                        ...this.state.deletedForumPosts,
                        this.state.parent.id
                      ]
                    })
                  }
                  comments={this.state.comments}
                  clear={() => {
                    var answer = window.confirm(
                      "are you sure you want to clear this comment?"
                    );
                    if (answer) {
                      this.setState({ comment: "" });
                    }
                  }}
                  height={this.props.height}
                  postHeight={this.state.postHeight}
                  globeChosen={this.props.globeChosen}
                  communities={this.props.communities}
                />
              ) : (
                <NewDrop
                  linkDrop={this.props.linkDrop}
                  dropId={this.props.dropId}
                  parent={this.state.parent}
                  collection={"forum"}
                  openDrop={this.openDrop}
                  closeDrop={this.state.closeDrop}
                  auth={this.props.auth}
                  height={this.props.height}
                  width={this.props.width}
                  users={this.props.users}
                  user={this.props.user}
                  communities={this.props.communities}
                />
              )}
              <div
                ref={this.grabbottomofchat}
                style={{ backgroundColor: "rgb(245,248,250)" }}
              >
                <ChatterSender
                  vintageName={this.props.vintageName}
                  user={this.props.user}
                  parent={this.state.parent}
                  //
                  chosenTopic={this.props.chosenTopic}
                  achatisopenfalse={this.props.achatisopenfalse}
                  recipients={this.props.recipients}
                  recipientsProfiled={this.props.recipientsProfiled}
                  rangeChosen={this.props.rangeChosen}
                  signedIn={this.props.signedIn}
                  entityType={this.props.entityType}
                  entityId={this.props.entityId}
                  auth={this.props.auth}
                  recentChats={this.props.recentChats}
                  topics={this.props.topics}
                />
              </div>
            </div>
          </div>
          {this.state.videoRecorderOpen &&
            this.state.message === "" &&
            this.state.roomOpen && (
              <div
                style={{
                  bottom: "0px",
                  left: "0px",
                  position: "fixed",
                  zIndex: "9999"
                }}
              >
                <Recorder
                  collection={"chats"}
                  user={this.props.user}
                  getUserInfo={this.props.getUserInfo}
                  topic={this.props.chosenTopic}
                  getVideos={this.props.getVideos}
                  getFolders={this.props.getFolders}
                  folders={this.props.folders}
                  videos={this.props.videos}
                  onDeleteVideo={this.props.onDeleteVideo}
                  handleSaveVideo={this.props.handleSaveVideo}
                  auth={this.props.auth}
                  room={
                    this.state.room
                      ? this.state.room
                      : { id: this.props.threadId }
                  }
                  threadId={this.props.threadId}
                  cancel={() => this.setState({ videoRecorderOpen: false })}
                  entityType={"users"}
                  entityId={null}
                />
              </div>
            )}
          <ChatAccessories
            alterRecipients={this.props.alterRecipients}
            entityType={this.props.entityType}
            entityId={this.props.entityId}
            checkProfiles={() => this.setState({ profileChecker: true })}
            checkProfilesClose={() => this.setState({ profileChecker: false })}
            profileChecker={this.state.profileChecker}
            addUsertoRec={this.props.addUsertoRec}
            removeUserfromRec={this.props.removeUserfromRec}
            changeFilteredSenders={(x) => {
              if (filteredSenders.includes(x.id)) {
                var foo = filteredSenders;
                foo = foo.filter((e) => e !== x.id);
                this.setState({
                  filteredSenders: foo
                });
              } else {
                this.setState({
                  filteredSenders: [...filteredSenders, x.id]
                });
              }
            }}
            auth={this.props.auth}
            filteredSenders={filteredSenders}
            userQuery={this.state.userQuery}
            changeUserQuery={(e) =>
              this.setState({ userQuery: e.target.value.toLowerCase() })
            }
            openusersearch={this.state.openusersearch}
            opentheusersearch={() =>
              this.setState({ openusersearch: false, filterBySender: false })
            }
            opentheusersearch2={() => {
              if (this.state.openusersearch) {
                this.setState({ openusersearch: false });
              } else this.setState({ openusersearch: true });
            }}
            user={this.props.user}
            filterBySender={this.state.filterBySender}
            users={this.props.users}
            usersforaddrem={this.state.usersforaddrem}
            recipients={this.props.recipients}
          />
        </div>
        <Link
          to={{
            pathname: "/calendar",
            state: {
              prevLocation: window.location.pathname,
              chatwasopen: this.props.achatopen,
              recentchatswasopen: this.props.chatsopen
            }
          }}
          onClick={this.props.parlayRecip}
          style={{
            display: this.state.message !== "" ? "none" : "flex",
            position: "fixed",
            zIndex: "-1",
            width: "38px",
            height: "34px",
            justifyContent: "center",
            alignItems: "center",
            //boxShadow: "inset 0px 0px 5px 1px white",
            padding: "10px",
            color: "white",
            bottom: "0px",
            right: "0px",
            fontSize: "18px"
          }}
        />
        <div
          style={{
            display: this.state.openNewPlan ? "flex" : "none",
            position: "absolute",
            zIndex: "9999",
            width: "86px",
            height: "36px",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "40px",
            border: ".5px yellow dashed",
            padding: "5px 10px",
            color: "white",
            bottom: "56px",
            right: "10px",
            backgroundColor: "rgb(200,200,250)",
            fontSize: "18px"
          }}
        />
        <CheckProfiler
          recentChats={this.props.recentChats}
          thisentity={this.props.thisentity}
          communities={this.props.communities}
          entityTitle={this.props.entityTitle}
          entityType={this.props.entityType}
          auth={this.props.auth}
          checkProfilesClose={() => this.setState({ profileChecker: false })}
          profileChecker={this.state.profileChecker}
          users={this.props.users}
          entityId={this.props.entityId}
          recipients={this.props.recipients}
          user={this.props.user}
          openusersearch={this.state.openusersearch}
          opentheusersearch={() =>
            this.setState({ openusersearch: false, filterBySender: false })
          }
          opentheusersearch2={() => {
            if (this.state.openusersearch) {
              this.setState({ openusersearch: false });
            } else {
              this.setState({ openusersearch: true });
            }
          }}
        />
        <div
          onMouseEnter={() => this.setState({ hoverVideoOpen: true })}
          onMouseLeave={() => this.setState({ hoverVideoOpen: false })}
          onClick={() => {
            if (this.state.videoRecorderOpen) {
              this.setState({
                videoRecorderOpen: false
              });
            } else
              this.setState({
                videoRecorderOpen: true
              });
          }}
          style={{
            backgroundColor: this.state.hoverVideoOpen
              ? "rgba(255,70,50,1)"
              : this.state.videoRecorderOpen
              ? "rgba(255,70,50,.7)"
              : "rgba(255,70,50,.3)",
            display: "flex",
            position:
              this.state.message !== "" || this.state.sidemenuWidth === "40vw"
                ? "none"
                : "fixed",
            zIndex: "5",
            width: "34px",
            height: "34px",
            justifyContent: "center",
            alignItems: "center",
            border: "1px grey dashed",
            padding: "10px",
            color: "black",
            top: "56px",
            right: "0px",
            fontSize: "18px",
            transition: ".2s ease-in"
          }}
        >
          {this.state.videoRecorderOpen ? <div>&times;</div> : "+"}
        </div>
        <ChatPolls
          recentChats={this.props.recentChats}
          open={
            !this.state.profileChecker &&
            !this.state.openusersearch &&
            (this.state.sidemenuWidth === "40vw" || this.state.addPoll)
          }
          answers={answers}
          sidemenuWidth={() =>
            this.setState({
              addPoll: true,
              sidemenuWidth: "0"
            })
          }
          closePolls={() =>
            this.setState({ sidemenuWidth: "40vw", addPoll: false })
          }
          addPoll={this.state.addPoll}
          chosenTopic={this.props.chosenTopic}
        />
        <img
          onClick={() => {
            if (this.state.parent) {
              this.handleClose();
            } else this.handleClose2();
          }}
          src={back}
          alt="error"
          className="backgochat"
        />
      </div>
    );
  }
}
export default Chatter;

/*!this.state.profileChecker &&
!this.state.openusersearch &&
this.state.openDrivePicker && (
  <YouTube
    openVideoRecorder={() =>
      this.setState({
        videoRecorderOpen: true,
        openDrivePicker: false,
        sidemenuWidth: true
      })
    }
    openDrive={() => this.setState({ openDrivePicker: true })}
    accessToken={this.props.accessToken}
  />
  )*/
/*!this.state.profileChecker &&
!this.state.openusersearch &&
!this.state.openDrivePicker && (
  <div
    onClick={
      this.state.roomOpen
        ? () => this.setState({ roomOpen: false })
        : () => this.setState({ roomOpen: true })
    }
    style={
      this.state.roomOpen
        ? {
            display: "flex",
            position: "fixed",
            zIndex: "9999",
            width: "34px",
            height: "34px",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            color: "white",
            top: "56px",
            right: "0px",
            fontSize: "18px",
            backgroundColor: "rgb(150,150,250)",
            border: "3px rgb(250,150,150) solid",
            borderRadius: "20px"
          }
        : {
            display: "flex",
            position: "fixed",
            zIndex: "9999",
            width: "34px",
            height: "34px",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            color: "white",
            top: "56px",
            right: "0px",
            fontSize: "18px",
            backgroundColor: "rgb(250,150,150)",
            border: "3px rgb(250,150,150) solid",
            borderRadius: "20px"
          }
    }
  >
    {!this.state.roomOpen ? "unlock" : "lock"}
  </div>
)*/
/*<DrivePicker
            switchAccount={this.props.switchAccount}
            s={this.props.s}
            picker={this.picker}
            signOut={this.props.signOut}
            signedIn={this.props.signedIn}
            loadGapiApi={this.props.loadGapiApi}
            openDrivePicker={this.state.openDrivePicker}
            clearFilesPreparedToSend={() =>
              this.setState({ filePreparedToSend: [] })
            }
            changeFilesPreparedToSend={() => {
              this.state.filePreparedToSend.map((x) => {
                return lh.push(x.url);
              });
              this.setState({
                openDrivePicker: false,
                message: lh.toString()
              });
            }}
            filePreparedToSend={this.state.filePreparedToSend}
            openusersearch={this.state.openusersearch}
          />*/
