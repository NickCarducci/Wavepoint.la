import React from "react";
import firebase from "../../.././init-firebase";
import * as geofirestore from "geofirestore";
import back from "../.././Icons/Images/back777.png";
import settings33 from "../.././Icons/Images/settings33.png";
import imagesl from "../.././SwitchCity/Community/standardIMG.jpg";
import Info from "./Info";
import History from "./History";
import Edit from "./Edit";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./eventopen.css";
import PeanutGallery from "../../Post/PeanutGallery";
import ListEvents from "../../Forum/Person/ListEvents";

const eventsInitial = {
  admin: [],
  text: "",
  messages: [],
  ticketCategories: [
    {
      ticketName: "",
      ticketQuant: "",
      ticketPrice: "",
      attendeeQuant: 0
    }
  ],
  ticketNameNew: "",
  ticketQuantNew: "",
  ticketPriceNew: "",
  totheleft: false,
  totheleft1: false,
  tickets: [],
  votes: [],
  amountoftickets: 0
};
const clubInitial = {
  admin: [],
  text: "",
  messages: [],
  totheleft: false,
  totheleft1: false,
  tickets: { count: 0, owners: [] },
  ratings: { ratingLevel: 0, rates: [] }
};
const jobInitial = {
  admin: [],
  text: "",
  messages: [],
  openChosenChat: null
};
const classInitial = {
  admin: [],
  text: "",
  messages: [],
  totheleft: false,
  totheleft1: false,
  tickets: { count: 0, owners: [] },
  ratings: { ratingLevel: 0, rates: [] }
};
class Made extends React.Component {
  constructor(props) {
    super(props);
    //const { id } = this.props;
    var thing = props.eventsInitial
      ? eventsInitial
      : props.clubInitial
      ? clubInitial
      : props.jobInitial
      ? jobInitial
      : props.housingInitial
      ? clubInitial
      : props.classInitial
      ? classInitial
      : props.departmentInitial
      ? clubInitial
      : props.shopInitial
      ? clubInitial
      : props.restaurantInitial
      ? clubInitial
      : props.serviceInitial
      ? clubInitial
      : props.pageInitial
      ? clubInitial
      : props.venueInitial
      ? clubInitial
      : {};
    if (props.chosenEntity) {
      thing.authorId = props.auth.uid;
      thing.message = props.chosenEntity.message;
      thing.body = props.chosenEntity.body;
      thing.planEditOpen = false;
      thing.address = props.chosenEntity.address;
      thing.eventID = props.chosenEntity.id;
    }
    thing.open = true;
    thing.date =
      props.chosenEntity && props.chosenEntity.date
        ? props.chosenEntity.date.seconds
          ? props.chosenEntity.date.seconds * 1000
          : props.chosenEntity.date
        : new Date();
    thing.events = [];
    thing.forumPosts = [];
    thing.lastForumPost = "";
    thing.undoForumPost = "";
    thing.community = { message: "" };
    thing.city = "";
    thing.admin = [];
    thing.width = window.innerHeight;
    thing.height = window.innerWidth;
    this.state = thing;
  }
  handleSendEvent = (e) => {
    e.preventDefault();
    const { user } = this.props;
    const anonID = "anonID";
    const anon = "anon";
    this.setState({ text: "", messages: [] });
    firebase
      .firestore()
      .collection("messages")
      .add({
        eventroom: this.props.chosenEntity.id,
        message: this.state.text,
        authorId: this.state.authorId ? this.state.authorId : anonID,
        username: user && user.username ? user.username : anon,
        date: new Date()
      })
      .then((ref) => {
        console.log("document ID: ", ref.id);
      });
  };
  removeMessage(e) {
    this.setState({ messages: [] }, () => {
      firebase
        .firestore()
        .collection("messages")
        .doc(e)
        .delete()
        .then((ref) => {
          console.log("deleted document" + ref);
        })
        .catch((err) => console.log(err));
    });
  }
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
  handleSubmitEvent = () => {
    const chosenEntity = this.state;
    var collection = "";
    var filterTime = false;
    var isEvents = false;
    var isGeo = true;
    if (this.props.eventsInitial) {
      collection = "planner";
      filterTime = true;
      isEvents = true;
    } else if (this.props.clubInitial) {
      collection = "clubs";
    } else if (this.props.shopInitial) {
      collection = "shops";
    } else if (this.props.restaurantInitial) {
      collection = "restaurants";
    } else if (this.props.serviceInitial) {
      collection = "services";
    } else if (this.props.jobInitial) {
      collection = "jobs";
      filterTime = true;
    } else if (this.props.housingInitial) {
      collection = "housing";
    } else if (this.props.classInitial) {
      collection = "classes";
      isGeo = false;
    } else if (this.props.departmentInitial) {
      collection = "departments";
      isGeo = false;
    }
    let answer = window.confirm("Are you sure you want to update?");
    if (answer === true) {
      if (isEvents) {
        const firestore = firebase.firestore();
        const GeoFirestore = geofirestore.initializeApp(firestore);
        const geocollection = GeoFirestore.collection(collection);
        const geocollection1 = GeoFirestore.collection("oldPlanner");
        if (chosenEntity.date > new Date()) {
          delete chosenEntity.ticketNameNew;
          delete chosenEntity.ticketQuantNew;
          delete chosenEntity.ticketPriceNew;
          geocollection.doc(this.state.eventID).update({
            ...chosenEntity,
            chosenPhoto: this.state.chosenPhoto ? this.state.chosenPhoto : null,
            message: chosenEntity.message,
            body: chosenEntity.body,
            date: chosenEntity.date.seconds * 1000,
            planEditOpen: false,
            address: chosenEntity.address,
            ratings: chosenEntity.ratings,
            updatedAt: new Date()
          });
        } else {
          geocollection1.doc(chosenEntity.id).set(chosenEntity);
          geocollection
            .doc(chosenEntity.id)
            .delete()
            .then((ref) => {
              console.log(
                "document moved to previous chosenEntity collection" + ref
              );
            })
            .catch((err) => console.log(err));
        }
      } else if (filterTime) {
        const firestore = firebase.firestore();
        const GeoFirestore = geofirestore.initializeApp(firestore);
        const geocollection = GeoFirestore.collection(collection);
        const geocollection1 = GeoFirestore.collection("oldJobs");
        if (chosenEntity.date > new Date()) {
          delete chosenEntity.ticketNameNew;
          delete chosenEntity.ticketQuantNew;
          delete chosenEntity.ticketPriceNew;
          geocollection.doc(this.state.eventID).update({
            ...chosenEntity,
            chosenPhoto: this.state.chosenPhoto ? this.state.chosenPhoto : null,
            message: chosenEntity.message,
            body: chosenEntity.body,
            date: chosenEntity.date.seconds * 1000,
            planEditOpen: false,
            address: chosenEntity.address,
            ratings: chosenEntity.ratings,
            updatedAt: new Date()
          });
        } else {
          geocollection1.doc(chosenEntity.id).set(chosenEntity);
          geocollection
            .doc(chosenEntity.id)
            .delete()
            .then((ref) => {
              console.log("document moved to previous job collection" + ref);
            })
            .catch((err) => console.log(err));
        }
      } else if (!isGeo) {
        firebase
          .firestore()
          .collection(collection)
          .doc(this.state.chosenEntity.id)
          .update({
            chosenPhoto: this.state.chosenPhoto ? this.state.chosenPhoto : null,
            message: chosenEntity.message,
            body: chosenEntity.body,
            ratings: chosenEntity.ratings,
            updatedAt: new Date()
          });
      } else {
        const firestore = firebase.firestore();
        const GeoFirestore = geofirestore.initializeApp(firestore);
        const geocollection = GeoFirestore.collection(collection);
        geocollection.doc(this.state.chosenEntity.id).update({
          message: chosenEntity.message,
          body: chosenEntity.body,
          ratings: chosenEntity.ratings,
          updatedAt: new Date()
        });
      }
    }
    this.planEditCloser();
  };
  componentDidMount = () => {
    this.refresh();
    window.addEventListener("resize", this.refresh);
    this.setState({ mounted: true });
    this.props.chosenEntity && this.refreshEvent(this.props.chosenEntity);
  };
  componentDidUpdate = (prevProps) => {
    if (
      this.props.chosenEntity &&
      this.props.chosenEntity !== prevProps.chosenEntity
    ) {
      this.refreshEvent(this.props.chosenEntity);
    }
  };
  refreshEvent = (chosenEntity) => {
    this.setState({
      admin: chosenEntity.admin,
      id: chosenEntity.id,
      chosenEntity,
      //profilekey: chosenEntity.profile.key,
      message: chosenEntity.message,
      body: chosenEntity.body,
      date: chosenEntity.date ? chosenEntity.date.seconds * 1000 : new Date(),
      planEditOpen: false,
      address: chosenEntity.address,
      eventID: chosenEntity.id,
      ticketCategories: chosenEntity.ticketCategories,
      authorId: chosenEntity.authorId,
      postedAs: chosenEntity.postedAs,
      collectionId: chosenEntity.collectionId
    });
  };
  planInfoOpener = () => {
    this.setState({
      planInfoOpen: true
    });
  };
  planInfoCloser = () => {
    this.setState({
      planInfoOpen: false
    });
  };
  planEditOpener = () => {
    this.setState({
      planEditOpen: true
    });
  };
  planEditCloser = () => {
    this.setState({
      planEditOpen: false
    });
  };
  onDeleteClub = (id) => {
    console.log(id);
    firebase.firestore().collection("clubs").doc(id).delete();

    firebase
      .firestore()
      .collection("messages")
      .where("eventroom", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          doc.ref.delete();
        });
      });

    this.props.history.push("/");
  };
  onDeleteJob = (id) => {
    console.log(id);
    firebase.firestore().collection("jobs").doc(id).delete();
    firebase
      .firestore()
      .collection("messages")
      .where("eventroom", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          doc.ref.delete();
        });
      });
    this.props.history.push("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  onDeleteEvent = (id) => {
    console.log(id);
    firebase.firestore().collection("planner").doc(id).delete();

    firebase
      .firestore()
      .collection("messages")
      .where("eventroom", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          doc.ref.delete();
        });
      });
    this.props.listDeletedEvts(id);
    this.props.history.push("/");
  };
  handleChangeTitle = (e) => {
    const c = e.target.value.toLowercase();
    //if (/^[a-zA-Z0-9]+$/.test(c)) {
    this.setState({ pleaseNewClubname: false });
    var array = [];
    for (let i = 1; i < c.length + 1; i++) {
      array.push(c.substring(0, i));
    }
    this.setState({
      message: c,
      titleAsArray: array,
      updatedAt: new Date()
    });
  };
  handleChangeBody = (e) => {
    this.setState({
      body: e.target.value,
      updatedAt: new Date()
    });
  };
  render() {
    const { forumPosts } = this.props;
    let drawerClasses = "eventedit-drawer1";
    if (this.state.planEditOpen) {
      drawerClasses = "eventedit-drawer1 open";
    }
    const { chosenEntity, open } = this.state;
    if (chosenEntity) {
      var thiscommunity = chosenEntity.community;
      var collection = this.props.eventsInitial
        ? "planner"
        : this.props.jobsInitial
        ? "jobs"
        : this.props.housingInitial
        ? "housing"
        : this.props.clubInitial
        ? "clubs"
        : this.props.classInitial
        ? "classes"
        : this.props.departmentInitial
        ? "departments"
        : this.props.pageInitial
        ? "pages"
        : this.props.venueInitial
        ? "venues"
        : this.props.serviceInitial
        ? "services"
        : this.props.restaurantInitial
        ? "restaurants"
        : this.props.shopInitial
        ? "shops"
        : "planner";

      var filterUnspecified =
        this.state.budgetTyped === "" &&
        this.state.ordinanceTyped === "" &&
        this.state.classTyped === "" &&
        this.state.caseTyped === "" &&
        this.state.departmentTyped === "" &&
        this.state.electionTyped === "" &&
        this.state.forumTyped === "";
      var placeUnspecified =
        this.state.community.message === "" && this.state.city === "";
      var collectionUnspecified = this.state.collection === "";
      var forumm = forumPosts.filter((parent) => {
        var switcher =
          "forum" === parent.collection
            ? { type: "issue", compare: "forumTyped", chosenForum: "forum" }
            : ["elections", "oldElections"].includes(parent.collection)
            ? {
                type: "electionType",
                compare: "electionTyped",
                chosenForum: "elections"
              }
            : ["budget & proposals", "oldBudget"].includes(parent.collection)
            ? {
                type: "budgetType",
                compare: "budgetTyped",
                chosenForum: "budget"
              }
            : ["court cases", "oldCases"].includes(parent.collection)
            ? { type: "caseType", compare: "caseTyped", chosenForum: "cases" }
            : "ordinances" === parent.collection
            ? {
                type: "ordinanceType",
                compare: "ordinanceTyped",
                chosenForum: "ordinances"
              }
            : { type: "issue", compare: "forumTyped", chosenForum: "forum" };
        return (
          (placeUnspecified ||
            this.state.community.id === parent.communityId ||
            this.state.city === parent.city) &&
          (collectionUnspecified ||
            this.state.collection === parent.collection) &&
          (filterUnspecified ||
            parent[switcher.type] === this.state[switcher.compare]) &&
          (this.props.chosenForum.includes(switcher.chosenForum) ||
            (parent.collection === "forum" &&
              this.props.chosenForum.includes(parent.newLessonShow)))
        );
      });
      return (
        <div
          style={{
            transform: `translateX(${
              !this.state.mounted || this.state.closing ? "-100" : "0"
            }%)`,

            backgroundColor: "rgba(20,20,25,.5)",
            display: "flex",
            position: "fixed",
            width: "100%",
            height: "100%",
            flexDirection: "column",
            overflowX: "hidden",
            overflowY: "hidden",
            transition: ".3s ease-in"
            //transform: `translateY(${!this.props.chosenPost ? 0 : 100}%)`,
            //transition: ".3s ease-in"
          }}
        >
          <Helmet>
            <meta
              content="text/html; charset=UTF-8"
              http-equiv="Content-Type"
            />
            {/*<meta name="twitter:card" content="player" />*/}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@viaThumbprint" />
            <meta
              name="twitter:title"
              content={`${chosenEntity.message}'s ${window.location.href} page`}
            />
            <meta
              name="twitter:description"
              content={`${chosenEntity.message} is on ${window.location.href}`}
            />
            <meta
              name="twitter:image"
              content={
                chosenEntity.chosenPhoto && chosenEntity.chosenPhoto.small
                  ? chosenEntity.chosenPhoto.small
                  : imagesl
              }
            />
          </Helmet>
          <div
            style={{
              backgroundColor: "rgb(190,220,250)",
              display: "flex",
              position: "relative",
              alignItems: "flex-end",
              zIndex: !open ? "-2" : "",
              opacity: !open ? "0" : "1",
              maxHeight: !open ? "0px" : "min-content",
              height: "96px",
              transition: ".3s ease-out"
            }}
          >
            <div
              onClick={() => {}}
              style={{
                display: "flex",
                position: "relative",
                borderRight: "1px solid",
                height: "100%",
                width: "min-content"
              }}
            >
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  position: "relative"
                }}
              >
                <img
                  style={{
                    width: "auto",
                    height: "100%"
                  }}
                  src={
                    chosenEntity.chosenPhoto
                      ? chosenEntity.chosenPhoto.small
                      : imagesl
                  }
                  alt={chosenEntity.message}
                />
              </div>
              <div
                style={{
                  height: "min-content",
                  marginLeft: "5px"
                }}
              >
                /{chosenEntity.collection}/{chosenEntity.message}/
                {chosenEntity.community
                  ? chosenEntity.community.message
                  : chosenEntity.city}
                {!this.props.eventsInitial ? (
                  this.props.auth !== undefined ? (
                    ((chosenEntity.members &&
                      chosenEntity.members.includes(this.props.auth.uid)) ||
                      (chosenEntity.admin &&
                        chosenEntity.admin.includes(this.props.auth.uid)) ||
                      (chosenEntity.authorId &&
                        chosenEntity.authorId === this.props.auth.uid)) && (
                      <div
                        onClick={() => {
                          var ok = chosenEntity.members.concat(
                            chosenEntity.admin.concat(chosenEntity.authorId)
                          );
                          var unique = new Set(ok);
                          var set = unique.sort((a, b) => a - b);
                          var recipients = set.sort();
                          var entityId = chosenEntity.id;
                          var entityTitle = chosenEntity.message;
                          var entityCo = chosenEntity.communityId
                            ? chosenEntity.communityId
                            : chosenEntity.city;
                          var entityType = collection;
                          var threadId = collection + entityId + recipients;
                          var x = {
                            threadId,
                            recipients,
                            entityId,
                            entityType,
                            entityTitle,
                            entityCo
                          };
                          this.props.openChatWithGroup(x);
                        }}
                        style={{
                          display: "flex",
                          position: "relative",
                          backgroundColor: "grey",
                          width: "100px",
                          height: "min-content"
                        }}
                      >
                        Open chat
                      </div>
                    )
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        position: "relative",
                        backgroundColor: "grey",
                        width: "50%",
                        height: "min-content"
                      }}
                      onClick={this.props.getUserInfo}
                      //to="/login"
                    >
                      Login
                    </div>
                  )
                ) : null}
                About: {chosenEntity.body}
              </div>
            </div>
            <div>
              {!this.props.classInitial &&
                !this.props.eventsInitial &&
                !this.props.jobInitial &&
                !this.props.housingInitial && (
                  <Link
                    style={{
                      display: "flex",
                      position: "relative",
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                    to={`/sd/${collection}/${chosenEntity.id}`}
                  >
                    Schedule /sd/{collection}/{chosenEntity.id}
                  </Link>
                )}
              <div
                onClick={this.props.openCommunityAdmin}
                style={{
                  border: "3px solid",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  height: "min-content"
                }}
              >
                <div
                  style={{
                    marginRight: "10px",
                    fontSize: "14px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  {chosenEntity.admin && chosenEntity.admin.length}
                  <span aria-label="admins open" role="img">
                    &#128100;
                  </span>
                  admin
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: "14px",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  {chosenEntity.members && chosenEntity.members.length}
                  <span aria-label="admins open" role="img">
                    &#128100;
                  </span>{" "}
                  members
                </div>
              </div>
            </div>
          </div>
          {this.state.planEditOpen ? null : (
            <div
              style={{
                justifyContent: "space-between",
                top: "0px",
                display: "flex",
                position: "relative",
                alignItems: "center",
                height: "56px",
                width: "100%",
                color: "rgb(66, 82, 87)",
                backgroundColor: "white",
                fontSize: "26px",
                borderBottom: "rgb(66, 82, 87) 1px solid"
              }}
            >
              {this.props.auth &&
              this.props.auth.uid === chosenEntity.authorId ? (
                <img
                  onClick={this.planEditOpener}
                  src={settings33}
                  style={{
                    position: "relative",
                    left: "2%",
                    height: "36px",
                    width: "36px"
                  }}
                  alt="error"
                />
              ) : (
                <div
                  onClick={this.planInfoOpener}
                  style={{
                    position: "relative",
                    left: "2%",
                    height: "36px",
                    width: "36px"
                  }}
                >
                  {" "}
                  &#9432;
                </div>
              )}
              <div onClick={() => this.setState({ open: !this.state.open })}>
                {chosenEntity.message}
              </div>
              {this.state.planEditOpen ? null : (
                <Link to={"/"} style={{ zIndex: "9" }}>
                  <img
                    onClick={this.state.planInfoOpen && this.planInfoCloser}
                    src={back}
                    className="eventcloseback4"
                    alt="error"
                  />
                </Link>
              )}
            </div>
          )}
          {this.state.planInfoOpen && (
            <Info
              classInitial={this.props.classInitial}
              clubInitial={this.props.clubInitial}
              auth={this.props.auth}
              tickets={this.props.tickets}
              user={this.props.user}
              ticketCategories={this.state.ticketCategories}
              eventsInitial={this.props.eventsInitial}
              collection={collection}
              chosenEntity={chosenEntity}
            />
          )}

          <ListEvents events={this.state.events} />
          <History
            findPost={this.props.findPost}
            getCommunity={this.props.getCommunity}
            hydrateUser={this.props.hydrateUser}
            chosenEntity={chosenEntity}
            forumPosts={forumPosts}
            community={this.state.community}
            parent={this.props.parent}
            droppedPost={this.props.droppedPost}
            linkDrop={this.props.linkDrop}
            dropId={this.props.dropId}
            collection={collection}
            width={this.state.width}
            openCommunityAdmin={this.props.openCommunityAdmin}
            events={this.state.events}
            undoEventPost={this.state.undoEventPost}
            lastEventPost={this.state.lastEventPost}
            undoForumPost={this.state.undoForumPost}
            lastForumPost={this.state.lastForumPost}
            getLastForum={this.getLastForum}
            getNextForum={this.getNextForum}
            users={this.props.users}
          />
          {/*<PeanutGallery
            chosenPost={this.props.chosenPost}
            chosenPostId={this.props.chosenPostId}
            getUserInfo={this.props.getUserInfo}
            vertical={this.props.vertical}
            height={this.props.height}
            postHeight={this.props.postHeight}
            postMessage={this.props.postMessage}
            comments={this.props.comments}
            commentType={
              this.props.chosenPost && this.props.chosenPost.commentsName
            }
            width={this.props.width}
            forumPosts={forumm}
            user={this.props.user}
            auth={this.props.auth}
            helper={this.props.helper}
            closeGroupFilter={this.props.closeGroupFilter}
            openGroupFilter={this.props.openGroupFilter}
          />*/}
          {this.props.auth !== undefined && (
            <Edit
              ticketCategories={this.props.ticketCategories}
              users={this.props.users}
              admin={this.state.admin}
              id={this.state.id}
              user={this.props.user}
              auth={this.props.auth}
              drawerClasses={drawerClasses}
              handleSubmitEvent={this.handleSubmitEvent}
              handleChangeBody={this.handleChangeBody}
              body={this.state.body}
              eventsInitial={this.props.eventsInitial}
              jobInitial={this.props.jobInitial}
              materialDate={this.props.materialDate}
              handleChangeDate={this.props.handleChangeDate}
              thiscommunity={thiscommunity}
              chosenEntity={chosenEntity}
              collection={collection}
              chosenPhoto={this.state.chosenPhoto}
              choosePhoto={(x) => this.setState({ chosenPhoto: x })}
              eventID={this.state.eventID}
              planEditCloser={this.planEditCloser}
              pleaseNewClubname={this.state.pleaseNewClubname}
              handleChangeTitle={this.handleChangeTitle}
              message={this.state.message}
            />
          )}
          {this.state.wantThese && (
            <div>
              Looking for these {collection}?
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%"
                }}
              >
                {[this.state.wantThese].map((x) => {
                  return (
                    <Link
                      to={
                        collection === "classes"
                          ? `/${collection}/${
                              thiscommunity
                                ? thiscommunity.message
                                : encodeURIComponent(x.city)
                            }/${x.message}/${new Date(
                              x.endDate.seconds * 1000
                            ).getFullYear()}-${
                              new Date(x.endDate.seconds * 1000).getMonth() + 1
                            }-${new Date(x.endDate.seconds * 1000).getDate()}`
                          : ["housing", "jobs", "planner"].includes(collection)
                          ? `/${
                              collection === "planner" ? "events" : collection
                            }/${x.id}`
                          : `/${collection}/${
                              thiscommunity
                                ? thiscommunity.message
                                : encodeURIComponent(x.city)
                            }/${x.message}`
                      }
                    >
                      {x.message}
                      <div style={{ color: "grey", fontSize: "14px" }}>
                        {new Date(
                          x.endDate.seconds * 1000
                        ).toLocaleDateString()}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
          <div
            className="fas fa-store-slash"
            style={{
              transition: ".3s ease-in",
              borderRadius: "20px",
              border: "1px solid",
              right: "33px",
              justifyContent: "center",
              alignItems: "center",
              top: "55px",
              display: "flex",
              position: "absolute",
              width: "30px",
              height: "30px"
            }}
          />
        </div>
      );
    } else return null;
  }
}

export default React.forwardRef((props, ref) => <Made {...props} ref={ref} />);

/*const center = new firebase.firestore.GeoPoint(0, 0);
          const center1 = new firebase.firestore.GeoPoint(0, 72);
          const center2 = new firebase.firestore.GeoPoint(0, 144);
          const center3 = new firebase.firestore.GeoPoint(0, -144);
          const center4 = new firebase.firestore.GeoPoint(0, -72);*/

/*firebase.firestore()
          .collection("planner")
          .where("communityId", "==", community.id)
          .where("message", "==", message)
          .onSnapshot((querySnapshot) => {
            if (querySnapshot.empty) {
              firebase.firestore()
                .collection("oldPlanner")
                .where("communityId", "==", community.id)
                .where("message", "==", message)
                .onSnapshot((querySnapshot) => {
                  let p = 0;
                  let wantThese = [];
                  querySnapshot.docs.forEach((doc) => {
                    if (doc.exists) {
                      const chosenEntity = doc.data();

                      chosenEntity.id = doc.id;
                      this.setState({
                        admin: chosenEntity.id,
                        id: chosenEntity.id,
                        chosenEntity: chosenEntity,
                        profilekey: chosenEntity.profile.key,
                        message: chosenEntity.message,
                        body: chosenEntity.body,
                        date: chosenEntity.date.seconds * 1000,
                        planEditOpen: false,
                        address: chosenEntity.address,
                        eventID: f,
                        ticketCategories: chosenEntity.ticketCategories,
                        authorId: chosenEntity.authorId,
                        postedAs: chosenEntity.postedAs,
                        collectionId: chosenEntity.collectionId
                      });
                      wantThese.push(chosenEntity);
                      this.getForum(collection, chosenEntity.id);
                    }
                  });
                  if (
                    querySnapshot.docs.length === p &&
                    this.state.wantThese !== wantThese
                  ) {
                    this.setState({ wantThese });
                  }
                });
            } else
              querySnapshot.docs.forEach((doc) => {
                if (doc.exists) {
                  const chosenEntity = doc.data();

                  chosenEntity.id = doc.id;
                  this.setState({
                    admin: chosenEntity.admin,
                    id: chosenEntity.id,
                    chosenPhoto: chosenEntity.chosenPhoto,
                    city: chosenEntity.city,
                    communityId: chosenEntity.communityId,
                    chosenEntity: chosenEntity,
                    profilekey: chosenEntity.profile.key,
                    message: chosenEntity.message,
                    body: chosenEntity.body,
                    date: chosenEntity.date.seconds * 1000,
                    planEditOpen: false,
                    address: chosenEntity.address,
                    eventID: f,
                    ticketCategories: chosenEntity.ticketCategories,
                    authorId: chosenEntity.authorId,
                    postedAs: chosenEntity.postedAs,
                    collectionId: chosenEntity.collectionId
                  });
                  this.getForum(collection, chosenEntity.id);
                }
              });
          });*/

/**
           * if (this.state.mounted === false) {
          this.setState({ mounted: true });
        }
        let x = [];
        this.props.chosenEntity &&
          this.props.chosenEntity.id &&
          firebase
            .firestore()
            .collection("messages")
            .where("eventroom", "==", this.props.chosenEntity.id)
            .onSnapshot((querySnapshot) => {
              this.setState({ messages: [] }, () => {
                x = [];
                querySnapshot.docs.forEach((doc) => {
                  var look = doc.data();
                  look.id = doc.id;
                  x.push(look);
                  this.setState({ messages: x });
                });
              });
            });
           */
//.near({ center: x, radius: 8587 })
