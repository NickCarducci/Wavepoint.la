import React from "react";
import firebase from "../../.././init-firebase";
import * as geofirestore from "geofirestore";
import { withRouter } from "react-router-dom";
import Confirm from "./Confirm";

import "./Make.css";
import "./imagelist.css";

import "../.././Calendar/DatepickerBackdrop.css";
import "../.././Calendar/PouchDBpages/plansettings.css";
import Header from "./Header";
import Submit from "./Submit";
import Accessories from "./Accessories";
import Photo from "./Photo";
import Body from "./Body";
import { specialFormatting } from "../../../widgets/authdb";

export const WEEK_DAYS = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY"
};
const planInitial = {
  message: "",
  ttype: "",
  mesage: "",
  body: "",
  createdAt: null,
  updatedAt: null,
  term: null,
  saving: false,
  time: new Date(),
  planDateOpen: true,
  planSettingsOpen: false,
  center: "",
  location: [34.0522, -118.2437],
  makeEnterTitle: false
};
const jobInitial = {
  message: "",
  body: "",

  createdAt: null,
  updatedAt: null,
  eventDateOpen: true,
  eventSettingsOpen: false,
  search: "",
  lsearch: "",
  places: [],
  images: [],
  place_name: "",
  location: [{ lat: 34.0522, lng: -118.2436 }],
  center: "",
  jtype: [],
  unmounted: false,
  ratings: []
};
const clubInitial = {
  message: "",
  body: "",

  createdAt: null,
  updatedAt: null,
  eventDateOpen: false,
  eventSettingsOpen: false,
  search: "",
  lsearch: "",
  places: [],
  images: [],
  seatsioOpen: false,
  addTicketsOpen: false,
  allCharts: [],
  clientDesignerKey: "",
  place_name: "",
  location: [{ lat: 34.0522, lng: -118.2436 }],
  center: "",
  ctype: [],
  servtype: [],
  rtype: [],
  htype: [],
  ptype: [],
  vtype: [],
  theatrype: [],
  stype: [],
  unmounted: false,
  canMakePayment: false,
  paymentRequest: true,
  ratings: []
};
const eventInitial = {
  message: "",
  body: "",

  createdAt: null,
  updatedAt: null,
  eventDateOpen: true,
  eventSettingsOpen: false,
  search: "",
  lsearch: "",
  places: [],
  images: [],
  seatsioOpen: false,
  addTicketsOpen: false,
  allCharts: [],
  clientDesignerKey: "",
  place_name: "",
  location: [{ lat: 34.0522, lng: -118.2436 }],
  center: "",
  etype: [],
  unmounted: false,
  ticketCategories: [],
  ticketName: "",
  ticketQuant: "",
  ticketPrice: "",
  vendorId: null,
  ratings: [],
  profile: { type: null, key: null }
};
class Make extends React.PureComponent {
  constructor(props) {
    super(props);
    var thing = this.props.eventInitial
      ? eventInitial
      : this.props.clubInitial
      ? clubInitial
      : this.props.jobInitial
      ? jobInitial
      : this.props.housingInitial
      ? clubInitial
      : this.props.planInitial
      ? planInitial
      : this.props.shopInitial
      ? clubInitial
      : this.props.restaurantInitial
      ? clubInitial
      : this.props.serviceInitial
      ? clubInitial
      : this.props.pageInitial
      ? clubInitial
      : this.props.venueInitial
      ? clubInitial
      : null;
    this.submitPaused = false;
    this.addressSearch = "";
    thing.recipients = props.recipients;
    thing.recipientSuggestionsProfiled = [];
    thing.topicSuggestions = ["*"];
    thing.lastRecipients = [];
    thing.ttype = "";
    thing.place_name = "";
    thing.entityId = null;
    thing.entityType = "users";
    thing.locationType = "city";
    this.state = thing;

    this.type = this.props.planInitial
      ? "ttype"
      : this.props.eventInitial
      ? "etype"
      : this.props.clubInitial
      ? "ctype"
      : this.props.shopInitial
      ? "stype"
      : this.props.restaurantInitial
      ? "rtype"
      : this.props.serviceInitial
      ? "servtype"
      : this.props.jobInitial
      ? "jtype"
      : this.props.housingInitial
      ? "htype"
      : this.props.pageInitial
      ? "ptype"
      : this.props.venueInitial
      ? "vtype"
      : null;
  }

  stopSubmit(e) {
    e.preventDefault();
    return false;
  }
  onSubmitCustomTriggered = (event) => {
    event.preventDefault();
    this.setState({
      usearch: event
    });
    this.onPhotoSearchCustom(event);
  };
  holdupOpener = () => {
    this.setState({
      submitPaused: true
    });
  };
  holdupCloser = () => {
    this.setState({
      submitPaused: false
    });
  };
  eventSettingsOpener = () => {
    this.setState({
      submitPaused: false,
      eventSettingsOpen: true
    });
  };
  eventSettingsCloser = () => {
    this.setState({
      eventSettingsOpen: false
    });
  };

  choosePhoto = (image) => {
    this.setState({ chosenPhoto: image });
    //console.log(this.state.chosenPhoto);
  };

  onPhotoSearch = () => {
    //unsplash off
    //this.queryPexels(this.state.photoQuery);
    this.setState({
      message: this.state.photoQuery
    });
  };
  componentWillUnmount = () => {
    /*if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }*/
    this.unmounted = true;
  };
  selectAddress = (prediction) => {
    this.setState({
      place_name: prediction.place_name,
      center: [prediction.center[1], prediction.center[0]]
    });
  };
  keyUp = () => {
    if (
      !this.state.chosenPhoto &&
      //(
      (this.state.askForPhotos || !this.props.planInitial) //||
      //(this.props.planInitial && this.props.location.state))
    ) {
      this.setState({ typingNow: true });
      clearTimeout(this.timezout);
      this.timezout = setTimeout(() => {
        this.setState({ typingNow: false });
        console.log("searching...");
        this.queryPexels(this.state.message);
      }, 3000);
    }
  };
  handleChangeBody = (e) => {
    this.setState({
      body: e.target.value
    });
  };
  handleChangeDate = (e) => {
    const currentNote = { ...this.state };
    currentNote.date = e;

    this.setState(currentNote);
    //this.setState({
    //date: e.target.value
    //});
  };
  handleDate = (e) => {
    const currentNote = { ...this.state };
    currentNote.date = e;

    this.setState(currentNote);
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      images: [],
      submitPaused: !this.state.submitPaused,
      holdupopenh: !this.state.holdupOpenh,
      createdAt: new Date()
    });
  };
  queryPexels = async (message) => {
    console.log(message);
    if (
      !this.state.chosenPhoto &&
      (this.state.askForPhotos ||
        (this.props.planInitial && this.props.location.state) ||
        !this.props.planInitial)
    ) {
      const done = message.split(" ").join("+");
      const url = `https://api.pexels.com/v1/search?query=${done}&per_page=9&page=1`;
      //return res.send(url)
      await fetch(url, {
        headers: {
          Authorization:
            "563492ad6f91700001000001702cdbab8c46478a86694c18d3e1bc6b"
        }
      })
        .then(async (response) => await response.json())
        .then((results) => {
          //let images = []
          //images.push(results)
          this.setState({ images: results.photos });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  check2 = () => {
    var collection = this.props.clubInitial
      ? "clubs"
      : this.props.shopInitial
      ? "shops"
      : this.props.restaurantInitial
      ? "restaurants"
      : this.props.serviceInitial
      ? "services"
      : this.props.pageInitial
      ? "pages"
      : this.props.venueInitial
      ? "venues"
      : null;
    const firestore = firebase.firestore();
    const geocollection = firestore.collection(collection);
    let empty = [];
    geocollection
      .where("city", "==", this.state.place_name)
      .where("messageLower", "==", this.state.message.toLowerCase())
      .get()
      .then(
        (querySnapshot) => {
          if (querySnapshot.empty) {
            console.log("check");
            empty.push("empty");
            if (empty.length === 5) {
              return collection === "clubs"
                ? this.handleSubmitClub()
                : collection === "shops"
                ? this.handleSubmitShop()
                : collection === "restaurants"
                ? this.handleSubmitRestaurant()
                : collection === "services"
                ? this.handleSubmitService()
                : collection === "pages"
                ? this.handleSubmitPage()
                : collection === "venues"
                ? this.handleSubmitVenue()
                : null;
            } else return null;
          } else {
            console.log("city has");
            querySnapshot.docs.forEach((doc) => {
              if (doc.exists) {
                const foo = doc.data();
                foo.id = doc.id;
                console.log("city has");
                this.setState({
                  pleaseNewClubname: this.state.place_name,
                  submitPaused: false
                });
              }
            });
          }
        },
        (e) => console.log(e.message)
      )
      .catch((e) => console.log(e.message));
  };
  check = async (result) => {
    console.log(result);
    await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${result}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
    )
      .then(async (response) => await response.json())
      .then((body) => {
        var prediction = body.features[0];
        prediction.place_name = prediction.place_name.replace(/, /g, " ");
        this.setState({ city: prediction.place_name, prediction });
        if (
          this.props.clubInitial ||
          this.props.shopInitial ||
          this.props.restaurantInitial ||
          this.props.serviceInitial ||
          this.props.pageInitial ||
          this.props.venueInitial
        ) {
          this.check2();
        } else if (this.props.planInitial) {
          this.planSubmit();
        } else if (this.props.eventInitial) {
          this.handleSubmitEvent();
          this.props.clearMaterialDate();
        } else if (this.props.jobInitial) {
          this.handleSubmitJob();
          this.props.clearMaterialDate();
        } else if (this.props.housingInitial) {
          this.handleSubmitHousing();
        }
      })
      .catch((err) => console.log(err.message));
  };
  checkComms = (communityId) => {
    var collection = this.props.clubInitial
      ? "clubs"
      : this.props.shopInitial
      ? "shops"
      : this.props.restaurantInitial
      ? "restaurants"
      : this.props.serviceInitial
      ? "services"
      : this.props.pageInitial
      ? "pages"
      : this.props.venueInitial
      ? "venues"
      : null;
    const firestore = firebase.firestore();
    //const GeoFirestore = geofirestore.initializeApp(firestore);
    const geocollection = firestore.collection(collection);
    console.log(collection);
    var thisone = this.props.communities.find((x) => x.id === communityId);
    collection &&
      geocollection
        .where("communityId", "==", communityId)
        .where("messageLower", "==", this.state.message.toLowerCase())
        .get()
        .then(
          (querySnapshot) => {
            if (querySnapshot.empty) {
              console.log("empty");
              //empty.push("empty");
              //if (empty.length === 5) {
              return this.check(this.state.place_name);
              //} else return null;
            } else {
              querySnapshot.docs.forEach((doc) => {
                if (doc.exists) {
                  const foo = doc.data();
                  foo.id = doc.id;
                  console.log("comm has");
                  this.setState({
                    pleaseNewClubname: thisone.message,
                    submitPaused: false
                  });
                }
              });
            }
          },
          (e) => console.log(e.message)
        );
  };
  planSubmit = () => {
    if (this.state.recipients.length > 0 && this.state.ttype === "") {
      return (
        !this.state.pauseNeedTopic && this.setState({ pauseNeedTopic: true })
      );
    } else {
      if (this.state.recipients.length > 0) {
        let x =
          this.state.recipients.constructor === Array
            ? this.state.recipients
            : [this.state.recipients];
        x.push(this.props.auth.uid);
        firebase
          .firestore()
          .collection("chats")
          .add({
            threadId:
              this.state.entityType +
              this.state.entityId +
              this.state.recipients.sort(),
            recipients: x,
            topic: this.state.ttype,
            entityType: this.state.entityType,
            entityId: this.state.entityId,
            message: this.state.message,
            body: this.state.body,
            chosenPhoto: this.state.chosenPhoto
              ? {
                  large: this.state.chosenPhoto.src.large,
                  medium: this.state.chosenPhoto.src.medium,
                  small: this.state.chosenPhoto.src.small,
                  photographer: this.state.chosenPhoto.photographer,
                  photographer_url: this.state.chosenPhoto.photographer_url
                }
              : null,
            authorId: this.props.auth.uid,
            time: new Date(),
            date: this.props.materialDate,
            authoritarianTopic: false
          })
          .then(
            (docRef) => {
              console.log("Document written with ID: ", docRef.id);
              var goo = {};
              goo.message = this.state.message;
              goo.body = this.state.body;
              goo.createdAt = this.state.createdAt;
              goo.updatedAt = this.state.updatedAt;
              goo.date = this.props.materialDate;
              goo.time = this.state.time;
              goo.location = this.state.location;
              goo.recipients = this.state.recipients;
              goo.ttype = this.state.ttype;
              goo.center = this.state.center;
              goo.place_name = this.state.place_name;
              goo.authorId = this.props.auth.uid;
              goo.chosenPhoto = this.state.chosenPhoto;
              goo._id = docRef.id;
              this.props.handleSave(goo);

              firebase.firestore().collection("calendar").doc(docRef.id).set({
                rangeChosen: this.props.rangeChosen,
                authorId: this.props.auth.uid,
                date: this.props.materialDate
              });
              firebase
                .firestore()
                .collection("planchats")
                .add({
                  chatId: goo._id,
                  firstChat: true,
                  message: "",
                  authorId: this.props.auth.uid
                })
                .then((x) => console.log(`added ${x}`))
                .catch((x) => console.log(x.message));
              this.props.history.push("/");
            },
            (e) => console.log(e.message)
          )
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      } else {
        firebase
          .firestore()
          .collection("chats")
          .add({
            threadId: "",
            recipients:
              this.props.auth !== undefined ? [this.props.auth.uid] : [],
            topic: "",
            entityType: "",
            entityId: "",
            message: "",
            body: "",

            authorId: this.props.auth !== undefined ? this.props.auth.uid : "",
            time: "",
            date: "",
            authoritarianTopic: false
          })
          .then(
            (docRef) => {
              console.log("Document written with ID: ", docRef.id);
              var goo = {};
              goo.message = this.state.message;
              goo.body = this.state.body;
              goo.createdAt = this.state.createdAt;
              goo.updatedAt = this.state.updatedAt;
              goo.date = this.props.materialDate;
              goo.time = this.state.time;
              goo.center = this.state.center;
              goo.location = this.state.location;
              goo.recipients = this.state.recipients;
              goo.ttype = this.state.ttype;
              goo.place_name = this.state.place_name;
              goo.authorId =
                this.props.auth !== undefined ? this.props.auth.uid : "";
              goo.chosenPhoto = this.state.chosenPhoto;
              goo._id = docRef.id;
              this.props.handleSave(goo);

              firebase
                .firestore()
                .collection("calendar")
                .doc(docRef.id)
                .set({
                  rangeChosen: this.props.rangeChosen,
                  authorId:
                    this.props.auth !== undefined ? this.props.auth.uid : "",
                  date: this.props.materialDate
                });
              firebase
                .firestore()
                .collection("planchats")
                .add({
                  chatId: goo._id,
                  firstChat: true,
                  message: "",
                  authorId:
                    this.props.auth !== undefined ? this.props.auth.uid : ""
                })
                .then((x) => console.log(`added ${x}`))
                .catch((x) => console.log(x.message));
              this.props.history.push("/");
            },
            (e) => console.log(e.message)
          )
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      }
    }
    this.props.clearMaterialDate();
  };
  handleSubmitEvent = () => {
    this.setState({ images: "" });
    const firestore = firebase.firestore();
    const GeoFirestore = geofirestore.initializeApp(firestore);
    const geocollection = GeoFirestore.collection("planner");
    const geopoint = new firebase.firestore.GeoPoint(
      Number(this.state.center[0]),
      Number(this.state.center[1])
    );
    var array = [];
    const c = this.state.message.toLowerCase();
    for (let i = 1; i < c.length + 1; i++) {
      array.push(c.substring(0, i));
    }
    geocollection
      .add({
        entityId: this.state.entityId,
        entityType: this.state.entityType,
        coordinates: geopoint,
        rangeChosen: this.props.rangeChosen,
        message: this.state.message,
        messageLower: this.state.message.toLowerCase(),
        titleAsArray: array,
        body: this.state.body,
        chosenPhoto: {
          large: this.state.chosenPhoto.src.large,
          medium: this.state.chosenPhoto.src.medium,
          small: this.state.chosenPhoto.src.small,
          photographer: this.state.chosenPhoto.photographer,
          photographer_url: this.state.chosenPhoto.photographer_url
        },
        date: this.props.materialDate,
        createdAt: this.state.createdAt,
        updatedAt: this.state.updatedAt,
        etype: this.state.etype,
        authorId: this.props.auth.uid,
        admin: [],
        authorName: this.props.user.name,
        authorUsername: this.props.user.username,
        vendorId: this.props.user.vendorId ? this.props.user.vendorId : null,
        profile: this.state.profile,
        place_name: this.state.place_name,
        center: this.state.center,
        communityId: this.state.communityId ? this.state.communityId : null,
        city: this.state.city
      })
      .then((res) => {
        const resp = res.id;
        this.state.ticketCategories === [] || this.state.ticketCategories === ""
          ? geocollection.doc(resp).update({ id: resp })
          : geocollection.doc(resp).update({
              id: resp,
              ticketCategories: this.state.ticketCategories
            });
        this.setState({ loadingSubmitted: false });
        this.props.history.push("/");
        setTimeout(function () {
          //window.location.reload();
        }, 100);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handleSubmitClub = () => {
    console.log("subm");
    this.setState({ images: "" });
    const firestore = firebase.firestore();
    const GeoFirestore = geofirestore.initializeApp(firestore);
    const geocollection = GeoFirestore.collection("clubs");
    const geopoint = new firebase.firestore.GeoPoint(
      Number(this.state.center[0]),
      Number(this.state.center[1])
    );
    var array = [];
    const c = this.state.message.toLowerCase();
    for (let i = 1; i < c.length + 1; i++) {
      array.push(c.substring(0, i));
    }
    geocollection
      .add({
        coordinates: geopoint,
        message: this.state.message,
        messageLower: this.state.message.toLowerCase(),
        titleAsArray: array,
        body: this.state.body,
        chosenPhoto: {
          large: this.state.chosenPhoto.src.large,
          medium: this.state.chosenPhoto.src.medium,
          small: this.state.chosenPhoto.src.small,
          photographer: this.state.chosenPhoto.photographer,
          photographer_url: this.state.chosenPhoto.photographer_url
        },
        createdAt: this.state.createdAt,
        updatedAt: this.state.updatedAt,
        ctype: this.state.ctype,
        authorId: this.props.auth.uid,
        authorName: this.props.user.name,
        authorUsername: this.props.user.username,
        admin: [],
        members: [],
        place_name: this.state.place_name,
        center: this.state.center,
        communityId: this.state.communityId ? this.state.communityId : null,
        city: this.state.city
      })
      .then((res) => {
        const resp = res.id;
        geocollection.doc(resp).update({ id: resp });
        this.setState({ loadingSubmitted: false, success: true }, () => {
          this.props.history.push("/");
          setTimeout(() => this.setState({ success: false }), 5000);
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  handleSubmitShop = () => {
    console.log("subm");
    this.setState({ images: "" });
    const firestore = firebase.firestore();
    const GeoFirestore = geofirestore.initializeApp(firestore);
    const geocollection = GeoFirestore.collection("shops");
    const geopoint = new firebase.firestore.GeoPoint(
      Number(this.state.center[0]),
      Number(this.state.center[1])
    );
    var array = [];
    const c = this.state.message.toLowerCase();
    for (let i = 1; i < c.length + 1; i++) {
      array.push(c.substring(0, i));
    }
    geocollection
      .add({
        coordinates: geopoint,
        message: this.state.message,
        messageLower: this.state.message.toLowerCase(),
        titleAsArray: array,
        body: this.state.body,
        chosenPhoto: {
          large: this.state.chosenPhoto.src.large,
          medium: this.state.chosenPhoto.src.medium,
          small: this.state.chosenPhoto.src.small,
          photographer: this.state.chosenPhoto.photographer,
          photographer_url: this.state.chosenPhoto.photographer_url
        },
        createdAt: this.state.createdAt,
        updatedAt: this.state.updatedAt,
        stype: this.state.stype,
        authorId: this.props.auth.uid,
        authorName: this.props.user.name,
        authorUsername: this.props.user.username,
        admin: [],
        members: [],
        place_name: this.state.place_name,
        center: this.state.center,
        communityId: this.state.communityId ? this.state.communityId : null,
        city: this.state.city
      })
      .then((res) => {
        const resp = res.id;
        geocollection.doc(resp).update({ id: resp });
        this.setState({ loadingSubmitted: false, success: true }, () => {
          setTimeout(() => this.setState({ success: false }), 5000);
        });
        this.props.history.push("/");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  handleSubmitRestaurant = () => {
    console.log("subm");
    this.setState({ images: "" });
    const firestore = firebase.firestore();
    const GeoFirestore = geofirestore.initializeApp(firestore);
    const geocollection = GeoFirestore.collection("restaurants");
    const geopoint = new firebase.firestore.GeoPoint(
      Number(this.state.center[0]),
      Number(this.state.center[1])
    );
    var array = [];
    const c = this.state.message.toLowerCase();
    for (let i = 1; i < c.length + 1; i++) {
      array.push(c.substring(0, i));
    }
    geocollection
      .add({
        coordinates: geopoint,
        message: this.state.message,
        messageLower: this.state.message.toLowerCase(),
        titleAsArray: array,
        body: this.state.body,
        chosenPhoto: {
          large: this.state.chosenPhoto.src.large,
          medium: this.state.chosenPhoto.src.medium,
          small: this.state.chosenPhoto.src.small,
          photographer: this.state.chosenPhoto.photographer,
          photographer_url: this.state.chosenPhoto.photographer_url
        },
        createdAt: this.state.createdAt,
        updatedAt: this.state.updatedAt,
        rtype: this.state.rtype,
        authorId: this.props.auth.uid,
        authorName: this.props.user.name,
        authorUsername: this.props.user.username,
        admin: [],
        members: [],
        place_name: this.state.place_name,
        center: this.state.center,
        communityId: this.state.communityId ? this.state.communityId : null,
        city: this.state.city
      })
      .then((res) => {
        const resp = res.id;
        geocollection.doc(resp).update({ id: resp });
        /*if (this.state.communityId) {
          this.chooseCommunity(this.state.community);
        } else {
          const city = this.state.city.split(", ")[0];
          const cityapi = city.replace(/, /g, "%20").replace(/ /g, "%20");
          const state = this.state.city.split(", ")[1].split(", ")[0];
          const stateapi = state.replace(/ /, "%20");
          this.chooseCitypoint(
            this.state.center,
            this.props.distance,
            this.state.city,
            cityapi,
            stateapi
          );
        }*/
        this.setState({ loadingSubmitted: false, success: true }, () => {
          setTimeout(() => this.setState({ success: false }), 5000);
        });
        this.props.history.push("/");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  handleSubmitService = () => {
    console.log("subm");
    this.setState({ images: "" });
    const firestore = firebase.firestore();
    const GeoFirestore = geofirestore.initializeApp(firestore);
    const geocollection = GeoFirestore.collection("services");
    const geopoint = new firebase.firestore.GeoPoint(
      Number(this.state.center[0]),
      Number(this.state.center[1])
    );
    var array = [];
    const c = this.state.message.toLowerCase();
    for (let i = 1; i < c.length + 1; i++) {
      array.push(c.substring(0, i));
    }
    geocollection
      .add({
        coordinates: geopoint,
        message: this.state.message,
        messageLower: this.state.message.toLowerCase(),
        titleAsArray: array,
        body: this.state.body,
        chosenPhoto: {
          large: this.state.chosenPhoto.src.large,
          medium: this.state.chosenPhoto.src.medium,
          small: this.state.chosenPhoto.src.small,
          photographer: this.state.chosenPhoto.photographer,
          photographer_url: this.state.chosenPhoto.photographer_url
        },
        createdAt: this.state.createdAt,
        updatedAt: this.state.updatedAt,
        servtype: this.state.servtype,
        authorId: this.props.auth.uid,
        authorName: this.props.user.name,
        authorUsername: this.props.user.username,
        admin: [],
        members: [],
        place_name: this.state.place_name,
        center: this.state.center,
        communityId: this.state.communityId ? this.state.communityId : null,
        city: this.state.city
      })
      .then((res) => {
        const resp = res.id;
        geocollection.doc(resp).update({ id: resp });
        this.setState({ loadingSubmitted: false, success: true }, () => {
          setTimeout(() => this.setState({ success: false }), 5000);
        });
        this.props.history.push("/");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  handleSubmitJob = () => {
    this.setState({ images: "" });
    const firestore = firebase.firestore();
    const GeoFirestore = geofirestore.initializeApp(firestore);
    const geocollection = GeoFirestore.collection("jobs");
    const geopoint = new firebase.firestore.GeoPoint(
      Number(this.state.center[0]),
      Number(this.state.center[1])
    );
    var array = [];
    const c = this.state.message.toLowerCase();
    for (let i = 1; i < c.length + 1; i++) {
      array.push(c.substring(0, i));
    }
    geocollection
      .add({
        coordinates: geopoint,
        rangeChosen: this.props.rangeChosen,
        message: this.state.message,
        messageLower: this.state.message.toLowerCase(),
        titleAsArray: array,
        body: this.state.body,
        chosenPhoto: {
          large: this.state.chosenPhoto.src.large,
          medium: this.state.chosenPhoto.src.medium,
          small: this.state.chosenPhoto.src.small,
          photographer: this.state.chosenPhoto.photographer,
          photographer_url: this.state.chosenPhoto.photographer_url
        },
        date: this.props.materialDate,
        createdAt: this.state.createdAt,
        updatedAt: this.state.updatedAt,
        jtype: this.state.jtype,
        authorId: this.props.auth.uid,
        admin: [],
        authorName: this.props.user.name,
        authorUsername: this.props.user.username,
        place_name: this.state.place_name,
        center: this.state.center,
        communityId: this.state.communityId ? this.state.communityId : null,
        city: this.state.city
      })
      .then((res) => {
        const resp = res.id;
        geocollection.doc(resp).update({ id: resp });
        this.props.history.push("/");
        setTimeout(function () {
          //window.location.reload();
        }, 100);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handleSubmitHousing = () => {
    console.log("subm");
    this.setState({ images: "" });
    const firestore = firebase.firestore();
    const GeoFirestore = geofirestore.initializeApp(firestore);
    const geocollection = GeoFirestore.collection("housing");
    const geopoint = new firebase.firestore.GeoPoint(
      Number(this.state.center[0]),
      Number(this.state.center[1])
    );
    var array = [];
    const c = this.state.message.toLowerCase();
    for (let i = 1; i < c.length + 1; i++) {
      array.push(c.substring(0, i));
    }
    geocollection
      .add({
        coordinates: geopoint,
        message: this.state.message,
        messageLower: this.state.message.toLowerCase(),
        titleAsArray: array,
        body: this.state.body,
        chosenPhoto: {
          large: this.state.chosenPhoto.src.large,
          medium: this.state.chosenPhoto.src.medium,
          small: this.state.chosenPhoto.src.small,
          photographer: this.state.chosenPhoto.photographer,
          photographer_url: this.state.chosenPhoto.photographer_url
        },
        createdAt: this.state.createdAt,
        updatedAt: this.state.updatedAt,
        htype: this.state.htype,
        authorId: this.props.auth.uid,
        authorName: this.props.user.name,
        authorUsername: this.props.user.username,
        admin: [],
        members: [],
        place_name: this.state.place_name,
        center: this.state.center,
        communityId: this.state.communityId ? this.state.communityId : null,
        city: this.state.city
      })
      .then((res) => {
        const resp = res.id;
        geocollection.doc(resp).update({ id: resp });
        this.setState({ loadingSubmitted: false, success: true }, () => {
          setTimeout(() => this.setState({ success: false }), 5000);
        });
        this.props.history.push("/");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  handleSubmitPage = () => {
    console.log("subm");
    this.setState({ images: "" });
    const firestore = firebase.firestore();
    const GeoFirestore = geofirestore.initializeApp(firestore);
    const geocollection = GeoFirestore.collection("pages");
    const geopoint = new firebase.firestore.GeoPoint(
      Number(this.state.center[0]),
      Number(this.state.center[1])
    );
    var array = [];
    const c = this.state.message.toLowerCase();
    for (let i = 1; i < c.length + 1; i++) {
      array.push(c.substring(0, i));
    }
    geocollection
      .add({
        coordinates: geopoint,
        message: this.state.message,
        messageLower: this.state.message.toLowerCase(),
        titleAsArray: array,
        body: this.state.body,
        chosenPhoto: {
          large: this.state.chosenPhoto.src.large,
          medium: this.state.chosenPhoto.src.medium,
          small: this.state.chosenPhoto.src.small,
          photographer: this.state.chosenPhoto.photographer,
          photographer_url: this.state.chosenPhoto.photographer_url
        },
        createdAt: this.state.createdAt,
        updatedAt: this.state.updatedAt,
        ptype: this.state.ptype,
        authorId: this.props.auth.uid,
        authorName: this.props.user.name,
        authorUsername: this.props.user.username,
        admin: [],
        members: [],
        place_name: this.state.place_name,
        center: this.state.center,
        communityId: this.state.communityId ? this.state.communityId : null,
        city: this.state.city
      })
      .then((res) => {
        const resp = res.id;
        geocollection.doc(resp).update({ id: resp });
        this.setState({ loadingSubmitted: false, success: true }, () => {
          setTimeout(() => this.setState({ success: false }), 5000);
        });
        this.props.history.push("/");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  handleSubmitVenue = () => {
    console.log("subm");
    this.setState({ images: "" });
    const firestore = firebase.firestore();
    const GeoFirestore = geofirestore.initializeApp(firestore);
    const geocollection = GeoFirestore.collection("venues");
    const geopoint = new firebase.firestore.GeoPoint(
      Number(this.state.center[0]),
      Number(this.state.center[1])
    );
    var array = [];
    const c = this.state.message.toLowerCase();
    for (let i = 1; i < c.length + 1; i++) {
      array.push(c.substring(0, i));
    }
    geocollection
      .add({
        coordinates: geopoint,
        message: this.state.message,
        messageLower: this.state.message.toLowerCase(),
        titleAsArray: array,
        body: this.state.body,
        chosenPhoto: {
          large: this.state.chosenPhoto.src.large,
          medium: this.state.chosenPhoto.src.medium,
          small: this.state.chosenPhoto.src.small,
          photographer: this.state.chosenPhoto.photographer,
          photographer_url: this.state.chosenPhoto.photographer_url
        },
        createdAt: this.state.createdAt,
        updatedAt: this.state.updatedAt,
        ptype: this.state.ptype,
        authorId: this.props.auth.uid,
        authorName: this.props.user.name,
        authorUsername: this.props.user.username,
        admin: [],
        members: [],
        place_name: this.state.place_name,
        center: this.state.center,
        communityId: this.state.communityId ? this.state.communityId : null,
        city: this.state.city
      })
      .then((res) => {
        const resp = res.id;
        geocollection.doc(resp).update({ id: resp });
        this.setState({ loadingSubmitted: false, success: true }, () => {
          setTimeout(() => this.setState({ success: false }), 5000);
        });
        this.props.history.push("/");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  componentDidMount = async () => {
    if (this.props.planInitial) {
      if (this.props.auth !== undefined) {
        var recipients =
          this.props.location.state && this.props.location.state.recipients
            ? new Set([...this.props.location.state.recipients])
            : this.props.recipients;
        recipients = this.props.recipients.filter(
          (b) => b !== this.props.auth.uid
        );
        await Promise.all(
          recipients.map(async (x) => await this.props.hydrateUser(x))
        ).then((recipientSuggestionsProfiled) => {
          this.setState({ recipientSuggestionsProfiled });
        });

        if (this.props.location.state) {
          var sendTitlePlan = this.props.location.state.sendTitlePlan;
          var message = specialFormatting(sendTitlePlan);

          var entityId = this.props.location.state.entityId;
          var entityType = this.props.location.state.entityType;
          this.setState({
            recipients,
            message,
            entityId,
            entityType,
            topicSuggestions: [...this.props.location.state.topics]
          });
        } else {
          var person = window.location.pathname.split("/bk/")[1];
          if (person) {
            var date1 = person.split("/")[1];
            var hours1 = 0;
            var minutes1 = 0;
            var profile = await this.props.hydrateUserFromUserName(person);
            this.setState({ recipients: [profile.id] });
            if (date1) {
              hours1 = date1.split("/")[1];
              if (hours1) {
                date1 = date1.split("/")[0];
                minutes1 = hours1.split(":")[1];
                if (minutes1) {
                  hours = hours1.split(":")[0];
                  this.setState({
                    materialDate: new Date(
                      new Date(date1.replace(/-/g, "/")).setHours(
                        hours1,
                        minutes1,
                        0,
                        0
                      )
                    )
                  });
                } else {
                  this.setState({
                    materialDate: new Date(
                      new Date(date1.replace(/-/g, "/")).setHours(
                        hours1,
                        0,
                        0,
                        0
                      )
                    )
                  });
                }
              } else {
                this.setState({
                  materialDate: new Date(
                    new Date(date1.replace(/-/g, "/")).setHours(12, 0, 0, 0)
                  )
                });
              }
            }
          }
          if (this.props.location.state) {
            if (window.location.pathname === "/") {
              if (this.props.location.state.fromMap && this.props.forumOpen) {
                this.setState({
                  forumOpen: false,
                  started: false
                });
              }
            }
          }
        }
      }
    }
  };
  render() {
    const numberEntered = /^[\d]/;

    const entityTypeChosen =
      (this.props.clubInitial && this.state.ctype.length === 0) ||
      (this.props.shopInitial && this.state.stype.length === 0) ||
      (this.props.serviceInitial && this.state.servtype.length === 0) ||
      (this.props.restaurantInitial && this.state.rtype.length === 0) ||
      (this.props.pageInitial && this.state.ptype.length === 0) ||
      (this.props.venueInitial && this.state.vtype.length === 0);

    const { materialDate } = this.props;
    return (
      <div
        style={{
          display: this.props.materialDateOpen ? "none" : "flex",
          position: "fixed",
          width: "100%",
          top: "0px",
          height: "100%",
          flexDirection: "column",
          transition: ".3s ease-in"
        }}
      >
        <Header
          message-={this.state.message}
          planInitial={this.props.planInitial}
          eventInitial={this.props.eventInitial}
          clubInitial={this.props.clubInitial}
          shopInitial={this.props.shopInitial}
          restaurantInitial={this.props.restaurantInitial}
          serviceInitial={this.props.serviceInitial}
          jobInitial={this.props.jobInitial}
          housingInitial={this.props.housingInitial}
          pageInitial={this.props.pageInitial}
          venueInitial={this.props.venueInitial}
          success={this.state.success}
          chosenPhoto={this.state.chosenPhoto}
        />

        <Submit
          submitPaused={this.state.submitPaused}
          askForPhotos={this.state.askForPhotos}
          keyUp={this.keyUp}
          message={this.state.message}
          planInitial={this.props.planInitial}
          chosenPhoto={this.state.chosenPhoto}
          pleaseNewClubname={this.state.pleaseNewClubname}
          changeState={(x) => this.setState(x)}
          materialDate={materialDate}
          closed={
            this.props.eventInitial ||
            this.props.jobInitial ||
            this.props.planInitial
          }
          submit={
            this.state.images === [] &&
            !this.state.chosenPhoto &&
            !this.props.planInitial
              ? (e) => {
                  e.preventDefault();
                  if (this.state.message !== this.state.lastTitle) {
                    this.setState({ lastTitle: this.state.message });
                    this.queryPexels(this.state.message);
                  }
                  //
                }
              : !this.state.chosenPhoto && !this.props.planInitial
              ? (e) => {
                  e.preventDefault();
                  var c = window.confirm("please choose a photo");
                  c && window.focus();
                  c && window.scrollTo(0, 0);
                }
              : (e) => this.handleSubmit(e)
          }
        />
        <Photo
          eventSettingsCloser={this.eventSettingsCloser}
          typingNow={this.state.typingNow}
          images={this.state.images}
          message={this.state.message}
          choosePhoto={this.choosePhoto}
        />

        <Body
          handleChangeBody={this.handleChangeBody}
          eventSettingsOpen={this.state.eventSettingsOpen}
          entityType={
            this.props.eventInitial
              ? "Event "
              : this.props.clubInitial
              ? "Club "
              : this.props.shopInitial
              ? "Shop "
              : this.props.restaurantInitial
              ? "Restaurant "
              : this.props.serviceInitial
              ? "Service "
              : this.props.jobInitial
              ? "Job "
              : this.props.planInitial
              ? "Plan "
              : this.props.housingInitial
              ? "Housing "
              : this.props.pageInitial
              ? "Page "
              : this.props.venueInitial
              ? "Venue or Theatre "
              : null
          }
        />

        <Accessories
          eventSettingsCloser={this.eventSettingsCloser}
          planInitial={this.props.planInitial}
          place_name={this.state.place_name}
          go={() => {
            if (this.props.planInitial) {
              if (this.state.place_name) {
                this.check(this.state.place_name);
              } else {
                this.planSubmit();
              }
            } else if (entityTypeChosen) {
              if (this.state.communityId) {
                this.checkComms(this.state.communityId);
              } else {
                this.check(this.state.place_name);
              }
            } else if (
              this.props.eventInitial &&
              this.state.etype.length !== 0
            ) {
              this.check(this.state.place_name);
            } else if (this.props.jobInitial && this.state.jtype.length !== 0) {
              this.check(this.state.place_name);
            } else if (
              this.props.housingInitial &&
              this.state.htype.length !== 0
            ) {
              this.check(this.state.place_name);
            }
          }}
          materialDateOpener={this.props.materialDateOpener}
          eventSettingsOpen={this.state.eventSettingsOpen}
          submitPaused={this.state.submitPaused}
          planSettingsOpen={this.props.planSettingsOpen}
          hasTime={
            this.props.eventInitial ||
            this.props.jobInitial ||
            this.props.planInitial
          }
          hasType={
            (this.props.eventInitial && this.state.etype.length === 0) ||
            (this.props.jobInitial && this.state.jtype.length === 0) ||
            (this.props.housingInitial && this.state.htype.length === 0)
          }
          entityTypeChosen={entityTypeChosen}
          location={this.props.location}
          eventSettingsOpener={this.eventSettingsOpener}
        />
        {this.state.submitPaused && (
          <Confirm
            back={() =>
              this.setState({
                submitPaused: false
              })
            }
            setCommunity={(x) => this.setState(x)}
            auth={this.props.auth}
            users={this.props.users}
            topicSuggestions={this.state.topicSuggestions}
            entityType={this.state.entityType}
            entityId={this.state.entityId}
            setEntity={(x) => this.setState(x)}
            recipientSuggestionsProfiled={
              this.state.recipientSuggestionsProfiled
            }
            setRecipients={(x) => this.setState(x)}
            recipients={this.state.recipients}
            pauseNeedTopic={this.state.pauseNeedTopic}
            setType={(x) => {
              this.state.pauseNeedTopic &&
                this.setState({ pauseNeedTopic: false });
              this.setState(x);
            }}
            ttype={this.state.ttype}
            etype={this.state.etype}
            ctype={this.state.ctype}
            stype={this.state.stype}
            rtype={this.state.rtype}
            servtype={this.state.servtype}
            jtype={this.state.jtype}
            htype={this.state.htype}
            ptype={this.state.ptype}
            vtype={this.state.vtype}
            clearlocation={() => this.setState({ place_name: "", center: [] })}
            numberEntered={numberEntered}
            setPoster={(x) => this.setState(x)}
            myClubs={this.props.myClubs}
            myShops={this.props.myShops}
            myServices={this.props.myServices}
            myClasses={this.props.myClasses}
            myPages={this.props.myPages}
            myRestaurants={this.props.myRestaurants}
            myDepartments={this.props.myDepartments}
            place_name={this.state.place_name}
            eventInitial={this.props.eventInitial}
            planInitial={this.props.planInitial}
            jobInitial={this.props.jobInitial}
            clubInitial={this.props.clubInitial}
            housingInitial={this.props.housingInitial}
            serviceInitial={this.props.serviceInitial}
            shopInitial={this.props.shopInitial}
            restaurantInitial={this.props.restaurantInitial}
          />
        )}
      </div>
    );
  }
}
export default withRouter(Make);
