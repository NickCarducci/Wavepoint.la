import React from "react";
import firebase from "../../.././init-firebase";
import { Link } from "react-router-dom";

import "./planopen.css";
import GetPhotos from "./GetPhotos";

class EditNotePage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { recipients: [], userQuery: "" };
  }
  doit = (y) => {
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
    let foo = [];
    let roll = [];
    this.props.chats.map((x) => {
      if (
        x.recipients.map((recipient) =>
          this.state.recipients.map((pq) => foo.push(pq.id)).includes(recipient)
        )
      ) {
        roll.push(x.ttype);
      }
      return roll;
    });
    this.setState({ ttypes: roll });
    if (this.props.auth !== undefined) {
      let leg = [];
      let w = 0;
      let x =
        this.state.recipients.constructor === Array
          ? [...this.state.recipients, this.props.auth.uid]
          : [this.state.recipients, this.props.auth.uid];
      //x.filter(b => b !== this.props.auth.uid);
      this.props.chats.forEach((hop) => {
        var doc = hop;
        //doc.recipients = hop.recipients.filter(x => x !== this.props.auth.uid);
        if (
          x.toString() === doc.recipients.toString() ||
          x.sort().toString() === doc.recipients.sort().toString()
        ) {
          leg.push({ entityId: hop.entityId, entityType: hop.entityType });
          w++;
          if (w === [leg].length) {
            var entityIds = [...new Set(leg)];
            let applicableEntities = [];
            entityIds.forEach(
              (fo) =>
                fo.entityType !== "users" &&
                firebase
                  .firestore()
                  .collection(fo.entityType)
                  .doc(fo.entityId)
                  .onSnapshot((doc) => {
                    if (doc.exists) {
                      const foo = doc.data().d;
                      applicableEntities.push(foo);
                      foo && this.setState({ applicableEntities });
                    }
                  })
            );
          }
        }
      });
    }
  };
  componentDidMount = () => {
    var note = this.props.notes.find(
      (x) => x._id === this.props.match.params.id
    );
    note && this.setState({ ...note });
    note && this.props.auth !== undefined && this.doit(note._id);
  };
  componentDidUpdate = () => {
    if (this.state._id !== this.state.lastId) {
      this.doit(this.state._id);
      this.setState({ lastId: this.state._id });
    }
  };
  async handleSave() {
    var chat = this.props.chats.find((x) => x.id === this.state._id);
    var entry = { ...this.state };
    if (chat && this.props.auth.uid === chat.authorId) {
      entry.date = this.props.date ? this.props.date : this.state.date;
      firebase
        .firestore()
        .collection("chats")
        .doc(this.state._id)
        .update({
          topic: "*",
          entityType: "users",
          entityId: null,
          message: this.state.message,
          body: "",
          chosenPhoto: this.state.chosenPhoto ? this.state.chosenPhoto : null,
          authorId: this.props.auth.uid,
          time: new Date(),
          date: entry.date
          //authoritarianTopic: false
        })
        .then((docRef) => {
          firebase.firestore().collection("calendar").doc(docRef.id).update({
            authorId: this.props.auth.uid,
            date: this.props.date
          });
        })
        .catch((x) => console.log(x));
    }
    this.setState({ saving: true });
    //
    entry.date = this.props.date ? this.props.date : entry.date;
    delete entry.query;
    delete entry.lastQuery;
    delete entry.images;
    const res = await this.props.onSave(entry);
    this.props.history.replace(`/plan/${res.id}`);
    this.props.clearMaterialDate();
  }
  updateValue(e) {
    let { note } = this.state;

    this.setState({ ...note, [e.target.name]: e.target.value });
  }
  drawerToggleClickHandler = () => {
    this.setState({
      drawerOpen: !this.state.drawerOpen
    });
  };
  backdropClickHandler = () => {
    this.setState({
      drawerOpen: false
    });
  };
  /*componentDidUpdate = () => {
    if (this.state.date !== this.props.date) {
      //this.props.choosePlan(this.state.date);
      this.setState({ date: this.props.date });
    }
  };*/
  render() {
    /*let backdrop;
    if (this.state.drawerOpen) {
      backdrop = <PlanEditBackdrop close={this.backdropClickHandler} />;
    }*/
    var placeholderusersearch = this.props.filterBySender ? "Search" : "Search";
    //this.props.chats.map(y => recents.push(y.id));
    return (
      <div
        className="planeditpage"
        style={
          this.props.eventDateOpen ? { display: "none" } : { display: "flex" }
        }
      >
        {/*<div>
          <Link to="/planner">
            <img src={back777} className="backopen" alt="error" />
        </Link>
        </div>*/}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            this.handleSave();
          }}
        >
          <input
            className="Plan_Header"
            type="text"
            name="message"
            value={this.state.message}
            onChange={(e) => {
              this.updateValue(e);
            }}
            autoComplete="off"
            required
          />

          <div
            onClick={() => this.setState({ sharedialog: false })}
            style={
              this.state.sharedialog
                ? {
                    display: "flex",
                    position: "fixed",
                    flexDirection: "column",
                    backgroundColor: "rgba(0,0, 0, 0.721)",
                    zIndex: "9999",
                    opacity: "1",
                    width: "100%",
                    height: "100%"
                  }
                : {
                    display: "flex",
                    position: "fixed",
                    flexDirection: "column",
                    backgroundColor: "rgba(0,0, 0, 0.721)",
                    zIndex: "-10",
                    opacity: "0",
                    width: "100%",
                    height: "100%"
                  }
            }
          />
          <div
            style={
              this.state.recipients > 0 && this.state.applicableEntities > 0
                ? {
                    display: "flex",
                    position: "fixed",
                    flexDirection: "column",
                    backgroundColor: "rgba(35, 108, 255, 0.721)",
                    color: "white",
                    zIndex: "9999",
                    top: "230px",
                    right: "100px",
                    width: "200px",
                    height: "200px"
                  }
                : {
                    display: "flex",
                    position: "fixed",
                    flexDirection: "column",
                    backgroundColor: "rgba(35, 108, 255, 0.721)",
                    color: "white",
                    zIndex: "9999",
                    top: "30px",
                    right: "100%",
                    width: "200px",
                    height: "200px"
                  }
            }
          >
            <div
              style={{
                display: "flex",
                position: "absolute",
                overflowY: "scroll",
                flexDirection: "column",
                width: "100%",
                color: "white",
                zIndex: "99",
                justifyContent: "center"
              }}
            >
              <br />
              {this.props.user !== undefined &&
                this.state.applicableEntities &&
                this.state.applicableEntities
                  /*.filter(
                    x =>
                      (this.props.user.following &&
                        this.props.user.following.includes(x.id)) ||
                      recents.includes(x.id)
                  )*/
                  //.filter(obj => this.props.recipients.includes(obj.id))
                  .map((x) => {
                    //if (this.props.recipients.indexOf(x.id) < 1)
                    if (this.props.auth !== undefined) {
                      return (
                        <div
                          key={x}
                          style={{
                            display: "flex",
                            position: "relative",
                            justifyContent: "center",
                            zIndex: "9999",
                            margin: "1px 2px",
                            padding: "5px",
                            width: "auto",
                            backgroundColor: "rgba(51, 51, 51, 0.687)"
                          }}
                        >
                          <div
                            onClick={() =>
                              this.setState({
                                entityId: x.entityId,
                                entityType: x.entityType
                              })
                            }
                            style={
                              this.state.entityId === x.entityId &&
                              this.state.entityType === x.entityType
                                ? { color: "white", width: "min-content" }
                                : { color: "grey", width: "min-content" }
                            }
                          >
                            {x}
                          </div>
                        </div>
                      );
                    } else return null;
                  })}
            </div>
          </div>
          <div
            style={
              this.state.sharedialog
                ? {
                    display: "flex",
                    position: "fixed",
                    flexDirection: "column",
                    backgroundColor: "rgba(35, 108, 255, 0.721)",
                    color: "white",
                    zIndex: "9999",
                    top: "30px",
                    right: "100px",
                    width: "200px",
                    height: "200px"
                  }
                : {
                    display: "flex",
                    position: "fixed",
                    flexDirection: "column",
                    backgroundColor: "rgba(35, 108, 255, 0.721)",
                    color: "white",
                    zIndex: "9999",
                    top: "30px",
                    right: "100%",
                    width: "200px",
                    height: "200px"
                  }
            }
          >
            <input
              value={this.state.userQuery}
              placeholder={placeholderusersearch}
              style={{
                display: "flex",
                position: "relative",
                flexDirection: "column",
                backgroundColor: "#333",
                border: "3px solid #333",
                borderRadius: "0px",
                height: "20px",
                color: "white",
                zIndex: "9999",
                fontSize: "18px"
              }}
              maxLength="30"
              onChange={(e) => this.setState({ userQuery: e.target.value })}
            />
            <div
              style={
                this.state.userQuery !== ""
                  ? {
                      display: "flex",
                      position: "absolute",
                      overflowY: "scroll",
                      flexDirection: "column",
                      width: "100%",
                      color: "white",
                      zIndex: "99",
                      justifyContent: "center"
                    }
                  : {
                      display: "none"
                    }
              }
            >
              <br />
              {this.state.userQuery !== "" &&
                this.props.user !== undefined &&
                this.props.users &&
                this.props.users
                  /*.filter(
                    x =>
                      (this.props.user.following &&
                        this.props.user.following.includes(x.id)) ||
                      recents.includes(x.id)
                  )*/
                  //.filter(obj => this.props.recipients.includes(obj.id))
                  .map((x) => {
                    //if (this.props.recipients.indexOf(x.id) < 1)
                    if (
                      this.props.auth !== undefined &&
                      x.id !== this.props.auth.uid
                    ) {
                      return (
                        <div
                          style={{
                            display: "flex",
                            position: "relative",
                            justifyContent: "center",
                            zIndex: "9999",
                            margin: "1px 2px",
                            padding: "5px",
                            width: "auto",
                            backgroundColor: "rgba(51, 51, 51, 0.687)"
                          }}
                        >
                          {this.state.recipients.includes(x.id) ? (
                            <div
                              style={{ width: "min-content" }}
                              onClick={() => {
                                firebase
                                  .firestore()
                                  .collection("chats")
                                  .doc(this.state._id)
                                  .update({
                                    recipients: firebase.firestore.FieldValue.arrayRemove(
                                      x.id
                                    )
                                  });
                              }}
                            >
                              -&nbsp;
                            </div>
                          ) : (
                            <div
                              onClick={() => {
                                var entry = { ...this.state };
                                entry.date = this.props.date
                                  ? this.props.date
                                  : this.state.date;
                                var chat = this.props.chats.find(
                                  (x) => x.id === this.state._id
                                );
                                var values = [x.id, this.props.auth.uid];
                                if (chat) {
                                  firebase
                                    .firestore()
                                    .collection("chats")
                                    .doc(this.state._id)
                                    .update({
                                      recipients: firebase.firestore.FieldValue.arrayUnion(
                                        ...values
                                      ),
                                      topic: "*",
                                      entityType: "users",
                                      entityId: null,
                                      message: this.state.message,
                                      body: "",
                                      chosenPhoto: this.state.chosenPhoto
                                        ? this.state.chosenPhoto
                                        : null,
                                      authorId: this.props.auth.uid,
                                      time: new Date(),
                                      date: entry.date,
                                      authoritarianTopic: false
                                    })
                                    .then(() => {})
                                    .catch((x) => console.log(x));
                                } else {
                                  firebase
                                    .firestore()
                                    .collection("chats")
                                    .doc(this.state._id)
                                    .set({
                                      recipients: firebase.firestore.FieldValue.arrayUnion(
                                        ...values
                                      ),
                                      topic: "*",
                                      entityType: "users",
                                      entityId: null,
                                      message: this.state.message,
                                      body: "",
                                      chosenPhoto: this.state.chosenPhoto
                                        ? this.state.chosenPhoto
                                        : null,
                                      authorId: this.props.auth.uid,
                                      time: new Date(),
                                      date: entry.date,
                                      authoritarianTopic: false
                                    })
                                    .then(() => {})
                                    .catch((x) => console.log(x));
                                }
                              }}
                              style={{ color: "grey", width: "min-content" }}
                            >
                              +&nbsp;
                            </div>
                          )}
                          <div
                            style={
                              this.state.recipients.includes(x.id)
                                ? { color: "white", width: "min-content" }
                                : { color: "grey", width: "min-content" }
                            }
                          >
                            {x && x.username}
                          </div>
                        </div>
                      );
                    } else return null;
                  })}
            </div>
          </div>
          <div
            style={
              this.state.recipients > 0
                ? {
                    display: "flex",
                    position: "fixed",
                    flexDirection: "column",
                    backgroundColor: "rgba(35, 108, 255, 0.721)",
                    color: "white",
                    zIndex: "9999",
                    top: "230px",
                    right: "100px",
                    width: "200px",
                    height: "200px"
                  }
                : {
                    display: "flex",
                    position: "fixed",
                    flexDirection: "column",
                    backgroundColor: "rgba(35, 108, 255, 0.721)",
                    color: "white",
                    zIndex: "9999",
                    top: "30px",
                    right: "100%",
                    width: "200px",
                    height: "200px"
                  }
            }
          >
            <input
              value={this.state.topicQuery}
              placeholder={placeholderusersearch}
              style={{
                display: "flex",
                position: "relative",
                flexDirection: "column",
                backgroundColor: "#333",
                border: "3px solid #333",
                borderRadius: "0px",
                height: "20px",
                color: "white",
                zIndex: "9999",
                fontSize: "18px"
              }}
              maxLength="30"
              onChange={(e) => this.setState({ topicQuery: e.target.value })}
            />
            <div
              style={
                this.state.topicQuery !== ""
                  ? {
                      display: "flex",
                      position: "absolute",
                      overflowY: "scroll",
                      flexDirection: "column",
                      width: "100%",
                      color: "white",
                      zIndex: "99",
                      justifyContent: "center"
                    }
                  : {
                      display: "none"
                    }
              }
            >
              <br />
              {/*
  
  
    // add/remove + empty query
    */}
              {this.state.topicQuery !== "" &&
                this.props.user !== undefined &&
                this.state.ttypes &&
                this.state.ttypes
                  /*.filter(
                    x =>
                      (this.props.user.following &&
                        this.props.user.following.includes(x.id)) ||
                      recents.includes(x.id)
                  )*/
                  //.filter(obj => this.props.recipients.includes(obj.id))
                  .map((x) => {
                    //if (this.props.recipients.indexOf(x.id) < 1)
                    if (
                      this.props.auth !== undefined &&
                      this.state.ttypes.includes(this.state.topicQuery)
                    ) {
                      return (
                        <div
                          key={x}
                          style={{
                            display: "flex",
                            position: "relative",
                            justifyContent: "center",
                            zIndex: "9999",
                            margin: "1px 2px",
                            padding: "5px",
                            width: "auto",
                            backgroundColor: "rgba(51, 51, 51, 0.687)"
                          }}
                        >
                          <div
                            onClick={() => this.setState({ ttype: x })}
                            style={
                              this.state.ttype === x
                                ? { color: "white", width: "min-content" }
                                : { color: "grey", width: "min-content" }
                            }
                          >
                            {x}
                          </div>
                        </div>
                      );
                    } else return null;
                  })}
            </div>
          </div>
          <textarea
            className="PlanEdit_Description"
            type="text"
            name="body"
            placeholder="Write anything for your own eyes here"
            value={this.state.body}
            onChange={(e) => this.updateValue(e)}
            autoComplete="off"
          />
          <input className="save" type="submit" value="Save" />
        </form>
        <Link
          to={{
            pathname: `/plan/${this.state._id}`,
            state:
              this.props.location.state && this.props.location.state.lastOpen
                ? {
                    lastOpen: this.props.location.state.lastOpen
                  }
                : null
          }}
        >
          <div onClick={this.props.clearMaterialDate} className="cancel">
            Cancel
          </div>
        </Link>

        <div className="dateordelete">
          <div
            onClick={() => {
              this.props.choosePlan(this.state.date);
              this.props.eventDateOpener();
            }}
          >
            Change Date {new Date(this.state.date).toLocaleString()}
            <br />
            {this.props.date && "to"}&nbsp;
            {this.props.date && new Date(this.props.date).toLocaleString()}
          </div>
          <Link className="note-delete" to="/plan">
            <div
              className="btn"
              onClick={() => {
                this.props.onDelete(this.state._id);
              }}
            >
              Delete
            </div>
          </Link>
        </div>
        {/*<PlanEditDrawer
          show={this.state.drawerOpen}
          date={this.state.note.date}
          handleDate={this.handleDate}
        />
        {backdrop}*/}
        {!this.state.editPhoto && this.state.chosenPhoto && (
          <div
            onClick={() => this.setState({ editPhoto: true })}
            style={{
              display: "flex",
              position: "fixed",
              height: "auto",
              width: "150px",
              overflow: "hidden",
              bottom: "116px",
              right: "0px",
              padding: "20px 10px",
              color: "black"
            }}
          >
            <img
              //onLoad={this.onImgLoad}
              /*
  event.d
    ? event.d.chosenPhoto
    : */
              src={this.state.chosenPhoto && this.state.chosenPhoto.small}
              alt="error"
              className="imageplan"
            />
          </div>
        )}
        <div
          onClick={() => this.setState({ editPhoto: true })}
          style={{
            display: "flex",
            position: "fixed",
            height: "56px",
            width: "max-content",
            bottom: "56px",
            right: "0px",
            padding: "0px 10px",
            color: "black"
          }}
        >
          Change photo
        </div>
        <div
          style={{
            display: "flex",
            position: "fixed",
            height: "56px",
            width: "max-content",
            maxWidth: "100%",
            bottom: "0px",
            right: "0px",
            padding: "0px 10px",
            color: "black"
          }}
        >
          <div
            onClick={
              this.state.recipients.length > 1
                ? () => {
                    var entry = {};
                    entry.date = this.props.date
                      ? this.props.date
                      : this.state.date;
                    firebase
                      .firestore()
                      .collection("chats")
                      .doc(this.state._id)
                      .update({
                        time: "",
                        date: entry.date,
                        authorId: this.props.auth.uid,
                        entityType: "users",
                        entityId: null,
                        //message: "",
                        body: "",
                        recipients: [this.props.auth.uid]
                      })
                      .then((ref) => {
                        console.log("deleted plan from messages" + ref);
                        firebase
                          .firestore()
                          .collection("calendar")
                          .doc(ref.id)
                          .delete();
                      })
                      .catch((err) => console.log(err));

                    firebase
                      .firestore()
                      .collection("planchats")
                      .where("chatId", "==", this.state._id)
                      .get()
                      .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                          if (!doc.data().firstChat) {
                            doc.ref
                              .delete()
                              .then((ref) => {
                                console.log("deleted plan from messages" + ref);
                              })
                              .catch((err) => console.log(err));
                          }
                        });
                        console.log("planchats successfully deleted!");
                      })
                      .catch((error) => {
                        console.error("Error removing document: ", error);
                      });
                  }
                : this.state.recipients.length > 0 && this.state.clouded
                ? () => {
                    var entry = {};
                    entry.date = this.props.date
                      ? this.props.date
                      : this.state.date;

                    firebase
                      .firestore()
                      .collection("chats")
                      .doc(this.state._id)
                      .update({
                        threadId:
                          this.state.entityType +
                          this.state.entityId +
                          [this.props.auth.uid].sort(),
                        time: "",
                        date: entry.date,
                        authorId: this.props.auth.uid,
                        entityType: "users",
                        entityId: null,
                        message: "",
                        body: "",
                        recipients: [this.props.auth.uid]
                      })
                      .then((ref) => {
                        console.log("deleted plan from messages" + ref);
                        firebase
                          .firestore()
                          .collection("calendar")
                          .doc(ref.id)
                          .delete();
                      })
                      .catch((err) => console.log(err));

                    firebase
                      .firestore()
                      .collection("planchats")
                      .where("chatId", "==", this.state._id)
                      .get()
                      .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                          if (!doc.data().firstChat) {
                            doc.ref
                              .delete()
                              .then((ref) => {
                                console.log("deleted plan from messages" + ref);
                              })
                              .catch((err) => console.log(err));
                          }
                        });
                        console.log("planchats successfully deleted!");
                      })
                      .catch((error) => {
                        console.error("Error removing document: ", error);
                      });
                  }
                : null
            }
            style={
              this.state.recipients.length > 0 && this.props.auth !== undefined
                ? {
                    display: "flex",
                    position: "relative",
                    height: "56px",
                    width: "max-content",
                    bottom: "0px",
                    right: "0px",
                    padding: "0px 10px",
                    color: "black"
                  }
                : {
                    display: "none"
                  }
            }
          >
            {this.state.recipients.length > 1 &&
              `(${this.state.recipients.length - 1})`}
            &nbsp;
            {this.state.recipients.length > 1
              ? "Recind all invites"
              : this.state.recipients.length > 0 && this.state.clouded
              ? "Remove from cloud"
              : ""}
          </div>
          <div
            onClick={
              this.props.auth === undefined
                ? () => this.props.getUserInfo() //this.props.history.push("/login")
                : this.state.recipients.length > 0 && this.state.clouded
                ? () => this.setState({ sharedialog: true })
                : () => {
                    var entry = {};
                    entry.date = this.props.date
                      ? this.props.date
                      : this.state.date;
                    firebase
                      .firestore()
                      .collection("users")
                      .doc(this.props.auth.uid)
                      .update({
                        backedUpCount: firebase.firestore.FieldValue.increment(
                          1
                        )
                      })
                      .catch((err) => console.log(err.message));
                    firebase
                      .firestore()
                      .collection("chats")
                      .doc(this.state._id)
                      .update({
                        threadId: "users" + null + [this.props.auth.uid].sort(),
                        time: new Date(),
                        date: entry.date,
                        topic: "*",
                        authorId: this.props.auth.uid,
                        entityType: "users",
                        entityId: null,
                        message: this.state.message,
                        body: this.state.body,
                        recipients: firebase.firestore.FieldValue.arrayUnion(
                          this.props.auth.uid
                        )
                      });
                    firebase.firestore().collection("planchats").add({
                      firstChat: true,
                      authorId: this.props.auth.uid,
                      message: this.state.body,
                      chatId: this.state._id
                    });
                  }
            }
            style={{
              display: "flex",
              position: "relative",
              height: "56px",
              width: "max-content",
              bottom: "0px",
              right: "0px",
              padding: "0px 10px",
              color: "black"
            }}
          >
            {this.props.auth === undefined
              ? `Login to ${"save to cloud (or share)"}`
              : this.state.recipients.length > 0 && this.state.clouded
              ? "Open share dialog"
              : "Save to cloud"}
          </div>
        </div>
        <div
          style={
            this.state.editPhoto
              ? {
                  bottom: "0px",
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
                  zIndex: "9999",
                  borderTop: "3px rgb(250, 250, 250) solid"
                }
              : {
                  bottom: "0px",
                  display: "none",
                  position: "relative",
                  textAlign: "center",
                  alignItems: "flex-start",
                  fontSize: "26px",
                  color: "white",
                  width: "auto",
                  maxHeight: "40vh",
                  overflow: "hidden",
                  textDecoration: "none",
                  zIndex: "9999",
                  borderTop: "3px rgb(250, 250, 250) solid"
                }
          }
        >
          <img
            //onLoad={this.onImgLoad}
            /*
  event.d
    ? event.d.chosenPhoto
    : */
            src={this.state.chosenPhoto && this.state.chosenPhoto.large}
            alt="error"
            className="imageplan"
          />
          {this.state.editPhoto ? (
            <div
              className="cancelphoto"
              onClick={() =>
                this.setState({
                  editPhoto: false,
                  images: []
                })
              }
              style={
                this.state.chosenPhoto
                  ? {
                      display: "flex",
                      backgroundColor: "grey",
                      padding: "20px",
                      transform: "translateX(-100%)",
                      transition: ".3s ease-in",
                      fontSize: "20px",
                      justifyContent: "center",
                      alignItems: "center"
                    }
                  : {
                      display: "flex",
                      backgroundColor: "grey",
                      padding: "0px 20px",
                      paddingBottom: "20px",
                      transform: "translateX(0%)",
                      transition: ".3s ease-out",
                      fontSize: "1px"
                    }
              }
            >
              choose
            </div>
          ) : null}
          {this.state.chosenPhoto || this.state.editPhoto ? (
            <div
              className="cancelphoto"
              onClick={() =>
                this.setState({
                  editPhoto: false,
                  chosenPhoto: null,
                  images: []
                })
              }
              style={{
                backgroundColor: "grey",
                padding: "0px 20px",
                paddingBottom: "20px"
              }}
            >
              &times;
            </div>
          ) : null}
        </div>
        <div
          style={
            this.state.editPhoto
              ? {
                  display: "flex",
                  position: "fixed",
                  width: "100%",
                  height: "40%",
                  bottom: "0px",
                  zIndex: "9999"
                }
              : { display: "none" }
          }
        >
          <GetPhotos
            choosePhoto={(x) =>
              this.setState({
                chosenPhoto: {
                  large: x.src.large,
                  medium: x.src.medium,
                  small: x.src.small,
                  photographer: x.photographer,
                  photographer_url: x.photographer_url
                }
              })
            }
          />
        </div>
        {this.props.auth !== undefined &&
          this.props.auth.uid !== this.state.authorId &&
          this.state.message !== this.state.cloudTitle && (
            <div
              onClick={() => {
                firebase
                  .firestore()
                  .collection("chats")
                  .doc(this.state._id)
                  .update({ message: this.state.cloudTitle });
                this.setState({ message: this.state.cloudTitle });
              }}
              style={{
                display: "flex",
                position: "fixed",
                bottom: "10px",
                left: "10px",
                zIndex: 9999
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
                  .doc(this.state._id)
                  .update({ date: this.state.cloudDate });
                this.setState({ date: this.state.cloudDate });
              }}
              style={{
                display: "flex",
                position: "fixed",
                bottom: "10px",
                left: "10px",
                zIndex: 9999
              }}
            >
              Sync to cloud date:{" "}
              {new Date(this.state.cloudDate).toLocaleDateString()}
              <br />
              (your free time uses this date)
            </div>
          )}
      </div>
    );
  }
}

export default EditNotePage;
