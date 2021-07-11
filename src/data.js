import React from "react";
import firebase from "./init-firebase";
import Folder from "./folder";
import * as geofirestore from "geofirestore";
import { PDB, standardCatch, shortHandId, canIView } from "./widgets/authdb";
import {
  profileDirectory,
  profileCommentsDirectory
} from "./widgets/arraystrings";
import { JailClass } from "./jail";
//import { Jail } from "react-fuffer";

const reverst = (foo, lastCollection) =>
  firebase
    .firestore()
    .collection(foo.collection)
    .doc(foo.id)
    .set(foo)
    .then(() =>
      firebase
        .firestore()
        .collection(lastCollection)
        .doc(foo.id)
        .delete()
        .then(() =>
          console.log(
            `document moved to ${foo.collection} collection ` + foo.id
          )
        )
        .catch(standardCatch)
    )
    .catch(standardCatch);

const fillQuery = (commtype) => {
  var collection = "forum";
  var NewcommentsName = false;
  var ExpiredcommentsName = false;
  var filterTime = false;
  var name = "";
  var isForms = false;
  var old = false;
  var last = false;
  var undo = false;
  var lastOld = false;
  var undoOld = false;
  if (["new", "lesson", "show", "game"].includes(commtype)) {
    collection = "forum";
    name = "forumPosts";
    last = "lastCommPost";
    undo = "undoCommPost";
    NewcommentsName = "forumcomments";
  } else if (commtype === "ordinance") {
    collection = "ordinances";
    name = "ordinances";
    last = "lastCommOrd";
    undo = "undoCommOrd";
    NewcommentsName = "ordinancecomments";
  } else if (commtype === "department") {
    collection = "departments";
    name = "departments";
    last = "lastCommDept";
    undo = "undoCommDept";
  } else if (commtype === "budget & proposal") {
    collection = "budget & proposals";
    name = "budget";
    filterTime = true;
    old = "oldBudget";
    last = "lastBudget";
    undo = "undoBudget";
    lastOld = "lastOldBudget";
    undoOld = "undoOldBudget";
    NewcommentsName = "budgetcommentsnew";
    ExpiredcommentsName = "budgetcommentsexpired";
  } else if (commtype === "election") {
    collection = "elections";
    name = "elections";
    filterTime = true;
    old = "oldElections";
    last = "lastElections";
    undo = "undoElections";
    lastOld = "lastOldElections";
    undoOld = "undoOldElections";
    NewcommentsName = "electioncommentsnew";
    ExpiredcommentsName = "electioncommentsexpired";
  } else if (commtype === "court case") {
    collection = "court cases";
    filterTime = true;
    name = "cases";
    old = "oldCases";
    last = "lastCases";
    undo = "undoCases";
    lastOld = "lastOldCases";
    undoOld = "undoOldCases";
    NewcommentsName = "casecommentsnew";
    ExpiredcommentsName = "casecommentsexpired";
  } else if (commtype === "classes") {
    collection = "classes";
    filterTime = true;
    name = "classes";
    last = "lastClasses";
    undo = "undoClasses";
    old = "oldClasses";
    lastOld = "lastOldClasses";
    undoOld = "undoOldClasses";
  } else if (commtype === "forms & permits") {
    isForms = true;
    last = "lastCommForm";
    undo = "undoCommForm";
  }
  return {
    collection,
    NewcommentsName,
    ExpiredcommentsName,
    filterTime,
    name,
    isForms,
    old,
    last,
    undo,
    lastOld,
    undoOld
  };
};
const newPostingsClass = {
  lastCommPost: null,
  undoCommPost: null,
  lastCommOrd: null,
  undoCommOrd: null,
  lastCommDept: null,
  undoCommDept: null,
  lastOldBudget: null,
  undoOldBudget: null,
  lastOldElections: null,
  undoOldElections: null,
  lastOldCases: null,
  undoOldCases: null,
  lastOldClasses: null,
  undoOldClasses: null,
  lastCommForm: null,
  undoCommForm: null
};
const newPostingsClassLatest = {
  budget: [],
  oldBudget: [],
  forumPosts: [],
  ordinances: [],
  elections: [],
  oldElections: [],
  cases: [],
  oldCases: [],
  classes: [],
  oldClasses: [],
  departments: []
};
class Data extends React.Component {
  constructor(props) {
    super(props);

    const current = new Date().setHours(0, 0, 0, 0);
    const db = new PDB();
    this.state = {
      db,
      jailclasses: [],
      freedocs: [],
      queriedDate: current,
      current,
      current1: new Date(current + 86400000 * 7),
      range: 604800000,
      //
      lastEntity: "",
      pathname: "/",
      postHeight: 0,
      edmStore: {},
      //
      favoriteCities: [],
      cityapisLoaded: [],
      following: [],
      lastUsers: [],
      lastCommunities: [],
      lastEntities: [],
      lastDroppedPosts: [],
      postsWithChatMetas: {},
      recordedPostChatMetas: [],
      chats: [],
      selfvites: [],
      invites: [],
      recordedDroppedPosts: [],
      droppedPosts: [],
      recordedCommunities: [],
      communities: [],
      recordedCommunityNames: [],
      recordedEntityNames: [],
      recordedEntities: [],
      entities: [],
      commentedPosts: [],
      recordedPostComments: [],
      gottenUsers: [],
      recordedUsers: [],
      users: [],
      //
      community: null,
      myDocs: [],
      recordedUserNames: [],
      profileClubs: [],
      profileEvents: [],
      profileJobs: [],
      profileRestaurants: [],
      profilePages: [],
      profileVenues: [],
      profileShops: [],
      profileClasses: [],
      profileHousing: [],
      profileDepartments: [],
      profileServices: []
    };
    this.handleCommentSet.closer = this.handleCommentSet.bind(this);
    this.handleDropId.closer = this.handleDropId.bind(this);
    //closer - hydrate user/community
    this.hydratePostChatMeta.closer = this.hydratePostChatMeta.bind(this);
    this.hydrateEntity.closer = this.hydrateEntity.bind(this);
    this.hydrateEntityFromName.closer = this.hydrateEntity.bind(this);
    this.hydrateUser.closer = this.hydrateUser.bind(this);
    this.hydrateUserFromUserName.closer = this.hydrateUserFromUserName.bind(
      this
    );
    this.getCommunity.closer = this.getCommunity.bind(this);
    this.getCommunityByName.closer = this.getCommunityByName.bind(this);
    //
    /**
     *
     */
    this.handleCommentSet.promise = this.handleCommentSet.bind(this);
    this.handleDropId.promise = this.handleDropId.bind(this);
    //promise - hydrate user/community
    this.hydratePostChatMeta.meta = this.hydratePostChatMeta.bind(this);
    this.hydrateEntity.entity = this.hydrateEntity.bind(this);
    this.hydrateEntityFromName.entity = this.hydrateEntity.bind(this);
    this.hydrateUser.user = this.hydrateUser.bind(this);
    this.hydrateUserFromUserName.user = this.hydrateUserFromUserName.bind(this);
    this.getCommunity.community = this.getCommunity.bind(this);
    this.getCommunityByName.community = this.getCommunityByName.bind(this);
    //

    this.fuffer = React.createRef();
    //this.RTCPeerConnection = new RTCPeerConnection();
  }
  handleCommSnapshot = (hp, collection) =>
    Promise.all(
      hp.map(async (foo) => {
        var droppedPost =
          foo.droppedId && (await this.handleDropId(foo.droppedId).promise());
        foo.droppedPost = droppedPost && JSON.parse(droppedPost);
        var community =
          foo.communityId &&
          (await this.getCommunity(foo.communityId).community());
        foo.community = community && JSON.parse(community);
        var entity =
          foo.entityId &&
          (await this.hydrateEntity(foo.entityId, foo.entityType).entity());
        foo.entity = entity && JSON.parse(entity);
        var author = await this.hydrateUser(foo.authorId).user();
        foo.author = author && JSON.parse(author);
        if (["elections", "oldElections"].includes(collection)) {
          const {
            candidatesProfiled,
            candidateRequestsProfiled
          } = await this.hydrateElection(foo);
          foo.candidatesProfiled = candidatesProfiled;
          foo.candidateRequestsProfiled = candidateRequestsProfiled;
        } else if (["oldCases", "court cases"].includes(collection)) {
          const {
            prosecution,
            defense,
            jury,
            testimonies,
            consults,
            judges
          } = await this.hydrateCase(foo);
          foo.prosecution = prosecution;
          foo.defense = defense;
          foo.jury = jury;
          foo.testimonies = testimonies;
          foo.consults = consults;
          foo.judges = judges;
        }
        return foo;
      })
    );

  hydrateElection = async (foo) => {
    var candidateRequestsProfiled =
      foo.candidateRequests &&
      (await Promise.all(
        foo.candidateRequests.map(async (requestId) => {
          var perp = await this.hydrateUser(requestId).user();
          return perp && JSON.parse(perp);
        })
      ));

    var candidatesProfiled =
      foo.candidates &&
      (await Promise.all(
        foo.candidates.map(async (requestId) => {
          var perp = await this.hydrateUser(requestId).user();
          return perp && JSON.parse(perp);
        })
      ));
    return { candidateRequestsProfiled, candidatesProfiled };
  };
  hydrateCase = async (foo) => {
    var ma = {};
    [
      ("judges", "prosecution", "defense", "jury", "testimonies", "consults")
    ].map(async (m) => {
      ma[m] =
        foo[m] &&
        (await Promise.all(
          foo[m].map(async (requestId) => {
            var perp = await this.hydrateUser(requestId).user();
            return perp && JSON.parse(perp);
          })
        ));
    });
    return { ...ma };
  };
  lastGlobalForum = (globall, commtype) => {
    let globalForumPosts = [];

    (globall
      ? [""]
      : this.props.user !== undefined && this.state.following
      ? this.state.following
      : []
    ).map((x) => {
      return firebase
        .firestore()
        .collection("forum")
        .where("authorId", "==", x)
        .where("newLessonShow", "==", commtype)
        .orderBy("time", "desc")
        .startAfter(this.state.lastGlobalPost)
        .limit(14)
        .onSnapshot((querySnapshot) => {
          let q = 0;
          let issuess = [];
          querySnapshot.docs.forEach(async (doc) => {
            q++;
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              foo.collection = "forum";
              foo.commentsName = "forumcomments";
              var droppedPost =
                foo.droppedId &&
                (await this.handleDropId(foo.droppedId).promise());
              foo.droppedPost = droppedPost && JSON.parse(droppedPost);
              var community =
                foo.communityId &&
                (await this.getCommunity(foo.communityId).community());
              foo.community = community && JSON.parse(community);

              var videos = await this.hydratePostChatMeta(foo).meta();
              foo.videos = videos && JSON.parse(videos);
              foo.videos && globalForumPosts.push(foo);
              foo.issue && issuess.push(foo.issue);
            }
          });
          if (querySnapshot.docs.length === q) {
            var issues = new Set(issuess);
            var lastGlobalPost =
              querySnapshot.docs[querySnapshot.docs.length - 1];
            var undoGlobalPost = querySnapshot.docs[0];
            this.props.setForumDocs({
              issues,
              globalForumPosts,
              lastGlobalPost,
              undoGlobalPost
            });
          }
        }, standardCatch);
    });
  };
  undoGlobalForum = (globall, commtype) => {
    let globalForumPosts = [];
    (globall
      ? [""]
      : this.props.user !== undefined && this.state.following
      ? this.state.following
      : []
    ).map(async (x) => {
      let issuess = [];
      let q = 0;
      const keepalive = 3600000;
      const free = await JailClass(
        //for each: foo = {...doc.data(),doc.id}
        firebase
          .firestore()
          .collection("forum")
          .where("authorId", "==", x)
          .where("newLessonShow", "==", commtype), //optional canIncludes()?
        keepalive,
        { order: "time", by: "desc" }, //sort
        null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        14, //limit
        null, //startAfter
        null //endBefore
      );

      return this.setState(
        {
          lastGlobalPost: free.startAfter,
          undoGlobalPost: free.endBefore
        },
        () => {
          free.docs.forEach(async (foo) => {
            q++;
            foo.collection = "forum";
            foo.commentsName = "forumcomments";
            var droppedPost =
              foo.droppedId &&
              (await this.handleDropId(foo.droppedId).promise());
            foo.droppedPost = droppedPost && JSON.parse(droppedPost);
            var community =
              foo.communityId &&
              (await this.getCommunity(foo.communityId).community());
            foo.community = community && JSON.parse(community);
            var author = await this.hydrateUser(foo.authorId).user();
            foo.author = author && JSON.parse(author);
            var videos = await this.hydratePostChatMeta(foo).meta();
            foo.videos = videos && JSON.parse(videos);
            foo.videos && globalForumPosts.push(foo);
            foo.issue && issuess.push(foo.issue);
          });
          if (free.docs.length === q) {
            var issues = new Set(issuess);
            this.props.setForumDocs({
              issues,
              globalForumPosts
            });
          } else return null;
        },
        standardCatch
      );
    });
  };
  getGlobalForum = async (globall, commtype) => {
    let globalForumPosts = [];
    (globall
      ? [""]
      : this.props.user !== undefined && this.state.following
      ? this.state.following
      : []
    ).map(async (x) => {
      let issuess = [];
      let q = 0;
      const keepalive = 3600000;
      const free = await JailClass(
        //for each: foo = {...doc.data(),doc.id}
        firebase
          .firestore()
          .collection("forum")
          .where("authorId", "==", x)
          .where("newLessonShow", "==", commtype), //optional canIncludes()?
        keepalive,
        { order: "time", by: "desc" }, //sort
        null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        14, //limit
        null, //startAfter
        null //endBefore
      );
      return this.setState(
        {
          lastGlobalPost: free.startAfter,
          undoGlobalPost: free.endBefore
        },
        () => {
          free.docs.forEach(async (foo) => {
            q++;
            foo.collection = "forum";
            foo.commentsName = "forumcomments";
            var droppedPost =
              foo.droppedId &&
              (await this.handleDropId(foo.droppedId).promise());
            foo.droppedPost = droppedPost && JSON.parse(droppedPost);
            var community =
              foo.communityId &&
              (await this.getCommunity(foo.communityId).community());
            foo.community = community && JSON.parse(community);
            var author = await this.hydrateUser(foo.authorId).user();
            foo.author = author && JSON.parse(author);

            var videos = await this.hydratePostChatMeta(foo).meta();
            foo.videos = videos && JSON.parse(videos);
            foo.videos && globalForumPosts.push(foo);
            foo.issue && issuess.push(foo.issue);
          });
          if (free.docs.length === q) {
            var issues = new Set(issuess);

            this.setState({
              issues,
              globalForumPosts
            });
          } else return null;
        }
      );
    });
    this.props.auth !== undefined && this.setState({ gotGlobe: true });
  };
  handleProfileCommentSnapshot = (comments) =>
    Promise.all(
      comments.map(async (foo) => {
        var author = await this.hydrateUser(foo.authorId).user();
        foo.author = author && JSON.parse(author);

        return foo.author && foo;
      })
    );
  helper = async (post, i) => {
    var hideComments = !post || this.state.chosenPostId === post.id;

    if (!hideComments) {
      this.props.loadGreenBlue("getting comments");
      var forumTypecomm =
        post.collection === "budget & proposals"
          ? "budgetcommentsnew"
          : post.collection === "elections"
          ? "electioncommentsnew"
          : post.collection === "court cases"
          ? "casecommentsnew"
          : post.collection === "oldBudget"
          ? "budgetcommentsexpired"
          : post.collection === "oldElections"
          ? "electioncommentsexpired"
          : post.collection === "oldCases"
          ? "casecommentsexpired"
          : post.collection === "ordinances"
          ? "ordinancecomments"
          : "forumcomments";
      const keepalive = 3600000;
      const free = await JailClass(
        //for each: foo = {...doc.data(),doc.id}
        firebase
          .firestore()
          .collection(forumTypecomm)
          .where("forumpostId", "==", post.id), //optional canIncludes()?
        keepalive,
        { order: "time", by: "desc" }, //sort
        null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        14, //limit
        null, //startAfter
        null //endBefore
      );
      return this.setState(
        {
          lastGlobalPost: free.startAfter,
          undoGlobalPost: free.endBefore
        },
        async () => {
          if (free.docs.length === 0) {
            //window.alert("be the first to comment");
            this.setState({
              chosenPostId: post.id,
              postMessage: post.message,
              chosenPost: post,
              comments: []
            });
            this.props.unloadGreenBlue();
          } else {
            let comments = [];
            let p = 0;
            free.docs.map(async (doc) => {
              p++;
              if (doc.exists) {
                var foo = doc.data();
                foo.id = doc.id;
                comments.push(foo);
              }
            });
            if (free.docs.length === p) {
              comments = await this.handleProfileCommentSnapshot(comments);

              comments.sort(
                (a, b) =>
                  (this.props.user !== undefined &&
                    this.state.following.includes(a.authorId)) -
                  (this.props.user === undefined ||
                    !this.state.following.includes(b.authorId))
              );
              this.setState({
                commentedPosts: [...this.state.commentedPosts, post],
                chosenPostId: post.id,
                postMessage: post.message,
                chosenPost: post,
                comments
              });
              this.props.unloadGreenBlue();
            }
          }
        },
        standardCatch
      );
    } else if (post && this.state.chosenPostId === post.id) {
      this.setState({
        postHeight: this.state.lastPostHeight,
        comments: this.state.lastChosenComments,
        postMessage: this.state.lastChosenPost.message,
        chosenPostId: this.state.lastChosenPost.id,
        chosenPost: this.state.lastChosenPost
      });
    } else if (this.state.postHeight === 0) {
      this.setState({ chosenPostId: null });
    } else {
      this.setState({
        postHeight: 0,
        comments: null,
        lastChosenComments: this.state.comments,
        lastChosenPost: this.state.chosenPost,
        lastPostHeight: this.state.postHeight,
        postMessage: "",
        chosenPost: null
      });
    }
  };
  getDrop = async (id) => {
    if (id) {
      this.props.loadGreenBlue("finding post...");
      var p = await this.handleDropId(id).promise();
      var drop = p && JSON.parse(p);
      if (drop) {
        this.props.unloadGreenBlue();
        return drop && drop;
      }
    }
  };
  findPost = async (id) => {
    if (id) {
      this.props.loadGreenBlue("finding post...");
      var p = await this.handleDropId(id).promise();
      var drop = p && JSON.parse(p);
      if (drop) {
        this.props.unloadGreenBlue();
        return drop && drop;
      }
    }
  };
  dropId = async (droppedId, parent) => {
    if (droppedId) {
      this.props.loadGreenBlue("attaching rebeat...");
      if (droppedId.includes(".") || droppedId.includes("/"))
        return window.alert("invalid id (three dots, bottom-right");
      var post = await this.handleDropId(droppedId).promise();
      var droppedPost = post && JSON.parse(post);
      droppedPost &&
        firebase
          .firestore()
          .collection(parent.collection)
          .doc(parent.id)
          .update({
            message: parent.message === "" ? droppedId : parent.message,
            droppedId
          })
          .then(() => {
            this.props.unloadGreenBlue();
            window.alert(droppedPost.message + " on " + parent.message);
          })
          .catch(standardCatch);
    }
  };
  componentWillUnmount = () => {
    clearTimeout(this.getTimeout);
    clearTimeout(this.slowPager);
    this.state.gottenUsers.map(
      (userId) => this[userId] && clearInterval(this[userId])
    );
    this.handleCommentSet.closer();
    this.handleDropId.closer();
    this.hydratePostChatMeta.closer();
    this.hydrateEntity.closer();
    this.hydrateEntityFromName.closer();
    this.hydrateUser.closer();
    this.hydrateUserFromUserName.closer();
    this.getCommunity.closer();
    this.getCommunityByName.closer();
  };
  timeFilterJobs = (e) => {
    let dol = [];
    e.map((ev) => {
      if (
        new Date(ev.datel).setHours(0, 0, 0, 0) > this.state.queriedDate &&
        new Date(ev.datel).setHours(0, 0, 0, 0) <
          this.state.queriedDate + this.state.range
      ) {
        dol.push(ev);
      }
      dol.sort((a, b) => b.datel - a.datel);
      return this.props.setForumDocs({ jobs: dol });
    });
  };
  timeFilterEvents = (events, a) => {
    let dol = [];
    events.map((ev) => {
      if (
        new Date(ev.datel).setHours(0, 0, 0, 0) > this.state.queriedDate &&
        new Date(ev.datel).setHours(0, 0, 0, 0) <
          this.state.queriedDate + this.state.range
      ) {
        dol.push(ev);
      }

      return null;
    });
    this.props.setForumDocs({
      together: a ? [...a, ...dol].sort((a, b) => b.datel - a.datel) : dol
    });
  };
  fetchCommEvents = async (community, targetid) => {
    this.props.setForumDocs({
      clubs: [],
      pages: [],
      restaurants: [],
      services: [],
      shops: [],
      together: [],
      forumPosts: []
    });
    const collection =
      targetid === "housing"
        ? "housing"
        : targetid === "event"
        ? "planner"
        : targetid + "s";

    const filterTime = ["event", "job"].includes(targetid);
    const old =
      targetid === "event"
        ? "oldPlanner"
        : targetid === "job"
        ? "oldJobs"
        : false;

    let dol = [];
    let p = 0;
    //freshen = clearTimeout(timeout) if timeout = setTimeout(close(onSnapshot),1200000)
    //if onSnapshot = firebase.firestore().collection(collection).where("communityId", "==", community.id).onSnapshot
    const keepalive = 3600000;
    //postIdToSubdocument: local field forged for subobject, like hydratePost/User in data.js for class (no Promise/awaits)
    //if dropId, drop = (dropId) => postIdToSubdocument(foo.dropId, keepalive);
    //if dropIds, drops = (dropIds) => foo.dropIds.map((f) => postIdToSubdocument(f, keepalive)); make-a-da-"[]"
    //if doc().data.message, messageAsArray = (doc().data.message) => lowercased array-string-buffer
    const free = await JailClass(
      //for each: foo = {...doc.data(),doc.id}
      firebase
        .firestore()
        .collection(collection)
        .where("communityId", "==", community.id),
      keepalive,
      { order: "time", by: "desc" }, //sort
      null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      14, //limit
      null, //startAfter
      null //endBefore
    ); //enables snapshot cleanups with custom keepalive (default is hour-long), longpolling prompts,
    //console.log(free.id)
    //aliveFor, browsing-to-freshen-each-snapshot & pagination.
    //free.startAfter: doc from this query, for limit()
    //free.endBefore: "", for limitToLast()
    //free.limit (number for either limitToLast() or limit())
    //free.sort
    //free.near
    //free.refresh: useCallback(() => resetCancel(true), [])
    //free.id: match of callString (snapshot constructed as "string"/String)
    //free.aliveFor: keepalive left since last refresh
    //free.verbose: console.log match callString
    //free.docs[0].messageAsArray for use in array-contains or arrayContainsAny (further queries)
    //free.docs[0].drop for use as subobject/on-device-subcollection
    //free.docs[0].drops ""'s
    free.docs.forEach(async (foo) => {
      p++;
      if (filterTime) foo.datel = new Date(foo.date.seconds * 1000);
      if (!filterTime || foo.datel > new Date()) {
        canIView(this.props.auth, foo, community) && dol.push(foo);
      } else if (this.props.auth !== undefined) reverst(foo, old);
    });
    if (free.docs.length === p) {
      Promise.all(
        dol.map(async (foo) => {
          var community =
            foo.communityId &&
            (await this.getCommunity(foo.communityId).community());
          foo.community = community && JSON.parse(community);
          var author = await this.hydrateUser(foo.authorId).user();
          foo.author = author && JSON.parse(author);
          return foo;
        })
      ).then((hp) =>
        collection === "planner"
          ? this.timeFilterEvents(
              dol,
              this.state.edmStore[
                this.state.cityapi +
                  this.state.stateapi +
                  this.state.queriedDate +
                  this.state.range
              ]
            )
          : collection === "jobs"
          ? this.timeFilterJobs(dol)
          : this.props.setForumDocs({ [collection]: dol })
      );
    }
  };
  fetchEvents = async (location, distance, city, targetid) => {
    this.props.setForumDocs({
      forumPosts: []
    });
    this.props.setCommunity({ city });
    this.setState({
      distance
    });
    const collection =
      targetid === "housing"
        ? "housing"
        : targetid === "event"
        ? "planner"
        : targetid + "s";

    const filterTime = ["event", "job"].includes(targetid);
    const old =
      targetid === "event"
        ? "oldPlanner"
        : targetid === "job"
        ? "oldJobs"
        : false;

    let dol = [];
    let p = 0;
    /*if (this.props.community && this.props.community.blockedForum) {
        this.props.community.blockedForum.includes(this.props.commtype) &&
          this.props.setForumDocs({ commtype: "new" });
      }*/
    console.log(location[0], location[1]);
    const firestore = firebase.firestore();
    const GeoFirestore = geofirestore.initializeApp(firestore);
    const geocollection = GeoFirestore.collection(collection);
    const geocollection1 = old && GeoFirestore.collection(old);
    var coll = null;
    var other = null;
    var newer = null;
    this.props.setForumDocs({
      distance
    });
    const keepalive = 3600000;
    const free = await JailClass(
      //for each: foo = {...doc.data(),doc.id}
      GeoFirestore.collection(collection),
      keepalive,
      null, //sort for firestore orderBy { order: "time", by: "desc" }
      {
        center: new firebase.firestore.GeoPoint(location[1], location[0]),
        radius: distance
      }, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore near { center: near.center, radius: near.distance }
      14, //limit
      null, //startAfter
      null //endBefore
    );
    free.docs.forEach(async (foo) => {
      p++;
      foo.collection = collection;
      if (filterTime) {
        if (this.state.queriedDate < new Date().getTime()) {
          coll = geocollection;
          other = geocollection1;
          newer = true;
        } else {
          coll = geocollection1;
          other = geocollection;
        }
        foo.datel = new Date(foo.date.seconds * 1000);
      }
      var community =
        foo.communityId &&
        (await this.getCommunity(foo.communityId).community());
      community = community && JSON.parse(community);
      if (!community || canIView(this.props.auth, foo, community)) {
        if (
          (newer && foo.datel > new Date()) ||
          (!newer && foo.datel < new Date())
        ) {
          dol.push(foo);
        } else if (this.props.auth !== undefined) {
          other.doc(foo.id).set(foo);
          coll
            .doc(foo.id)
            .delete()
            .then((ref) => {
              console.log("document moved to previous event collection" + ref);
            })
            .catch(standardCatch);
        }
      }
    });
    if (free.docs.length === p) {
      Promise.all(
        dol.map(async (foo) => {
          var author = await this.hydrateUser(foo.authorId).user();
          return (foo.author = author && JSON.parse(author));
        })
      ).then((dol) =>
        collection === "events"
          ? this.timeFilterEvents(
              dol,
              this.state.edmStore[
                this.state.cityapi +
                  this.state.stateapi +
                  this.state.queriedDate +
                  this.state.range
              ]
            )
          : collection === "jobs"
          ? this.timeFilterJobs(dol)
          : this.props.setForumDocs({
              [collection]: dol
            })
      );
    }
  };

  getProfileFutureEvents = async (profile) => {
    const keepalive = 3600000;
    const free = await JailClass(
      //for each: foo = {...doc.data(),doc.id}
      firebase
        .firestore()
        .collection("planner")
        .where("authorId", "==", profile.id),
      keepalive,
      { order: "time", by: "desc" }, //sort
      null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      5, //limit
      null, //startAfter
      null //endBefore
    );
    return free.docs;
  };
  getEntityQuery = async (old, role, profile, type, titles) => {
    const keepalive = 3600000;
    const free = await JailClass(
      //for each: foo = {...doc.data(),doc.id}
      firebase.firestore().collection(old).where(role, "==", profile.id),
      keepalive,
      { order: "createdAt", by: "desc" }, //sort
      null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      14, //limit
      null, //startAfter
      null, //endBefore
      true
    );
    free &&
      this.setState({
        [type.name]: free.docs
      });
  };

  getProfileEntities = (profile) => {
    let q = 0;
    [
      { collection: "clubs", name: "profileClubs" },
      { collection: "shops", name: "profileShops" },
      { collection: "restaurants", name: "profileRestaurants" },
      { collection: "services", name: "profileServices" },
      { collection: "classes", name: "profileClasses" },
      { collection: "departments", name: "profileDepartments" },
      { collection: "pages", name: "profilePages" },
      { collection: "jobs", name: "profileJobs" },
      { collection: "venues", name: "profileVenues" },
      { collection: "housing", name: "profileHousing" },
      { collection: "planner", name: "profileEvents" }
    ].map((type) => {
      q++;
      let titles = [];

      var old = false;
      if (["classes", "planner", "jobs"].includes(type.collection)) {
        if ("classes" === type.collection) {
          old = "oldClasses";
        } else if ("planner" === type.collection) {
          old = "oldPlanner";
        } else if ("jobs" === type.collection) {
          old = "oldJobs";
        }
      }

      if (old) {
        this.getEntityQuery(old, "authorId", profile, type, titles);
        this.getEntityQuery(old, "admin", profile, type, titles);
      }
      this.getEntityQuery(type.collection, "authorId", profile, type, titles);
      this.getEntityQuery(type.collection, "admin", profile, type, titles);

      return this.setState({
        [type.name]: titles
      });
    });
    if (q === 11) {
      this.getComments(profile);
      this.props.loadGreenBlue("getting comments from " + profile.username);
      this.setState({
        lastProfile: profile
      });
    }
  };

  paginateGroupPosts = async (chosenEntity, way) => {
    var wayCode = way.slice(0, way.length);
    if (wayCode === "last") {
      wayCode = "groupLast";
    } else {
      wayCode = "groupUndo";
    }
    if (!this.state[wayCode]) {
      // console.log("skipped " + [type[way]]);
    } else {
      this.props.loadGreenBlue(
        "getting more of " + this.props.profile.username
      );
      //console.log(way + ": getting more..." + type[way]);
      var fbbb = false;
      if (way === "last") {
        fbbb = firebase
          .firestore()
          .collection("forum")
          .where("entityId", "==", chosenEntity.id)
          .where("entityType", "==", chosenEntity.entityType);
      } else
        fbbb = firebase
          .firestore()
          .collection("forum")
          .where("entityId", "==", chosenEntity.id)
          .where("entityType", "==", chosenEntity.entityType);

      const keepalive = 3600000;
      const free = await JailClass(
        //for each: foo = {...doc.data(),doc.id}
        fbbb,
        keepalive,
        { order: "time", by: "desc" }, //sort
        null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        8, //limit
        null, //startAfter
        null, //endBefore
        true
      );
      if (free) {
        this.setState(
          {
            groupLast: free.startAfter,
            groupUndo: free.endBefore
          },
          () => {
            if (free.docs.length === 0) {
              this.props.unloadGreenBlue();
              if (way === "last") {
                this.setState({
                  groupLast: null
                });
              } else {
                this.setState({
                  groupUndo: null
                });
              }
            } else {
              free.docs.forEach(async (foo) => {
                foo.commentsName = "forumcomments";
                var community =
                  foo.communityId &&
                  (await this.getCommunity(foo.communityId).community());
                foo.community = community && JSON.parse(community);
                var canView = !community
                  ? true
                  : canIView(this.props.auth, foo, community);
                if (canView) {
                  var entity =
                    foo.entityId &&
                    (await this.hydrateEntity(
                      foo.entityId,
                      foo.entityType
                    ).entity());

                  foo.entity = entity && JSON.parse(entity);
                  foo.author = await this.hydrateUser(foo.authorId).user();

                  var videos = await this.hydratePostChatMeta(foo).meta();
                  foo.videos = videos && JSON.parse(videos);

                  var rest = this.props.entityPosts.filter(
                    (post) =>
                      foo.id !== post.id || foo.collection !== post.collection
                  );
                  this.props.setForumDocs({
                    entityPosts: [...rest, foo]
                  });
                }
                this.props.unloadGreenBlue();
              });
            }
          }
        );
      }
    }
  };
  lastPostsAs = (chosenEntity) => {
    this.props.setForumDocs({
      entityPosts: []
    });
    this.paginateGroupPosts(chosenEntity, "last");
  };

  undoPostsAs = (chosenEntity) => {
    this.props.setForumDocs({
      entityPosts: []
    });
    this.paginateGroupPosts(chosenEntity, "undo");
  };

  getPostsAs = async (chosenEntity) => {
    this.props.setForumDocs({
      entityPosts: []
    });

    const keepalive = 3600000;
    const free = await JailClass(
      //for each: foo = {...doc.data(),doc.id}
      firebase
        .firestore()
        .collection("forum")
        .where("entityId", "==", chosenEntity.id)
        .where("entityType", "==", chosenEntity.entityType),
      keepalive,
      { order: "time", by: "desc" }, //sort
      null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      5, //limit
      null, //startAfter
      null, //endBefore
      true
    );
    this.setState(
      {
        groupLast: free.startAfter,
        groupUndo: free.endBefore
      },
      () =>
        free.docs.map(async (doc) => {
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            foo.collection = "forum";
            foo.commentsName = "forumcomments";
            var community =
              foo.communityId &&
              (await this.getCommunity(foo.communityId).community());
            foo.community = community && JSON.parse(community);
            var entity =
              foo.entityId &&
              (await this.hydrateEntity(foo.entityId, foo.entityType).entity());
            foo.entity = entity && JSON.parse(entity);
            var author = await this.hydrateUser(foo.authorId).user();
            foo.author = author && JSON.parse(author);

            var videos = await this.hydratePostChatMeta(foo).meta();
            foo.videos = videos && JSON.parse(videos);
            return this.props.setForumDocs({
              entityPosts: [...this.props.entityPosts, foo]
            });
          }
        })
    );
  };

  getPosts = (profile, selectedBias) => {
    /*var switcher = [];
    selectedBias.map(x=>{
      if(["new","games","shows","lessons"].includes(x)&&!switcher.includes("forum")){
      switcher.push("forum")}else{
        switcher.push(x)
      }
    })
    var mapThese = profileDirectory.filter((x) =>
      selectedBias.includes(x.collection)
    );*/
    var todayDate = new Date();
    profileDirectory.map(async (type, i) => {
      let dol = [];
      const keepalive = 3600000;
      const free = await JailClass(
        //for each: foo = {...doc.data(),doc.id}
        firebase
          .firestore()
          .collection(type.collection)
          .where("authorId", "==", profile.id), //optional canIncludes()?
        keepalive,
        { order: "time", by: "desc" }, //sort
        null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        5, //limit
        type.last, //startAfter
        type.undo //endBefore
      );

      this.setState(
        {
          [type.last]: free.startAfter,
          [type.undo]: free.endBefore
        },
        () => {
          free.docs.map(async (foo) => {
            foo.commentsName = type.commentsName;

            var datel = foo.date && foo.date.seconds * 1000;
            foo.datel = datel && new Date(datel);
            if (
              ![
                "elections",
                "budget & proposals",
                "court cases",
                "oldElections",
                "oldBudget",
                "oldCases"
              ].includes(foo.collection) ||
              (["oldElections", "oldBudget", "oldCases"].includes(
                foo.collection
              ) &&
                foo.datel < todayDate) ||
              (["elections", "budget & proposals", "court cases"].includes(
                foo.collection
              ) &&
                foo.datel > todayDate)
            ) {
              var community =
                foo.communityId &&
                (await this.getCommunity(foo.communityId).community());
              foo.community = community && JSON.parse(community);
              var canView = !community
                ? true
                : canIView(this.props.auth, foo, community);
              if (canView) {
                var droppedPost =
                  foo.droppedId &&
                  (await this.handleDropId(foo.droppedId).promise());
                foo.droppedPost = droppedPost && JSON.parse(droppedPost);
                var entity =
                  foo.entityId &&
                  (await this.hydrateEntity(
                    foo.entityId,
                    foo.entityType
                  ).entity());
                foo.entity = entity && JSON.parse(entity);
                foo.author = profile;
                foo.isOfComment = false;
                var videos = await this.hydratePostChatMeta(foo).meta();
                foo.videos = videos && JSON.parse(videos);
                foo.videos && this.props.addProfilePost(foo);
                dol.push(foo);
              }
            } else {
              foo.collection = type.oppositeCollection;
              foo.commentsName = type.oppositeCommentsName;
              reverst(foo, type.collection);
            }
          });
        }
      );
      return dol;
    });
  };

  lastPosts = () => {
    this.props.loadGreenBlue(
      "getting more recent stuff of " + this.props.profile.username
    );
    this.props.setForumDocs({ profilePostsSorted: [] });
    this.props.clearProfile();
    profileDirectory.forEach((type, i) =>
      this.paginateProfilePosts(type, this.props.profile, "last", i)
    );
  };

  undoPosts = () => {
    this.props.loadGreenBlue("getting more of " + this.props.profile.username);
    this.props.setForumDocs({ profilePostsSorted: [] });
    this.props.clearProfile();
    profileDirectory.forEach((type, i) =>
      this.paginateProfilePosts(type, this.props.profile, "undo", i)
    );
  };
  paginateProfilePosts = async (type, profile, way, i) => {
    this.setState({
      [type[way]]: null
    });
    if (!this.state[type[way]]) {
      //skipped [type[way]]
    } else {
      //getting more... type[way]
      var fbbb = false;
      if (way === "last") {
        //end before this.state[type.undo].id
        fbbb = firebase
          .firestore()
          .collection(type.collection)
          .where("authorId", "==", profile.id);
      } else {
        //start after this.state[type.last].id
        fbbb = firebase
          .firestore()
          .collection(type.collection)
          .where("authorId", "==", profile.id);
      }
      const keepalive = 3600000;
      const free = await JailClass(
        //for each: foo = {...doc.data(),doc.id}
        fbbb, //optional canIncludes()?
        keepalive,
        { order: "time", by: "desc" }, //sort
        null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        8, //limit
        type.last, //startAfter
        type.undo //endBefore
      );

      this.setState(
        {
          [type.last]: free.startAfter,
          [type.undo]: free.endBefore
        },
        () => {
          if (free.docs.length === 0) {
            this.setState({
              [type[way]]: null
            });
          } else {
            free.docs.forEach(async (foo) => {
              var datel = foo.date && foo.date.seconds * 1000;
              foo.datel = datel && new Date(datel);

              if (
                ![
                  "elections",
                  "budget & proposals",
                  "court cases",
                  "oldElections",
                  "oldBudget",
                  "oldCases"
                ].includes(foo.collection) ||
                (["oldElections", "oldBudget", "oldCases"].includes(
                  foo.collection
                ) &&
                  foo.datel < new Date()) ||
                (["elections", "budget & proposals", "court cases"].includes(
                  foo.collection
                ) &&
                  foo.datel > new Date())
              ) {
                foo.commentsName = type.commentsName;
                var community =
                  foo.communityId &&
                  (await this.getCommunity(foo.communityId).community());
                foo.community = community && JSON.parse(community);
                var canView = !community
                  ? true
                  : canIView(this.props.auth, foo, community);
                if (canView) {
                  var entity =
                    foo.entityId &&
                    (await this.hydrateEntity(
                      foo.entityId,
                      foo.entityType
                    ).entity());
                  foo.entity = entity && JSON.parse(entity);
                  foo.author = profile;
                  foo.isOfComment = false;
                  var videos = await this.hydratePostChatMeta(foo).meta();
                  foo.videos = videos && JSON.parse(videos);

                  this.props.addProfilePost(foo);
                }
              } else {
                foo.collection = type.oppositeCollection;
                foo.commentsName = type.oppositeCommentsName;
                reverst(foo, type.collection);
              }
            });
          }
        }
      );
    }
  };

  handleCommentSet = (type, profile, paginate) => {
    var fine = true;
    return {
      promise: async () =>
        await new Promise((resolve, reject) => {
          if (!fine) reject(!fine);
          let comments = [];
          var close = false;
          if (paginate) {
            if (this.state[type[paginate]]) {
              if (paginate === "last") {
                close = firebase
                  .firestore()
                  .collection(type.commentsName)
                  .where("authorId", "==", profile.id)
                  .orderBy("time", "desc")
                  .endBefore(this.state[type.last])
                  .limitToLast(14);
              } else {
                close = firebase
                  .firestore()
                  .collection(type.commentsName)
                  .where("authorId", "==", profile.id)
                  .orderBy("time", "desc")
                  .startAfter(this.state[type.undo])
                  .limit(14);
              }
              close &&
                close
                  .get()
                  .then((querySnapshot) => {
                    let o = 0;
                    if (querySnapshot.empty) {
                      this.setState({
                        [type[paginate]]: null
                      });
                      resolve("none");
                    } else {
                      querySnapshot.docs.forEach((doc) => {
                        o++;
                        if (doc.exists) {
                          var foo = doc.data();
                          foo.id = doc.id;
                          foo.collection = type.commentsSource;
                          foo.commentsName = type.commentsName;
                          comments.push(foo);
                        }
                        if (querySnapshot.docs.length === o) {
                          var lastPost =
                            querySnapshot.docs[querySnapshot.docs.length - 1];
                          var undoPost = querySnapshot.docs[0];
                          this.setState({
                            [type.last]: lastPost,
                            [type.undo]: undoPost
                          });
                          resolve(JSON.stringify(comments));
                        }
                      });
                    }
                  })
                  .catch(standardCatch);
            } else resolve("none");
          } else {
            close = firebase
              .firestore()
              .collection(type.commentsName)
              .where("authorId", "==", profile.id)
              .orderBy("time", "desc")
              .limit(14)
              .get()
              .then((querySnapshot) => {
                let o = 0;
                if (querySnapshot.empty) {
                  this.setState({
                    [type.last]: null,
                    [type.undo]: null
                  });
                  resolve("none");
                } else {
                  querySnapshot.docs.forEach((doc) => {
                    o++;
                    if (doc.exists) {
                      var foo = doc.data();
                      foo.id = doc.id;
                      foo.collection = type.commentsSource;
                      foo.commentsName = type.commentsName;
                      comments.push(foo);
                    }
                    if (querySnapshot.docs.length === o) {
                      var lastPost =
                        querySnapshot.docs[querySnapshot.docs.length - 1];
                      var undoPost = querySnapshot.docs[0];
                      this.setState({
                        [type.last]: lastPost,
                        [type.undo]: undoPost
                      });
                      resolve(JSON.stringify(comments));
                    }
                  });
                }
              });
          }
          if (!fine) {
            close();
          }
        }),
      closer: () => (fine = false)
    };
  };
  handleProfileComments = (profile, paginate) => {
    if (paginate) {
      this.props.loadGreenBlue("loading more commented posts");
      this.props.setForumDocs({ profilePostsSorted: [] });
      this.props.clearProfile(true); //clear comments
    }
    Promise.all(
      profileCommentsDirectory.map(async (type, i) => {
        return await this.handleCommentSet(type, profile, paginate).promise();
      })
    ).then((comments) => {
      let commentss = [];
      comments.map((x) => {
        if (x !== "none") {
          return commentss.push(JSON.parse(x));
        } else return null;
      });
      var commentsCombined = [];
      for (let x = 0; x < commentss.length; x++) {
        commentsCombined = commentsCombined.concat(commentss[x]);
      }
      var comms = [];
      var commms = [];
      commentsCombined.map((com) => {
        if (!comms.includes(com.id)) {
          comms.push(com.id);
          return commms.push(com);
        } else return null;
      });
      commms.forEach((post) =>
        firebase
          .firestore()
          .collection(post.collection)
          .doc(post.forumpostId)
          .onSnapshot(async (doc) => {
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              foo.collection = post.collection;
              foo.commentsName = post.commentsName;
              foo.comments = comments.filter((x) => x.forumpostId === foo.id);
              var community =
                foo.communityId &&
                (await this.getCommunity(foo.communityId).community());
              foo.community = community && JSON.parse(community);

              var entity =
                foo.entityId &&
                (await this.hydrateEntity(
                  foo.entityId,
                  foo.entityType
                ).entity());
              foo.entity = entity && JSON.parse(entity);
              //foo.author = await this.hydrateUser(foo.authorId).user();
              foo.author = profile; //JSON.parse(author);
              foo.isOfComment = true;

              var videos = await this.hydratePostChatMeta(foo).meta();
              foo.videos = videos && JSON.parse(videos);
              return foo.videos && this.props.addProfilePost(foo);
            }
          }, standardCatch)
      );
      if (paginate) {
        this.props.unloadGreenBlue();
      } else {
        var selection = [
          { id: ["forum"], value: "new" },
          { id: ["forum"], value: "lessons" },
          { id: ["forum"], value: "shows" },
          { id: ["forum"], value: "games" },
          { id: ["budget & proposals", "oldBudget"], value: "budget" },
          { id: ["court cases", "oldCases"], value: "cases" },
          { id: ["elections", "oldElections"], value: "elections" },
          { id: ["ordinances"], value: "ordinances" }
        ];
        var selected = selection.filter((x) =>
          [
            "new",
            "lessons",
            "shows",
            "games",
            "budget",
            "cases",
            "elections",
            "ordinances"
          ].includes(x.value)
        );
        var selectedBias = [];
        let p = 0;
        selected.map((x) => {
          p++;
          return x.id.map((y) => {
            return selectedBias.push(y);
          });
        });
        selectedBias &&
          p === selected.length &&
          this.getPosts(profile, selectedBias);
        this.props.loadGreenBlue("getting posts from " + profile.username);
      }
    });
  };

  lastComments = (profile) => this.handleProfileComments(profile, "last");

  undoComments = (profile) => this.handleProfileComments(profile, "undo");

  getComments = (profile) => this.handleProfileComments(profile);

  againBackDocs = () => {
    this.state.againDoc &&
      firebase
        .firestore()
        .collection("chats")
        .where("recipients", "array-contains", this.props.auth.uid)
        .where("gsUrl", ">", "")
        .orderBy("gsUrl")
        .orderBy("time", "desc")
        .startAfter(this.state.againDoc)
        .limit(20)
        .onSnapshot((querySnapshot) => {
          let p = 0;
          let myDocs = [];
          querySnapshot.docs.forEach(async (doc) => {
            p++;
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              foo.recipientsProfiled = await Promise.all(
                foo.recipients.map(async (recipientId) => {
                  var recipient = await this.hydrateUser(recipientId).user();
                  return recipient && JSON.parse(recipient);
                })
              );
              var author = await this.hydrateUser(foo.authorId).user();
              foo.author = author && JSON.parse(author);

              myDocs.push(foo);
            }
          });
          if (p === querySnapshot.docs.length && this.state.myDocs !== myDocs) {
            var lastDoc = myDocs[myDocs.length - 1];
            var againDoc = myDocs[0];
            this.setState({
              myDocs,
              lastDoc: lastDoc ? lastDoc : null,
              againDoc: againDoc ? againDoc : null
            });
          }
        }, standardCatch);
  };
  moreDocs = () => {
    this.state.lastDoc &&
      firebase
        .firestore()
        .collection("chats")
        .where("recipients", "array-contains", this.props.auth.uid)
        .where("gsUrl", ">", "")
        .orderBy("gsUrl")
        .orderBy("time", "desc")
        .startAfter(this.state.lastDoc)
        .limit(20)
        .onSnapshot((querySnapshot) => {
          let p = 0;
          let myDocs = [];
          querySnapshot.docs.forEach(async (doc) => {
            p++;
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              foo.recipientsProfiled = await Promise.all(
                foo.recipients.map(async (recipientId) => {
                  var recipient = await this.hydrateUser(recipientId).user();
                  return recipient && JSON.parse(recipient);
                })
              );
              var author = await this.hydrateUser(foo.authorId).user();
              foo.author = author && JSON.parse(author);

              myDocs.push(foo);
            }
          });
          if (p === querySnapshot.docs.length && this.state.myDocs !== myDocs) {
            var lastDoc = myDocs[myDocs.length - 1];
            var againDoc = myDocs[0];
            this.setState({
              myDocs,
              lastDoc: lastDoc ? lastDoc : null,
              againDoc: againDoc ? againDoc : null
            });
          }
        }, standardCatch);
  };
  againBackMessages = () => {
    this.state.againMessage &&
      firebase
        .firestore()
        .collection("chats")
        .where("recipients", "array-contains", this.props.auth.uid)
        .orderBy("time", "desc")
        .startAfter(this.state.againMessage)
        .limit(33)
        .onSnapshot((querySnapshot) => {
          let p = 0;
          let chats = [];
          querySnapshot.docs.forEach(async (doc) => {
            p++;
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              foo.recipientsProfiled = await Promise.all(
                foo.recipients.map(async (recipientId) => {
                  var recipient = await this.hydrateUser(recipientId).user();
                  return recipient && JSON.parse(recipient);
                })
              );
              var entity =
                foo.entityId &&
                (await this.hydrateEntity(
                  foo.entityId,
                  foo.entityType
                ).entity());
              foo.entity = entity && JSON.parse(entity);
              var author = await this.hydrateUser(foo.authorId).user();
              foo.author = author && JSON.parse(author);

              chats.push(foo);
            }
          });
          if (p === querySnapshot.docs.length && this.state.chats !== chats) {
            var lastMessage = chats[chats.length - 1];
            var againMessage = chats[0];
            this.setState({
              chats,
              lastMessage: lastMessage ? lastMessage : null,
              againMessage: againMessage ? againMessage : null
            });
          }
        }, standardCatch);
  };
  moreMessages = () => {
    this.state.lastMessage &&
      firebase
        .firestore()
        .collection("chats")
        .where("recipients", "array-contains", this.props.auth.uid)
        .orderBy("time", "desc")
        .startAfter(this.state.lastMessage)
        .limit(33)
        .onSnapshot((querySnapshot) => {
          let p = 0;
          let chats = [];
          querySnapshot.docs.forEach(async (doc) => {
            p++;
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              foo.recipientsProfiled = await Promise.all(
                foo.recipients.map(async (recipientId) => {
                  var recipient = await this.hydrateUser(recipientId).user();
                  return recipient && JSON.parse(recipient);
                })
              );
              var entity =
                foo.entityId &&
                (await this.hydrateEntity(
                  foo.entityId,
                  foo.entityType
                ).entity());
              foo.entity = entity && JSON.parse(entity);
              var author = await this.hydrateUser(foo.authorId).user();
              foo.author = author && JSON.parse(author);

              chats.push(foo);
            }
          });
          if (p === querySnapshot.docs.length && this.state.chats !== chats) {
            var lastMessage = chats[chats.length - 1];
            var againMessage = chats[0];
            this.setState({
              chats,
              lastMessage: lastMessage ? lastMessage : null,
              againMessage: againMessage ? againMessage : null
            });
          }
        }, standardCatch);
  };
  handleChatSnapshot = async (chats) =>
    Promise.all(
      chats.map(async (foo) => {
        foo.recipientsProfiled = await Promise.all(
          foo.recipients.map(async (recipientId) => {
            var recipient = await this.hydrateUser(recipientId).user();
            return recipient && JSON.parse(recipient);
          })
        );
        var author = await this.hydrateUser(foo.authorId).user();
        foo.author = author && JSON.parse(author);
        return foo;
      })
    );
  showChats = async () => {
    this.props.loadGreenBlue("getting chats...");
    let p = 0;
    const keepalive = 3600000;
    const free = await JailClass(
      //for each: foo = {...doc.data(),doc.id}
      firebase
        .firestore()
        .collection("chats")
        .where("recipients", "array-contains", this.props.auth.uid), //optional canIncludes()?
      keepalive,
      { order: "time", by: "desc" }, //sort
      null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      33, //limit
      null, //startAfter
      null //endBefore
    );
    this.setState(
      {
        lastMessage: free.startAfter,
        againMessage: free.endBefore
      },
      async () => {
        let chats = [];
        if (free.docs.length === 0) {
          this.props.setForumDocs({ chats: [] });
        } else {
          free.docs.forEach(async (doc) => {
            p++;
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;

              var entity =
                foo.entityId &&
                (await this.hydrateEntity(
                  foo.entityId,
                  foo.entityType
                ).entity());
              foo.entity = entity && JSON.parse(entity);
              chats.push(foo);
            }
          });
        }
        if (p === free.docs.length) {
          chats = await this.handleChatSnapshot(chats);
          this.props.unloadGreenBlue();
          this.setState({
            chats,
            lastMessage: chats[chats.length - 1],
            againMessage: chats[0]
          });
        }
      }
    );

    const free1 = await JailClass(
      //for each: foo = {...doc.data(),doc.id}
      firebase
        .firestore()
        .collection("chats")
        .where("recipients", "array-contains", this.props.auth.uid), //optional canIncludes()?
      keepalive,
      { order: "time", by: "desc" }, //sort
      null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      33, //limit
      null, //startAfter
      null //endBefore
    );
    this.setState(
      {
        lastMessage: free1.startAfter,
        againMessage: free1.endBefore
      },
      async () => {
        let pp = 0;
        let myDocs = [];
        free1.docs.forEach(async (doc) => {
          pp++;
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            var author = await this.hydrateUser(foo.authorId).user();
            foo.author = author && JSON.parse(author);

            myDocs.push(foo);
          }
        });
        if (pp === free1.docs.length && this.state.myDocs !== myDocs) {
          this.setState({
            myDocs
          });
        }
      }
    );
    //docs
    const free2 = await JailClass(
      //for each: foo = {...doc.data(),doc.id}
      firebase
        .firestore()
        .collection("chats")
        .where("recipients", "array-contains", this.props.auth.uid)
        .where("gsUrl", ">", ""), //optional canIncludes()?
      keepalive,
      { order: "time", by: "desc" }, //sort gsURL
      null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      20, //limit
      null, //startAfter
      null //endBefore
    );
    this.setState(
      {
        lastMessage: free2.startAfter,
        againMessage: free2.endBefore
      },
      async () => {
        let pp = 0;
        let myDocs = [];
        free2.docs.forEach(async (doc) => {
          pp++;
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            var author = await this.hydrateUser(foo.authorId).user();
            foo.author = author && JSON.parse(author);

            myDocs.push(foo);
          }
        });
        if (pp === free2.docs.length && this.state.myDocs !== myDocs) {
          this.setState({
            myDocs
          });
        }
      },
      standardCatch
    );

    this.getInvites();
  };
  getInvites = async () => {
    let invites = [];
    let p = 0;
    const keepalive = 3600000;
    const free = await JailClass(
      //for each: foo = {...doc.data(),doc.id}
      firebase
        .firestore()
        .collection("chats")
        .where("recipients", "array-contains", this.props.auth.uid)
        .where("date", ">=", new Date().getTime()), //optional canIncludes()?
      keepalive,
      { order: "date", by: "desc" }, //sort gsURL
      null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      20, //limit
      null, //startAfter
      null //endBefore
    );
    free.docs.forEach(async (foo) => {
      p++;
      var author = await this.hydrateUser(foo.authorId).user();
      foo.author = author && JSON.parse(author);

      invites.push(foo);
    });
    if (p === free.docs.length) {
      this.setState({
        invites
      });
    }
    let selfvites = [];
    let pp = 0;
    const free1 = await JailClass(
      //for each: foo = {...doc.data(),doc.id}
      firebase
        .firestore()
        .collection("chats")
        .where("recipients", "==", [this.props.auth.uid])
        .where("date", ">=", new Date().getTime()), //optional canIncludes()?
      keepalive,
      { order: "date", by: "desc" }, //sort gsURL
      null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      20, //limit
      null, //startAfter
      null //endBefore
    );
    free.docs.forEach(async (foo) => {
      pp++;
      var author = await this.hydrateUser(foo.authorId).user();
      foo.author = author && JSON.parse(author);

      selfvites.push(foo);
    });
    if (pp === free1.docs.length) {
      /*var selfvites = f.filter(
              (x) => x.date && !Object.keys(this.state.notes).includes(x.id)
            );*/
      this.setState({
        selfvites
      });
    }
  };
  async handleDelete(id) {
    let { notes } = this.state;
    var note = notes.find((x) => x._id === id);

    if (note) {
      const noAuthorOrMatch =
        !note.authorId ||
        note.authorId === "" ||
        note.authorId === this.props.auth.uid;
      //copies for anonymity
      noAuthorOrMatch &&
        firebase
          .firestore()
          .collection("chats")
          .doc(note._id)
          .delete()
          .then((ref) => {
            console.log("deleted plan from messages " + note._id);
          })
          .catch(standardCatch);
      noAuthorOrMatch &&
        firebase
          .firestore()
          .collection("calendar")
          .doc(note._id)
          .delete()
          .then((ref) => {
            console.log("deleted plan from calendar " + note._id);
          })
          .catch(standardCatch);
      noAuthorOrMatch &&
        firebase
          .firestore()
          .collection("planchats")
          .where("chatId", "==", note._id)
          .onSnapshot((querySnapshot) => {
            querySnapshot.docs.forEach(async (doc) => {
              return firebase
                .firestore()
                .collection("planchats")
                .doc(doc.id)
                .delete()
                .then((ref) => {
                  console.log("deleted plan from messages " + doc.id);
                })
                .catch(standardCatch);
            });
          }, standardCatch);
      await this.state.db
        .deleteNote(note)
        .then(() => {
          console.log("deleted plan from local " + note._id);
          //this.getNotes();
        })
        .catch(standardCatch);
    } else {
      console.log("no plan to delete");
    }
  }
  async handleSave(note, method) {
    delete note.term;
    delete note.saving;
    delete note.planDateOpen;
    delete note.planSettingsOpen;
    delete note.predictions;
    delete note.enteredValue;
    var foo = await this.state.db[method](note);
    return foo;
  }
  getNotes = async () => {
    await this.state.db.getAllNotes().then(async (notes) => {
      /*var result = Object.keys(notes).map(key => {
      return notes[key];
      }); 
      this.props.setForumDocs({ notes, noteCount: result });*/
      console.log(notes);
      notes.sort((a, b) => new Date(b.date) - new Date(a.date));
      await Promise.all(
        notes.map(async (note) => {
          note.recipientsProfiled =
            note.recipients &&
            (await Promise.all(
              note.recipients.map(async (recipientId) => {
                var recipient = await this.hydrateUser(recipientId).user();
                return recipient && JSON.parse(recipient);
              })
            ));
          var author =
            note.authorId &&
            note.authorId !== "" &&
            (await this.hydrateUser(note.authorId).user());
          note.author = author && JSON.parse(author);
          return note;
        })
      ).then((notes) => {
        this.setState({
          notes
        });
      });
    });
  };
  componentDidMount = async () => {
    this.getNotes();
  };
  componentDidUpdate = async (prevProps) => {
    /*if (functions !== this.state.functions) {
      const itobj = functions.map((x) => {
        return { ["docs" + x.id]: window.fuffer.dbFUFFER[x.id] };
      });
      this.setState({ functions, ...itobj }, () => {
        functions.map((x) => {
          return console.log(this.state["docs" + x.id]);
        });
      });
    }*/
    if (this.props.user !== undefined && this.props.user !== prevProps.user) {
      if (this.props.user.faveComm) {
        let favComm = [...this.props.user.faveComm];
        Promise.all(
          favComm.map(async (x) => {
            var community = await this.getCommunity(x).community();

            return community && JSON.parse(community);
          })
        )
          .then((favComm) => {
            var favcit = this.props.user.favoriteCities
              ? this.props.user.favoriteCities
              : [];
            var favoriteCities = favcit.concat(favComm);
            this.setState({ favoriteCities });
          })
          .catch((e) => console.log(e));
        this.props.user.following &&
          Promise.all(
            this.props.user.following.map(async (x) => {
              var user = await this.hydrateUser(x).user();
              return user && JSON.parse(user);
            })
          ).then((following) => {
            this.setState({ following });
          });
      }
    }
    // reset, update privateKeysEncryptedByPublicKeys
    // device identifier copy
    if (this.state.users !== this.state.lastUsers) {
      let set = {};
      [
        "forumPosts",
        "budget",
        "classes",
        "departments",
        "cases",
        "elections",
        "ordinances"
      ].map((g, i) => {
        if (this.props[g]) {
          set[g] = [];
          this.props[g].map(async (x) => {
            var user = await this.hydrateUser(x.authorId).user();
            x.author = user && JSON.parse(user);
            return set[g].push(x);
          });
        }

        if (this.props[g].length === i) {
          return this.props.setForumDocs({ [g]: set[g] });
        } else return null;
      });
      var profilePosts = [];
      this.props.profilePosts.map(async (x) => {
        var user = await this.hydrateUser(x.authorId).user();
        x.author = user && JSON.parse(user);
        return x.author && profilePosts.push(x);
      });
      profilePosts.length === this.props.profilePosts.length &&
        this.props.setForumDocs({ profilePosts });

      this.setState({ lastUsers: this.state.users });
    }
    if (this.state.communities !== this.state.lastCommunities) {
      let set = {};
      profileDirectory.map((g) => {
        let p = 0;
        if (this.props[g.collection]) {
          set[g.collection] = [];
          this.props[g.collection].map((x) => {
            p++;
            var community = this.state.communities.find(
              (a) => a.id === x.communityId
            );
            x.community = community ? community : x.community;
            return set[g.collection].push(x);
          });
          return (
            this.props[g.collection].length === p &&
            this.props.setForumDocs({ [g.collection]: set[g.collection] })
          );
        } else return null;
      });
      this.setState({ lastCommunities: this.state.communities });
      if (this.props.community) {
        var community = this.state.communities.find(
          (x) => x.id === this.props.community.id
        );
        this.props.setCommunity({ community });
      }
    }
    /*if(this.state.postsWithChatMetas!==this.state.lastPWCM)
    this.setState({lastPWCM:this.state.postsWithChatMetas})*/
  };
  hydratePostChatMeta = (parent) => {
    let fine = true;
    const { recordedPostChatMetas } = this.state;
    return {
      meta: async () => {
        const shortId = shortHandId(parent);
        if (!recordedPostChatMetas.includes(shortId)) {
          this.setState({
            recordedPostChatMetas: [...recordedPostChatMetas, shortId]
          });
          firebase
            .firestore()
            .collection("chatMeta")
            .where("threadId", "==", shortId)
            .onSnapshot((querySnapshot) => {
              querySnapshot.docs.forEach(async (doc) => {
                if (doc.exists) {
                  var updatedVideo = doc.data();
                  updatedVideo.id = doc.id;
                  updatedVideo.folder = updatedVideo.folder
                    ? updatedVideo.folder
                    : "*";
                  const postWithChatMeta = this.state.postsWithChatMetas[
                    shortId
                  ];
                  const videos = Object.values(
                    postWithChatMeta ? postWithChatMeta : {}
                  ).filter((x) => x.gsURL !== updatedVideo.gsURL);

                  var postsWithChatMetas = {
                    ...Object.values(this.state.postsWithChatMetas).filter(
                      (x, i) =>
                        Object.keys(this.state.postsWithChatMetas)[i] !==
                        shortId //notThisOne;
                    ),
                    [shortId]: {
                      ...videos,
                      updatedVideo
                    }
                  };
                  this.setState({ postsWithChatMetas });
                }
              });
            }, standardCatch);
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!parent) {
              reject(shortId);
            }
            var close = firebase
              .firestore()
              .collection("chatMeta")
              .where("threadId", "==", shortId)
              .get()
              .then((querySnapshot) => {
                if (querySnapshot.empty) {
                  resolve("[]");
                } else
                  querySnapshot.docs.forEach(async (doc) => {
                    if (doc.exists) {
                      var newVideo = doc.data();
                      newVideo.id = doc.id;
                      newVideo.folder = newVideo.folder ? newVideo.folder : "*";
                      const postWithChatMeta = this.state.postsWithChatMetas[
                        shortId
                      ];
                      const videos = Object.values(
                        postWithChatMeta ? postWithChatMeta : {}
                      ).filter((x) => x.gsURL !== newVideo.gsURL);
                      if (videos.constructor === Array) {
                        var postsWithChatMetas = {
                          ...Object.values(
                            this.state.postsWithChatMetas
                          ).filter((x, i) => {
                            const notThisOne =
                              Object.keys(this.state.postsWithChatMetas)[i] !==
                              shortId;
                            return notThisOne;
                          }),
                          [shortId]: {
                            ...videos,
                            newVideo
                          }
                        };
                        if (postsWithChatMetas) {
                          this.setState({ postsWithChatMetas });
                          resolve(JSON.stringify([...videos, newVideo]));
                        }
                      }
                    } else return resolve("[]");
                  });
              })
              .catch((e) => {
                console.log(e.message);
                return resolve("[]");
              });
            if (!parent) {
              close();
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!parent) {
              reject(shortId);
            }
            this.getTimeout = setTimeout(() => {
              var videos = this.state.postsWithChatMetas[shortId];

              if (videos) {
                resolve(JSON.stringify(videos));
              } else {
                resolve("[]");
              }
            }, 2000);
          });
        }
      },
      closer: () => (fine = false)
    };
  };
  hydrateUserFromUserName = (profileUserName) => {
    let fine = true;
    const { recordedUserNames } = this.state;
    return {
      user: async () => {
        if (!recordedUserNames.includes(profileUserName)) {
          this.setState({
            recordedUserNames: [...recordedUserNames, profileUserName]
          });
          firebase
            .firestore()
            .collection("users")
            .where("username", "==", profileUserName.toLowerCase())
            .onSnapshot((querySnapshot) => {
              querySnapshot.docs.forEach(async (doc) => {
                if (doc.exists) {
                  var user = doc.data();
                  user.id = doc.id;

                  var skills = [
                    ...(user.experiences ? user.experiences : []),
                    ...(user.education ? user.education : []),
                    ...(user.hobbies ? user.hobbies : [])
                  ];
                  user.skills = skills.map(
                    (x) => x.charAt(0).toUpperCase() + x.slice(1)
                  );

                  var rest = this.state.users.filter((x) => x.id !== user.id);
                  var users = [...rest, user];
                  this.setState({ users });
                }
              });
            }, standardCatch);
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!profileUserName) {
              reject(!profileUserName);
            }
            var close = firebase
              .firestore()
              .collection("users")
              .where("username", "==", profileUserName.toLowerCase())
              .get()
              .then((querySnapshot) => {
                if (querySnapshot.empty) {
                  resolve("{}");
                } else
                  querySnapshot.docs.forEach(async (doc) => {
                    if (doc.exists) {
                      var user = doc.data();
                      user.id = doc.id;

                      var skills = [
                        ...(user.experiences ? user.experiences : []),
                        ...(user.education ? user.education : []),
                        ...(user.hobbies ? user.hobbies : [])
                      ];
                      user.skills = skills.map(
                        (x) => x.charAt(0).toUpperCase() + x.slice(1)
                      );

                      var rest = this.state.users.filter(
                        (x) => x.id !== user.id
                      );
                      this.setState({ users: [...rest, user] });
                      return resolve(JSON.stringify(user));
                    } else return resolve("{}");
                  });
              })
              .catch((e) => {
                console.log(e.message);
                return resolve(null);
              });
            if (!profileUserName) {
              close();
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!profileUserName) {
              reject(!profileUserName);
            }
            this.getTimeout = setTimeout(() => {
              var user = this.state.users.find(
                (x) => x.username === profileUserName
              );

              if (user) {
                resolve(JSON.stringify(user));
              } else {
                resolve("{}");
              }
            }, 2000);
          });
        }
      },
      closer: () => (fine = false)
    };
  };

  hydrateUser = (userId) => {
    let fine = true;
    const { recordedUsers } = this.state;
    return {
      user: async () => {
        if (!recordedUsers.includes(userId)) {
          this.setState({
            recordedUsers: [...recordedUsers, userId]
          });
          firebase
            .firestore()
            .collection("users")
            .doc(userId)
            .onSnapshot(async (doc) => {
              if (doc.exists) {
                var user = doc.data();
                user.id = doc.id;

                var skills = [
                  ...(user.experiences ? user.experiences : []),
                  ...(user.education ? user.education : []),
                  ...(user.hobbies ? user.hobbies : [])
                ];
                user.skills = skills.map(
                  (x) => x.charAt(0).toUpperCase() + x.slice(1)
                );

                var rest = this.state.users.filter((x) => x.id !== user.id);

                this.setState({ users: [...rest, user] });
              }
            }, standardCatch);
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!userId) {
              reject(!userId);
            }
            var close = firebase
              .firestore()
              .collection("users")
              .doc(userId)
              .get()
              .then(async (doc) => {
                if (doc.exists) {
                  var user = doc.data();
                  user.id = doc.id;

                  var skills = [
                    ...(user.experiences ? user.experiences : []),
                    ...(user.education ? user.education : []),
                    ...(user.hobbies ? user.hobbies : [])
                  ];
                  user.skills = skills.map(
                    (x) => x.charAt(0).toUpperCase() + x.slice(1)
                  );

                  var rest = this.state.users.filter((x) => x.id !== user.id);
                  this.setState({ users: [...rest, user] });
                  return user && resolve(JSON.stringify(user));
                } else return resolve("{}");
              })
              .catch(standardCatch);
            if (!userId) {
              close();
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!userId) {
              reject(!userId);
            }
            this.getTimeout = setTimeout(() => {
              var user = this.state.users.find((x) => x.id === userId);

              user && resolve(JSON.stringify(user));
            }, 2000);
          });
        }
      },
      closer: () => (fine = false)
    };
  };
  getCommunity = (communityId) => {
    let fine = true;
    const { recordedCommunities } = this.state;
    return {
      community: async () => {
        if (!recordedCommunities.includes(communityId)) {
          this.setState({
            recordedCommunities: [...recordedCommunities, communityId]
          });
          firebase
            .firestore()
            .collection("communities")
            .doc(communityId)
            .onSnapshot(async (doc) => {
              if (doc.exists) {
                var community = doc.data();
                community.id = doc.id;
                var rest = this.state.communities.filter(
                  (x) => x.id !== community.id
                );
                var communities = [...rest, community];
                this.setState({ communities });
              }
            }, standardCatch);
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!communityId) {
              reject(!communityId);
            }
            var close = firebase
              .firestore()
              .collection("communities")
              .doc(communityId)
              .get()
              .then(async (doc) => {
                if (doc.exists) {
                  var community = doc.data();
                  community.id = doc.id;
                  var rest = this.state.communities.filter(
                    (x) => x.id !== community.id
                  );

                  this.setState({ communities: [...rest, community] });
                  return community && resolve(JSON.stringify(community));
                } else return resolve("{}");
              })
              .catch((e) => {
                console.log(e.message);
                return resolve("{}");
              });
            if (!communityId) {
              close();
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!communityId) {
              reject(!communityId);
            }
            this.getTimeout = setTimeout(() => {
              var community = this.state.communities.find(
                (x) => x.id === communityId
              );

              community && resolve(JSON.stringify(community));
            }, 2000);
          });
        }
      },
      closer: () => (fine = false)
    };
  };
  getCommunityByName = (communityName) => {
    let fine = true;
    const { recordedCommunityNames } = this.state;

    return {
      community: async () => {
        if (!recordedCommunityNames.includes(communityName)) {
          this.setState({
            recordedCommunityNames: [...recordedCommunityNames, communityName]
          });
          firebase
            .firestore()
            .collection("communities")
            .where("messageLower", "==", communityName.toLowerCase())
            .onSnapshot((querySnapshot) => {
              querySnapshot.docs.forEach((doc) => {
                if (doc.exists) {
                  var community = doc.data();
                  community.id = doc.id;
                  /*var messageLower = community.message.toLowerCase();
                    if (community.messageLower !== messageLower)
                      firebase
                        .firestore()
                        .collection("communities")
                        .doc(community.id)
                        .update({ messageLower });*/
                  var rest = this.state.communities.filter(
                    (x) => x.id !== community.id
                  );
                  var communities = [...rest, community];
                  this.setState({ communities });
                }
              });
            }, standardCatch);
          return await new Promise((resolve, reject) => {
            !fine && reject(!fine);
            if (!communityName) {
              reject(!communityName);
            }
            var close = firebase
              .firestore()
              .collection("communities")
              .where("messageLower", "==", communityName.toLowerCase())
              .get()
              .then((querySnapshot) => {
                if (querySnapshot.empty) {
                  return resolve("{}");
                } else
                  querySnapshot.docs.forEach((doc) => {
                    if (doc.exists) {
                      var community = doc.data();

                      community.id = doc.id;

                      var rest = this.state.communities.filter(
                        (x) => x.id !== community.id
                      );
                      this.setState({ communities: [...rest, community] });
                      return community && resolve(JSON.stringify(community));
                    } else return resolve("{}");
                  });
              })
              .catch((e) => {
                console.log(e.message);
                return resolve("{}");
              });
            if (!communityName) {
              close();
            }
          });
        } else {
          return await new Promise((resolve, reject) => {
            !fine && reject(!fine);
            if (!communityName) {
              reject(!communityName);
            }
            this.getTimeout = setTimeout(() => {
              var community = this.state.communities.find(
                (x) => x.message.toLowerCase() === communityName.toLowerCase()
              );

              if (community) {
                resolve(JSON.stringify(community));
              } else {
                resolve("{}");
              }
            }, 2000);
          });
        }
      },
      closer: () => (fine = false)
    };
  };
  hydrateEntityFromName = (
    entityCollection,
    nameUnparsed,
    communityNameUnparsed
  ) => {
    let fine = true;
    const { recordedEntityNames } = this.state;
    var communityName = communityNameUnparsed.replace(/_/g, " ");
    var name = nameUnparsed.replace(/_/g, " ");
    return {
      entity: async () => {
        if (!recordedEntityNames.includes(name + communityNameUnparsed)) {
          this.setState({
            recordedEntityNames: [
              ...recordedEntityNames,
              name + communityNameUnparsed
            ]
          });
          firebase
            .firestore()
            .collection(entityCollection)
            .where("messageLower", "==", name.toLowerCase())
            .onSnapshot((querySnapshot) => {
              querySnapshot.docs.forEach(async (doc) => {
                if (doc.exists) {
                  var entity = doc.data();
                  entity.id = doc.id;
                  entity.collection = entityCollection;
                  var community =
                    entity.communityId &&
                    (await this.getCommunity(entity.communityId).community());
                  entity.community = community && JSON.parse(community);
                  var adminArray = entity.admin ? entity.admin : [];
                  var memberArray = entity.members ? entity.members : [];
                  var recipientArray = [
                    entity.authorId,
                    ...adminArray,
                    ...memberArray
                  ];
                  entity.recipients = Promise.all(
                    recipientArray.map(async (recipientId) => {
                      var recipient = await this.hydrateUser(
                        recipientId
                      ).user();
                      return recipient && JSON.parse(recipient);
                    })
                  );
                  if (entity.recipients) {
                    var rest = this.state.entities.filter(
                      (x) =>
                        x.id !== entity.id && x.entityType !== entity.entityType
                    );
                    var entities = [...rest, entity];
                    this.setState({ entities });
                  }
                }
              });
            }, standardCatch);
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            var close = firebase
              .firestore()
              .collection(entityCollection)
              .where("messageLower", "==", name.toLowerCase())
              .get()
              .then((querySnapshot) => {
                querySnapshot.docs.forEach(async (doc) => {
                  if (doc.exists) {
                    var entity = doc.data();
                    entity.id = doc.id;
                    entity.collection = entityCollection;
                    var community =
                      entity.communityId &&
                      (await this.getCommunity(entity.communityId).community());
                    entity.community = community && JSON.parse(community);
                    var adminArray = entity.admin ? entity.admin : [];
                    var memberArray = entity.members ? entity.members : [];
                    var recipientArray = [
                      entity.authorId,
                      ...adminArray,
                      ...memberArray
                    ];
                    entity.recipients = Promise.all(
                      recipientArray.map(async (recipientId) => {
                        var recipient = await this.hydrateUser(
                          recipientId
                        ).user();
                        return recipient && JSON.parse(recipient);
                      })
                    );
                    if (entity.recipients) {
                      var rest = this.state.entities.filter(
                        (x) =>
                          x.id !== entity.id &&
                          x.collection !== entity.collection
                      );

                      this.setState({ entities: [...rest, entity] });
                      return entity && resolve(JSON.stringify(entity));
                    }
                  } else return resolve("{}");
                });
              })
              .catch((e) => {
                console.log(e.message);
                return resolve("{}");
              });
            if (!name) {
              close();
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!name) {
              reject(!name);
            }
            var com = await this.getCommunityByName(communityName).community();
            var community = com && JSON.parse(com);
            if (Object.keys(community).length !== 0) {
              this.getTimeout = setTimeout(() => {
                var entity = this.state.entities.find(
                  (x) =>
                    x.message.toLowerCase() === name.toLowerCase() &&
                    x.communityId === community.id
                );

                entity && resolve(JSON.stringify(entity));
              }, 2000);
            } else {
              var entity = this.state.entities.find(
                (x) =>
                  x.message.toLowerCase() === name.toLowerCase() &&
                  x.communityId === community.id
              );

              entity && resolve(JSON.stringify(entity));
            }
          });
        }
      },
      closer: () => (fine = false)
    };
  };
  hydrateEntity = (entityId, entityType) => {
    let fine = true;
    const { recordedEntities } = this.state;
    return {
      entity: async () => {
        if (!recordedEntities.includes(entityType + entityId)) {
          this.setState({
            recordedEntities: [...recordedEntities, entityType + entityId]
          });
          firebase
            .firestore()
            .collection(entityType)
            .doc(entityId)
            .onSnapshot(async (doc) => {
              if (doc.exists) {
                var entity = doc.data();
                entity.id = doc.id;
                entity.collection = entityType;
                var community =
                  entity.communityId &&
                  (await this.getCommunity(entity.communityId).community());
                entity.community = community && JSON.parse(community);
                var adminArray = entity.admin ? entity.admin : [];
                var memberArray = entity.members ? entity.members : [];
                var recipientArray = [
                  entity.authorId,
                  ...adminArray,
                  ...memberArray
                ];
                entity.recipients = Promise.all(
                  recipientArray.map(async (recipientId) => {
                    var recipient = await this.hydrateUser(recipientId).user();
                    return recipient && JSON.parse(recipient);
                  })
                );
                if (entity.recipients) {
                  var rest = this.state.entities.filter(
                    (x) =>
                      x.id !== entity.id && x.entityType !== entity.entityType
                  );
                  var entities = [...rest, entity];
                  this.setState({ entities });
                }
              }
            }, standardCatch);
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!entityId) {
              reject(!entityId);
            }
            var close = firebase
              .firestore()
              .collection(entityType)
              .doc(entityId)
              .get()
              .then(async (doc) => {
                if (doc.exists) {
                  var entity = doc.data();
                  entity.id = doc.id;
                  entity.collection = entityType;
                  var community =
                    entity.communityId &&
                    (await this.getCommunity(entity.communityId).community());
                  entity.community = community && JSON.parse(community);
                  var adminArray = entity.admin ? entity.admin : [];
                  var memberArray = entity.members ? entity.members : [];
                  var recipientArray = [
                    entity.authorId,
                    ...adminArray,
                    ...memberArray
                  ];
                  entity.recipients = Promise.all(
                    recipientArray.map(async (recipientId) => {
                      var recipient = await this.hydrateUser(
                        recipientId
                      ).user();
                      return recipient && JSON.parse(recipient);
                    })
                  );
                  if (entity.recipients) {
                    var rest = this.state.entities.filter(
                      (x) =>
                        x.id !== entity.id && x.collection !== entity.collection
                    );

                    this.setState({ entities: [...rest, entity] });
                    return entity && resolve(JSON.stringify(entity));
                  }
                } else return resolve("{}");
              })
              .catch((e) => {
                console.log(e.message);
                return resolve("{}");
              });
            if (!entityId) {
              close();
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!entityId) {
              reject(!entityId);
            }
            this.getTimeout = setTimeout(() => {
              var entity = this.state.entities.find(
                (x) => x.id === entityId && x.entityType === entityType
              );

              entity && resolve(JSON.stringify(entity));
            }, 2000);
          });
        }
      },
      closer: () => (fine = false)
    };
  };
  handleDropId = (droppedId) => {
    let fine = true;
    const { recordedDroppedPosts } = this.state;
    var collection = "forum";
    var id = "";
    var start = "";
    if (droppedId) {
      if (droppedId.startsWith("forum")) {
        collection = "forum";
        start = "forum";
      } else if (droppedId.startsWith("oldBudget")) {
        collection = "oldBudget";
        start = "oldBudget";
      } else if (droppedId.startsWith("oldCase")) {
        collection = "oldCases";
        start = "oldCase";
      } else if (droppedId.startsWith("oldElection")) {
        collection = "oldElections";
        start = "oldElection";
      } else if (droppedId.startsWith("election")) {
        collection = "elections";
        start = "election";
      } else if (droppedId.startsWith("case")) {
        collection = "court cases";
        start = "case";
      } else if (droppedId.startsWith("budget")) {
        collection = "budget & proposals";
        start = "budget";
      }
      id = droppedId.split(start)[1];
    }
    return {
      promise: async () => {
        if (!recordedDroppedPosts.includes(collection + id)) {
          this.setState({
            recordedDroppedPosts: [...recordedDroppedPosts, collection + id]
          });

          firebase
            .firestore()
            .collection(collection)
            .doc(id)
            .onSnapshot(async (doc) => {
              var droppedPost = doc.data();
              droppedPost.id = doc.id;
              droppedPost.collection = collection;
              var community =
                droppedPost.communityId &&
                (await this.getCommunity(droppedPost.communityId).community());
              droppedPost.community = community && JSON.parse(community);
              var author = await this.hydrateUser(droppedPost.authorId).user();
              droppedPost.author = author && JSON.parse(author);

              if (droppedPost.author) {
                var rest = this.state.droppedPosts.filter(
                  (x) => x.id !== droppedPost.id
                );
                var droppedPosts = [...rest, droppedPost];
                this.setState({
                  droppedPosts
                });
              }
            });
          return await new Promise((resolve, reject) => {
            !fine && reject(!fine);
            if (!droppedId) {
              reject(!droppedId);
            }
            var close = firebase
              .firestore()
              .collection(collection)
              .doc(id)
              .get()
              .then(async (doc) => {
                var droppedPost = doc.data();
                droppedPost.id = doc.id;
                droppedPost.collection = collection;
                var entity =
                  droppedPost.entityId &&
                  (await this.hydrateEntity(
                    droppedPost.entityId,
                    droppedPost.entityType
                  ).entity());
                droppedPost.entity = entity;
                var community =
                  droppedPost.communityId &&
                  (await this.getCommunity(
                    droppedPost.communityId
                  ).community());
                droppedPost.community = community && JSON.parse(community);
                var author = await this.hydrateUser(
                  droppedPost.authorId
                ).user();
                droppedPost.author = author && JSON.parse(author);

                var videos = await this.hydratePostChatMeta(droppedPost).meta();
                droppedPost.videos = videos && JSON.parse(videos);
                if (
                  (!droppedPost.entityId || droppedPost.entity) &&
                  (!droppedPost.communityId || droppedPost.community) &&
                  droppedPost.videos
                ) {
                  var rest = this.state.droppedPosts.filter(
                    (x) =>
                      x.id !== droppedPost.id &&
                      x.collection !== droppedPost.collection
                  );
                  this.setState({ droppedPosts: [...rest, droppedPost] });
                  var string = JSON.stringify(droppedPost);
                  resolve(string);
                }
              });
            if (!droppedId) {
              close(!droppedId);
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!droppedId) {
              reject(!droppedId);
            }
            this.getTimeout = setTimeout(() => {
              var droppedPost = this.state.droppedPosts.find(
                (x) => x.id === id && x.collection === collection
              );

              droppedPost && resolve(JSON.stringify(droppedPost));
            }, 2000);
          });
        }
      },
      closer: () => {
        fine = false;
      }
    };
  };
  lastCityForum = async (city, commtype) => {
    if (!this.state.lastCityPost) {
      window.alert("no more");
    } else {
      var message = "fetching forum for " + city;
      this.props.loadGreenBlue(message);

      const keepalive = 3600000;
      const jailclass = {
        docsOutputLabel: "forumPosts",
        stateAfterLabel: "lastCityPost",
        endBeforeLabel: "undoCityPost",
        state: {
          commentsName: "forumcomments"
        },
        //for each: foo = {...doc.data(),doc.id}
        snapshotQuery: firebase
          .firestore()
          .collection("forum")
          .where("city", "==", city)
          .where("newLessonShow", "==", commtype), //optional canIncludes()?
        keepalive,
        sort: { order: "time", by: "desc" }, //sort
        near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        limit: 14, //limit
        startAfter: this.state.lastCityPost, //startAfter
        endBefore: this.state.undoCityPost, //endBefore
        verbose: true, //verbose
        whenOn: false //whenOn
      };

      this.setState({
        jailclasses: [...this.state.jailclasses, jailclass]
      });
    }
  };
  undoCityForum = async (city, commtype) => {
    if (!this.state.undoCityPost) {
      window.alert("nothing new");
    } else {
      var message = "fetching forum for " + city;
      this.props.loadGreenBlue(message);
      const keepalive = 3600000;
      const jailclass = {
        docsOutputLabel: "forumPosts",
        stateAfterLabel: "lastCityPost",
        endBeforeLabel: "undoCityPost",
        state: {
          commentsName: "forumcomments"
        },
        //for each: foo = {...doc.data(),doc.id}
        snapshotQuery: firebase
          .firestore()
          .collection("forum")
          .where("city", "==", city)
          .where("newLessonShow", "==", commtype), //optional canIncludes()?
        keepalive,
        sort: { order: "time", by: "desc" }, //sort
        near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        limit: 14, //limit
        startAfter: this.state.lastCityPost, //startAfter
        endBefore: this.state.undoCityPost, //endBefore
        verbose: true, //verbose
        whenOn: false //whenOn
      };

      this.setState({
        jailclasses: [...this.state.jailclasses, jailclass]
      });
    }
  };
  paginateCommForum = async (post, postOld) => {
    const { community } = this.props;
    var commtype = this.props.commtype;
    const {
      collection,
      NewcommentsName,
      ExpiredcommentsName,
      filterTime,
      name,
      isForms,
      old,
      last,
      undo,
      lastOld,
      undoOld
    } = fillQuery(commtype);
    if (!this.state[{ last, undo }[post]]) {
      window.alert("no more");
    } else {
      var message = "fetching more " + collection + " for " + community.message;

      this.props.loadGreenBlue(message);
      if (filterTime && !isForms) {
        const keepalive = 3600000;
        const jailclass = {
          docsOutputLabel: name,
          stateAfterLabel: last,
          endBeforeLabel: undo,
          state: {
            commentsName: NewcommentsName,
            filterTime: true,
            oppositeComments: ExpiredcommentsName,
            oppositeCollection: old
          },
          //for each: foo = {...doc.data(),doc.id}
          snapshotQuery: firebase
            .firestore()
            .collection(collection)
            .where("communityId", "==", community.id), //optional canIncludes()?
          keepalive,
          sort: { order: "time", by: "desc" }, //sort
          near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
          //near for geofirestore { center: near.center, radius: near.distance }
          limit: 14, //limit
          startAfter: null, //startAfter
          endBefore: null, //endBefore
          verbose: true, //verbose
          whenOn: false //whenOn
        };

        this.setState({
          jailclasses: [...this.state.jailclasses, jailclass]
        });

        if (postOld) {
          const jailclass = {
            docsOutputLabel: old,
            stateAfterLabel: lastOld,
            endBeforeLabel: undoOld,
            state: {
              commentsName: ExpiredcommentsName,
              filterTime: true,
              oppositeComments: NewcommentsName,
              oppositeCollection: collection
            },
            //for each: foo = {...doc.data(),doc.id}
            snapshotQuery: firebase
              .firestore()
              .collection(old)
              .where("communityId", "==", community.id), //optional canIncludes()?
            keepalive,
            sort: { order: "time", by: "desc" }, //sort
            near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
            //near for geofirestore { center: near.center, radius: near.distance }
            limit: 14, //limit
            startAfter: null, //startAfter
            endBefore: null, //endBefore
            verbose: true, //verbose
            whenOn: false //whenOn
          };

          this.setState({
            jailclasses: [...this.state.jailclasses, jailclass]
          });
        }
      } else if (collection === "forum") {
        const keepalive = 3600000;
        const jailclass = {
          docsOutputLabel: name,
          stateAfterLabel: last,
          endBeforeLabel: undo,
          state: {
            commentsName: NewcommentsName
          },
          //for each: foo = {...doc.data(),doc.id}
          snapshotQuery: firebase
            .firestore()
            .collection(collection)
            .where("communityId", "==", community.id)
            .where("newLessonShow", "==", commtype), //optional canIncludes()?
          keepalive,
          sort: { order: "time", by: "desc" }, //sort
          near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
          //near for geofirestore { center: near.center, radius: near.distance }
          limit: 14, //limit
          startAfter: null, //startAfter
          endBefore: null, //endBefore
          verbose: true, //verbose
          whenOn: false //whenOn
        };

        this.setState({
          jailclasses: [...this.state.jailclasses, jailclass]
        });
      } else {
        const keepalive = 3600000;
        const jailclass = {
          docsOutputLabel: name,
          stateAfterLabel: last,
          endBeforeLabel: undo,
          state: {
            commentsName: NewcommentsName
          },
          //for each: foo = {...doc.data(),doc.id}
          snapshotQuery: firebase
            .firestore()
            .collection(collection)
            .where("communityId", "==", community.id), //optional canIncludes()?
          keepalive,
          sort: { order: "time", by: "desc" }, //sort
          near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
          //near for geofirestore { center: near.center, radius: near.distance }
          limit: 14, //limit
          startAfter: null, //startAfter
          endBefore: null, //endBefore
          verbose: true, //verbose
          whenOn: false //whenOn
        };

        this.setState({
          jailclasses: [...this.state.jailclasses, jailclass]
        });
      }
    }
  };
  fetchCommForum = async (community, commtype) => {
    const {
      collection,
      NewcommentsName,
      ExpiredcommentsName,
      filterTime,
      name,
      isForms,
      old,
      last,
      undo,
      lastOld,
      undoOld
    } = fillQuery(commtype);
    var message = "fetching " + collection + " for " + community.message;
    this.props.loadGreenBlue(message);
    if (filterTime && !isForms) {
      const keepalive = 3600000;
      const jailclass1 = {
        docsOutputLabel: name,
        stateAfterLabel: last,
        endBeforeLabel: undo,
        state: {
          commentsName: NewcommentsName,
          filterTime: true,
          oppositeComments: ExpiredcommentsName,
          oppositeCollection: old
        },
        //for each: foo = {...doc.data(),doc.id}
        snapshotQuery: firebase
          .firestore()
          .collection(collection)
          .where("communityId", "==", community.id), //optional canIncludes()?
        keepalive,
        sort: { order: "time", by: "desc" }, //sort
        near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        limit: 14, //limit
        startAfter: null, //startAfter
        endBefore: null, //endBefore
        verbose: true, //verbose
        whenOn: false //whenOn
      };

      this.setState({
        jailclasses: [...this.state.jailclasses, jailclass1]
      });

      const jailclass = {
        docsOutputLabel: old,
        stateAfterLabel: lastOld,
        endBeforeLabel: undoOld,
        state: {
          commentsName: ExpiredcommentsName,
          filterTime: true,
          oppositeComments: NewcommentsName,
          oppositeCollection: collection
        },
        //for each: foo = {...doc.data(),doc.id}
        snapshotQuery: firebase
          .firestore()
          .collection(old)
          .where("communityId", "==", community.id), //optional canIncludes()?
        keepalive,
        sort: { order: "time", by: "desc" }, //sort
        near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        limit: 14, //limit
        startAfter: null, //startAfter
        endBefore: null, //endBefore
        verbose: true, //verbose
        whenOn: false //whenOn
      };

      this.setState({
        jailclasses: [...this.state.jailclasses, jailclass]
      });
    } else {
      //ordinances, departments
      const keepalive = 3600000;
      const jailclass = {
        docsOutputLabel: name,
        stateAfterLabel: last,
        endBeforeLabel: undo,
        state: { commentsName: NewcommentsName },
        //for each: foo = {...doc.data(),doc.id}
        snapshotQuery: firebase
          .firestore()
          .collection(collection)
          .where("communityId", "==", community.id)
          .where("newLessonShow", "==", commtype), //optional canIncludes()?
        keepalive,
        sort: { order: "time", by: "desc" }, //sort
        near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        limit: 14, //limit
        startAfter: null, //startAfter
        endBefore: null, //endBefore
        verbose: true, //verbose
        whenOn: false //whenOn
      };

      this.setState({
        jailclasses: [...this.state.jailclasses, jailclass]
      });
    }
  };
  fetchForum = (city, commtype, noLoad) => {
    //this.props.meAuth === undefined && this.props.getUserInfo();
    if (["new", "lessons", "show", "game"].includes(this.props.commtype)) {
      if (["new", "lessons", "show", "game"].includes(commtype)) {
        this.props.setIndex({ commtype });
        console.log(
          commtype + " same query as [new, lesson, show, game] for now"
        );
      }
    }
    this.setState(newPostingsClass, async () => {
      this.props.setCommunity({
        community: null,
        city
      });
      this.props.setForumDocs({
        commtype,
        ...newPostingsClassLatest
      });
      var message = "fetching forum for " + city;
      if (!noLoad) {
        this.props.loadGreenBlue(message);
        console.log(message + " ~~loadGreenBlue");
      } else {
        console.log("just gonna send thaat " + city);
      }
      const keepalive = 3600000;
      //for each: foo = {...doc.data(),doc.id}
      //sort && near cannot be true (coexist, orderBy used by geohashing)
      const jailclass = {
        docsOutputLabel: "forumPosts",
        stateAfterLabel: "lastCityPost",
        endBeforeLabel: "undoCityPost",
        state: { commentsName: "forumcomments" },
        //
        snapshotQuery: firebase
          .firestore()
          .collection("forum")
          .where("city", "==", city)
          .where("newLessonShow", "==", commtype), //optional canIncludes()?
        keepalive,
        sort: { order: "time", by: "desc" }, //sort
        near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        limit: 14, //limit
        startAfter: null, //startAfter
        endBefore: null, //endBefore
        verbose: true, //verbose
        whenOn: false //whenOn
      };
      this.setState({
        jailclasses: [...this.state.jailclasses, jailclass]
      });
      /*var pc = new RTCPeerConnection();
          const opts = { negotiated: true, id: product.peerId };
          //peer connection can have up to a theoretical maximum of 65,534 data channels
          var dc = pc.createDataChannel(
            `label for channel ${product.id} if ${product.peerId}`,
            opts
          );
          dc.onopen = () => {
            console.log("datachannel open");
          };
          product.dc.onmessage = (event) =>
            console.log("received: " + event.data);

          product.dc.onclose = () => console.log("datachannel close");
        */
    });
  };

  finFetchForum = (product) => {
    var murder = null;
    clearTimeout(murder);
    murder = setTimeout((e) => product.close(), product.alivefor); //1hr

    const stasis = !product.docs
      ? null
      : product.docs.length === 0
      ? "continue"
      : "handle";
    if (!stasis) {
      window.alert("react-fuffer must have failed to complete, sorry!");
    } else if (stasis === "continue") {
      this.props.unloadGreenBlue();
    } else if (stasis === "handle") {
      //console.log(product.docs); //this.finFetchForum(product)
      Promise.all(
        product.docs.map(async (foo) => {
          if (product.state && product.state.filterTime) {
            var datel =
              product.docsOutputLabel === "classes"
                ? foo.endDate.seconds * 1000
                : foo.date.seconds * 1000;
            foo.datel = new Date(datel);
            if (foo.datel > new Date()) {
              //const collection = foo.collection;
              //foo.collection = product.state.oppositeCollection;
              foo.commentsName = product.state.oppositeComments;

              return reverst(foo, foo.collection);
              /*firebase
                .firestore()
                .collection(product.state.oppositeCollection)
                .doc(foo.id)
                .set(foo)
                .then(() =>
                  firebase
                    .firestore()
                    .collection(collection)
                    .doc(foo.id)
                    .delete()
                    .then(() => {
                      console.log(
                        `document moved to ${product.state.oppositeCollection} collection ` +
                          foo.id
                      );
                    })
                    .catch(standardCatch)
                )
                .catch(standardCatch);*/
            }
          }
          //var canView = canIView(this.props.auth, foo, community);
          //if (canView) {
          var droppedPost =
            foo.droppedId && (await this.handleDropId(foo.droppedId).promise());
          foo.droppedPost = droppedPost && JSON.parse(droppedPost);
          var entity =
            foo.entityId &&
            (await this.hydrateEntity(foo.entityId, foo.entityType).entity());
          foo.entity = entity && JSON.parse(entity);
          var author = await this.hydrateUser(foo.authorId).user();
          foo.author = author && JSON.parse(author);

          var videos = await this.hydratePostChatMeta(foo).meta();
          foo.videos = videos && JSON.parse(videos);

          if (["elections", "oldElections"].includes(foo.collection)) {
            const {
              candidatesProfiled,
              candidateRequestsProfiled
            } = await this.hydrateElection(foo);
            foo.candidatesProfiled = candidatesProfiled;
            foo.candidateRequestsProfiled = candidateRequestsProfiled;
          } else if (["oldCases", "court cases"].includes(foo.collection)) {
            const {
              prosecution,
              defense,
              jury,
              testimonies,
              consults,
              judges
            } = await this.hydrateCase(foo);
            foo.prosecution = prosecution;
            foo.defense = defense;
            foo.jury = jury;
            foo.testimonies = testimonies;
            foo.consults = consults;
            foo.judges = judges;
          }
          if (
            foo.author &&
            (!foo.entityId || foo.entity) &&
            (!foo.droppedId || foo.droppedPost)
          )
            return foo;
        })
      ).then((forumPosts) => {
        this.props.unloadGreenBlue();
        this.props.setForumDocs({
          [product.docsOutputLabel]: forumPosts
        });
      });
    }
  };

  render() {
    const {
      item,
      appHeight,
      ordinances,
      budget,
      cases,
      elections,
      oldBudget,
      oldCases,
      oldElections,
      containerStyle,
      commtype,
      width
    } = this.props;
    const {
      openWhen,
      lastCommPost,
      undoCommPost,
      lastCommOrd,
      undoCommOrd,
      lastCommDept,
      undoCommDept,
      lastOldBudget,
      undoOldBudget,
      lastOldElections,
      undoOldElections,
      lastOldCases,
      undoOldCases,
      lastOldClasses,
      undoOldClasses,
      lastCommForm,
      undoCommForm,
      jailclasses
    } = this.state;
    const profileEntities = {
      profileEvents: this.state.profileEvents,
      profileJobs: this.state.profileJobs,
      profileClubs: this.state.profileClubs,
      profileServices: this.state.profileServices,
      profileClasses: this.state.profileClasses,
      profileDepartments: this.state.profileDepartments,
      profileRestaurants: this.state.profileRestaurants,
      profileShops: this.state.profileShops,
      profilePages: this.state.profilePages,
      profileVenues: this.state.profileVenues,
      profileHousing: this.state.profileHousing,
      profilePosts: this.props.profilePosts
    };

    var lastPost = profileDirectory.find((type) => this.state[type.last]);
    var undoPost = profileDirectory.find((type) => this.state[type.undo]);
    var lastPostOfComment = profileDirectory.find(
      (type) => this.state[type.last]
    );
    var undoPostOfComment = profileDirectory.find(
      (type) => this.state[type.undo]
    );
    //console.log("isprofile " + this.props.isProfile);
    return (
      <div>
        <JailClass
          jailclasses={jailclasses}
          /**
           {
            match,
            close,
            localizedDocs: dol,
            startAfter: qs.docs[qs.docs.length - 1],
            endBefore: qs.docs[0]
          }
         */
          updateLiberty={(productFuffer) => {
            this.setState(
              { freedocs: [...this.state.freedocs, productFuffer] },
              () => {
                this.state.freedocs.map((product) => {
                  /**
                   * product = {state:{}, ...product}
                   */
                  if (product) {
                    return this.setState(
                      {
                        [product.stateAfterLabel]: product.startAfter,
                        [product.endBeforeLabel]: product.endBefore
                      },
                      () => {
                        this.finFetchForum(product);
                      }
                    );
                  } else return null;
                });
              }
            );
          }}
        />
        <Folder
          unmountFirebase={this.props.unmountFirebase}
          width={width}
          commtype={commtype}
          history={this.props.history}
          getProfileEntities={this.getProfileEntities}
          getPostsAs={this.getPostsAs}
          item={item}
          containerStyle={containerStyle}
          appHeight={appHeight}
          apple={this.props.apple}
          location={this.props.location}
          statePathname={this.props.statePathname}
          setIndex={this.props.setIndex}
          displayPreferences={this.props.displayPreferences}
          setDisplayPreferences={this.props.setDisplayPreferences}
          isPost={this.props.isPost}
          isCommunity={this.props.isCommunity}
          isProfile={this.props.isProfile}
          isEntity={this.props.isEntity}
          //
          chosenEntity={this.state.chosenEntity}
          forumPosts={this.props.forumPosts}
          setForumDocs={this.props.setForumDocs}
          pathname={this.props.pathname}
          postHeight={this.state.postHeight}
          chosenPostId={this.state.chosenPostId}
          community={this.props.community}
          ordinances={ordinances}
          budget={budget}
          cases={cases}
          elections={elections}
          oldBudget={oldBudget}
          oldCases={oldCases}
          oldElections={oldElections}
          //
          tileChosen={this.props.tileChosen}
          //
          departments={this.props.departments}
          classes={this.props.classes}
          oldClasses={this.props.oldClasses}
          events={this.props.together}
          clubs={this.props.clubs}
          jobs={this.props.jobs}
          venues={this.props.venues}
          services={this.props.services}
          restaurants={this.props.restaurants}
          shops={this.props.shops}
          pages={this.props.pages}
          housing={this.props.housing}
          setCommunity={this.props.setCommunity}
          forumOpen={this.props.forumOpen}
          following={this.state.following}
          getProfile={this.getProfile}
          openOptions={this.state.openOptions}
          openEntity={
            this.state.openOptions
              ? () => this.setState({ openOptions: false })
              : () => this.setState({ openOptions: true })
          }
          chooseCity={(prediction) => {
            var city = prediction.place_name;
            this.props.setCommunity({ city });
            var center = [prediction.center[1], prediction.center[0]];
            this.setState({
              center,
              locOpen: false
            });
            this.props.dropCityIssues(city);
          }}
          issues={this.state.issues}
          dropCityIssues={(city) =>
            firebase
              .firestore()
              .collection("cities")
              .doc(city)
              .onSnapshot((doc) => {
                if (doc.exists) {
                  var foo = doc.data();
                  foo.id = doc.id;
                  return this.setState({ issues: [...foo.issues] });
                }
              })
          }
          profile={this.props.profile}
          notes={this.state.notes}
          openWhen={openWhen}
          city={this.props.city}
          setCommtype={this.props.setCommtype}
          //
          favoriteCities={this.state.favoriteCities}
          parents={this.props.parents}
          storageRef={this.props.storageRef}
          meAuth={this.props.meAuth}
          logoutofapp={this.props.logoutofapp}
          saveAuth={this.props.saveAuth}
          getUserInfo={this.props.getUserInfo}
          //
          myDocs={this.state.myDocs}
          moreDocs={this.moreDocs}
          againBackDocs={this.againBackDocs}
          tickets={this.props.tickets}
          myCommunities={this.props.myCommunities}
          profileEntities={profileEntities}
          auth={this.props.auth}
          user={this.props.user}
          //
          iAmCandidate={this.props.iAmCandidate}
          iAmJudge={this.props.iAmJudge}
          iAmRepresentative={this.props.iAmRepresentative}
          followingMe={this.props.followingMe}
          //
          getFolders={this.props.getFolders}
          getVideos={this.props.getVideos}
          folders={this.props.folders}
          videos={this.props.videos}
          oktoshowchats={this.state.oktoshowchats}
          showChatsOnce={() => {
            this.showChats();
            this.setState({ oktoshowchats: true });
          }}
          //
          showChats={this.showChats}
          stripeKey={this.props.stripeKey}
          setGoogleLoginRef={this.props.loginButton}
          spotifyAccessToken={this.props.spotifyAccessToken}
          deleteScopeCode={this.props.deleteScopeCode}
          setScopeCode={this.props.setScopeCode}
          accessToken={this.props.accessToken}
          twitchUserAccessToken={this.props.twitchUserAccessToken}
          communities={this.state.communities}
          loaded={this.props.loaded}
          //
          filePreparedToSend={this.props.filePreparedToSend}
          picker={this.props.picker}
          picker1={this.props.picker1}
          picker2={this.props.picker2}
          loadGapiApi={this.props.loadGapiApi}
          signedIn={this.props.signedIn}
          switchAccount={this.props.switchAccount}
          signOut={this.props.signOut}
          //

          clearFilePreparedToSend={this.props.clearFilePreparedToSend}
          loadYoutubeApi={this.props.loadYoutubeApi}
          s={this.props.s}
          authResult={this.props.authResult}
          googlepicker={this.props.googlepicker}
          individualTypes={this.props.individualTypes}
          db={this.state.db}
          loadGreenBlue={this.props.loadGreenBlue}
          unloadGreenBlue={this.props.unloadGreenBlue}
          //
          comments={this.state.comments}
          postMessage={this.state.postMessage}
          chosenPost={this.state.chosenPost}
          helper={this.helper} //promise
          parent={this.state.parent}
          getDrop={this.getDrop}
          findPost={this.findPost}
          dropId={this.dropId}
          chats={this.state.chats}
          invites={this.state.invites}
          selfvites={this.state.selfvites}
          fetchForum={this.fetchForum}
          fetchCommForum={this.fetchCommForum}
          lastComments={() => this.lastComments(this.props.profile)}
          undoComments={() => this.undoComments(this.props.profile)}
          lastPostOfComment={lastPostOfComment}
          undoPostOfComment={undoPostOfComment}
          groupLast={this.state.groupLast}
          groupUndo={this.state.groupUndo}
          lastPosts={
            this.state.chosenEntity
              ? () => this.lastPostsAs(this.state.chosenEntity)
              : this.lastPosts
          }
          lastPost={lastPost}
          undoPosts={
            this.state.chosenEntity
              ? () => this.undoPostsAs(this.state.chosenEntity)
              : this.undoPosts
          }
          undoPost={undoPost}
          //
          lastGlobalPost={this.state.lastGlobalPost}
          undoGlobalPost={this.state.undoGlobalPost}
          lastGlobalForum={() => {
            this.setState({ slowPager: true });
            if (this.state.slowPager) {
              window.alert("woah there champ");

              //clearTimeout(this.slowPager);
            } else {
              this.lastGlobalForum(false, "new");
              this.slowPager = setTimeout(() => {
                this.setState({ slowPager: false });
              }, 2000);
            }
          }}
          undoGlobalForum={() => {
            this.setState({ slowPager: true });
            if (this.state.slowPager) {
              window.alert("woah there champ");
              //
              //clearTimeout(this.slowPager);
            } else {
              this.undoGlobalForum(false, "new");
              this.slowPager = setTimeout(() => {
                this.setState({ slowPager: false });
              }, 2000);
            }
          }}
          //
          lastCityPost={this.state.lastCityPost}
          undoCityPost={this.state.undoCityPost}
          lastCityForum={() => {
            this.setState({ slowPager: true });
            if (this.state.slowPager) {
              window.alert("woah there champ");

              //clearTimeout(this.slowPager);
            } else {
              console.log("last");
              this.lastCityForum(this.props.city, this.props.commtype);
              this.slowPager = setTimeout(() => {
                this.setState({ slowPager: false });
              }, 2000);
            }
          }}
          undoCityForum={() => {
            this.setState({ slowPager: true });
            if (this.state.slowPager) {
              window.alert("woah there champ");

              //clearTimeout(this.slowPager);
            } else {
              console.log("undo");
              this.undoCityForum(this.props.city, this.props.commtype);
              this.slowPager = setTimeout(() => {
                this.setState({ slowPager: false });
              }, 2000);
            }
          }}
          //
          lastCommPost={lastCommPost}
          undoCommPost={undoCommPost}
          lastCommOrd={lastCommOrd}
          undoCommOrd={undoCommOrd}
          lastCommDept={lastCommDept}
          undoCommDept={undoCommDept}
          lastOldBudget={lastOldBudget}
          undoOldBudget={undoOldBudget}
          lastOldElections={lastOldElections}
          undoOldElections={undoOldElections}
          lastOldCases={lastOldCases}
          undoOldCases={undoOldCases}
          lastOldClasses={lastOldClasses}
          undoOldClasses={undoOldClasses}
          lastCommForm={lastCommForm}
          undoCommForm={undoCommForm}
          lastCommForum={() => {
            this.setState({ slowPager: true });
            if (this.state.slowPager) {
              window.alert("woah there champ");

              //clearTimeout(this.slowPager);
            } else {
              console.log("last");
              this.paginateCommForum("last", "lastOld");
              this.slowPager = setTimeout(() => {
                this.setState({ slowPager: false });
              }, 2000);
            }
          }}
          undoCommForum={() => {
            this.setState({ slowPager: true });
            if (this.state.slowPager) {
              window.alert("woah there champ");

              //clearTimeout(this.slowPager);
            } else {
              console.log("undo");
              this.paginateCommForum("undo", "undoOld");
              this.slowPager = setTimeout(() => {
                this.setState({ slowPager: false });
              }, 2000);
            }
          }}
          fetchCommEvents={this.fetchCommEvents}
          fetchEvents={this.fetchEvents}
          timeFilterEvents={this.timeFilterEvents}
          timeFilterJobs={this.timeFilterJobs}
          range={this.state.range}
          queriedDate={this.state.queriedDate}
          getCommunity={async (x) => {
            var community = x && (await this.getCommunity(x).community());
            return community && JSON.parse(community);
          }}
          getCommunityByName={async (x) => {
            var community = x && (await this.getCommunityByName(x).community());
            return community && JSON.parse(community);
          }}
          hydrateUserFromUserName={async (username) => {
            var userResult =
              username && (await this.hydrateUserFromUserName(username).user());
            return userResult && JSON.parse(userResult);
          }}
          hydrateUser={async (userId) => {
            var userResult = userId && (await this.hydrateUser(userId).user());
            return userResult && JSON.parse(userResult);
          }}
          hydrateEntity={async (id, collection) => {
            var entity = await this.hydrateEntity(id, collection).entity();
            return entity && JSON.parse(entity);
          }}
          hydrateEntityFromName={async (collection, name, communityName) => {
            var entity = await this.hydrateEntityFromName(
              collection,
              name,
              communityName
            ).entity();
            return entity && JSON.parse(entity);
          }}
          cityapisLoaded={this.state.cityapisLoaded}
          edmStore={this.state.edmStore}
          cityapi={this.state.cityapi}
          stateapi={this.state.stateapi}
          getGlobalForum={this.getGlobalForum}
          onDelete={(id) => this.handleDelete(id)}
          handleSave={(note) => this.handleSave(note, "createNote")}
          setData={(x) => this.setState(x)}
          loadingMessage={this.props.loadingMessage}
          //
          current={this.state.current}
          current1={this.state.current1}
          lastProfilePosts={this.props.lastProfilePosts}
        />
      </div>
    );
  }
}
export default Data;

/*if (match) {
  const dataChannel = window.dC[match];
  /*dataChannel={send: ƒ send() {}
  label: "forum/city,newLessonShow"
  ordered: true
  maxPacketLifeTime: null
  maxRetransmits: null
  protocol: ""
  negotiated: false
  id: null
  readyState: "connecting"
  bufferedAmount: 0
  bufferedAmountLowThreshold: 0
  onopen: ƒ () {}
  onbufferedamountlow: null
  onerror: null
  onclosing: null
  onclose: ƒ () {}
  onmessage: ƒ () {}
  binaryType: "arraybuffer"
  reliable: true
  close: ƒ close() {}
  addEventListener: ƒ addEventListener() {}
  dispatchEvent: ƒ dispatchEvent() {}
  removeEventListener: ƒ removeEventListener() {}
  <constructor>: "RTCDataChannel"}*
  //console.log(dataChannel);
  //ondatachannel
  dataChannel.onopen((ev) => {
    console.log(ev);
    rC = ev.channel; //RTCDataChannelEvent.channel;

    rC.onopen = (event) => console.log(event);
    rC.onclose = (event) => console.log(event);
    rC.onmessage = (result) => {*/
//console.log(res + " result");

/*if (!free.UPDATABLE) {
        return (async () =>
          await landerInterval(queryWithFixins, match, keepalive))();
      } else {
        UPDATABLE = true;
        return { docs, startAfter, endBefore, close,UPDATABLE };
      }*/
