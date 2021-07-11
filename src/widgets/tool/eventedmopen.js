import React from "react";
import firebase from "../.././init-firebase";
import back777 from "../.././components/Icons/Images/back777.png";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

export const WEEK_DAYS = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY"
};
class Eventedmopen extends React.Component {
  constructor(props) {
    super(props);
    const { event } = this.props;
    this.state = {
      agePromised: false,
      title: !event
        ? null
        : event.name
        ? event.name
        : event.artistList[0] && event.artistList[0].name,
      body: event && event.artistList,
      date: event && event.date && new Date(event.date).toISOString(),
      planEditOpen: false,
      address: event && event.venue && event.venue.address,
      searchResults: [],
      mounted: false
    };
    this.textInput = React.createRef();
  }
  componentWillUnmount = () => {
    this.setState({ mounted: false });
  };
  addNoteFromEvent = () => {
    const { event, noteList } = this.props;
    var title =
      event && event.name
        ? event.name
        : event.artistList && event.artistList[0].name;
    var foo = event;
    foo._id = event._id ? event._id : event.id;
    if (noteList.includes(event._id ? event._id : event.id)) {
      this.props.onDelete(event._id);
    } else if (this.props.auth !== undefined) {
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
          body: event.ticketLink,
          chosenPhoto: event.chosenPhoto && {
            large: event.chosenPhoto.src.large,
            medium: event.chosenPhoto.src.medium,
            small: event.chosenPhoto.src.small,
            photographer: event.chosenPhoto.photographer,
            photographer_url: event.chosenPhoto.photographer_url
          },
          authorId: this.props.auth.uid,
          time: new Date(),
          date: event.date,
          authoritarianTopic: false
        })
        .then(
          (docRef) => {
            console.log("Document written with ID: ", docRef.id);
            var goo = {};
            goo.message = title;
            goo.body = event.ticketLink;
            goo.createdAt = this.state.createdAt;
            goo.updatedAt = this.state.updatedAt;
            goo.date = event.date;
            goo.time = new Date();
            goo.recipients = [this.props.auth.uid];
            goo.ttype = "savedEvents";
            goo.authorId = this.props.auth.uid;
            goo.chosenPhoto = event.chosenPhoto;
            goo._id = docRef.id;
            this.props.handleSave(goo);

            firebase.firestore().collection("calendar").doc(docRef.id).set({
              rangeChosen: 3600,
              authorId: this.props.auth.uid,
              date: event.date
            });
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
    } else
      firebase
        .firestore()
        .collection("chats")
        .add({
          threadId: "users" + null + [],
          recipients: [],
          topic: "savedEvents",
          entityType: "users",
          entityId: null,
          message: title,
          body: event.ticketLink,
          chosenPhoto: event.chosenPhoto && {
            large: event.chosenPhoto.src.large,
            medium: event.chosenPhoto.src.medium,
            small: event.chosenPhoto.src.small,
            photographer: event.chosenPhoto.photographer,
            photographer_url: event.chosenPhoto.photographer_url
          },
          authorId: "",
          time: new Date(),
          date: event.date,
          authoritarianTopic: false
        })
        .then(
          (docRef) => {
            console.log("Document written with ID: ", docRef.id);
            var goo = {};
            goo.message = title;
            goo.body = event.ticketLink;
            goo.createdAt = this.state.createdAt;
            goo.updatedAt = this.state.updatedAt;
            goo.date = event.date;
            goo.time = new Date();
            goo.recipients = [];
            goo.ttype = "savedEvents";
            goo.authorId = "";
            goo.chosenPhoto = event.chosenPhoto;
            goo._id = docRef.id;
            this.props.handleSave(goo);

            firebase.firestore().collection("calendar").doc(docRef.id).set({
              rangeChosen: 3600,
              authorId: this.props.auth.uid,
              date: event.date
            });
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
    const { noteList, noteTitles, notes } = this.props;

    const pathname = window.location.pathname;
    const d = pathname.split("/events/edmtrain/")[1];
    var event =
      this.props.events &&
      this.props.events.find((x) => String(x.id) === String(d));

    const today = new Date().getTime();
    if (event) {
      var note = notes && notes.find((x) => x._id === event.id);
      const eventdate = new Date(event.date).getTime();
      //
      if (today > eventdate && this.props.messages) {
        this.props.messages &&
          this.props.messages.map((message) => {
            return this.props.deleteMessage(message.id);
          });
      }
      var eventDate1 = new Date(eventdate);
      //
      function renderDate(date) {
        let d = dayjs(date);
        return d.format("MMMM D YYYY");
      }
      var datenotime = new Date();

      datenotime.setHours(0, 0, 0, 0);
      eventDate1.setHours(0, 0, 0, 0);
      //
      var diffDays = Math.round(
        (datenotime.getTime() - eventDate1.getTime()) / 86400000
      );
      var is_negative = diffDays < 0;
      //
      var title =
        event && event.name
          ? event.name
          : event.artistList[0]
          ? event.artistList[0].name
          : null;
      var body = event ? event.artistList : null;
      //
      var address = event ? event.venue.address : null;
      var list = [];
      event.artistList.map((x) => {
        return list.push(x.name);
      });
      event && event.name && list.push(event.name);
      return (
        <div>
          <div
            onMouseEnter={() => this.setState({ hovering: true })}
            onMouseLeave={() => this.setState({ hovering: false })}
            className="starfavorite" //onClick={this.props.openATC}
            onClick={() => {
              if (noteTitles.includes(title)) {
                var answer = window.confirm(
                  `a plan named "${title}" already exists in your local calendar, add this one anyway?`
                );
                if (answer) {
                  this.addNoteFromEvent();
                }
              } else {
                this.addNoteFromEvent();
              }
            }}
            style={{
              top: "0px",
              left: "0px",
              color: "white",
              zIndex: "9999",
              display: "flex",
              positon: "fixed"
            }}
          >
            {
              //star
              (note && noteList.includes(event._id ? event._id : event.id)) ||
              noteTitles.includes(title) ? (
                <p style={noteTitles.includes(title) ? { opacity: ".5" } : {}}>
                  &#9733;
                </p>
              ) : (
                <p>&#9734;</p>
              )
            }
          </div>
          <Link
            to={
              this.props.location.state && this.props.location.state.lastOpen
                ? this.props.location.state.lastOpen
                : `/`
            }
          >
            <img
              onClick={this.props.eventOpener}
              src={back777}
              className="eventbackopen"
              alt="error"
            />
          </Link>

          <div className="eventopen_Header">{title}</div>
          {/*<VideoRecorder
            onRecordingComplete={(videoBlob) => {
              // Do something with the video...
              console.log("videoBlob", videoBlob);
            }}
          />*/}
          <div className="edmopenstarttime">
            <div className="edmtodaytomorrow">
              Edmtrain.com
              {diffDays === 0
                ? ` today`
                : diffDays === -1
                ? ` tomorrow`
                : diffDays === 1
                ? ` yesterday`
                : is_negative
                ? ` in ${Math.abs(diffDays)} days`
                : ` ${diffDays} days ago`}
            </div>
            <div className="edmtime">
              {diffDays === 0
                ? `${WEEK_DAYS[eventDate1.getDay()]} ${renderDate(eventDate1)}`
                : diffDays === -1
                ? `${WEEK_DAYS[eventDate1.getDay()]} ${renderDate(eventDate1)}`
                : diffDays === 1
                ? `${WEEK_DAYS[eventDate1.getDay()]} ${renderDate(eventDate1)}`
                : is_negative
                ? `${WEEK_DAYS[eventDate1.getDay()]} ${renderDate(eventDate1)}`
                : `${WEEK_DAYS[eventDate1.getDay()]} ${renderDate(eventDate1)}`}
            </div>
          </div>
          <div className="edmopendescription">
            {body && body.length > 1
              ? body.map((i, ii) => <div key={ii}>{i.name}</div>)
              : body && body[0]
              ? body[0].name
              : null}
            {event ? <a href={event.ticketLink}>{event.ticketLink}</a> : null}
            {event.ages ? `Age minimum: ${event.ages}` : null}
            <br />
            {address}
            <br />
            go at your own risk
            <br />
            the city may be taking away your freedom of expression,
            orientiation-of-arousal and inclusion, you may be harmed by city
            authoritarians in exercising these constitutional (A1+A13+A14)
            rights.
          </div>
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              maxWidth: "min-content"
            }}
            onSubmit={async (e) => {
              e.preventDefault();
              await fetch(
                "https://www.googleapis.com/customsearch/" +
                  `v1?key=AIzaSyD60cV8v9sk6ZsEIyDVz-ePdXW50Wm1hAU&` +
                  `cx=008604820760217866137:xc6cuferbru&q=${this.state.chosenTitle}`
              )
                .then(async (res) => await res.json())
                .then((result) =>
                  this.setState({ searchResults: result.items })
                )
                .catch((err) => console.log(err));
            }}
          >
            <select
              value={this.state.chosenTitle}
              onChange={(e) => this.setState({ chosenTitle: e.target.value })}
            >
              {list.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
            <input type="submit" />
          </form>
          <div
            style={{
              flexDirection: "row",
              width: "100%",
              display: "flex",
              position: "relative",
              flexWrap: "wrap"
            }}
          >
            {this.state.searchResults.map((x, i) => {
              if (x.pagemap.cse_thumbnail) {
                return (
                  <a
                    key={i}
                    href={x.formattedUrl}
                    style={{
                      backgroundColor: "white",
                      width: "200px",
                      display: "flex",
                      flexDirection: "column",
                      height: "min-content"
                    }}
                  >
                    <div
                      style={{
                        flexFlow: "row wrap",
                        fontSize: "16px",
                        wordWrap: "break-word",
                        height: "min-content"
                      }}
                    >
                      {x.title}
                    </div>
                    <div>
                      <img
                        style={{
                          display: "flex",
                          width: "200px",
                          height: "auto"
                        }}
                        src={x.pagemap.cse_thumbnail[0].src}
                        alt={x.item}
                      />
                    </div>
                  </a>
                );
              } else return <div>{x.title}</div>;
            })}
          </div>
          {/*<div className="edmmessages">
            {this.state.messages &&
              this.state.messages
                .sort((a, b) => {
                  if (a.date.seconds < b.date.seconds) return 1;
                  if (a.date.seconds > b.date.seconds) return -1;
                  return 0;
                })
                .map(message => {
                  return (
                    <div key={message.id}>
                      {message.username}: {message.message}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <p onClick={() => this.removeMessage(message.id)}>
                        &times;
                      </p>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {new Date(
                        message.date.seconds * 1000
                      ).toLocaleTimeString()}
                      {new Date(
                        message.date.seconds * 1000
                      ).toLocaleDateString()}
                    </div>
                  );
                })}
              </div>*/}
          {/*this.state.agePromised ||
          (this.props.auth && this.props.auth.uid) ? (
            <form
              className="stopformexp"
              onSubmit={this.state.text === "" ? null : this.handleSend}
            >
              <input
                className="edmtextbox4chat"
                placeholder={this.state.old ? "-" : "Type something.."}
                onChange={event => this.setState({ text: event.target.value })}
                value={this.state.text}
              />
            </form>
          ) : this.state.hideChatterBox ? null : (
            <div className="edmtextbox4chat2">
              Are you above 13?
              <div>
                <div onClick={() => this.setState({ agePromised: true })}>
                  Yes
                </div>
                <div
                  onClick={() =>
                    this.setState({
                      hideChatterBox: true,
                      agePromised: false
                    })
                  }
                >
                  No
                </div>
              </div>
            </div>
                )*/}
        </div>
      );
    } else {
      return (
        <div className="container center">
          <p>Loading project...</p>
        </div>
      );
    }
  }
}

export default Eventedmopen;
