import React from "react";
import firebase from "../../.././init-firebase";
import ReactLinkify from "react-linkify";
import MessageThumbnails from "./MessageThumbnails";
import NewNotif from "./NewNotif";
import dayjs from "dayjs";
import PlanObject from "../.././Calendar/Invites/PlanObject";
import EmbeddedRebeat from "../.././New/EmbeddedRebeat";
import NewDrop from "../.././Post/NewDrop";
import "../.././Calendar/Day/DayCalBackdrop.css";

export const WEEK_DAYS = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY"
};
class MessageClean extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "230,40,40",
      closeDrop: true,
      pollResults: [],
      attachments: [],
      opened: [],
      thisAuthor: {},
      printit:
        this.props.message.authorId !== this.props.auth.uid &&
        (!this.props.message.readUsers ||
          !this.props.message.readUsers.includes(this.props.auth.uid))
    };
    this.message = React.createRef();
  }
  renderTime(date) {
    let d = dayjs(date);
    return d.format("h:mm a");
  }
  renderDate(date) {
    let d = dayjs(date);
    return d.format("MMMM D YYYY");
  }
  componentDidMount = async () => {
    if (
      this.props.auth !== undefined &&
      (!this.props.message.readUsers ||
        !this.props.message.readUsers.includes(this.props.auth.uid))
    ) {
      firebase
        .firestore()
        .collection("chats")
        .doc(this.props.message.id)
        .update({
          readUsers: firebase.firestore.FieldValue.arrayUnion(
            this.props.auth.uid
          )
        })
        .catch((err) => console.log(err.message));
    }
    /*if (this.props.message) {
      firebase
        .firestore()
        .collection("polls")
        .where("threadId", "==", this.props.threadId)
        .onSnapshot((querySnapshot) => {
          querySnapshot.docs.forEach(
            (doc) => {
              if (doc.exists) {
                var pollResults = doc.data();
                pollResults.id = doc.id;
                this.setState({ pollResults });
              }
            },
            (e) => console.log(e.message)
          );
        });
    }*/
  };
  componentDidUpdate = (prevProps) =>
    this.props.message !== prevProps.message && this.getEntity();
  render() {
    const { message, noteList, noteTitles } = this.props;
    const note = this.props.notes.find((x) => x._id === message.id);
    var hasNote = message.date && note;
    var diffDays = 0;
    if (message.time) {
      var eventDate1 = new Date(
        message.time.seconds ? message.time.seconds * 1000 : message.time
      );
      var datenotime = new Date();
      datenotime.setHours(eventDate1.getHours(), eventDate1.getMinutes(), 0, 0);
      eventDate1.setSeconds(0);
      eventDate1.setMilliseconds(0);
      diffDays = Math.round(
        (datenotime.getTime() - eventDate1.getTime()) / 86400000
      );
    }
    return (
      <div
        style={{
          left: "0px",
          textIndent: "6px",
          display:
            this.props.filteredSenders === [] ||
            this.props.filteredSenders.includes(message.authorId) ||
            this.props.filteredSenders === message.authorId
              ? "flex"
              : "none",
          position: "relative",
          color: message.authorId === this.props.auth.uid ? "white" : "black",
          alignItems: "center",
          width: "min-content",
          maxWidth: "100%",
          wordBreak: "break-all",
          margin: "0px 0px"
        }}
      >
        <div
          style={{
            display: "flex",
            height: "inherit",
            width: "min-content",
            maxWidth: "100%"
          }}
        >
          {this.message.current && (
            <div
              style={{
                display: "flex",
                left: "0",
                position: "relative",
                height: `${this.message.current.offsetHeight}`,
                width: "5px"
              }}
            />
          )}
          <div
            ref={this.message}
            onClick={
              this.state.eraseQuestion
                ? () => this.setState({ eraseQuestion: false })
                : () => this.setState({ eraseQuestion: true })
            }
            style={{
              left: "0px",
              display: "flex",
              position: "relative",
              color:
                message.authorId === this.props.auth.uid ? "white" : "black",
              //backgroundColor: "rgb(200, 200, 250)",
              //backgroundColor: `rgb(${this.state.color})`,
              borderRadius: "0px",
              padding: "5px 10px",
              wordBreak: "break-all",
              alignItems: "flex-start",
              width: "min-content",
              maxWidth: "100%",
              height: "min-content",
              //border: `1px solid rgb(${this.state.color})`,
              flexDirection: "column",
              borderLeft: `4px solid rgb(${this.state.color})`,
              boxShadow: `inset 3px 0px 10px 1px rgb(200,200,200)`,
              //boxShadow: `inset 0px 0px 20px 1px rgb(${this.state.color})`,
              borderTopLeftRadius: "4px",
              borderBottomLeftRadius: "4px"
            }}
          >
            {this.state.contents && this.state.contents.length > 0 && (
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  left: "0px",
                  overflowY: "hidden",
                  overflowX: "auto",
                  width: "min-content",
                  maxWidth: "calc(100% - 20px)",
                  height: "200px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    position: "absolute",
                    width: "min-content",
                    height: "200px",
                    userSelect: "none",
                    border: "1px solid blue"
                  }}
                >
                  {this.state.contents.map((d, i) => {
                    return (
                      <MessageThumbnails
                        key={i}
                        openTopics={this.props.openTopics}
                        closeTheTopics={this.props.closeTheTopics}
                        chosenTopic={this.props.chosenTopic}
                        onDrag={this.props.onDrag}
                        i={i}
                        d={d}
                        onDragStart={this.props.onDragStart}
                        offDrag={this.props.offDrag}
                        contents={this.state.contents}
                        message={message}
                        signedIn={this.props.signedIn}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            <div
              style={{
                left: "0px",
                display: "flex",
                flexDirection: "column",
                width: "min-content",
                maxWidth: "100%"
              }}
            >
              {!hasNote && (
                <ReactLinkify>
                  <span
                    className={
                      message.authorId === this.props.auth.uid
                        ? "linkfinder"
                        : "linkfinderother"
                    }
                  >
                    {message.message}
                  </span>
                </ReactLinkify>
              )}
              {this.state.attachments.map((x) => {
                var videoUrl = window.URL.createObjectURL(x.blob);
                if (x.type.includes("video")) {
                  this[x.title].src = videoUrl;
                  return (
                    <div>
                      <video ref={(ref) => (this[x.title] = ref)}>
                        <p>Audio stream not available. </p>
                      </video>
                      <div onClick={() => this.videoUpload(x)}>
                        upload to cloud
                      </div>
                      <div onClick={() => this.props.onDeleteVideo(x._id)}>
                        delete from local device
                      </div>
                    </div>
                  );
                } else if (x.type.includes("image")) {
                  return (
                    <div>
                      <img
                        //id="photo"
                        key={x.title}
                        //ref={this.photo}
                        style={{
                          marginTop: "5px",
                          border: "3px solid",
                          borderRadius: "10px",
                          height: "90px",
                          width: "63px"
                        }}
                        src={videoUrl}
                        alt={x.title}
                      />
                      <div onClick={() => this.videoUpload(x)}>
                        upload to cloud
                      </div>
                      <div onClick={() => this.props.onDeleteVideo(x._id)}>
                        delete from local device
                      </div>
                    </div>
                  );
                } else if (x.type.includes("application/pdf")) {
                  return (
                    <div>
                      {x.title}
                      <div onClick={() => this.videoUpload(x)}>
                        upload to cloud
                      </div>
                      <div onClick={() => this.props.onDeleteVideo(x._id)}>
                        delete from local device
                      </div>
                    </div>
                  );
                } else {
                  return console.log("unknown file type loaded " + x.type);
                }
              })}
              {message.answers &&
                message.answers.map((x) => {
                  return (
                    <div
                      key={x}
                      onClick={() => {
                        var thisone = this.state.pollResults.find(
                          (s) => s.authorId === this.props.auth.uid
                        );
                        var threadId =
                          this.props.entityType +
                          this.props.entityId +
                          this.props.recipients.sort();
                        if (thisone) {
                          firebase
                            .firestore()
                            .collection("polls")
                            .doc(thisone.id)
                            .update({
                              threadId,
                              authorId: this.props.auth.uid,
                              answer: x,
                              time: new Date()
                            });
                        } else {
                          firebase.firestore().collection("polls").add({
                            threadId,
                            authorId: this.props.auth.uid,
                            answer: x,
                            time: new Date()
                          });
                        }
                      }}
                      style={{
                        left: "0px",
                        border: "1px solid blue",
                        width: "max-content",
                        wordBreak: "break-word",
                        color: "black",
                        borderRadius: "15px"
                      }}
                    >
                      {x}
                    </div>
                  );
                })}
              {this.props.auth !== undefined &&
                this.props.auth.uid === message.authorId && (
                  //&&this.state.eraseQuestion
                  <div
                    style={{
                      padding: "0px 5px",
                      alignItems: "center",
                      backgroundColor: "rgba(40,40,70,.8)",
                      display: "flex",
                      position: "relative",
                      top: "0px",
                      left: "0px",
                      fontSize: "20px",
                      color: "rgb(220,220,220)",
                      width: "min-content",
                      maxWidth: "100%"
                    }}
                  >
                    {hasNote ? (
                      <div
                        onClick={() => {
                          var answer = window.confirm("recind your invite?");
                          if (answer) {
                            firebase
                              .firestore()
                              .collection("chats")
                              .doc(message.id)
                              .update({
                                recipients: [this.props.auth.uid],
                                topic: "",
                                entityType: "",
                                entityId: "",
                                message: "",
                                body: "",
                                chosenPhoto: "",
                                authorId: this.props.auth.uid,
                                time: "",
                                date: "",
                                authoritarianTopic: false
                              })
                              .then(() => {
                                this.props.listDeletedMsgs(message.id);
                              })
                              .catch((err) => console.log(err.message));
                          }
                        }}
                        style={{
                          fontSize: "20px",
                          color: "#555",
                          position: "relative",
                          width: "max-content"
                        }}
                      >
                        unshare
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          var answer = window.confirm("delete your message?");
                          if (answer) {
                            firebase
                              .firestore()
                              .collection("chats")
                              .doc(message.id)
                              .delete()
                              .then(() => {
                                this.props.listDeletedMsgs(message.id);
                                this.handleCountDecrease();
                              })
                              .catch((err) =>
                                window.alert(err.message + this.props.auth.uid)
                              );
                          }
                        }}
                        style={{
                          marginRight: "5px",
                          left: "0px",
                          fontSize: "20px",
                          position: "relative",
                          color: "#999"
                        }}
                      >
                        &times;
                      </div>
                    )}
                    <div
                      style={
                        message.authorId === this.props.auth.uid
                          ? {
                              wordWrap: "break-word",
                              width: "max-content",
                              maxWidth: "100%",
                              display: "flex",
                              position: "relative",
                              fontSize: "12px",
                              color: "rgb(150,150,50)"
                            }
                          : {
                              wordWrap: "break-word",
                              width: "max-content",
                              maxWidth: "100%",
                              display: "flex",
                              position: "relative",
                              fontSize: "12px",
                              color: "rgb(50,50,50)"
                            }
                      }
                    >
                      {diffDays} days ago -{" "}
                      {
                        ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"][
                          new Date(message.time.seconds * 1000).getDay()
                        ]
                      }{" "}
                      -{" "}
                      {
                        [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec"
                        ][new Date(message.time.seconds * 1000).getMonth()]
                      }{" "}
                      {new Date(
                        message.time.seconds * 1000
                      ).toLocaleTimeString()}
                      &nbsp;
                      {new Date(message.time.seconds * 1000).getDate()}{" "}
                      &nbsp;&nbsp;
                    </div>
                  </div>
                )}
              {this.state.printit && (
                <NewNotif auth={this.props.auth} message={message} />
              )}
              {message.droppedPost ? (
                //forumA6XwWfGwpz6mdh4F0aPn
                <EmbeddedRebeat
                  showStuff={true}
                  linkDrop={this.props.linkDrop}
                  dropId={this.props.dropId}
                  rebeat={message.droppedPost}
                  parent={message}
                  getCommunity={this.props.getCommunity}
                  issues={this.props.issues}
                  post={this.post}
                  setDelete={() => {
                    var answer = window.confirm("remove drop?");
                    if (answer)
                      firebase
                        .firestore()
                        .collection(message.collection)
                        .doc(message.id)
                        .update({ droppedId: null })
                        .then(() => {})
                        .catch((e) => console.log(e.message));
                  }}
                  userMe={this.props.user}
                  auth={this.props.auth}
                  community={this.props.community} //
                  etypeChanger={this.props.etypeChanger}
                  chosenPostId={this.state.chosenPostId}
                  helper={() => this.props.helper(message.droppedPost)}
                  delete={() =>
                    this.setState({
                      deletedForumPosts: [
                        ...this.state.deletedForumPosts,
                        message.id
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
                  parent={message}
                  droppedCommentsOpen={this.props.droppedCommentsOpen}
                  getUserInfo={this.props.getUserInfo}
                  openDrop={(parent) => {
                    this.setState(parent);
                  }}
                  closeDrop={this.state.closeDrop}
                  auth={this.props.auth}
                  height={this.props.height}
                  width={this.props.width}
                  user={this.props.user}
                  communities={this.props.communities}
                />
              )}
              <div
                style={{
                  backgroundColor: "black",
                  display: "flex",
                  width: "300px",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  top: "0px",
                  bottom: "56px",
                  marginBottom: "10px",
                  height: "min-content",
                  textDecoration: "none"
                }}
              >
                {message.date && (
                  <div>
                    <PlanObject
                      notes={this.props.notes}
                      auth={this.props.auth}
                      edmInitial={note && note.name}
                      eventInitial={note && !isNaN(note.date)}
                      eventsInitial={this.props.eventsInitial}
                      chooseInvite={this.props.chooseInvite}
                      //forMessage={true}
                      //ref={this[index]}
                      //id={`${note._id}_ref`}
                      onDelete={this.props.onDelete}
                      handleSave={this.props.handleSave}
                      noteList={noteList}
                      noteTitles={noteTitles}
                      note={message}
                      users={this.props.users}
                      height={this.props.height}
                      opened={this.state.opened}
                      open={(x) => {
                        this.setState({ opened: x });
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default MessageClean;

/**
 * 
  corsProxy(url) {
    return `https://cors-anywhere.herokuapp.com/${url}`;
  }
    let b = 0;
    let le = [];
    const words = this.props.message.message.split(/\s/);
    this.props.message.message.match(/https:\/\//) &&
      words.map((word) => {
        b++;
        //if (word.match(/^https:\/\//)) {
        var fileid = word.substring(
          word.lastIndexOf("/d/") + 3,
          word.lastIndexOf("/")
        );
        var thumbnail = `https://drive.google.com/thumbnail?id=${fileid}`;
        var couple = {};
        couple.content = word;
        couple.thumbnail = thumbnail;
        couple.id = fileid;
        //console.log(couple);
        le.push(couple);
        //}
        if (words.length === b && le !== this.state.contents) {
          this.setState({ contents: le });
          //this.props.contentLinker(couple);
        }
        return le;
      });
 */
