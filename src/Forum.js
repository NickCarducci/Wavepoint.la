import React from "react";
import { withRouter } from "react-router-dom";
import { stateCity, statesForBillsOfOpenStates } from "./widgets/arraystrings";
import firebase from "./init-firebase.js";
import Topsort from "./components/Forum/Topsort";
import AddMemberMaker from "./components/Forum/Owner/AddMemberMaker.js";
import AddRep from "./components/Forum/Owner/AddRep.js";
import AddJudge from "./components/Forum/Owner/AddJudge.js";
import Addteach from "./components/Forum/Owner/Addteach";
import Addtiles from "./components/Forum/Owner/Addtiles";
import Addforum from "./components/Forum/Owner/Addforum";
import SearchSettings from "./components/Forum/Owner/SearchSettings";
import Addmembers from "./components/Forum/Owner/Addmembers";
import ForumPagination from "./components/Forum/ForumPagination";
import Card from "./components/Forum/Card";
import Addself from "./components/Forum/Addself.js";
import NewItem from "./components/Forum/New/NewItem";
import NewClass from "./components/Forum/New/NewClass";
import Addadmin from "./components/Forum/Owner/Addadmin";
import UpdateProfilePicture from "./components/Forum/Owner/UpdateProfilePicture";
import USBudget from "./components/Forum/Tools/USBudget.js";
import Nav from "./components/Forum/Person/Nav.js";
import Accolades from "./components/Forum/Person/Accolades.js";
import ListEvents from "./components/Forum/Person/ListEvents.js";
import Entities from "./components/Forum/Person/Entities.js";

export const RegisterCurseWords = (mT, isGood) => {
  var curses = ["bitch", "cunt", "pussy", "pussies", "fuck", "shit"];
  if (isGood) {
    return mT;
  } else {
    const newerText = (curse, index) => {
      var hyphen = "-";
      for (let x = 0; x < curse.length - 1; x++) {
        hyphen = hyphen + "-";
      }
      return mT.replace(mT.substring(index, index + curse.length), hyphen);
    };
    var set = curses.map((c) => {
      var index = 0;
      if (mT.toLowerCase().includes(c)) {
        var curses = [];
        mT.split(/\W+/).map(
          (cc) => cc.toLowerCase().includes(c) && curses.push(cc)
        );
        var set = curses.map((curse) => {
          index = mT.lastIndexOf(curse);
          return (mT = newerText(curse, index));
        });
        return set[set.length - 1];
      } else return mT;
    });
    return set[set.length - 1];
  }
};
class Forum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      int: 3,
      opened: "",
      openChain: "",
      filterChain: "",
      swipe: "forum",
      lastForumOpen: undefined,
      post: "",
      deletedEvts: [],
      clubs: [],
      deletedClbs: [],
      jobs: [],
      deletedJobs: [],
      collection: "",
      events: [],
      lessonsGamesShows: [],
      chosenForum: [
        "new",
        "lessons",
        "shows",
        "games",
        "budget",
        "cases",
        "elections",
        "ordinances"
      ],
      community: { message: "" },
      city: "",
      billPagination: 1,
      bills: [],
      commdocs: [],
      users: [],
      heights: [],
      left: "0",
      s: "",
      filesPreparedToSend: [],
      userQuery: "",
      openGroupFilter: false,
      postHeight: 0,
      user: { username: "" },
      openPagination: false,
      deletedForumPosts: []
    };
    this.stinker = React.createRef();
    for (let i = 0; i < 14; i++) {
      this[i] = React.createRef();
    }
  }

  getUsers = () => {
    firebase
      .firestore()
      .collection("users")
      .orderBy("createdAt")
      .limit(10)
      .onSnapshot(
        (querySnapshot) => {
          let usersInitial = [];
          let p = 0;
          querySnapshot.docs.forEach((doc) => {
            p++;
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              usersInitial.push(foo);
            }
          });
          if (
            querySnapshot.docs.length === p &&
            this.state.usersInitial !== usersInitial
          ) {
            this.setState({ usersInitial });
            this.handleUserSources(usersInitial);
          }
        },
        (e) => console.log(e.message)
      );
  };
  handleUserSources = (usersInitial) => {
    var usersInState = this.state.users.filter(
      (user) => !usersInitial.find((parent) => parent.id === user.id)
    );
    this.setState({ users: [...usersInState, ...usersInitial] });
  };

  queryUsers = (query) => {
    firebase
      .firestore()
      .collection("users")
      .where("usernameAsArray", "array-contains", query)
      .onSnapshot((querySnapshot) => {
        let users = [];
        let p = 0;
        querySnapshot.docs.forEach((doc) => {
          p++;
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            users.push(foo);
          }
        });
        if (querySnapshot.docs.length === p && this.state.users !== users) {
          firebase
            .firestore()
            .collection("users")
            .where("nameAsArray", "array-contains", query)
            .onSnapshot((querySnapshot) => {
              let users = [];
              let p = 0;
              querySnapshot.docs.forEach((doc) => {
                p++;
                if (doc.exists) {
                  var foo = doc.data();
                  foo.id = doc.id;
                  users.push(foo);
                }
              });
              if (
                querySnapshot.docs.length === p &&
                this.state.users !== users
              ) {
                var usersInState = this.state.users.filter(
                  (user) => !users.find((parent) => parent.id === user.id)
                );
                this.setState({ users: [...usersInState, ...users] });
              }
            });
        }
      });
  };
  componentDidUpdate = (prevProps) => {
    const { loadingMessage } = this.props;
    if (loadingMessage !== prevProps.loadingMessage) {
      var gotComments = loadingMessage.startsWith("getting posts");
      var gotEntities = loadingMessage.startsWith("getting comments");
      console.log(loadingMessage);
      this.setState({
        swipe: gotEntities ? "forum" : gotComments ? "comments" : "home"
      });
    }
    if (this.props.isProfile !== prevProps.isProfile) {
      this.setState({ filterChain: "", openChain: "", opening: "" });
    }

    if (this.props.users !== prevProps.users) {
      var users = this.props.users.filter(
        (user) => !prevProps.users.find((parent) => parent.id === user.id)
      );
      this.setState({ users: [...this.state.users, ...users] });
      this.getUsers();
    }
    if (this.props.community && this.props.community !== prevProps.community) {
      this.getBills();
    }
    if (
      this.props.scrolling !== prevProps.scrolling &&
      this.props.scrolling &&
      this.state.opening !== ""
    )
      this.setState({ opening: "" });
  };
  getBills = (billSubject, pagination) => {
    if (statesForBillsOfOpenStates.includes(this.props.community.message)) {
      var subjectOrNot = null;
      if (billSubject) {
        subjectOrNot = "&subject=" + billSubject;
        this.setState({ billSubject });
      }
      /*const nj = {
        id: "ocd-jurisdiction/country:us/state:nj/government",
        name: "New Jersey",
        classification: "state",
        division_id: "ocd-division/country:us/state:nj",
        url: "http://www.njleg.state.nj.us/"
      };*/
      var stateSet = stateCity.find(
        (x) => x.name === this.props.community.message
      );
      if (pagination === "last") {
        this.setState({ billPagination: this.state.billPagination + 1 });
      } else if (pagination === "undo") {
        this.setState({ billPagination: this.state.billPagination + 1 });
      } else {
        this.state.billPagination !== 1 && this.setState({ billPagination: 1 });
      }
      const openStatesURL =
        `https://v3.openstates.org/bills` +
        `?jurisdiction=ocd-jurisdiction/country:us/state:${stateSet.abbreviation.toLowerCase()}/government` +
        `${subjectOrNot ? subjectOrNot : ""}&sort=latest_action_asc&page=${
          this.state.billPagination +
          (pagination === "last" ? 1 : pagination === "last" ? -1 : 0)
        }&per_page=10` +
        /*`&session=2021&chamber=Senate&updated_since=${"2020-12-01"}`+
        `&sort=latest_action_desc&page=1&per_page=10` +*/
        `&include=abstracts&apikey=f6d51945-d31e-47f6-8e4b-13f8348d5b4a`;

      fetch(openStatesURL)
        .then(async (res) => await res.json())
        .then((result) => {
          var bills = result.results;

          this.setState({ bills });
        })
        .catch((err) => console.log(err.message));
    }
  };
  onTouchEndForum = (e) => {
    if (!this.state.editingSomeText) {
      if (
        this.state.left > window.innerWidth * 0.8 &&
        this.props.forumOpen &&
        this.state.startTouch
      ) {
        this.setState({
          startTouch: false
        });
        e.target.scrollTo(0, 0);
        this.props.closeForum();

        this.endTouch = setTimeout(
          () =>
            this.setState({
              left: 0
            }),
          50
        );
      } else
        this.setState({
          startTouch: false,
          left: 0
        });
    }
  };
  onDragEndForum = (e) => {
    if (!this.state.editingSomeText) {
      var left = e.pageX;
      if (
        left > window.innerWidth * 0.8 &&
        this.props.forumOpen &&
        this.state.startDrag
      ) {
        this.setState({
          startDrag: false
        });
        e.target.scrollTo(0, 0);
        this.props.closeForum();
        this.endTouch = setTimeout(
          () =>
            this.setState({
              left: 0
            }),
          50
        );
      } else
        this.setState({
          startDrag: false,
          left: 0
        });
    }
  };
  onDragForum = (e) => {
    if (!this.state.editingSomeText) {
      var left = e.pageX;
      if (
        (e.target.offsetLeft === 0 && left && left < 100) ||
        this.state.startDrag
      ) {
        !this.state.startDrag && this.setState({ startDrag: true });
        left !== this.state.left &&
          Math.abs(left - this.state.left) > 2 &&
          this.setState({ left });
      }
    }
  };
  onTouchMoveForum = (e) => {
    if (!this.state.editingSomeText) {
      var left = e.touches[0].clientX;
      if (
        (e.target.offsetLeft === 0 && left && left < 100) ||
        this.state.startTouch
      ) {
        !this.state.startTouch && this.setState({ startTouch: true });
        left !== this.state.left &&
          Math.abs(left - this.state.left) > 2 &&
          this.setState({ left });
      }
    }
  };
  componentDidMount = () => {
    this.props.community && this.getBills();
  };
  scrollBackToTheLeft = () => {
    window.scrollTo(0, 0);
    /*if (this.props.columncount > 1) {
      this.stinker &&
        this.stinker.current.scroll({ left: 0, behavior: "smooth" });
    } else {
      this.stinker && this.stinker.current.scrollIntoView("smooth");
    }*/
    // forum.scrollLeft = forum.offsetLeft;
  };
  render() {
    const {
      highAndTight,
      notes,
      comments,
      vertical,
      commtype,
      subForum,
      auth,
      community,
      height,
      postHeight,
      person,
      forumPosts,
      profileEntities,
      displayPreferences,
      ownerOpen,
      //isMember,
      //isMemberMaker
      isFaculty,
      canMember,
      isAdmin,
      isAdminOrFaculty,
      permitted,
      isAuthor,
      collection,
      typeOrder,
      budgetTyped,
      ordinanceTyped,
      classTyped,
      caseTyped,
      departmentTyped,
      electionTyped,
      forumTyped
    } = this.props;
    let noteList = [];
    let noteTitles = [];
    notes &&
      notes.map((x) => {
        noteTitles.push(x.message);
        return noteList.push(x._id);
      });
    const { backgroundColor } = displayPreferences;
    const { swipe, chosenForum, deletedForumPosts } = this.state;
    const {
      profile,
      lastComments,
      undoComments,
      lastPostOfComment,
      undoPostOfComment,
      lastPosts,
      lastPost,
      undoPosts,
      undoPost
    } = person;
    const {
      profileEvents,
      profileJobs,
      profileClubs,
      profileServices,
      profileClasses,
      profileDepartments,
      profileRestaurants,
      profileShops,
      profilePages,
      profileVenues,
      profileHousing
    } = profileEntities;
    var experiences = profile && profile.experiences ? profile.experiences : [];
    var education = profile && profile.education ? profile.education : [];
    var hobbies = profile && profile.hobbies ? profile.hobbies : [];
    //var hide = !this.state.mounted || this.state.closing;
    var selection = [
      "new",
      "lessons",
      "shows",
      "games",
      "budget",
      "cases",
      "elections",
      "ordinances"
    ];
    const hasSome = (chosenForum) =>
      chosenForum === "budget"
        ? forumPosts.find((x) =>
            ["budget", "oldBudget"].includes(x.collection)
          ) && true
        : ["new", "lessons", "games", "shows"].includes(chosenForum)
        ? forumPosts.find(
            (x) => "forum" === x.collection && chosenForum === x.newLessonShow
          ) && true
        : chosenForum === "cases"
        ? forumPosts.find((x) =>
            ["court cases", "oldCases"].includes(x.collection)
          ) && true
          ? chosenForum === "ordinances"
          : forumPosts.find((x) => "ordinances" === x.collection) && true
        : chosenForum === "elections"
        ? forumPosts.find((x) =>
            ["elections", "oldElections"].includes(x.collection)
          ) && true
        : null;

    var filterUnspecified =
      budgetTyped === "" &&
      ordinanceTyped === "" &&
      classTyped === "" &&
      caseTyped === "" &&
      departmentTyped === "" &&
      electionTyped === "" &&
      forumTyped === "";
    var collectionUnspecified = this.state.collection === "";
    var undoCommPost = swipe === "comments" ? lastPostOfComment : lastPost;
    var lastCommPost = swipe === "comments" ? undoPostOfComment : undoPost;
    //end profile(person) stuff
    var editingEnabled =
      !this.props.globeChosen &&
      !subForum &&
      this.props.editingCommunity &&
      commtype === "new";
    let allposters = [];
    comments &&
      comments.map(
        (c) => !allposters.includes(c.authorId) && allposters.push(c.authorId)
      );
    var width = vertical ? this.props.width - 56 : this.props.width;
    const max = 450;
    var columncount =
      this.state.listplz || width < max
        ? 1
        : width < max + 450
        ? 2
        : width < max + 900
        ? 3
        : width < max + 1350
        ? 4
        : 1;

    var cards = this.props.drop
      ? [this.props.drop]
      : this.props.globeChosen
      ? this.props.globalForumPosts
      : subForum
      ? this.props.subForumPosts
      : commtype === "bills"
      ? this.state.bills
      : commtype === "budget & proposal" && this.props.openWhen === "expired"
      ? this.props.oldBudget
      : commtype === "election" && this.props.openWhen === "expired"
      ? this.props.oldElections
      : commtype === "court case" && this.props.openWhen === "expired"
      ? this.props.oldCases
      : commtype === "classes" && this.props.openWhen === "expired"
      ? this.props.oldClasses
      : forumPosts;
    let res = {};
    for (let i = 0; i < 14; i++) {
      res[i] = (i / 14) * 0.3;
    }
    var firstPostPerAuthor = [];
    var postPerAuthor = [];
    let posts = {};
    if (!["department", "classes", "oldClasses"].includes(commtype)) {
      cards.map((x) => {
        const chainId = this.props.isProfile
          ? x.community
            ? x.community.message
            : x.city
          : x.author
          ? x.author.username
          : x.authorId;
        const filter =
          this.state.filterChain === "" || this.state.filterChain === chainId;
        if (
          !deletedForumPosts.includes(x.id) &&
          filter &&
          (this.state.openChain === "" || this.state.openChain === chainId)
        ) {
          if (!posts[chainId]) posts[chainId] = [];
          return posts[chainId].push(x);
        } else return null;
      });
      Object.values(posts).map((x) => {
        postPerAuthor.push(x[0]);
        return firstPostPerAuthor.push(x[0].id);
      });
    }
    var nothing = !permitted ? null : cards.length === 0;

    const scrollTop =
      this.stinker &&
      this.stinker.current &&
      this.stinker.current.scrollTop > 150;

    var lastComm = this.props.isProfile
      ? lastCommPost
      : this.props.globeChosen
      ? this.props.lastGlobalPost
      : community
      ? this.props.lastCommPost
      : this.props.lastCityPost;

    var undoComm = this.props.isProfile
      ? undoCommPost
      : this.props.globeChosen
      ? this.props.undoGlobalPost
      : community
      ? this.props.undoCommPost
      : this.props.undoCityPost;

    //
    var late = this.props.isProfile
      ? swipe === "comments"
        ? lastComments
        : this.state.entityId
        ? this.props.lastPostsAs
        : lastPosts
      : this.props.globeChosen
      ? this.props.lastGlobalForum
      : commtype === "bills" && community
      ? () => this.getBills(this.state.billSubject, "last")
      : community
      ? this.props.lastCommForum
      : this.props.lastCityForum;

    var back = this.props.isProfile
      ? !lastCommPost
        ? () => window.alert("no more")
        : swipe === "comments"
        ? undoComments
        : this.state.entityId
        ? this.props.undoPostsAs
        : undoPosts
      : this.props.globeChosen
      ? this.props.undoGlobalForum
      : commtype === "bills" && community
      ? () => this.getBills(this.state.billSubject, "undo")
      : community
      ? this.props.undoCommForum
      : this.props.undoCityForum;

    var forum =
      //filter on ? filter for
      this.props.globeChosen
        ? this.props.globalForumPosts
        : subForum || commtype === "classes" || commtype === "department"
        ? []
        : commtype === "budget & proposal" && this.props.openWhen === "expired"
        ? this.props.oldBudget
        : commtype === "election" && this.props.openWhen === "expired"
        ? this.props.oldElections
        : commtype === "court case" && this.props.openWhen === "expired"
        ? this.props.oldCases
        : forumPosts;
    const bubbleStyle = {
      transition: ".3s ease-in",
      display: "flex",
      borderRadius: "50px",
      border: "1px solid black",
      position: "absolute"
    };
    return (
      <div
        ref={this.stinker}
        draggable="true"
        onDrag={this.onDragForum}
        onTouchMove={this.onTouchMoveForum}
        onDragEnd={this.onDragEndForum}
        onTouchEnd={this.onTouchEndForum}
        style={{
          backgroundColor: "rgba(0,0,0,.3)",
          position: "relative",
          transition: `1s ease-in-out`,
          left: `${this.state.left + (vertical ? 56 : 0)}px`,
          top: this.props.editingCommunity ? "56px" : "0px",
          maxWidth: this.props.drop ? "500px" : "",
          width: vertical ? `calc(100% - 56px)` : "100%",
          columnCount: this.props.drop ? 1 : columncount,
          columnGap: "2px"
        }}
      >
        <div
          style={{
            height: "max-content",
            width: "calc(100% - 4px)",
            border: "2px solid",
            breakInside: "avoid"
          }}
        >
          {this.props.isProfile ? (
            <Nav
              city={this.props.city}
              statePathname={this.props.statePathname}
              profile={profile}
              swipe={swipe}
              setSwipe={(parent) =>
                this.setState(
                  this.state.filterChain !== "" && this.state.openChain !== ""
                    ? { ...parent, filterChain: "", openChain: "" }
                    : parent
                )
              }
              width={this.props.width}
            />
          ) : (
            <Topsort
              setFoundation={this.props.setFoundation}
              unreadChatsCount={this.props.unreadChatsCount}
              notes={this.props.notes}
              typeOrder={typeOrder}
              tileChosen={this.props.tileChosen}
              commtype={commtype}
              subForum={subForum}
              type={this.props.type}
              togglePagination={() =>
                this.setState({
                  openPagination: !this.state.openPagination
                })
              }
              backgroundColor={backgroundColor}
              triggerNew={this.props.triggerNew}
              forumOpen={this.props.forumOpen}
              newforum={this.props.newforum}
              createSliderOpener={this.props.createSliderOpener}
              highAndTight={highAndTight}
              openWhen={this.props.openWhen}
              editingSomeText={this.state.editingSomeText}
              columncount={columncount}
              postHeight={postHeight}
              chosenPostId={this.state.chosenPostId}
              switchCMapOpener={this.props.switchCMapOpener}
              profileTileChosen={this.props.profileTileChosen}
              eventTypes={this.props.eventTypes}
              openForum={this.props.openForum}
              openElections={this.props.openElections}
              openDepartments={this.props.openDepartments}
              openClasses={this.props.openClasses}
              openCases={this.props.openCases}
              openOrdinances={this.props.openOrdinances}
              openBudget={this.props.openBudget}
              //
              budgetTyped={this.props.budgetTyped}
              ordinanceTyped={this.props.ordinanceTyped}
              caseTyped={this.props.caseTyped}
              classTyped={this.props.classTyped}
              departmentTyped={this.props.departmentTyped}
              electionTyped={this.props.electionTyped}
              forumTyped={this.props.forumTyped}
              //
              openFilters={this.props.openFilters}
              showFilters={this.props.showFilters}
              openCommunityAdmin={this.props.openCommunityAdmin}
              city={this.props.city}
              auth={auth}
              followingMe={this.props.followingMe}
              width={width}
              listplz={this.state.listplz}
              listplzToggle={this.props.listplzToggle}
              user={this.props.user}
              openGroup={() => this.setState({ openGroupFilter: true })}
              community={community}
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
              chooseGlobe={this.props.chooseGlobe}
              globeChosen={this.props.globeChosen}
            />
          )}
        </div>
        {/*notes && (
          <Calendar
            noteList={noteList}
            noteTitles={noteTitles}
            notes={notes}
            invites={this.props.invites}
            selfvites={this.props.selfvites}
            user={this.props.user}
            auth={this.props.auth}
            queriedDate={this.props.queriedDate}
            events={this.props.events}
            foundEntity={this.props.foundEntity}
            recipients={this.props.recipients}
            //calendarInitial={true}
            monthCalOpen={this.props.monthCalOpen}
            dayCalOpener={this.props.dayCalOpener}
            monthCalOpener={this.props.monthCalOpener}
            monthCalCloser={this.props.monthCalCloser}
            chats={this.props.chats}
            hiddenMsgs={this.props.hiddenMsgs}
            deletedMsgs={this.props.deletedMsgs}
            onDelete={this.props.onDelete}
            handleSave={this.props.handleSave}
            chooseInvite={this.props.chooseInvite}
            achatwasopen={this.props.achatwasopen}
            recentchatswasopen={this.props.recentchatswasopen}
            chatsopen={this.props.chatsopen}
            nochatopen={this.props.nochatopen}
          />
        )*/}
        <div
          style={{
            breakInside: "avoid",
            height: "max-content",
            width: "calc(100% - 4px)",
            border: "2px solid"
          }}
        >
          {this.props.community &&
            this.props.community.message === "United States of America" && (
              <USBudget width={this.props.width / columncount} />
            )}
        </div>
        <div
          style={{
            breakInside: "avoid",
            width: "calc(100% - 4px)",
            border: "2px solid",
            height: swipe === "paw" ? "min-content" : "0%",
            backgroundColor: "rgb(230,230,230)"
          }}
        >
          {this.props.isProfile &&
            [
              {
                name: "lessons, games or shows",
                events: this.state.lessonsGamesShows
              },
              { name: "events", events: this.state.events }
            ].map((x, i) => (
              <ListEvents
                key={i}
                events={x.events}
                swipe={swipe}
                name={x.name}
              />
            ))}
        </div>
        <div
          style={{
            breakInside: "avoid",
            height: "max-content",
            width: "calc(100% - 4px)",
            border: "2px solid"
          }}
        >
          {this.props.isProfile && (
            <Entities //["home"].includes(swipe)
              profile={profile}
              swipe={swipe}
              setProfileTile={(parent) => this.setState(parent)}
              profileTileChosen={this.state.profileTileChosen}
              deletedEvts={this.state.deletedEvts}
              auth={this.props.auth}
              profileEvents={profileEvents}
              profileClubs={profileClubs}
              profileShops={profileShops}
              profileRestaurants={profileRestaurants}
              profileServices={profileServices}
              profileJobs={profileJobs}
              profileHousing={profileHousing}
              profilePages={profilePages}
              profileVenues={profileVenues}
              profileDepartments={profileDepartments}
              profileClasses={profileClasses}
              communities={this.props.communities}
            />
          )}
        </div>
        <div
          style={{
            breakInside: "avoid",
            height: "max-content",
            width: "calc(100% - 4px)",
            border: "2px solid"
          }}
        >
          {this.props.isProfile && (
            <Accolades //["home"].includes(swipe)
              swipe={swipe}
              experiences={experiences}
              hobbies={hobbies}
              education={education}
            />
          )}
        </div>
        <div
          style={{
            breakInside: "avoid",
            height: "max-content",
            width: "calc(100% - 4px)",
            border: "2px solid"
          }}
        >
          <ForumPagination
            show={
              this.props.openPagination &&
              !this.props.editingCommunity &&
              !subForum &&
              postHeight === 0 &&
              !["department", "ordinance", "forms & permits"].includes(
                commtype
              ) &&
              !this.props.chatsopen
            }
            openPagination={
              this.props.isProfile ? true : this.state.openPagination
            }
            swipe={swipe}
            findPost={this.props.findPost}
            editing={this.props.editing}
            clearBillSubject={() =>
              this.setState({ billSubject: null, billPagination: 1 }, () =>
                this.getBills()
              )
            }
            billSubject={this.state.billSubject}
            getBills={this.getBills}
            bills={this.state.bills}
            commtype={commtype}
            auth={this.props.auth}
            toggleEditing={this.props.toggleEditing}
            profile={profile}
            community={this.props.community}
            city={this.props.city}
            //forumPosts={forumPosts}
            profilePosts={this.props.profilePosts}
            setForumDocs={this.props.setForumDocs}
            getDrop={this.props.getDrop}
            getCommunity={this.props.getCommunity}
            hydrateUser={this.props.hydrateUser}
            inTopSort={true}
            editingCommunity={this.props.editingCommunity}
            scrollTop={scrollTop}
            lastCommPost={lastComm}
            undoCommPost={undoComm}
            //
            users={this.props.users}
            late={late}
            back={back}
            forumPosts={forum}
            tagsOpen={this.state.tagsOpen}
            tagResults={this.state.tagResults}
            toggleTags={
              this.state.tagsOpen
                ? () => this.setState({ tagsOpen: false })
                : () => this.setState({ tagsOpen: true })
            }
          />
          {nothing && !editingEnabled && (
            <div
              onClick={this.props.triggerNew}
              style={{
                padding: "4px 0px",
                backgroundColor: "grey",
                color: "white",
                width: "calc(100% - 4px)",
                border: "2px solid",
                breakInside: "none"
              }}
            >
              <div
                style={{
                  borderRadius: "6px",
                  backgroundColor: "rgb(200,200,200)",
                  padding: "6px",
                  margin: "4px",
                  fontSize: "15px"
                }}
              >
                nothing
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            breakInside: "avoid",
            height: "max-content",
            width: "calc(100% - 4px)",
            border: "2px solid"
          }}
        >
          {this.props.isProfile && (
            <div
              onClick={(e) => {
                var sel = e.target.id;
                if (chosenForum.includes(sel)) {
                  var foo = chosenForum.filter((x) => x !== sel);
                  this.props.setProfileBias({ chosenForum: foo });
                } else {
                  this.props.setProfileBias({
                    chosenForum: [...foo, sel]
                  });
                }
              }}
              style={{
                padding: "5px 0px",
                flexWrap: "wrap",
                display: "flex",
                width: "calc(100% - 4px)",
                border: "2px solid",
                height: "min-content",
                backgroundColor: "rgb(20,20,25)"
              }}
            >
              {selection.map((parent) => (
                <div
                  style={{
                    color: "white",
                    textDecoration:
                      chosenForum.includes(parent) && hasSome(parent)
                        ? "underline"
                        : "none",
                    padding: "5px 10px"
                  }}
                  id={parent}
                  key={parent}
                >
                  {parent}
                </div>
              ))}
            </div>
          )}
        </div>
        {ownerOpen && (
          <UpdateProfilePicture
            editingSomeText={this.state.editingSomeText}
            columncount={columncount}
            postHeight={postHeight}
            chosenPostId={this.state.chosenPostId}
            community={community}
            helper={() => this.props.helper()}
            showpicker2={this.props.showpicker2}
            clearFiles={this.props.clearFiles}
            filePreparedToSend={this.props.filePreparedToSend}
            addPic={this.props.addPic}
            remindPic={this.state.remindPic}
            openDescript={this.state.openDescript}
            contents={this.state.contents}
            s={this.props.s}
            loadGapiAuth={this.props.loadGapiAuth}
          />
        )}

        {ownerOpen && (
          <div
            onClick={() => this.setState({ locOpen: !this.state.locOpen })}
            style={{
              color: "grey",
              width: "calc(100% - 4px)",
              padding: "10px 0px",
              boxShadow: "6px 3px 50px #222",
              backgroundColor: "rgb(200,200,200)",
              borderBottom: "1px solid grey",
              border: "2px solid",
              position: "relative",
              flexDirection: "column",
              maxHeight: columncount === 1 || postHeight > 0 ? "" : "100%",
              overflowX: "hidden",
              overflowY: columncount === 1 ? "hidden" : "auto",
              userSelect: this.state.editingSomeText ? "none" : "",
              display: this.props.editingCommunity ? "flex" : "none"
            }}
          >
            <div
              style={{
                userSelect: this.props.editingCommunity ? "none" : "",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                height: "min-content",
                width: "calc(100% - 4px)",
                border: "2px solid",
                breakInside: "avoid"
              }}
            >
              {community.place_name}
              <br />
              {community.center && community.center[0]}
              &nbsp;
              {community.center && community.center[1]}
            </div>
          </div>
        )}
        {ownerOpen && <SearchSettings community={community} />}
        {ownerOpen && (
          <Addadmin
            editingSomeText={this.state.editingSomeText}
            columncount={columncount}
            postHeight={postHeight}
            chosenPostId={this.state.chosenPostId}
            editingCommunity={this.props.editingCommunity}
            user={this.props.user}
            users={this.props.users}
            community={community}
            auth={auth}
            queryText={(parent) => this.setState(parent)}
            userQuery={this.state.userQuery}
            resetUsers={() => this.handleUserSources(this.state.usersInitial)}
          />
        )}
        {editingEnabled &&
          this.props.editingCommunity &&
          (isAdmin || canMember) && (
            <Addmembers
              editingSomeText={this.state.editingSomeText}
              columncount={columncount}
              postHeight={postHeight}
              chosenPostId={this.state.chosenPostId}
              editingCommunity={this.props.editingCommunity}
              user={this.props.user}
              users={this.props.users}
              community={community}
              auth={auth}
              queryText={(parent) => this.setState(parent)}
              userQuery={this.state.userQuery}
              resetUsers={() => this.handleUserSources(this.state.usersInitial)}
            />
          )}
        {editingEnabled &&
          this.props.editingCommunity &&
          (isAdmin || canMember) && (
            <div
              style={{
                backgroundColor: "rgb(170,170,130)",
                userSelect: this.state.editingSomeText ? "none" : "",
                breakInside: "avoid",
                zIndex: 6,
                width: "calc(100% - 4px)",
                border: "2px solid",
                maxHeight: columncount === 1 || postHeight > 0 ? "" : "100%",
                height: `max-content`,
                position: "relative",
                display: "flex",
                color: "black",
                flexDirection: "column",
                borderBottom: "1px solid grey",
                overflowX: "hidden",
                overflowY: columncount === 1 ? "hidden" : "auto"
              }}
            >
              <div
                style={{
                  userSelect: this.props.editingCommunity ? "none" : "",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  height: "min-content",
                  width: "calc(100% - 4px)",
                  border: "2px solid",
                  breakInside: "avoid"
                }}
              >
                <div
                  onClick={() =>
                    firebase
                      .firestore()
                      .collection("communities")
                      .doc(community.id)
                      .update({
                        privateToMembers: !community.privateToMembers
                      })
                      .catch((err) => console.log(err.message))
                  }
                  style={{
                    height: "min-content",
                    padding: "10px 0px",
                    margin: "0px 10px",
                    display: "flex",
                    position: "relative"
                  }}
                >
                  <div
                    style={{
                      ...bubbleStyle,
                      height: "22px",
                      width: "46px",
                      right: "30px",
                      backgroundColor: community.privateToMembers ? "" : "blue"
                    }}
                  />
                  <div
                    style={{
                      ...bubbleStyle,
                      height: "16px",
                      width: "16px",
                      right: "50px",
                      backgroundColor: community.privateToMembers
                        ? ""
                        : "lightblue"
                    }}
                  />
                  <div
                    style={{
                      minHeight: "min-content"
                    }}
                  >
                    {community.privateToMembers
                      ? `private to members`
                      : "public forum tiles"}
                    <div
                      style={{
                        minHeight: "min-content",
                        fontSize: "12px"
                      }}
                    >
                      {community.privateToMembers
                        ? ` only members can see `
                        : " everyone can see "}
                      & post
                    </div>
                  </div>
                </div>
                <div
                  onClick={() =>
                    firebase
                      .firestore()
                      .collection("communities")
                      .doc(community.id)
                      .update({
                        privateVoting: !community.privateVoting
                      })
                      .catch((err) => console.log(err.message))
                  }
                  style={{
                    opacity: "0",
                    zIndex: !community.privateToMembers ? "" : "-9999",
                    height: !community.privateToMembers ? "min-conte" : "0px",
                    padding: "10px 0px",
                    margin: "0px 10px",
                    display: "flex",
                    position: "relative",
                    transition: ".3s ease-out"
                  }}
                >
                  <div
                    style={{
                      ...bubbleStyle,
                      height: "22px",
                      width: "46px",
                      right: "30px",
                      backgroundColor: community.privateVoting ? "" : "green"
                    }}
                  />
                  <div
                    style={{
                      ...bubbleStyle,
                      transform: "translate(-3px,3px)",
                      height: "16px",
                      width: "16px",
                      right: "50px",
                      backgroundColor: community.privateVoting
                        ? ""
                        : "lightgreen"
                    }}
                  />
                  <div
                    style={{
                      minHeight: "min-content"
                    }}
                  >
                    {community.privateVoting
                      ? `private voting`
                      : "public voting"}
                    <div
                      style={{
                        minHeight: "min-content",
                        fontSize: "12px"
                      }}
                    >
                      {community.privateVoting ? `only members ` : "everyone "}
                      can vote
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        {!this.props.globeChosen &&
          !subForum &&
          isAdmin &&
          commtype === "new" && (
            <Addteach
              queryText={(parent) => this.setState(parent)}
              userQuery={this.state.userQuery}
              users={this.state.users}
              resetUsers={() => this.handleUserSources(this.state.usersInitial)}
              editingSomeText={this.state.editingSomeText}
              columncount={columncount}
              postHeight={postHeight}
              chosenPostId={this.state.chosenPostId}
              editingCommunity={this.props.editingCommunity}
              user={this.props.user}
              community={community}
              auth={auth}
            />
          )}
        {!this.props.globeChosen &&
          !subForum &&
          isAdmin &&
          commtype === "new" &&
          this.props.editingCommunity && (
            <div
              onClick={() =>
                firebase
                  .firestore()
                  .collection("communities")
                  .doc(community.id)
                  .update({ facultyCanMember: !community.facultyCanMember })
              }
              style={{
                padding: "10px",
                backgroundColor: !community.facultyCanMember
                  ? "rgb(0,40,0)"
                  : "rgb(120,120,190)"
              }}
            >
              <div
                style={{
                  color: community.facultyCanMember
                    ? "rgb(0,40,0)"
                    : "rgb(200,200,200)",
                  fontSize: "16px",
                  padding: "10px",
                  margin: "10px",
                  transition: ".3s ease-in",
                  backgroundColor: community.facultyCanMember ? "white" : "",
                  borderRadius: "30px",
                  textDecoration: community.facultyCanMember
                    ? ""
                    : "line-through"
                }}
              >
                Faculty can add/remove members
              </div>
              <div
                style={{
                  fontSize: "16px",
                  margin: "10px",
                  transition: ".3s ease-in",
                  textDecoration: !community.facultyCanMember
                    ? "underline"
                    : "line-through",
                  color: !community.facultyCanMember
                    ? "white"
                    : "rgb(200,200,200)"
                }}
              >
                Only memberMakers, community author and admins can add/remove
                members
              </div>
            </div>
          )}
        {!this.props.globeChosen &&
          !subForum &&
          isAdmin &&
          commtype === "new" && (
            <AddMemberMaker
              queryText={(parent) => this.setState(parent)}
              userQuery={this.state.userQuery}
              users={this.state.users}
              resetUsers={() => this.handleUserSources(this.state.usersInitial)}
              editingSomeText={this.state.editingSomeText}
              columncount={columncount}
              postHeight={postHeight}
              chosenPostId={this.state.chosenPostId}
              editingCommunity={this.props.editingCommunity}
              user={this.props.user}
              community={community}
              auth={auth}
            />
          )}
        {!this.props.globeChosen &&
          !subForum &&
          isAdmin &&
          commtype === "new" && (
            <Addforum
              queryText={(parent) => this.setState(parent)}
              userQuery={this.state.userQuery}
              users={this.state.users}
              resetUsers={() => this.handleUserSources(this.state.usersInitial)}
              editingSomeText={this.state.editingSomeText}
              columncount={columncount}
              postHeight={postHeight}
              chosenPostId={this.state.chosenPostId}
              editingCommunity={this.props.editingCommunity}
              user={this.props.user}
              community={community}
              auth={auth}
            />
          )}
        {!this.props.globeChosen &&
          !subForum &&
          commtype === "new" &&
          isAdmin && (
            <Addtiles
              queryText={(parent) => this.setState(parent)}
              userQuery={this.state.userQuery}
              users={this.state.users}
              resetUsers={() => this.handleUserSources(this.state.usersInitial)}
              editingSomeText={this.state.editingSomeText}
              columncount={columncount}
              postHeight={postHeight}
              chosenPostId={this.state.chosenPostId}
              editingCommunity={this.props.editingCommunity}
              user={this.props.user}
              community={community}
              auth={auth}
            />
          )}
        {!this.props.globeChosen &&
          !subForum &&
          commtype === "new" &&
          isAdmin &&
          community &&
          (!community.blockedForum ||
            (community.blockedForum &&
              !community.blockedForum.includes("court case"))) && (
            <AddJudge
              queryText={(parent) => this.setState(parent)}
              userQuery={this.state.userQuery}
              users={this.state.users}
              resetUsers={() => this.handleUserSources(this.state.usersInitial)}
              editingSomeText={this.state.editingSomeText}
              columncount={columncount}
              postHeight={postHeight}
              chosenPostId={this.state.chosenPostId}
              editingCommunity={this.props.editingCommunity}
              user={this.props.user}
              community={community}
              auth={auth}
            />
          )}
        {!this.props.globeChosen &&
          !subForum &&
          commtype === "new" &&
          isAdmin && (
            <AddRep
              queryText={(parent) => this.setState(parent)}
              userQuery={this.state.userQuery}
              users={this.state.users}
              resetUsers={() => this.handleUserSources(this.state.usersInitial)}
              editingSomeText={this.state.editingSomeText}
              columncount={columncount}
              postHeight={postHeight}
              chosenPostId={this.state.chosenPostId}
              editingCommunity={this.props.editingCommunity}
              user={this.props.user}
              community={community}
              auth={auth}
            />
          )}
        {community
          ? !this.props.globeChosen &&
            community &&
            !isAdmin && (
              <Addself
                editingSomeText={this.state.editingSomeText}
                columncount={columncount}
                postHeight={postHeight}
                chosenPostId={this.state.chosenPostId}
                getUserInfo={this.props.getUserInfo}
                user={this.props.user}
                auth={auth}
                community={community}
              />
            )
          : null}
        {!this.props.globeChosen &&
          !subForum &&
          !["classes", "oldClasses"].includes(collection) &&
          (isAdmin ||
            (isFaculty &&
              ["court cases", "oldCases"].includes(collection))) && (
            <div
              style={{
                userSelect: this.state.editingSomeText ? "none" : "",
                WebkitColumnBreakInside: "avoid",
                pageBreakInside: "avoid",
                breakInside: "avoid",
                zIndex: 6,
                width: "calc(100% - 4px)",
                border: "2px solid",
                maxHeight:
                  columncount === 1 || postHeight > 0 ? "" : "calc(100% - 1px)",
                height: `min-content`,
                position: "relative",
                display: "flex",
                color: "black",
                flexDirection: "column",
                opacity: "1",
                borderBottom: "1px solid grey",
                overflowX: "hidden",
                overflowY: columncount === 1 ? "hidden" : "auto"
              }}
            >
              <NewItem
                editingSomeText={this.state.editingSomeText}
                columncount={columncount}
                postHeight={postHeight}
                chosenPostId={this.state.chosenPostId}
                cards={cards}
                closeNew={this.props.closeNew}
                showNewItem={this.props.showNewItem}
                ordinanceTyped={this.props.ordinanceTyped}
                budgetTyped={this.props.budgetTyped}
                caseTyped={this.props.caseTyped}
                electionTyped={this.props.electionTyped}
                departmentTyped={this.props.departmentTyped}
                classTyped={this.props.classTyped}
                auth={auth}
                preserveAdmin={this.state.preserveAdmin}
                community={community}
                materialDate={this.props.materialDate}
                click1={() => {
                  var parent = null;
                  if (
                    [
                      "classes",
                      "oldClasses",
                      "oldElections",
                      "elections",
                      "oldBudget",
                      "budget & proposals"
                    ].includes(collection)
                  ) {
                    parent = "futureOnly";
                  }
                  this.props.materialDateOpener(parent);
                }}
              />
            </div>
          )}
        {!this.props.globeChosen && !subForum && commtype === "classes" ? (
          isAdmin ? (
            <div
              style={{
                userSelect: this.state.editingSomeText ? "none" : "",
                breakInside: "avoid",
                zIndex: 6,
                width: "calc(100% - 4px)",
                border: "2px solid",
                maxHeight:
                  columncount === 1 || postHeight > 0 ? "" : "calc(100% - 1px)",
                height: `min-content`,
                position: "relative",
                display: "flex",
                color: "black",
                flexDirection: "column",
                opacity: "1",
                borderBottom: "1px solid grey",
                overflowX: "hidden",
                overflowY: columncount === 1 ? "hidden" : "auto"
              }}
            >
              <NewClass
                editingSomeText={this.state.editingSomeText}
                columncount={columncount}
                postHeight={postHeight}
                chosenPostId={this.state.chosenPostId}
                closeNew={this.props.closeNew}
                showNew={this.props.showNew}
                classTyped={this.state.classTyped}
                auth={auth}
                community={community}
                materialDate={this.props.materialDate}
                click1={() => {
                  this.props.materialDateOpener("futureOnly");
                }}
              />
            </div>
          ) : (
            <div />
          )
        ) : null}
        {!this.props.globeChosen && commtype === "budget & proposal" ? (
          !forumPosts ? (
            <div>No upcoming {this.state.openWhat} budget disbursements</div>
          ) : null
        ) : null}
        {community &&
          community.privateToMembers &&
          !(
            community.authorId === auth.uid ||
            community.admin.includes(auth.uid) ||
            community.faculty.includes(auth.uid) ||
            community.members.includes(auth.uid)
          ) && (
            <div
              style={{
                display: "flex",
                //maxWidth: "300px",
                height: "min-content",
                overflow: "hidden",
                zIndex: "9",
                color: "black",
                flexDirection: "column",
                WebkitColumnBreakInside: "avoid",
                pageBreakInside: "avoid",
                breakInside: "avoid",
                opacity: "1",
                backgroundColor: "white"
              }}
            >
              This community is private
              <div
                onClick={() =>
                  firebase
                    .firestore()
                    .collection("communities")
                    .doc(community.id)
                    .update({
                      requestingMembership: firebase.firestore.FieldValue.arrayUnion(
                        auth.uid
                      )
                    })
                }
                style={{
                  height: "min-content",
                  fontSize: "10px",
                  border: "1px solid",
                  width: "min-content",
                  padding: "2px",
                  borderRadius: "3px"
                }}
              >
                Request
              </div>
            </div>
          )}
        {!nothing &&
          Object.values(/*this.state.openChain !== "" ? cards : */ posts).map(
            (parent, i) => {
              var folders = [];
              if (parent.video && !folders.includes(parent.video.folder))
                folders.push(parent.video.folder);

              if (!parent.id) {
                //closeChain
                parent = parent[0];
              }
              if (parent.jurisdiction) {
                return (
                  <div
                    key={parent.identifier + parent.title}
                    style={{
                      padding: "10px",
                      backgroundColor: "white",
                      breakInside: "avoid",
                      width: "calc(100% - 20px)",
                      height: "min-content"
                    }}
                  >
                    <div
                      style={{
                        padding: "0px 10px",
                        paddingBottom: "10px",
                        width: "calc(100% - 20px)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div>{parent.identifier}</div>
                      <div style={{ fontSize: "10px", color: "grey" }}>
                        <div style={{ fontSize: "12px" }}>
                          {Math.round(
                            (new Date().getTime() -
                              new Date(parent.updated_at).getTime()) /
                              86400000
                          )}{" "}
                          &nbsp;days ago&nbsp;{" "}
                          {new Date(parent.updated_at).toLocaleDateString()}
                        </div>
                        <div>
                          {new Date(parent.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {parent.title}

                    <div
                      style={{
                        padding: "0px 10px",
                        paddingTop: "10px",
                        width: "calc(100% - 20px)",
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center"
                      }}
                    >
                      {parent.subject.map((x) => (
                        <div
                          key={x}
                          onClick={() => this.getBills(x.toUpperCase())}
                          style={{ border: "1px solid" }}
                        >
                          {x[0].toUpperCase() +
                            x.substring(1, x.length).toLowerCase()}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else {
                var goCard =
                  commtype === "classes"
                    ? [parent.classType, ""].includes(this.props.classTyped)
                    : commtype === "department"
                    ? [parent.departmentType, ""].includes(
                        this.props.departmentTyped
                      )
                    : subForum;
                var goPost = ["new", "lesson", "show", "game"].includes(
                  commtype
                )
                  ? [parent.issue, ""].includes(this.props.forumTyped)
                  : commtype === "budget & proposal"
                  ? [parent.budgetType, ""].includes(this.props.budgetTyped)
                  : commtype === "ordinance"
                  ? [parent.ordinanceType, ""].includes(
                      this.props.ordinanceTyped
                    )
                  : commtype === "court case"
                  ? [parent.caseType, ""].includes(this.props.caseTyped)
                  : commtype === "election"
                  ? [parent.electionType, ""].includes(this.props.electionTyped)
                  : !subForum;

                var isGood =
                  this.props.auth !== undefined &&
                  this.props.user !== undefined &&
                  !this.props.user.under13 &&
                  this.props.user.showCurses;
                var mTT =
                  parent.message && RegisterCurseWords(parent.message, isGood);

                var switcher =
                  "forum" === parent.collection
                    ? {
                        type: "issue",
                        compare: "forumTyped",
                        chosenForum: "forum"
                      }
                    : ["elections", "oldElections"].includes(parent.collection)
                    ? {
                        type: "electionType",
                        compare: "electionTyped",
                        chosenForum: "elections"
                      }
                    : ["budget & proposals", "oldBudget"].includes(
                        parent.collection
                      )
                    ? {
                        type: "budgetType",
                        compare: "budgetTyped",
                        chosenForum: "budget"
                      }
                    : ["court cases", "oldCases"].includes(parent.collection)
                    ? {
                        type: "caseType",
                        compare: "caseTyped",
                        chosenForum: "cases"
                      }
                    : "ordinances" === parent.collection
                    ? {
                        type: "ordinanceType",
                        compare: "ordinanceTyped",
                        chosenForum: "ordinances"
                      }
                    : {
                        type: "issue",
                        compare: "forumTyped",
                        chosenForum: "forum"
                      };
                var show =
                  !this.props.chatsopen &&
                  (collectionUnspecified ||
                    this.state.collection === parent.collection) &&
                  (filterUnspecified ||
                    parent[switcher.type] === this.props[switcher.compare]) &&
                  /*(chosenForum.includes(switcher.chosenForum) ||
                    (parent.collection === "forum" &&
                      chosenForum.includes(parent.newLessonShow))) &&*/
                  ((swipe !== "comments" && !parent.isOfComment) ||
                    (swipe === "comments" && parent.isOfComment));
                const chainId = this.props.isProfile
                  ? parent.community
                    ? parent.community.message
                    : parent.city
                  : parent.author
                  ? parent.author.username
                  : parent.authorId;
                return (
                  <div
                    ref={this[i]}
                    key={
                      parent.collection +
                      parent.id +
                      window.location.pathname +
                      "/" +
                      parent.isOfComment
                    }
                    style={{
                      width: "calc(100% - 4px)",
                      border: "2px solid",
                      breakInside: "avoid",
                      maxHeight:
                        columncount === 1 || postHeight > 0
                          ? ""
                          : "calc(100% - 1px)",
                      zIndex: show ? i + 6 : -9999,
                      height: show ? `min-content` : "0px",
                      color: "black",
                      opacity: show ? "1" : "0",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      overflowX: "hidden",
                      overflowY: columncount === 1 ? "hidden" : "auto"
                    }}
                  >
                    <Card
                      rebeat={this.props.rebeat}
                      setRebeat={this.props.setRebeat}
                      videos={this.props.videos}
                      folders={this.props.folders}
                      summary={this.state.openChain === chainId}
                      filterChain={this.state.filterChain}
                      int={this.state.int}
                      opening={this.state.opening}
                      openingSet={(shortId) =>
                        this.state.opening !== shortId &&
                        this.setState({ opening: shortId }, () => {
                          clearInterval(this.int);
                          this.int = setInterval(
                            () => this.setState({ int: this.state.int - 1 }),
                            1000
                          );
                          clearTimeout(this.holding);
                          this.holding = setTimeout(() => {
                            this.setState({
                              opening: "",
                              int: 3,
                              opened: shortId,
                              openChain: chainId,
                              filterChain: chainId
                            });
                          }, 3000);
                        })
                      }
                      openingClear={() =>
                        this.setState(
                          {
                            int: 3,
                            opening: ""
                          },
                          () => clearTimeout(this.holding)
                        )
                      }
                      opened={this.state.opened}
                      chainId={chainId}
                      drop={this.props.drop}
                      isProfile={this.props.isProfile}
                      openChain={this.state.openChain}
                      setChain={(openChain) => this.setState(openChain)}
                      cards={Object.values(posts)[i]}
                      forumOpen={this.props.forumOpen}
                      firstPostPerAuthor={firstPostPerAuthor}
                      mTT={mTT}
                      key={parent.id}
                      myCommentsPreview={false}
                      res={res}
                      linkDrop={this.props.linkDrop}
                      dropId={this.props.dropId}
                      parent={parent}
                      //
                      goCard={goCard}
                      goPost={goPost}
                      users={this.props.users}
                      editingSomeText={this.state.editingSomeText}
                      postHeight={postHeight}
                      community={community}
                      isAuthor={isAuthor} //in forum of community already found...
                      isAdminOrFaculty={isAdminOrFaculty}
                      i={i}
                      openWhen={this.props.openWhen}
                      isClass={commtype === "classes"}
                      isDepartment={commtype === "department"}
                      isHousing={
                        subForum && this.props.profileTileChosen === "housing"
                      }
                      isRestaurant={
                        subForum &&
                        this.props.profileTileChosen === "restaurant"
                      }
                      isService={
                        subForum && this.props.profileTileChosen === "service"
                      }
                      isShop={
                        subForum && this.props.profileTileChosen === "shop"
                      }
                      isPage={
                        subForum && this.props.profileTileChosen === "page"
                      }
                      isVenue={
                        subForum && this.props.profileTileChosen === "venue"
                      }
                      isJob={subForum && this.props.profileTileChosen === "job"}
                      user={this.props.user}
                      auth={auth}
                      cityapi={this.props.cityapi}
                      communities={this.props.communities}
                      //
                      unloadGreenBlue={this.props.unloadGreenBlue}
                      loadGreenBlue={this.props.loadGreenBlue}
                      setEditing={(edit) => this.setState(edit)}
                      getUserInfo={this.props.getUserInfo}
                      columncount={columncount}
                      storageRef={this.props.storageRef}
                      issues={this.props.issues}
                      meAuth={this.props.meAuth}
                      getVideos={this.props.getVideos}
                      getFolders={this.props.getFolders}
                      individualTypes={this.props.individualTypes}
                      city={this.props.city}
                      isAdmin={isAdmin}
                      userMe={this.props.user}
                      tileChanger={this.props.tileChanger}
                      commtype={commtype}
                      chosenPostId={this.state.chosenPostId}
                      helper={(x) => {
                        var input = x ? x : null;
                        this.props.helper(input);
                        var postHeight = this[i].current.offsetHeight;
                        this.props.setData({
                          chosenPostId: input.id,
                          postHeight
                        });
                        this[i].current.scrollIntoView("smooth");
                      }}
                      delete={() =>
                        this.setState({
                          deletedForumPosts: [
                            ...this.state.deletedForumPosts,
                            parent.id
                          ]
                        })
                      }
                      deletedForumPosts={this.state.deletedForumPosts}
                      comments={comments}
                      clear={() => {
                        var answer = window.confirm(
                          "are you sure you want to clear this comment?"
                        );
                        if (answer) {
                          this.setState({ comment: "" });
                        }
                      }}
                      height={height}
                      globeChosen={this.props.globeChosen}
                    />
                  </div>
                );
              }
            }
          )}
      </div>
    );
  }
}
//withRouter
export default withRouter(Forum);

/*
if (
  this.props.filePreparedToSend[0] &&
  this.props.filePreparedToSend[0] !== this.state.lastFiletosend
) {
  var file = this.props.filePreparedToSend[0].embedUrl;

  if (file) {
    var fileid = file.substring(
      file.lastIndexOf("/d/") + 3,
      file.lastIndexOf("/") // /edit or /preview
    );
    var thumbnail = `https://drive.google.com/thumbnail?id=${fileid}`;
    var couple = {};
    couple.content = this.props.filePreparedToSend[0];
    couple.thumbnail = thumbnail;
    couple.id = fileid;
    //console.log(couple);
    this.setState({
      lastFiletosend: this.props.filePreparedToSend[0],
      stop: true,
      contents: couple,
      photoSrc: file,
      photoThumbnail: thumbnail
    });
  } else {
    this.setState({
      lastFiletosend: this.props.filePreparedToSend[0],
      stop: true,
      contents: {},
      photoSrc: null,
      photoThumbnail: null
    });
  }
}*/
/**
 * 
if (!this.props.isProfile) {
  if (!posts[x.authorId]) posts[x.authorId] = [];
  return posts[x.authorId].push(x);
} else {
  if (x.communityId) {
    if (!posts[x.communityId]) posts[x.communityId] = [];
    return posts[x.communityId].push(x);
  } else {
    if (!posts[x.city]) posts[x.city] = [];
    return posts[x.city].push(x);
  }
}
 */
