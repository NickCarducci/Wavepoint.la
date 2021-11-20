import React from "react";
import firebase from "./init-firebase";
import PropTypes from "prop-types";
import Forum from "./Forum";
import Find from "./Find";
import List from "./components/Forum/List";
import Filters from "./components/Forum/Tools/Filters";
import ForumAccessories from "./components/Forum/ForumAccessories";
import Stuff from "./components/Forum/Stuff";
import Header from "./Header";
import Notifs from "./notifs";

class Napkin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTop: true,
      findheighter: 0,
      highAndTight: true,
      comm: {},
      notificationComments: [],
      notificationReactions: [],
      searching: "",
      predictions: [],
      width: window.innerWidth,
      height: window.innerHeight,
      //...this.resolveStateFromProp(),
      closeBottom: true,
      dayLiked: new Date().getHours() > 4 && new Date().getHours() < 20,
      zoomerOpen: true,
      zoomUpdated: true,
      zoomChosen: props.zoomChosen,
      city: "Los Angeles",
      cityapi: "Los%20Angeles",
      state: "CA",
      search: "",
      //mapheight: "",
      apiKeyFound: false,
      zoomerControl: false,
      data: [],
      counter: 0,
      chosenEdmevent: props.edmTrainevents && props.edmTrainevents[0],
      current: new Date().setHours(0, 0, 0, 0),
      date: new Date(),
      dateTimeZeroed: new Date(),
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      loading: false,
      searchedDate: new Date().setHours(0, 0, 0, 0),
      prev: props.queriedDate,
      mounted: false,
      stop: false,
      y: props.distance,
      pointData: null,
      center: "",
      place_name: "",
      deletedForumPosts: [],
      comment: "",
      budgetTyped: "",
      ordinanceTyped: "",
      classTyped: "",
      caseTyped: "",
      departmentTyped: "",
      electionTyped: "",
      forumTyped: "",
      openWhat: "council",
      openWhen: "new",
      browsedCommunities: []
    };
    this.map = React.createRef();
    this.closeSwitchMarker = React.createRef();
    this.forum = React.createRef();
    this.fwd = React.createRef();

    //props.combined.map(x => (this["myRef" + x.id] = React.createRef()));
    //this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount = async () => {
    this.browseCommunities();
    //this.props.community && this.getBills();
    this.refresh();
    window.addEventListener("scroll", this.scroll);
    window.addEventListener("resize", this.refresh);
  };
  browseCommunities = (paginate, cities) => {
    const collection = firebase.firestore().collection("communities");
    const query =
      cities === 4
        ? collection.where("tract", "==", "school").orderBy("createdAt", "desc")
        : cities === 3
        ? collection
            .where("tract", "==", "town/county")
            .orderBy("createdAt", "desc")
        : cities === 2
        ? collection
            .where("tract", "==", "country/city/providence")
            .orderBy("createdAt", "desc")
        : cities === 1 //countries
        ? collection
            .where("splitComma2", "<", "")
            .orderBy("splitComma2", "desc") //without a single comma
        : cities //cities
        ? collection
            .where("splitComma2", ">", "")
            .orderBy("splitComma2", "desc") //has at least two
        : collection.orderBy("members", "desc");
    var shot = null;
    var nuller = "";
    if (!paginate) {
      shot = query.limit(10);
    } else if (paginate === "undo") {
      nuller = "undoCommunity";
      shot = query.startAfter(this.state.undoCommunity).limit(10);
    } else if (paginate === "last") {
      nuller = "lastCommunity";
      shot = query.endBefore(this.state.lastCommunity).limitToLast(10);
    }
    shot &&
      shot.onSnapshot(
        (querySnapshot) => {
          let p = 0;
          let browsedCommunities = [];
          if (querySnapshot.empty) {
            this.setState({
              [nuller]: null
            });
          }
          querySnapshot.docs.forEach((doc) => {
            p++;
            if (doc.exists) {
              var community = doc.data();
              community.id = doc.id;
              var messageAsArray = [];
              for (let i = 1; i < community.message.length + 1; i++) {
                messageAsArray.push(community.message.substring(0, i));
              }
              /*if (community.tract === "campus") {
                firebase
                  .firestore()
                  .collection("communities")
                  .doc(community.id)
                  .update({ tract: "country/providence/state" });
              }*/
              if (this.props.auth !== undefined) {
                if (community) {
                  const sc = (community.isCommunity
                    ? community.message
                    : community.place_name
                  ).split(",")[1];
                  const splitComma = sc ? sc : false;
                  if (community.splitComma !== splitComma) {
                    firebase
                      .firestore()
                      .collection("communities")
                      .doc(community.id)
                      .update({ splitComma });
                  }
                  const sc2 = (community.isCommunity
                    ? community.message
                    : community.place_name
                  ).split(",")[2];
                  const splitComma2 = sc2 ? sc2 : false;
                  if (community.splitComma2 !== splitComma2) {
                    firebase
                      .firestore()
                      .collection("communities")
                      .doc(community.id)
                      .update({
                        splitComma2
                      });
                  }
                  /*if (
                    splitComma2 &&
                    community.tract === "country/providence/state"
                  ) {
                    firebase
                      .firestore()
                      .collection("communities")
                      .doc(community.id)
                      .update({ tract: "town/county" });
                  }*/
                  if (community.messageAsArray !== messageAsArray) {
                    firebase
                      .firestore()
                      .collection("communities")
                      .doc(community.id)
                      .update({
                        messageAsArray
                      });
                  }
                }
                browsedCommunities.push(community);
              }
            }
          });
          if (p === querySnapshot.docs.length) {
            const undoCommunity =
              querySnapshot.docs[querySnapshot.docs.length - 1];
            const lastCommunity = querySnapshot.docs[0];
            this.setState({
              browsedCommunities,
              undoCommunity,
              lastCommunity
            });
          }
        },
        (e) => console.log(e.message)
      );
  };
  searcher = (searching) => {
    //console.log(searching);
    this.setState(
      {
        searching
      },
      () => {
        clearTimeout(this.closer);
        this.closer = setTimeout(() => this.onSearcher(searching), 2000);
      } /*
      if (searching === "" || !this.props.forumOpen)
        if (searching !== "") {
          if (this.state.lastForumOpen === undefined)
            this.setState({ lastForumOpen: this.props.forumOpen });
          if (!this.props.forumOpen)
            this.props.setIndex({
              forumOpen: true
            });
        } else {
          this.props.setIndex({
            forumOpen: this.state.lastForumOpen
          });
          this.setState({ lastForumOpen: null });
        }
    }*/
    );
  };
  onSearcher = async (lastSearching) => {
    const { typesA = ["(address)"] } = this.props;
    //const { typesE = ["(establishment)"] } = this.props;

    //const numberEntered = /^[\d]/;
    const letterEntered = /^[\W\D]/;
    if (this.state.lastSearching !== lastSearching) {
      this.setState({ lastSearching, typesA }, () => {
        if (lastSearching && letterEntered.test(lastSearching)) {
          clearTimeout(this.timepout);
          this.timepout = setTimeout(async () => {
            await fetch(
              //`https://atlas.microsoft.com/search/address/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${lastSearching}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
            )
              .then(async (response) => await response.json())
              .then(
                (body) =>
                  body.features &&
                  body.features.constructor === Array &&
                  body.features.length > 0 &&
                  this.setState(
                    {
                      predictions: body.features,
                      lastPredictions: body.features
                    },
                    () => {
                      let communitiesFound = [];
                      firebase
                        .firestore()
                        .collection("communities")
                        .where(
                          "messageAsArray",
                          "array-contains",
                          lastSearching
                        )
                        //.orderBy("time", "desc")
                        //.startAfter(this.state.lastCityPost)
                        .limit(14)
                        .get()
                        .then((querySnapshot) => {
                          if (querySnapshot.empty) {
                            /*console.log(
                            `no communities including "${this.state.queryCity}"`
                          );*/
                          } else
                            querySnapshot.docs.forEach((doc) => {
                              if (doc.exists) {
                                var foo = doc.data();
                                foo.id = doc.id;
                                foo.isCommunity = true;
                                console.log("found community " + foo.message);
                                communitiesFound.push(foo);
                              }
                            });
                          this.setState(
                            {
                              predictions: [
                                ...this.state.predictions,
                                ...communitiesFound
                              ]
                            },
                            () => {
                              return null; //query tiles in foo.city
                            }
                          );
                        });
                    }
                  ),
                (err) => console.log(err)
              )
              .catch((err) => {
                console.log(err);
                alert("please try another city name");
              });
          });
        }
      });
    } else {
      this.setState({ predictions: this.state.lastPredictions });
    }
  };
  componentDidUpdate = (prevProps) => {
    const { appHeight } = this.props;
    if (appHeight !== prevProps.appHeight) {
      clearTimeout(this.appHeightTimeout);
      this.appHeightTimeout = setTimeout(() => {
        window.scroll(0, 0);
      }, 100);
    }
    if (this.props.isProfile && this.state.searching !== "") {
      this.setState({ searching: "" });
    }
    if (this.props !== prevProps) {
      this.setState({ woah: true });
      clearTimeout(this.woah);
      this.woah = setTimeout(() => {
        this.setState({ woah: false });
      }, 900);
    }
    if (!this.props.forumOpen && this.props.forumOpen !== prevProps.forumOpen) {
      this.setState({ closeBottom: true, focusSuggest: null });
    }
    if (this.state.height !== this.state.lastHeight) {
      if (this.state.height < 380) {
        !this.state.closeBottom && this.setState({ closeBottom: true });
      }
      this.setState({ lastHeight: this.state.height });
    }
    var community = this.props.community;
    if (community && community !== prevProps.community) {
      firebase
        .firestore()
        .collection("commdocs")
        .where("communityId", "==", community.id)
        .orderBy("time", "desc")
        .onSnapshot(
          (querySnapshot) => {
            let p = 0;
            let f = [];
            if (querySnapshot.empty) {
              this.setState({ commdocs: [] });
            } else {
              querySnapshot.docs.forEach((doc) => {
                p++;
                if (doc.exists) {
                  const foo = doc.data();
                  foo.id = doc.id;
                  //if (foo.entityType) {
                  f.push(foo);
                  //}
                  if (
                    p === querySnapshot.docs.length &&
                    this.state.commdocs !== f
                  ) {
                    this.setState({ commdocs: f });
                  }
                }
              });
            }
          },
          (e) => console.log(e.message)
        );
    }
    if (this.state.focusSuggest !== this.state.lastFocusSuggest) {
      this.setState({ lastFocusSuggest: this.state.focusSuggest }, () => {
        clearInterval(this.focusheighterTO);
        this.focusheighterTO = setInterval(
          () =>
            this.fwd &&
            this.fwd.current &&
            this.setState(
              {
                findheighter: this.fwd.current.offsetHeight
              },
              () =>
                this.fwd.current.innerHeight < 10 &&
                clearInterval(this.focusheighterTO)
            ),
          200
        );
        this.state.focusSuggest && this.props.setIndex({ forumOpen: true });
      });
    }
  };

  /* calculateZoom = () => {
    var Lat = this.state.center[0];
    var Length = this.props.distance * 1.60934;
    var Ratio = 100;
    var WidthPixel = window.innerWidth;
    Length = Length * 1000;
    var k = WidthPixel * 156543.03392 * Math.cos((Lat * Math.PI) / 180);
    //console.log(k);
    var myZoom = Math.round(Math.log((Ratio * k) / (Length * 100)) / Math.LN2);
    myZoom = myZoom - 1;
    //https:// gis.stackexchange.com/questions/7430/what-ratio-scales-do-google-maps-zoom-levels-correspond-to/31551#31551
    if (this.state.scrollChosen !== myZoom) {
      this.setState({ scrollChosen: myZoom });
    }
    return myZoom;
  };*/
  componentWillUnmount = () => {
    clearTimeout(this.timepout);
    clearTimeout(this.closer);
    clearInterval(this.focusheighterTO);
    clearTimeout(this.woah);
    clearTimeout(this.appHeightTimeout);
    clearTimeout(this.mounting);
    clearTimeout(this.resizeTimer);
    clearTimeout(this.scrollTimer);
    clearTimeout(this.scrolltimeout);
    window.removeEventListener("scroll", this.scroll);
    window.removeEventListener("resize", this.refresh);
  };
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

  scroll = () => {
    if (!this.state.lockIsTop && this.props.chatsopen) {
      if (!this.state.isTop && window.scrollY <= 10) {
        this.setState({ isTop: true });
      } else if (this.state.isTop && window.scrollY > 10) {
        this.setState({ isTop: false, lockIsTop: true });
      }
    }

    const switchCity = () => {
      this.props.setFoundation(
        {
          switchCityOpen: this.props.switchCityOpen
            ? document.body.scrollHeight - window.scrollY - window.innerHeight >
              0 // - this.closeSwitchMarker.current.offsetTop - > 56
            : this.props.switchCityOpen
        },
        () => {
          clearTimeout(this.scrollTimer);
          this.scrollTimer = setTimeout(
            () => this.setState({ scrolling: false, goAhead: false }),
            3000
          );
        }
      );
    };
    !this.state.scrolling && this.setState({ scrolling: true });
    clearTimeout(this.scrolltimeout);
    this.scrolltimeout = setTimeout(() => {
      if (this.props.switchCityOpen) {
        switchCity();
      } else {
        const ifMapIsOpen = (highAndTight) => {
          if (this.state.cancelScroll) {
            this.setState({ cancelScroll: false });
          } else {
            if (!highAndTight) {
              if (!this.props.started) {
                this.props.setFoundation({ started: true });
              }
              window.scroll(0, 0);
            } else if (highAndTight && this.props.started) {
              this.props.setFoundation({ started: false });
            }
          }
        };
        if (!this.props.openCal) {
          var highAndTight = window.scrollX === 0 || window.scrollY < 4;
          this.setState(
            { highAndTight },
            () =>
              this.props.tilesMapOpen === "tiles" &&
              !this.props.forumOpen &&
              ifMapIsOpen(highAndTight)
          );
        }
      }
    }, 400);
  };

  bigClose = () => {
    const {
      forumTyper,
      electionTyper,
      classTyper,
      departmentTyper,
      budgetTyper,
      caseTyper,
      ordinanceTyper
    } = this.state;
    this.props.showFilters && this.props.openFilters();
    forumTyper && this.setState({ forumTyper: false });
    electionTyper && this.setState({ electionTyper: false });
    classTyper && this.setState({ classTyper: false });
    departmentTyper && this.setState({ departmentTyper: false });
    budgetTyper && this.setState({ budgetTyper: false });
    caseTyper && this.setState({ caseTyper: false });
    ordinanceTyper && this.setState({ ordinanceTyper: false });
  };
  resetSearch = () =>
    this.setState(
      {
        focusSuggest: false,
        cancelScroll: true,
        searching: "",
        predictions: []
      },

      this.bigClose
    );

  render() {
    var newFollowers = [];
    this.props.followingMe &&
      this.props.user !== undefined &&
      this.props.followingMe.map(
        (x) =>
          !(
            this.props.user.followingNoticed &&
            this.props.user.followingNoticed.includes(x.id)
          ) && newFollowers.push(x)
      );
    const {
      users,
      auth,
      comments,
      started,
      tileChosen,
      forumOpen,
      postHeight,
      subForum,
      displayPreferences,
      commtype,
      forumPosts,
      community,
      electionTyper,
      forumTyper,
      caseTyper,
      classTyper,
      budgetTyper,
      ordinanceTyper,
      departmentTyper,
      openWhen,
      type
    } = this.props;
    const {
      openNotifs,
      notificationReactions,
      notificationComments,
      mounted,
      height,
      width,
      searching,
      highAndTight
    } = this.state;
    var isLoggedAndInComm = community && auth !== undefined;
    var isAuthor = isLoggedAndInComm && auth.uid === community.authorId;
    var isAdmin =
      isAuthor ||
      (isLoggedAndInComm &&
        community.admin &&
        community.admin.includes(auth.uid));
    var isFaculty =
      isLoggedAndInComm &&
      community.faculty &&
      community.faculty.includes(auth.uid);
    var isAdminOrFaculty = isAdmin || isFaculty;
    var isMemberMaker =
      isLoggedAndInComm &&
      community.memberMakers &&
      community.memberMakers.includes(auth.uid);
    var canMember =
      isMemberMaker ||
      (isLoggedAndInComm && community.facultyCanMember && isFaculty);
    var permitted =
      !community ||
      (community && !community.privateToMembers) ||
      isAuthor ||
      isAdmin ||
      isFaculty ||
      (community.members && community.members.includes(auth.uid));
    var ownerOpen =
      !this.props.globeChosen &&
      !subForum &&
      users &&
      commtype === "new" &&
      this.props.editingCommunity &&
      isAdminOrFaculty;
    /*var communitiesThatPartOf =
      auth !== undefined &&
      this.props.communities.filter(
        (x) =>
          x.admin.includes(auth.uid) ||
          x.faculty.includes(auth.uid) ||
          x.members.includes(auth.uid)
      );
    var suggested = [];
    communitiesThatPartOf &&
      communitiesThatPartOf.map((x) => {
        x.admin.map((a) => {
          if (!suggested.includes(a)) {
            return suggested.push(a);
          } else return null;
        });
        x.faculty.map((d) => {
          if (!suggested.includes(d)) {
            return suggested.push(d);
          } else return null;
        });
        return x.members.map((m) => {
          if (!suggested.includes(m)) {
            return suggested.push(m);
          } else return null;
        });
      });*/
    var top = (height < 380 || !forumOpen) && this.state.closeBottom;
    var shiftRight = (height < 200 && !started) || (height < 400 && started);
    const showFilters =
      !subForum &&
      postHeight === 0 &&
      !this.props.editingCommunity &&
      (this.props.showFilters ||
        electionTyper ||
        forumTyper ||
        caseTyper ||
        classTyper ||
        budgetTyper ||
        ordinanceTyper ||
        departmentTyper);
    var vertical =
      height < 380 &&
      forumOpen &&
      this.state.closeBottom &&
      !showFilters &&
      highAndTight;
    const { backgroundColor } = displayPreferences;

    var collection =
      commtype === "court case"
        ? this.props.materialDate < new Date()
          ? "oldCases"
          : "cases"
        : commtype === "department"
        ? "departments"
        : commtype === "classes"
        ? "classes"
        : commtype === "ordinances"
        ? "ordinances"
        : commtype === "budget & proposal"
        ? this.props.materialDate < new Date()
          ? "oldBudget"
          : "budget"
        : commtype === "elections"
        ? this.props.materialDate < new Date()
          ? "oldElections"
          : "elections"
        : "forum";
    var theLotOfPosts = this.props.globeChosen
      ? this.props.globalForumPosts
      : subForum
      ? []
      : commtype === "classes" && openWhen === "expired"
      ? this.props.oldClasses
      : commtype === "budget" && openWhen === "expired"
      ? this.props.oldBudget
      : commtype === "elections" && openWhen === "expired"
      ? this.props.oldElections
      : commtype === "cases" && openWhen === "expired"
      ? this.props.oldCases
      : forumPosts;
    /*forumOpen && ["classes", "department"].includes(commtype)
      ? commtype
      : type*/
    const typeOrder = [
      /*{ type: "clubs", name: "myClubs" },
        { type: "shops", name: "myShops" },
        { type: "restaurants", name: "myRestaurants" },
        { type: "services", name: "myServices" },
        { type: "pages", name: "myPages" },
        { type: "jobs", name: "myJobs" },
        { type: "venues", name: "myVenues" },
        { type: "housing", name: "myHousing" },
        { type: "planner", name: "myEvents" },*/
      { trigger: "openClasses", type: "classTyped", name: "classes" },
      {
        trigger: "openDepartments",
        type: "departmentTyped",
        name: "department"
      },
      {
        trigger: "openBudget",
        type: "budgetTyped",
        name: "budget & proposal"
      },
      { trigger: "openCases", type: "caseTyped", name: "court case" },
      {
        trigger: "openElections",
        type: "electionTyped",
        name: "election"
      },
      {
        trigger: "openOrdinances",
        type: "ordinanceTyped",
        name: "ordinance"
      },
      //{ type: "forms & permits", name: "forms & permits" },
      { trigger: "openForum", type: "forumTyped", name: "new" },
      { trigger: "openForum", type: "forumTyped", name: "lesson" },
      { trigger: "openForum", type: "forumTyped", name: "show" },
      { trigger: "openForum", type: "forumTyped", name: "game" },
      { trigger: "eventTypes", type: "etype", name: "event" },
      { trigger: "eventTypes", type: "rtype", name: "restaurant" },
      { trigger: "eventTypes", type: "ctype", name: "club" },
      { trigger: "eventTypes", type: "stype", name: "shop" },
      { trigger: "eventTypes", type: "servtype", name: "service" },
      { trigger: "eventTypes", type: "jtype", name: "job" },
      { trigger: "eventTypes", type: "htype", name: "housing" },
      { trigger: "eventTypes", type: "ptype", name: "page" },
      { trigger: "eventTypes", type: "vtype", name: "venue" }
    ].find((x) => x.name === commtype || x.name === tileChosen);
    return (
      <div
        ref={this.forum}
        style={{
          transition: ".3s ease-in",
          display: vertical ? "flex" : "block",
          zIndex: this.props.forumOpen ? 1 : 0,
          overflow: "hidden",
          position: "absolute",
          width: "100%",
          height: this.props.forumOpen
            ? "min-content"
            : this.props.started
            ? "0px"
            : "56px"
        }}
      >
        {this.props.switchCityOpen && (
          <List
            rebeat={this.props.rebeat}
            setRebeat={this.props.setRebeat}
            statesForBillsOfOpenStates={this.props.statesForBillsOfOpenStates}
            setCommtype={this.props.setCommtype}
            commtype={this.props.commtype}
            profileTileChosen={this.props.profileTileChosen}
            //selected
            openOptionsForThis={(x) => {
              this.setState({
                options: true,
                comm: x,
                comms: false
              });
            }}
            communities={this.props.communities}
            comm={this.state.comm}
            community={this.props.community}
            switchCMapCloser={this.props.switchCMapCloser}
            chooseFromTiptool={this.props.chooseFromTiptool}
            distance={this.props.distance}
            chooseCommunity={this.props.chooseCommunity}
            right={this.state.comms}
            options={this.state.options}
            comms={this.state.comms}
            thisone={{}}
            favorites={this.props.favoriteCities}
            auth={auth}
            user={this.props.user}
            setHovers={(x) => this.setState(x)}
            clickCityGifmap={async (x, tile) => {
              await fetch(
                //`https://atlas.microsoft.com/search/address/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${x}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
              )
                .then(async (response) => await response.json())
                .then((
                  body //console.log(body.features[0]))
                ) => this.props.clickCityGifmap(body.features[0], tile))
                .catch((err) => {
                  console.log(err);
                  alert(
                    "body.features[0] doesn't exist " +
                      `https://api.mapbox.com/geocoding/v5/mapbox.places/${x}.json?limit=2&types=place`
                  );
                });
            }}
          />
        )}
        <Find
          fwd={this.fwd}
          started={this.props.started}
          focusSuggest={this.state.focusSuggest}
          focusSearching={() => this.setState({ focusSuggest: true })}
          blurSearching={() => this.setState({ focusSuggest: false })}
          resetSearch={this.resetSearch}
          resetPathAlias={this.props.resetPathAlias}
          findCity={(prediction, tile) => {
            const q = prediction.place_name;

            const city = q.split(", ")[0];
            const cityapi = city.replace(/, /g, "%20").replace(/ /g, "%20");
            const distance = this.state.y;
            const state = prediction.place_name.split(", ")[1].split(", ")[0];
            const stateapi = state.replace(/ /, "%20");
            this.props.chooseCitypoint(
              prediction.center,
              distance,
              q,
              cityapi,
              stateapi,
              tile
            );
          }}
          searching={searching}
          browsedCommunities={this.state.browsedCommunities}
          lastCommunity={this.state.lastCommunity}
          undoCommunity={this.state.undoCommunity}
          browseCommunities={this.browseCommunities}
          predictions={this.state.predictions}
          backgroundColor={backgroundColor}
          openBuyer={this.state.openBuyer}
          height={this.state.height}
          favoriteCities={this.props.favoriteCities}
          nope={() =>
            this.setState({
              options: false,
              comms: false,
              comm: false
            })
          }
          on={() => this.setState({ options: false })}
          off={() => this.setState({ comms: true, options: false })}
          openOptionsForThis={(x) => {
            this.setState({
              options: true,
              comm: x,
              comms: false
            });
          }}
          comm={this.state.comm}
          city={this.props.city}
          community={this.props.community}
          switchCMapCloser={this.props.switchCMapCloser}
          auth={auth}
          user={this.props.user}
          communities={this.props.communities}
          distance={this.props.distance}
          chooseFromTiptool={this.props.chooseFromTiptool}
          setHovers={(x) => this.setState(x)}
        />
        <Header
          drop={this.props.drop}
          findheighter={this.state.findheighter}
          typeOrder={typeOrder}
          setNapkin={(obj) => this.setState(obj)}
          tileChosen={this.props.tileChosen}
          setFoundation={this.props.setFoundation}
          focusSuggest={this.state.focusSuggest}
          focusSearching={() => this.setState({ focusSuggest: true })}
          blurSearching={() =>
            this.setState({ focusSuggest: false, predictions: [] })
          }
          setIndex={this.props.setIndex}
          lastForumOpen={this.state.lastForumOpen}
          searching={searching}
          searcher={(e) => this.searcher(e.target.value)}
          resetSearch={this.resetSearch}
          notificationReactions={notificationReactions}
          notificationComments={notificationComments}
          newFollowers={newFollowers}
          openNotifs={openNotifs}
          setNotifOpen={(openNotifs) => this.setState(openNotifs)}
          isProfile={this.props.isProfile}
          profileCommunity={this.state.community}
          profileCity={this.state.city}
          hydrateUser={this.props.hydrateUser}
          eventTypes={this.props.eventTypes}
          openForum={() => {
            this.setState({ forumTyper: true });
            this.props.openForum();
          }}
          toggleForumBtn={this.props.toggleForumBtn}
          chatsopen={this.props.chatsopen}
          y={this.props.y}
          distance={this.props.distance}
          started={this.props.started}
          top={top}
          vertical={vertical}
          openElections={() => this.setState({ electionTyper: true })}
          openDepartments={() => this.setState({ departmentTyper: true })}
          openClasses={() => this.setState({ classTyper: true })}
          openCases={() => this.setState({ caseTyper: true })}
          openOrdinances={() => this.setState({ ordinanceTyper: true })}
          openBudget={() => this.setState({ budgetTyper: true })}
          commtype={subForum ? this.props.type : commtype}
          highAndTight={highAndTight}
          community={community}
          openFilters={() => {
            this.props.openFilters();
            this.setState({ forumTyper: true });
          }}
          //
          closeForum={this.props.closeForum}
          scrollBackToTheLeft={this.scrollBackToTheLeft}
          closeBottom={this.props.closeBottom}
          unclose={this.props.unclose}
          forumOpen={this.props.forumOpen}
          createSliderOpener={this.props.createSliderOpener}
          open={this.props.open}
          height={height}
          unSubForum={this.props.unSubForum}
          tilesMapOpen={this.props.tilesMapOpen}
          showFilters={showFilters}
          showFollowing={this.props.showFollowing}
          type={type}
          postHeight={postHeight}
          postMessage={this.props.postMessage}
          subForum={subForum}
          profileTileChosen={this.props.profileTileChosen}
          globeChosen={this.props.globeChosen}
          city={this.props.city}
          searchEvents={this.props.searchEvents}
          searcherEventer={this.props.searcherEventer}
          switchCMapOpener={this.props.switchCMapOpener}
        />
        <Notifs
          findheighter={this.state.findheighter}
          logoutofapp={this.props.logoutofapp}
          getUserInfo={this.props.getUserInfo}
          auth={auth}
          user={this.props.user}
          notificationReactions={notificationReactions}
          notificationComments={notificationComments}
          newFollowers={newFollowers}
          openNotifs={openNotifs}
          setNotifOpen={(openNotifs) => this.setState(openNotifs)}
          forumOpen={this.props.forumOpen}
        />
        <Forum
          setAuth={this.props.setAuth}
          isTop={this.state.isTop}
          unlockTop={() =>
            this.setState({ lockIsTop: false, isTop: true }, () => {
              this.props.chatscloser();
              this.props.achatisopenfalse();
              window.scrollTo(0, 0);
            })
          }
          findheighter={this.state.findheighter}
          setFoundation={this.props.setFoundation}
          typeOrder={typeOrder}
          openForum={() => {
            this.setState({ forumTyper: true });
            this.props.openForum();
          }}
          openElections={() => this.setState({ electionTyper: true })}
          openDepartments={() => this.setState({ departmentTyper: true })}
          openClasses={() => this.setState({ classTyper: true })}
          openCases={() => this.setState({ caseTyper: true })}
          openOrdinances={() => this.setState({ ordinanceTyper: true })}
          openBudget={() => this.setState({ budgetTyper: true })}
          budgetTyped={this.state.budgetTyped}
          ordinanceTyped={this.state.ordinanceTyped}
          caseTyped={this.state.caseTyped}
          classTyped={this.state.classTyped}
          departmentTyped={this.state.departmentTyped}
          electionTyped={this.state.electionTyped}
          forumTyped={this.state.forumTyped}
          highAndTight={highAndTight}
          canMember={canMember}
          permitted={permitted}
          isAuthor={isAuthor}
          isAdmin={isAdmin}
          isFaculty={isFaculty}
          ownerOpen={ownerOpen}
          manuallyDeleteKeyBox={this.props.manuallyDeleteKeyBox}
          go={this.props.go}
          recipientsProfiled={this.props.recipientsProfiled}
          unloadGreenBlue={this.props.unloadGreenBlue}
          loadGreenBlue={this.props.loadGreenBlue}
          getDrop={this.props.getDrop}
          parent={this.props.parent}
          droppedPost={this.props.droppedPost}
          dropId={this.props.dropId}
          getCommunity={this.props.getCommunity}
          hydrateUser={this.props.hydrateUser}
          storageRef={this.props.storageRef}
          getUserInfo={this.props.getUserInfo}
          getVideos={this.props.getVideos}
          getFolders={this.props.getFolders}
          folders={this.props.folders}
          videos={this.props.videos}
          onDeleteVideo={this.props.onDeleteVideo}
          handleSaveVideo={this.props.handleSaveVideo}
          width={width}
          openChatWithGroup={this.props.openChatWithGroup}
          myEvents={this.props.myEvents}
          myClubs={this.props.myClubs}
          myJobs={this.props.myJobs}
          myVenues={this.props.myVenues}
          myServices={this.props.myServices}
          myClasses={this.props.myClasses}
          myDepartments={this.props.myDepartments}
          myRestaurants={this.props.myRestaurants}
          myShops={this.props.myShops}
          myPages={this.props.myPages}
          myHousing={this.props.myHousing}
          thisentity={this.props.thisentity}
          entityTitle={this.props.entityTitle}
          entityType={this.props.entityType}
          entityId={this.props.entityId}
          setTopic={this.props.setTopic}
          threadId={this.props.threadId}
          chosenTopic={this.props.chosenTopic}
          oktoshowchats={this.props.oktoshowchats}
          showChatsOnce={this.props.showChatsOnce}
          accessToken={this.props.accessToken}
          communities={this.props.communities}
          recipients={this.props.recipients}
          rangeChosen={this.props.rangeChosen}
          againBackMessages={this.props.againBackMessages}
          moreMessages={this.props.moreMessages}
          forumOpen={forumOpen}
          onDelete={this.props.onDelete}
          handleSave={this.props.handleSave}
          clearFilesPreparedToSend={this.props.clearFilesPreparedToSend}
          filesPreparedToSend={this.props.filesPreparedToSend}
          loadYoutubeApi={this.props.loadYoutubeApi}
          switchAccount={this.props.switchAccount}
          signOut={this.props.signOut}
          signedIn={this.props.signedIn}
          s={this.props.s}
          loadGapiApi={this.props.loadGapiApi}
          authResult={this.props.authResult}
          googlepicker={this.props.googlepicker}
          switchCMap={this.props.switchCityOpen}
          addPic={this.props.addPic}
          hiddenMsgs={this.props.hiddenMsgs}
          deletedMsgs={this.props.deletedMsgs}
          listHiddenMsgs={this.props.listHiddenMsgs}
          listDeletedMsgs={this.props.listDeletedMsgs}
          notes={this.props.notes}
          profileOpener={this.props.profileOpener}
          profileOpen={this.props.profileOpen}
          chatsopen={this.props.chatsopen}
          chatscloser={this.props.chatscloser}
          users={users}
          auth={auth}
          user={this.props.user}
          firebase={this.props.firebase}
          openAChat={this.props.achatopen}
          achatisopen={this.props.achatisopen}
          achatisopenfalse={this.props.achatisopenfalse}
          chats={this.props.chats}
          //
          clickZoomer={this.props.clickZoomer}
          eventTypes={this.props.eventTypes}
          displayPreferences={displayPreferences}
          setDisplayPreferences={this.props.setDisplayPreferences}
          calToggle={this.props.calToggle}
          openCal={this.props.openCal}
          woah={this.state.woah}
          shiftRight={shiftRight}
          goToRadius={this.props.goToRadius}
          monthCalOpen={this.props.monthCalOpen}
          invites={this.props.invites}
          selfvites={this.props.selfvites}
          fonish={this.props.fonish}
          materialDateOpen={this.props.materialDateOpen}
          pathname={this.props.pathname}
          started={started}
          tilesMapOpen={this.props.tilesMapOpen}
          achatopen={this.props.achatopen}
          unreadChatsCount={this.props.unreadChatsCount}
          setData={this.props.setData}
          current={this.props.current}
          current1={this.props.current1}
          y={this.props.y}
          toggleCloseStuff={this.props.toggleCloseStuff}
          start={this.props.start}
          unStart={this.props.unStart}
          tilesOpener={this.props.tilesOpener}
          openStart={this.props.openStart}
          range={this.props.range}
          queriedDate={this.props.queriedDate}
          backtotoday={this.backtotoday}
          alltime={this.props.alltime}
          sliderchange={(x) => {
            this.props.sliderchange(x);
            this.setState({ zoomUpdated: false });
          }}
          distance={this.props.distance}
          trueZoom={this.props.trueZoom}
          zoomUpdated={this.state.zoomUpdated}
          chooseEvents={this.props.chooseEvents}
          tileToggler={this.props.tileToggler}
          commtype={this.props.commtype}
          openchat={this.props.openchat}
          tileChosen={tileChosen}
          openthestuff={this.props.openthestuff}
          zoomChoose1={this.props.zoomChoose1}
          zoomChoose2={this.props.zoomChoose2}
          zoomChoose3={this.props.zoomChoose3}
          zoomChoose4={this.props.zoomChoose4}
          queryDate={this.props.queryDate}
          zoomChosen={this.props.zoomChosen}
          community={this.props.community}
          city={this.props.city}
          //
          switchCityOpen={this.props.switchCityOpen}
          setNapkin={(obj) => this.setState(obj)}
          searching={searching}
          apple={this.props.apple}
          setCommunity={this.props.setCommunity}
          birdsEyeZoomOn={this.props.birdsEyeZoomOn}
          birdsEyeZoomOff={this.props.birdsEyeZoomOff}
          address={this.props.address}
          closeSurrounds={this.props.closeSurrounds}
          openSurrounds={this.props.openSurrounds}
          chooseCommunity={this.props.chooseCommunity}
          waitForMove={this.props.waitForMove}
          height={this.state.height}
          chooseEdmevent={this.props.chooseEdmevent}
          daylike={() => this.setState({ dayLiked: true })}
          daydislike={() => this.setState({ dayLiked: false })}
          chooseCitypoint={this.props.chooseCitypoint}
          mounted={mounted}
          center={this.props.center}
          zoomIn={this.props.zoomIn}
          classes={this.props.classes}
          departments={this.props.departments}
          clubs={this.props.clubs}
          jobs={this.props.jobs}
          shops={this.props.shops}
          services={this.props.services}
          housing={this.props.housing}
          pages={this.props.pages}
          events={this.props.events}
          restaurants={this.props.restaurants}
          ptype={this.props.ptype}
          vtype={this.props.vtype}
          servtype={this.props.servtype}
          htype={this.props.htype}
          stype={this.props.stype}
          etype={this.props.etype}
          ctype={this.props.ctype}
          jtype={this.props.jtype}
          ftype={this.props.ftype}
          rtype={this.props.rtype}
          cityapi={this.props.cityapi}
          chooseEvent={this.props.chooseEvent}
          searchEvents={this.props.searchEvents}
          setForumDocs={this.props.setForumDocs}
          //
          scrolling={this.props.scrolling}
          lastSearching={this.state.lastSearching}
          searcher={(e) => this.searcher(e.target.value)}
          resetSearch={this.resetSearch}
          predictions={this.state.predictions}
          resetPathAlias={this.props.resetPathAlias}
          switchCMapCloser={this.props.switchCMapCloser}
          setIndex={this.props.setIndex}
          newFollowers={newFollowers}
          drop={this.props.drop}
          statePathname={this.props.statePathname}
          profileEntities={this.props.profileEntities}
          isProfile={this.props.isProfile}
          person={this.props.person}
          chosenPost={this.props.chosenPost}
          chosenPostId={this.props.chosenPostId}
          postHeight={this.props.postHeight}
          forumPosts={forumPosts}
          profilePosts={this.props.profilePosts}
          comments={comments}
          postMessage={this.props.postMessage}
          openWhen={openWhen}
          helper2={this.props.helper2}
          helper={this.props.helper}
          linkDrop={this.props.linkDrop}
          bumpScrollReady={this.props.bumpScrollReady}
          //
          top={top}
          vertical={vertical}
          lastGlobalPost={this.props.lastGlobalPost}
          undoGlobalPost={this.props.undoGlobalPost}
          lastGlobalCommForum={this.props.lastGlobalForum}
          undoGlobalCommForum={this.props.undoGlobalForum}
          //
          lastCityPost={this.props.lastCityPost}
          undoCityPost={this.props.undoCityPost}
          lastCityForum={this.props.lastCityForum}
          undoCityForum={this.props.undoCityForum}
          //
          lastCommPost={this.props.lastCommPost}
          undoCommPost={this.props.undoCommPost}
          lastCommForum={this.props.lastCommForum}
          undoCommForum={this.props.undoCommForum}
          switchCMapOpener={this.props.switchCMapOpener}
          meAuth={this.props.meAuth}
          logoutofapp={this.props.logoutofapp}
          triggerNew={
            this.props.subForum
              ? this.props.createSliderOpener
              : ["new", "lesson", "show", "game"].includes(
                  this.props.commtype
                ) && this.props.forumOpen
              ? () => this.setState({ showNew: true })
              : this.props.createSliderOpener
          }
          closeNew={() => {
            this.setState({ showNew: false });
          }}
          showNew={this.state.showNew}
          individualTypes={this.props.individualTypes}
          showFilters={showFilters}
          openFilters={this.props.openFilters}
          toggleEditing={this.props.toggleEditing}
          editingCommunity={this.props.editingCommunity}
          type={type}
          openCommunityAdmin={this.props.openCommunityAdmin}
          issues={this.props.issues}
          oldBudget={this.props.oldBudget}
          oldElections={this.props.oldElections}
          oldCases={this.props.oldCases}
          oldClasses={this.props.oldClasses}
          followingMe={this.props.followingMe}
          dayLiked={this.state.dayLiked}
          materialDateOpener={this.props.materialDateOpener}
          materialDate={this.props.materialDate}
          clearMaterialDate={this.props.clearMaterialDate}
          listplz={this.props.listplz}
          listplzToggle={this.props.listplzToggle}
          addPicTrue={this.props.addPicTrue}
          addPicFalse={this.props.addPicFalse}
          subForum={this.props.subForum}
          subForumPosts={this.props.subForumPosts}
          showpicker2={this.props.showpicker2}
          settingsOpen={this.state.settingsOpen}
          picker2={this.props.picker2}
          loadGapiAuth={this.props.loadGapiAuth}
          filePreparedToSend={this.props.filePreparedToSend}
          closeForum={this.props.closeForum}
          globalForumPosts={this.props.globalForumPosts}
          globeChosen={this.props.globeChosen}
          chooseGlobe={this.props.chooseGlobe}
          // header stuff below...\/

          closeBottom={this.state.closeBottom}
          unclose={() => this.setState({ closeBottom: false })}
          createSliderOpener={this.props.createSliderOpener}
          open={this.props.open}
          unSubForum={this.props.unSubForum}
          showFollowing={this.props.openFollowing}
          searcherEventer={this.props.searcherEventer}
          cancelRebeat={this.props.cancelRebeat}
          rebeat={this.props.rebeat}
          collection={this.props.collection}
        />
        {/*
        <Chats
          getRoomKeys={(x) => this.Vintages.getRoomKeys(x)}
          vintageOfKeys={this.state.vintageOfKeys}
          setNapkin={(x) => this.setState(x)}
          hydrateEntity={this.props.hydrateEntity}
          getCommunity={this.props.getCommunity}
          hydrateUser={this.props.hydrateUser}
          setToUser={this.props.setToUser}
          standbyMode={this.props.standbyMode}
          setFoundation={this.props.setFoundation}
          setIndex={this.props.setIndex}
          forumOpen={this.props.forumOpen}
          go={this.props.go}
          recipientsProfiled={this.props.recipientsProfiled}
          unloadGreenBlue={this.props.unloadGreenBlue}
          loadGreenBlue={this.props.loadGreenBlue}
          getDrop={this.props.getDrop}
          parent={this.props.parent}
          droppedPost={this.props.droppedPost}
          dropId={this.props.dropId}
          storageRef={this.props.storageRef}
          getUserInfo={this.props.getUserInfo}
          getVideos={this.props.getVideos}
          getFolders={this.props.getFolders}
          folders={this.props.folders}
          videos={this.props.videos}
          onDeleteVideo={this.props.onDeleteVideo}
          handleSaveVideo={this.props.handleSaveVideo}
          width={width}
          openChatWithGroup={this.props.openChatWithGroup}
          myEvents={this.props.myEvents}
          myClubs={this.props.myClubs}
          myJobs={this.props.myJobs}
          myVenues={this.props.myVenues}
          myServices={this.props.myServices}
          myClasses={this.props.myClasses}
          myDepartments={this.props.myDepartments}
          myRestaurants={this.props.myRestaurants}
          myShops={this.props.myShops}
          myPages={this.props.myPages}
          myHousing={this.props.myHousing}
          thisentity={this.props.thisentity}
          entityTitle={this.props.entityTitle}
          entityType={this.props.entityType}
          entityId={this.props.entityId}
          setTopic={this.props.setTopic}
          threadId={this.props.threadId}
          chosenTopic={this.props.chosenTopic}
          oktoshowchats={this.props.oktoshowchats}
          showChatsOnce={this.props.showChatsOnce}
          accessToken={this.props.accessToken}
          communities={this.props.communities}
          recipients={this.props.recipients}
          rangeChosen={this.props.rangeChosen}
          againBackMessages={this.props.againBackMessages}
          moreMessages={this.props.moreMessages}
          onDelete={this.props.onDelete}
          handleSave={this.props.handleSave}
          clearFilesPreparedToSend={this.props.clearFilesPreparedToSend}
          filesPreparedToSend={this.props.filesPreparedToSend}
          loadYoutubeApi={this.props.loadYoutubeApi}
          switchAccount={this.props.switchAccount}
          signOut={this.props.signOut}
          signedIn={this.props.signedIn}
          s={this.props.s}
          loadGapiApi={this.props.loadGapiApi}
          authResult={this.props.authResult}
          googlepicker={this.props.googlepicker}
          switchCMap={this.props.switchCityOpen}
          addPic={this.props.addPic}
          hiddenMsgs={this.props.hiddenMsgs}
          deletedMsgs={this.props.deletedMsgs}
          listHiddenMsgs={this.props.listHiddenMsgs}
          listDeletedMsgs={this.props.listDeletedMsgs}
          notes={this.props.notes}
          profileOpener={this.props.profileOpener}
          profileOpen={this.props.profileOpen}
          chatsopen={this.props.chatsopen}
          chatscloser={this.props.chatscloser}
          users={users}
          auth={auth}
          user={this.props.user}
          firebase={this.props.firebase}
          openAChat={this.props.achatopen}
          achatisopen={this.props.achatisopen}
          achatisopenfalse={this.props.achatisopenfalse}
          chats={this.props.chats}
        />*/}
        <div
          style={{
            backgroundColor: "rgba(20,20,90,.4)",
            width: "100%",
            height: this.props.chatsopen ? "0px" : "200px",
            transition: ".3s ease-in"
          }}
        ></div>
        <Stuff
          forumOpen={this.props.forumOpen}
          highAndTight={highAndTight}
          closeForum={this.props.closeForum}
          scrollBackToTheLeft={this.scrollBackToTheLeft}
          users={users}
          globeChosen={this.props.globeChosen}
          locOpen={this.state.locOpen}
          setLoc={(parent) => this.setState(parent)}
          toggleEditing={this.props.toggleEditing}
          height={height}
          editingCommunity={this.props.editingCommunity}
          community={community}
          auth={auth}
          postHeight={postHeight}
          addPic={this.props.addPic}
        />
        <ForumAccessories
          chosenPostId={this.props.chosenPostId}
          comments={comments}
          postMessage={this.props.postMessage}
          getUserInfo={this.props.getUserInfo}
          vertical={vertical}
          editingCommunity={this.props.editingCommunity}
          //
          openWhen={openWhen}
          postHeight={postHeight}
          height={height}
          width={width}
          users={users}
          user={this.props.user}
          auth={auth}
          commdocs={this.state.commdocs}
          //
          photoThumbnail={this.state.photoThumbnail}
          photoSrc={this.state.photoSrc}
          contents={this.state.contents}
          showpicker2={this.props.showpicker2}
          clearFiles={this.props.clearFilesPreparedToSend}
          filePreparedToSend={this.props.filePreparedToSend}
          s={this.props.s}
          community={community}
          picker2={this.props.picker2}
          loadGapiAuth={this.props.loadGapiAuth}
          signIn={this.props.signedIn}
          switchAccount={this.props.switchAccount}
          signOut={this.props.signOut}
          commtype={commtype}
          showDriver={this.state.showDriver}
          closeDriver={() => this.setState({ showDriver: false })}
          //
          left={this.state.left}
          //
          openGroupFilter={this.state.openGroupFilter}
          closeGroupFilter={() => this.setState({ openGroupFilter: false })}
          helper={() => this.props.helper()}
        />
        {/*this.props.commtype !== "forms & permits" &&
          this.props.forumOpen &&
          (this.props.drop ? (
            <Link
              to={this.props.statePathname}
              style={{
                backgroundColor: "rgba(20,20,40,.5)",
                display: "flex",
                top: "0px",
                position: "fixed",
                width: "calc(100% - 4px)",
                border: "2px solid",
                height: "100%"
              }}
            />
          ) : (
            <div
              //#333
              onClick={this.props.closeForum}
              style={{
                backgroundColor: "rgba(20,20,40,.5)",
                display: "flex",
                top: "0px",
                position: "fixed",
                width: "calc(100% - 4px)",
                border: "2px solid",
                height: "100%"
              }}
            />
            ))*/}
        <Filters
          collection={collection}
          getUserInfo={this.props.getUserInfo}
          commtype={commtype}
          subForum={subForum}
          globeChosen={this.props.globeChosen}
          issues={this.props.issues}
          city={this.props.city}
          showFilters={showFilters}
          theLotOfPosts={theLotOfPosts}
          isNew={["new", "lesson", "show", "game"].includes(commtype)}
          isBudget={commtype === "budget & proposal"}
          isElection={commtype === "election"}
          isOrdinance={commtype === "ordinance"}
          isCase={commtype === "court case"}
          isClass={commtype === "classes"}
          isDepartment={commtype === "department"}
          isAdmin={isAdmin}
          auth={auth}
          user={this.props.user}
          community={community}
          budgetTyped={this.state.budgetTyped}
          ordinanceTyped={this.state.ordinanceTyped}
          caseTyped={this.state.caseTyped}
          classTyped={this.state.classTyped}
          departmentTyped={this.state.departmentTyped}
          electionTyped={this.state.electionTyped}
          forumTyped={this.state.forumTyped}
          //
          openForum={() => this.setState({ forumTyper: true })}
          openElections={() => this.setState({ electionTyper: true })}
          openDepartments={() => this.setState({ departmentTyper: true })}
          openClasses={() => this.setState({ classTyper: true })}
          openCases={() => this.setState({ caseTyper: true })}
          openOrdinances={() => this.setState({ ordinanceTyper: true })}
          openBudget={() => this.setState({ budgetTyper: true })}
          //
          budgetTyper={this.state.budgetTyper}
          ordinanceTyper={this.state.ordinanceTyper}
          caseTyper={this.state.caseTyper}
          classTyper={this.state.classTyper}
          departmentTyper={this.state.departmentTyper}
          electionTyper={this.state.electionTyper}
          forumTyper={this.state.forumTyper}
          //
          chooseB={(parent) =>
            this.setState({ budgetTyped: parent, budgetTyper: false })
          }
          chooseO={(parent) =>
            this.setState({
              ordinanceTyped: parent,
              ordinanceTyper: false
            })
          }
          chooseCase={(parent) =>
            this.setState({ caseTyped: parent, caseTyper: false })
          }
          chooseC={(parent) =>
            this.setState({ classTyped: parent, classTyper: false })
          }
          chooseD={(parent) =>
            this.setState({
              departmentTyped: parent,
              departmentTyper: false
            })
          }
          chooseE={(parent) =>
            this.setState({ electionTyped: parent, electionTyper: false })
          }
          chooseF={(parent) =>
            this.setState({ forumTyped: parent, forumTyper: false })
          }
          width={width}
          //
          bigClose={this.bigClose}
        />
        {/*this.props.isProfile && false && (
          <PersonHeader
            togglePaw={
              swipe === "forum"
                ? () => this.setState({ swipe: "home" })
                : swipe === "paw"
                ? () => this.setState({ swipe: "forum" })
                : () => this.setState({ swipe: "paw" })
            }
            swipe={swipe}
            community={this.state.community}
            city={this.state.city}
            columncount={columncount}
            myCommunities={this.props.myCommunities}
            headerScrolling={this.state.headerScrolling}
            thechats={thechats}
            auth={auth}
            profile={profile}
            user={this.props.user}
          />
          )*/}
      </div>
    );
  }
}

Napkin.propTypes = {
  date: PropTypes.instanceOf(Date),
  onDateChanged: PropTypes.func
};

export default Napkin;
