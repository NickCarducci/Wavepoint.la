import React from "react";
import firebase from "../../.././init-firebase";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import back777 from "../.././Icons/Images/back777.png";
import settings33 from "../.././Icons/Images/settings33.png";

import "./planopen.css";

class ShowPage extends React.PureComponent {
  constructor(props) {
    super(props);
    var event =
      props.notes &&
      props.notes.find((x) => {
        return x._id === props.match.params.id;
      });
    this.state = { event, planchats: [] };
  }
  renderDate() {
    let d = dayjs(this.props.event.updatedAt);
    return d.format("MMMM D YYYY, HH:mm");
  }
  /*
  componentWillMount() {
    if (!this.props.event) {
      this.props.history.replace(`/planner`);
      return;
    }
  }
*/
  componentDidMount = () => {
    if (this.state.event) {
      var id = this.state.event._id
        ? this.state.event._id
        : this.state.event.id;
      firebase
        .firestore()
        .collection("chats")
        .doc(id)
        .onSnapshot((doc) => {
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            this.setState({ event: foo });
          }
        });
      firebase
        .firestore()
        .collection("planchats")
        .where("chatId", "==", id)
        .onSnapshot((querySnapshot) => {
          let dol = [];
          querySnapshot.forEach((doc) => {
            if (doc.exists) {
              const foo = doc.data();
              foo.id = doc.id;
              if (!foo.firstChat) {
                dol.push(foo);
              } else {
                var announcement = foo.message;
              }
              return this.setState({
                announcement,
                planchats: dol ? dol : []
              });
            }
          });
        });
    } else if (this.props.inviteChosen) {
      this.setState({ event: this.props.inviteChosen });
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
    firebase
      .firestore()
      .collection("chats")
      .add({
        threadId: "users" + null + [this.props.auth.uid],
        recipients: [this.props.auth.uid],
        topic: "savedEvents",
        entityType: "users",
        entityId: null,
        message: title,
        body: note.ticketLink,
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
    const { event } = this.state;

    /*if (!event) {
      event = this.props.inviteChosen;
    }*/
    if (!event) {
      return null;
    }
    console.log(event);
    return (
      <div
        style={{
          display: "flex",
          background: "white",
          boxSizing: "border-box",
          position: "fixed",
          top: "0px",
          width: "100%",
          height: "100%",
          boxShadow: "1px 0px 7px rgba(0,0,0,0.5)",
          zIndex: "9999"
        }}
      >
        {event._id ? (
          <Link
            to={{
              pathname: `/plan/${event._id}/edit`,
              state:
                this.props.location.state && this.props.location.state.lastOpen
                  ? {
                      lastOpen: this.props.location.state.lastOpen
                    }
                  : null
            }}
          >
            <img src={settings33} className="settings33" alt="error" />
          </Link>
        ) : (
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: "10000",
              fontSize: "30px"
            }} //onClick={this.props.openATC}
            onClick={() => this.addNoteFromEvent(event)}
          >
            &#9734;
          </div>
        )}
        <Link
          to={
            this.props.location.state && this.props.location.state.lastOpen
              ? this.props.location.state.lastOpen
              : "/plan"
          }
        >
          <img src={back777} className="backopen" alt="error" />
        </Link>

        <div className="Plan_Header">{event.message}</div>
        <div>{this.state.firstChat}</div>
        {this.props.auth !== undefined &&
        event.authorId === this.props.auth.uid ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              var id = this.state.event._id
                ? this.state.event._id
                : this.state.event.id;
              firebase
                .firestore()
                .collection("planchats")
                .where("chatId", "==", id)
                .get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    if (doc.exists) {
                      const foo = doc.data();
                      foo.id = doc.id;
                      if (foo.firstChat) {
                        firebase
                          .firestore()
                          .collection("planchats")
                          .doc(foo.id)
                          .update({
                            message: this.state.announcement
                          });
                      } else {
                        firebase.firestore().collection("planchats").add({
                          chatId: id,
                          firstChat: true,
                          message: this.state.announcement,
                          authorId: this.props.auth.uid
                        });
                      }
                    }
                  });
                })
                .catch((err) => console.log(err));
            }}
          >
            <input
              className="inputforname"
              style={{
                display: "flex",
                position: "fixed",
                width: "100%",
                height: "min-content",
                minHeight: "56px",
                top: "56px",
                color: "black"
              }}
              value={this.state.announcement}
              placeholder="Add announcement"
              onChange={(e) => this.setState({ announcement: e.target.value })}
            />
          </form>
        ) : (
          <div>{this.state.announcement}</div>
        )}
        {this.state.planchats.map((x) => {
          return <div>{x.message}</div>;
        })}
        <div />
        <Link
          to={{
            pathname: `/plans/${
              this.state.event.chatId
                ? this.state.event.chatId
                : this.state.event.message
            }`,
            state: {
              planid: this.state.event.chatId
                ? this.state.event.chatId
                : this.state.event._id
            }
          }}
          style={{
            display: "flex",
            position: "fixed",
            top: "116px",
            right: "0px",
            backgroundColor: "grey",
            width: "100px",
            height: "100px"
          }}
        >
          All "{this.state.event.message}"
        </Link>
      </div>
    );
  }
}

export default ShowPage;
