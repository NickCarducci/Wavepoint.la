import React from "react";
import firebase from "../../.././init-firebase";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import imagesl from "../.././SwitchCity/Community/standardIMG.jpg";
//import firebase from "../../.././init-firebase";

export const WEEK_DAYS = {
  0: "su",
  1: "mo",
  2: "tu",
  3: "we",
  4: "th",
  5: "fr",
  6: "sa"
};
class PlanObject extends React.Component {
  state = {};
  getChatReppingPlan = (y) => {
    firebase
      .firestore()
      .collection("chats")
      .doc(y)
      .onSnapshot((doc) => {
        if (doc.exists) {
          var foo = doc.data();
          foo.id = doc.id;
          if (foo.message !== "") {
            this.setState({
              clouded: true,
              cloudDate: foo.date,
              cloudTitle: foo.message
            });
          } else {
            this.setState({ clouded: false });
          }
          return this.setState({
            recipients: foo.recipients
          });
        }
      });
  };
  componentDidMount = () => {
    var note = { ...this.props.note };
    note.id = note.id ? note.id : note._id;

    if (String(note.id).length < 10) {
      var title = note.name
        ? note.name
        : note.artistList[0]
        ? note.artistList[0].name
        : null;
      note =
        this.props.notes && this.props.notes.find((x) => x.message === title);
    } else {
      note = this.props.notes && this.props.notes.find((x) => x.id === note.id);
    }

    if (note) {
      this.setState({ ...note });
      this.props.auth !== undefined && this.getChatReppingPlan(note.id);
    }
  };
  componentDidUpdate = () => {
    if (this.state.id !== this.state.lastId) {
      this.getChatReppingPlan(this.state.id);
      this.setState({ lastId: this.state.id });
    }
  };
  addNoteFromEvent = (note) => {
    var title = "none";
    if (note && note.name) {
      title = note.name;
    } else if (note.artistList) {
      title = note.artistList[0].name;
    } else {
      title = note.message;
    }
    var arrAuthor = this.props.auth !== undefined ? [this.props.auth.uid] : [];
    firebase
      .firestore()
      .collection("chats")
      .add({
        threadId: "users" + null + arrAuthor,
        recipients: arrAuthor,
        topic: "savedEvents",
        entityType: "users",
        entityId: null,
        message: title,
        body: note.ticketLink ? note.ticketLink : note.body ? note.body : null,
        chosenPhoto: note.chosenPhoto
          ? {
              large: note.chosenPhoto.src.large,
              medium: note.chosenPhoto.src.medium,
              small: note.chosenPhoto.src.small,
              photographer: note.chosenPhoto.photographer,
              photographer_url: note.chosenPhoto.photographer_url
            }
          : null,
        authorId: this.props.auth !== undefined ? this.props.auth.uid : "",
        time: new Date(),
        date: note.date,
        authoritarianTopic: false
      })
      .then(
        (docRef) => {
          console.log("Document written with ID: ", docRef.id);
          var goo = {};
          goo.message = title;
          goo.body = note.ticketLink;
          goo.createdAt = this.state.createdAt;
          goo.updatedAt = this.state.updatedAt;
          goo.date = note.date;
          goo.time = new Date();
          goo.recipients = [this.props.auth.uid];
          goo.ttype = "savedEvents";
          goo.authorId = this.props.auth.uid;
          goo.chosenPhoto = note.chosenPhoto;
          goo._id = docRef.id;
          this.props.handleSave(goo);

          firebase.firestore().collection("calendar").doc(docRef.id).set({
            rangeChosen: 3600,
            authorId: this.props.auth.uid,
            date: note.date
          });
          if (this.props.auth !== undefined)
            firebase
              .firestore()
              .collection("planchats")
              .add({
                chatId: goo._id,
                firstChat: true,
                message: goo.body,
                authorId: this.props.auth.uid
              })
              .then((x) => console.log(`created ${x.id} in savedEvents`))
              .catch((x) => console.log(x.message));
        },
        (e) => console.log(e.message)
      )
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };
  render() {
    const { note, noteList, noteTitles } = this.props;
    if (note) {
      var eventDate1 = new Date(
        note.date.seconds ? note.date.seconds * 1000 : note.date
      );
      function renderTime(date) {
        let d = dayjs(date);
        return d.format("h:mm a");
      }
      function renderDate(date) {
        let d = dayjs(date);
        //return d.format("MMMM D YYYY");
        return d.format("MMM D YYYY");
      }
      var datenotime = new Date();
      datenotime.setHours(eventDate1.getHours(), eventDate1.getMinutes(), 0, 0);
      eventDate1.setSeconds(0);
      eventDate1.setMilliseconds(0);
      var diffDays = Math.round(
        (datenotime.getTime() - eventDate1.getTime()) / 86400000
      );
      var is_negative = diffDays < 0;
      var title =
        note && note.name
          ? note.name
          : note.artistList
          ? note.artistList[0].name
          : note.message;
      var id = note._id ? note._id : note.id;
      var to = {
        pathname: this.props.edmInitial
          ? `/events/edmtrain/${id}`
          : this.props.eventsInitial
          ? `/event/${id}`
          : `/plan/${id}`
      };
      return (
        <div className="relplans">
          <div className="eachplan">
            {this.props.opened === id ? (
              <Link
                style={{
                  top: "0px",
                  display: "flex",
                  position: "relative",
                  textAlign: "center",
                  alignItems: "flex-start",
                  fontSize: "26px",
                  color: "white",
                  width: "auto",
                  maxHeight: "40vh",
                  overflow: "hidden",
                  textDecoration: "none",
                  zIndex: "1"
                }}
                to={to}
                onClick={id ? null : () => this.props.chooseInvite(note)}
              >
                <div
                  onMouseEnter={() => this.setState({ hovered: true })}
                  onMouseLeave={() => this.setState({ hovered: false })}
                  style={
                    this.state.hovered
                      ? { opacity: "1", transition: ".1s ease-in" }
                      : { opacity: ".7", transition: ".3s ease-out" }
                  }
                >
                  {note && (
                    <div
                      style={
                        this.props.opened === id
                          ? { height: "auto" }
                          : { height: "76px", overflow: "hidden" }
                      }
                    >
                      <img
                        src={
                          note.chosenPhoto ? note.chosenPhoto.large : imagesl
                        }
                        alt="error"
                        className="imageplan"
                      />
                    </div>
                  )}
                </div>
                <div
                  className="plantitle"
                  style={{
                    top: "0px",
                    flexDirection: "column",
                    display: "flex",
                    position: "absolute",
                    borderRadius: "10px",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    zIndex: "100",
                    fontSize: "14px",
                    color: "white",
                    margin: "4",
                    padding: "2px",
                    height: "min-content",
                    width: "max-content",
                    textDecoration: "none",
                    backgroundColor: "rgba(51, 51, 51, 0.855)"
                  }}
                >
                  <div
                    className="boundtimes"
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      fontSize: "15px",
                      backgroundColor:
                        diffDays > 0 ? "rgba(126, 126, 166,.5)" : "",
                      color: diffDays > 0 ? "white" : "rgb(146, 266, 176)"
                    }}
                  >
                    {renderDate(eventDate1)}
                  </div>
                  {diffDays === 0
                    ? ` today`
                    : diffDays === -1
                    ? ` tomorrow`
                    : diffDays === 1
                    ? ` yesterday`
                    : is_negative
                    ? ` in ${Math.abs(diffDays)} days`
                    : ` ${diffDays} days ago`}
                  <br />
                  {WEEK_DAYS[eventDate1.getDay()]}
                  {diffDays === 0
                    ? renderTime(
                        note.date.seconds ? note.date.seconds * 1000 : note.date
                      )
                    : renderTime(
                        note.date.seconds ? note.date.seconds * 1000 : note.date
                      )}
                  <br />
                </div>
              </Link>
            ) : (
              <div
                style={{
                  top: "0px",
                  display: "flex",
                  position: "relative",
                  textAlign: "center",
                  alignItems: "center",
                  fontSize: "26px",
                  color: "white",
                  maxHeight: "40vh",
                  overflow: "hidden",
                  textDecoration: "none",
                  zIndex: "1"
                }}
                onClick={() => this.props.open(id)}
              >
                <div
                  onMouseEnter={() => this.setState({ hovered: true })}
                  onMouseLeave={() => this.setState({ hovered: false })}
                  style={
                    this.state.hovered
                      ? { opacity: "1", transition: ".1s ease-in" }
                      : { opacity: ".7", transition: ".3s ease-out" }
                  }
                >
                  {note && (
                    <div
                      style={
                        this.props.opened === id
                          ? { height: "auto" }
                          : { height: "76px", overflow: "hidden" }
                      }
                    >
                      <img
                        src={
                          note.chosenPhoto ? note.chosenPhoto.large : imagesl
                        }
                        alt="error"
                        className="imageplan"
                      />
                    </div>
                  )}
                </div>
                <div
                  style={{
                    top: "0px",
                    flexDirection: "column",
                    display: "flex",
                    position: "absolute",
                    borderRadius: "7px",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    zIndex: "100",
                    fontSize: "14px",
                    color: "white",
                    margin: "4",
                    padding: "2px",
                    height: "min-content",
                    width: "max-content",
                    textDecoration: "none",
                    backgroundColor: "rgba(51, 51, 51, 0.855)"
                  }}
                >
                  <div
                    style={{
                      borderRadius: "5px",
                      padding: "2px",
                      display: "flex",
                      justifyContent: "flex-start",
                      fontSize: "15px",
                      backgroundColor:
                        diffDays > 0 ? "rgba(126, 126, 166,.5)" : "",
                      color: diffDays > 0 ? "white" : "rgb(146, 266, 176)"
                    }}
                  >
                    {renderDate(eventDate1)}
                  </div>
                  {diffDays === 0
                    ? ` today`
                    : diffDays === -1
                    ? ` tomorrow`
                    : diffDays === 1
                    ? ` yesterday`
                    : is_negative
                    ? ` in ${Math.abs(diffDays)} days`
                    : ` ${diffDays} days ago`}
                  <br />
                  {WEEK_DAYS[eventDate1.getDay()]}
                  {diffDays === 0
                    ? renderTime(
                        note.date.seconds ? note.date.seconds * 1000 : note.date
                      )
                    : renderTime(
                        note.date.seconds ? note.date.seconds * 1000 : note.date
                      )}
                </div>
                <br />
                <div style={{ width: "100%", display: "flex" }}>
                  <div className="plantitle">
                    {(title ? title : note.message).substr(0, 40)}
                    {(title ? title : note.message).length > 40 && "..."}
                  </div>
                </div>
              </div>
            )}
            <div
              onMouseEnter={() => this.setState({ hovering: true })}
              onMouseLeave={() => this.setState({ hovering: false })}
              className="starfavorite" //star onClick={this.props.openATC}
              onClick={() => {
                var foo = { ...note };
                foo.date = note.date.seconds
                  ? note.date.seconds * 1000
                  : note.date;
                if (noteList.includes(id)) {
                  var deleteAll = window.confirm(
                    "Are you sure you want to delete this plan? " +
                      `${
                        this.props.auth !== undefined &&
                        note.authorId === this.props.auth.uid
                          ? "This also deletes you invites in chat with this plan." +
                            " Nothing can be recovered after this"
                          : "It will have its original date when you " +
                            `redownload it from the original author`
                      }`
                  );
                  if (deleteAll) {
                    this.props.onDelete(id);
                  } else this.props.onDelete();
                } else {
                  this.addNoteFromEvent(foo);
                }
              }}
              style={{ position: "absolute", right: "5px", zIndex: "6" }}
            >
              {this.state.hovering && this.state.clouded ? (
                <div style={{ width: "20px", height: "20px" }}>&times;</div>
              ) : noteList.includes(id) || noteTitles.includes(title) ? (
                <p
                  style={
                    noteList.includes(id) || noteTitles.includes(title)
                      ? { opacity: ".5" }
                      : {}
                  }
                >
                  &#9733;
                </p>
              ) : (
                <p>&#9734;</p>
              )}
            </div>
            <Link
              to={to}
              onClick={
                this.state.hovering
                  ? () => this.setState({ openShareDialog: true })
                  : null
              }
              onMouseEnter={() => this.setState({ hovering: true })}
              onMouseLeave={() => this.setState({ hovering: false })}
              style={
                //this.props.opened !== note._id
                {
                  transform: "translateY(0px)",
                  color: "rgb(100,100,100)",
                  display: "flex",
                  position: "absolute",

                  right: "30px",
                  top: "4px",
                  opacity: "1",
                  transition: ".3s ease-in",
                  backgroundColor: "rgba(0,0,0,1)",
                  fontSize: "15px",
                  textDecoration: "none"
                }
              }
            >
              {this.state.recipients &&
              this.state.recipients.length > 0 &&
              this.state.clouded
                ? "in the cloud"
                : noteList.includes(id)
                ? "on this device"
                : "add"}
            </Link>
            {this.props.auth !== undefined &&
              this.props.auth.uid !== this.state.authorId &&
              this.state.message !== this.state.cloudTitle && (
                <div
                  onClick={() => {
                    firebase
                      .firestore()
                      .collection("chats")
                      .doc(this.state.id)
                      .update({ message: this.state.cloudTitle });
                    this.setState({ message: this.state.cloudTitle });
                  }}
                  style={{
                    display: "flex",
                    position: "relative",
                    bottom: "10px",
                    left: "10px"
                  }}
                >
                  Sync to cloud title
                </div>
              )}
            {this.props.auth !== undefined &&
              this.props.auth.uid !== this.state.authorId &&
              this.state.date !== this.state.cloudDate && (
                <div
                  onClick={() => {
                    firebase
                      .firestore()
                      .collection("chats")
                      .doc(this.state.id)
                      .update({ date: this.state.cloudDate });
                    this.setState({ date: this.state.cloudDate });
                  }}
                  style={{
                    display: "flex",
                    position: "relative",
                    bottom: "10px",
                    left: "10px"
                  }}
                >
                  Sync to cloud date:{" "}
                  {new Date(this.state.cloudDate).toLocaleDateString()}
                  <br />
                  (your free time uses this date)
                </div>
              )}
          </div>
          <div
            onClick={
              this.state.hovering
                ? () => this.setState({ openShareDialog: true })
                : null
            }
            onMouseEnter={() => this.setState({ hovering: true })}
            onMouseLeave={() => this.setState({ hovering: false })}
            style={
              this.state.hovering || this.props.height < 600
                ? {
                    display: "flex",
                    position: "absolute",

                    right: "0px",
                    bottom: "0px",
                    opacity: "1",
                    transition: ".3s ease-in",
                    backgroundColor: "rgba(0,0,0,1)",
                    fontSize: "15px"
                  }
                : {
                    display: "flex",
                    position: "absolute",

                    right: "0px",
                    bottom: "0px",
                    opacity: "0",
                    transition: ".3s ease-out"
                  }
            }
          >
            {this.state.user && this.state.user.username}
          </div>
          {this.props.opened === id && (
            <div
              onClick={() => this.props.open(null)}
              style={{
                width: "min-content",
                display: "flex",
                position: "absolute",
                backgroundColor: "rgba(126, 126, 166,.5)",
                color: "white",
                bottom: "0px",
                left: "0px",

                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div className="plantitle">
                {(title ? title : note.message).substr(0, 40)}
                {(title ? title : note.message).length > 40 && "..."}
              </div>
              <div
                style={{
                  marginRight: "3px",
                  left: "4px",
                  display: "flex",
                  width: "36px",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {" "}
                &times;
              </div>
            </div>
          )}
        </div>
      );
    } else return null;
  }
}
export default PlanObject;
