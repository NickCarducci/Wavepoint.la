import React from "react";
import firebase from "./init-firebase";
import Folder from "./folder";
import * as geofirestore from "geofirestore";
import { PDB, standardCatch, shortHandId, canIView } from "./widgets/authdb";
import {
  profileDirectory,
  profileCommentsDirectory
} from "./widgets/arraystrings";
import { JailClass, WakeSnapshot } from "react-fuffer";

const reverst = (foo, oldCollection, geo) =>
  (geo ? geo : firebase.firestore())
    .collection(foo.collection)
    .doc(foo.id)
    .set(foo)
    .then(() =>
      firebase
        .firestore()
        .collection(oldCollection)
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
  } else if (commtype === "departments") {
    collection = "departments";
    name = "departments";
    last = "lastCommDept";
    undo = "undoCommDept";
  } else if (commtype === "budget") {
    collection = "budget";
    name = "budget";
    filterTime = true;
    old = "oldBudget";
    last = "lastBudget";
    undo = "undoBudget";
    lastOld = "lastOldBudget";
    undoOld = "undoOldBudget";
    NewcommentsName = "budgetcommentsnew";
    ExpiredcommentsName = "budgetcommentsexpired";
  } else if (commtype === "elections") {
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
  } else if (commtype === "cases") {
    collection = "cases";
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
      earSideways: !isNaN(props.width) ? props.width - 70 : 0,
      earUpwards: !isNaN(props.appHeight) ? props.appHeight - 70 : 0,
      db,
      deletedclasses: [],
      closes: [],
      alivefors: [],
      updatedclasses: [],
      jailclasses: [],
      freedocs: [],
      resnaps: [],
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
    this.ear = React.createRef();
    //this.RTCPeerConnection = new RTCPeerConnection();
    const firestore = firebase.firestore();
    this.GeoFirestore = geofirestore.initializeApp(firestore);
    this.recheck = [];
  }
  componentWillUnmount = () => {
    this.recheck && this.recheck.map((x) => clearInterval(x));
    clearTimeout(this.freetime);
    clearTimeout(this.easy);
    clearInterval(this.count);
    clearTimeout(this.hoverear);
    clearTimeout(this.gonnaOpen);
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
  handleTooltipMove = (ev) => {
    if (this.state.holdingEar) {
      this.paused && clearInterval(this.paused);
      this.paused = setInterval(() => {
        this.setState({ holdingEar: false, counterEar: null }, () => {
          clearTimeout(this.gonnaOpen);
          this.count && clearInterval(this.count);
        });
      }, 300);
    } else
      this.setState({ holdingEar: true }, () => {
        var count = 3;
        this.count && clearInterval(this.count);
        this.count = setInterval(() => {
          count = count - 1;
          this.setState({ counterEar: count });
          //console.log("opening in: " + count);
        }, 1000);
        this.gonnaOpen = setTimeout(
          () =>
            this.setState({ openAnyway: true }, () =>
              clearInterval(this.count)
            ),
          3300
        );
      });
    var left = ev.touches ? ev.touches[0].clientX : ev.pageX;
    var top = ev.touches ? ev.touches[0].clientY : ev.pageY;
    const dx = Math.abs(this.state.earSideways - left) > 5;
    const dy = Math.abs(this.state.earUpwards - top) > 5;
    if (dx || dy) {
      this.easy && clearTimeout(this.easy);
      //this.gonnaOpen && clearTimeout(this.gonnaOpen);
      this.easy = setTimeout(() => {
        this.setState({
          earSideways: left,
          earUpwards: top
        });
      }, 20);
      //this redundancy actually gives buffering without animation framing et al
    }
  };
  resetTooltip = (ev) =>
    this.setState(
      { holdingEar: false, counterEar: null /*openAnyway: false*/ },
      () => {
        //clearTimeout(this.debounce);
        clearTimeout(this.gonnaOpen);
        this.count && clearInterval(this.count);
        const e = ev.touches ? ev.touches[0] : ev;
        const moveLongitudially = (y) => this.setState(y);
        const moveLaterally = (x) => this.setState(x);

        const sd = e.pageX;
        const up = e.pageY;
        const offScreenX = (pX, reset) =>
          moveLaterally({
            earSideways:
              reset || this.props.width * 0.5 < pX ? this.props.width - 70 : 20
          });

        const offScreenRight = this.props.width < sd;
        const onScreenTop = this.props.appHeight * 0.5 > up;
        if (onScreenTop) {
          return offScreenX(sd); //if then return
        } else offScreenX(sd, offScreenRight);

        const onScreenLeft = this.props.width * 0.5 > sd;
        const offScreenBottom = this.props.appHeight < up;
        const offScreenY = (pY, reset) =>
          moveLongitudially({
            earUpwards:
              reset || this.props.appHeight * 0.5 < pY
                ? this.props.appHeight - 70
                : 20
          });
        if (onScreenLeft) {
          offScreenY(up);
        } else offScreenY(up, offScreenBottom);
        return null; /*offScreenRight
      ? offScreenX(sd, true)
      : offScreenBottom
      ? offScreenY(up, true)
      : null;*/
      }
    );
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
  handleCommSnapshot = async (hp, collection, isDropped) =>
    await Promise.all(
      hp.map(async (f, i) => {
        var foo = { ...hp[i] };
        return await new Promise(async (resolve) => {
          const videos = await this.hydratePostChatMeta(foo).meta();
          foo.videos && JSON.parse(videos);
          if (["elections", "oldElections"].includes(collection)) {
            const hydrateElection = async (foo) => {
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
            const {
              candidatesProfiled,
              candidateRequestsProfiled
            } = await hydrateElection(foo);
            foo.candidatesProfiled = candidatesProfiled;
            foo.candidateRequestsProfiled = candidateRequestsProfiled;
          } else if (["oldCases", "cases"].includes(collection)) {
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
          if (!isDropped && foo.droppedId) {
            console.log(foo.id + " has dropped " + foo.droppedId);
            const droppedPost = await this.handleDropId(
              foo.droppedId
            ).promise();
            if (droppedPost) {
              foo.droppedPost = JSON.parse(droppedPost);
            }
          }
          const community =
            foo.communityId &&
            (await this.getCommunity(foo.communityId).community());
          foo.community = community && JSON.parse(community);
          const entity =
            foo.entityId &&
            (await this.hydrateEntity(foo.entityId, foo.entityType).entity());
          foo.entity = entity && JSON.parse(entity);
          const author = await this.hydrateUser(foo.authorId).user();
          foo.author = author && JSON.parse(author);
          if (
            foo.author &&
            (isDropped || !foo.droppedId || foo.droppedPost) &&
            (!foo.communityId || foo.community) &&
            (!foo.entityId || foo.entity)
          ) {
            resolve(foo);
          }
        });
      })
    );

  lastGlobalForum = (globall, commtype) => {
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
        .onSnapshot(async (querySnapshot) => {
          let globalForumPosts = [];
          let q = 0;
          let allIssues = [];
          querySnapshot.docs.forEach(async (doc) => {
            q++;
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              foo.collection = "forum";
              globalForumPosts.push(foo);
            }
          });
          if (querySnapshot.docs.length === q) {
            globalForumPosts = await this.handleCommSnapshot(
              globalForumPosts,
              "forum"
            );
            globalForumPosts.forEach(async (foo) => {
              foo.currentComments = "forumcomments";
              foo.issue && allIssues.push(foo.issue);
              if (foo.droppedId) {
                var postt = await this.handleDropId(foo.droppedId).promise();
                foo.droppedPost = postt && JSON.parse(postt);
              }
            });
            var issues = new Set(allIssues);
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
    (globall
      ? [""]
      : this.props.user !== undefined && this.state.following
      ? this.state.following
      : []
    ).map(async (x) => {
      let globalForumPosts = [];
      let allIssues = [];
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
        async () => {
          free.docs.forEach(async (foo) => {
            q++;

            foo && globalForumPosts.push(foo);
          });
          if (free.docs.length === q) {
            globalForumPosts = await this.handleCommSnapshot(
              globalForumPosts,
              "forum"
            );
            globalForumPosts.forEach(async (foo) => {
              foo.currentComments = "forumcomments";
              foo.issue && allIssues.push(foo.issue);
              if (foo.droppedId) {
                var postt = await this.handleDropId(foo.droppedId).promise();
                foo.droppedPost = postt && JSON.parse(postt);
              }
            });
            var issues = new Set(allIssues);
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
    (globall
      ? [""]
      : this.props.user !== undefined && this.state.following
      ? this.state.following
      : []
    ).map(async (x) => {
      let globalForumPosts = [];
      let allIssues = [];
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
        async () => {
          free.docs.forEach(async (foo) => {
            q++;

            foo && globalForumPosts.push(foo);
          });
          if (free.docs.length === q) {
            globalForumPosts = await this.handleCommSnapshot(
              globalForumPosts,
              "forum"
            );
            globalForumPosts.forEach(async (foo) => {
              foo.currentComments = "forumcomments";
              foo.issue && allIssues.push(foo.issue);
              if (foo.droppedId) {
                var postt = await this.handleDropId(foo.droppedId).promise();
                foo.droppedPost = postt && JSON.parse(postt);
              }
            });
            var issues = new Set(allIssues);

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
  getDrop = async (id) => {
    if (id) {
      this.props.loadGreenBlue("finding post...");
      var p = await this.handleDropId(id).promise();
      var drop = p && JSON.parse(p);
      if (drop) {
        var buff = await this.handleCommSnapshot([drop], drop.collection);
        if (buff) {
          drop = buff[0];
        }
        if (drop.droppedId) {
          var postt = await this.handleDropId(drop.droppedId).promise();
          drop.droppedPost = postt && JSON.parse(postt);
        }
        if (
          drop.author &&
          (!drop.communityId || drop.community) &&
          (!drop.entityId || drop.entity)
        ) {
          this.props.unloadGreenBlue();
          return drop && drop;
        }
      }
    }
  };
  findPost = async (id) => {
    if (id) {
      this.props.loadGreenBlue("finding post...");
      var p = await this.handleDropId(id).promise();
      var drop = p && JSON.parse(p);
      if (drop) {
        var buff = await this.handleCommSnapshot([drop], drop.collection);
        if (buff) {
          drop = buff[0];
        }
        if (drop.droppedId) {
          var postt = await this.handleDropId(drop.droppedId).promise();
          drop.droppedPost = postt && JSON.parse(postt);
        }
        if (
          drop.author &&
          (!drop.communityId || drop.community) &&
          (!drop.entityId || drop.entity)
        ) {
          this.props.unloadGreenBlue();
          return drop && drop;
        }
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
  getProfileEntities = (profile) => {
    this.getComments(profile);
    return null;
    let q = 0;
    const types = [
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
    ];
    types.map((type) => {
      q++;

      var collection = type.collection;
      if ("classes" === type.collection) {
        collection = "oldClasses";
      } else if ("planner" === type.collection) {
        collection = "oldPlanner";
      } else if ("jobs" === type.collection) {
        collection = "oldJobs";
      }
      console.log(q);

      this.getEntityQuery(collection, "authorId", profile, type);
      return this.getEntityQuery(collection, "admin", profile, type);
    });
    if (q === types.length) {
      this.getComments(profile);
      this.props.loadGreenBlue("getting comments from " + profile.username);
    }
  };

  getEntityQuery = (collection, role, profile, type) =>
    this.setState({
      jailclasses: [
        ...this.state.jailclasses.filter(
          (x) => x.uuid !== "getEntityQuery" + collection + role
        ),
        {
          uuid: "getEntityQuery" + collection + role, //forumPosts
          docsOutputLabel: type.name,
          stateAfterLabel: "last",
          endBeforeLabel: "undo",
          state: { role },
          //for each: foo = {...doc.data(),doc.id}
          snapshotQuery: firebase
            .firestore()
            .collection(collection)
            .where(role, "==", profile.id), //optional canIncludes()?
          keepalive: 3600000,
          sort: { order: "createdAt", by: "desc" }, //sort
          near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
          //near for geofirestore { center: near.center, radius: near.distance }
          limit: 8, //limit
          startAfter: null, //startAfter
          endBefore: null, //endBefore
          verbose: false, //verbose
          whenOn: false //whenOn
        }
      ]
    });

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
                foo.currentComments = "forumcomments";
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

  handleComments = async (post, i) => {
    const { lastChosenPost } = this.state;
    if (post && (!lastChosenPost || lastChosenPost.id !== post.id)) {
      this.props.loadGreenBlue("getting comments");
      var forumTypecomm =
        post.collection === "budget"
          ? "budgetcommentsnew"
          : post.collection === "elections"
          ? "electioncommentsnew"
          : post.collection === "cases"
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
      firebase
        .firestore()
        .collection(forumTypecomm)
        .where("forumpostId", "==", post.id)
        .orderBy("time", "desc")
        //.limit(5)
        .onSnapshot(async (querySnapshot) => {
          if (querySnapshot.empty) {
            //window.alert("be the first to comment");
            this.setState({
              chosenPostId: post.id,
              postMessage: post.message,
              chosenPost: post,
              comments: [],
              lastChosenComments: [],
              lastChosenPost: post,
              lastPostHeight: this.state.postHeight
            });
            this.props.unloadGreenBlue();
          } else {
            let comments = [];
            let p = 0;
            querySnapshot.docs.map(async (doc) => {
              p++;
              if (doc.exists) {
                var foo = doc.data();
                foo.id = doc.id;
                comments.push(foo);
              }
            });
            if (querySnapshot.docs.length === p) {
              comments = await this.handleProfileCommentSnapshot(comments);

              comments.sort(
                (a, b) =>
                  (this.props.user !== undefined &&
                    this.state.following.includes(a.authorId)) -
                  (this.props.user === undefined ||
                    !this.state.following.includes(b.authorId))
              );
              this.setState({
                commentedPosts: [
                  ...this.state.commentedPosts.filter(
                    (x) => x.collection + x.id === post.collection + post.id
                  ),
                  post
                ],
                chosenPostId: post.id,
                postMessage: post.message,
                chosenPost: post,
                comments,
                lastChosenComments: comments,
                lastChosenPost: post,
                lastPostHeight: this.state.postHeight
              });
              this.props.unloadGreenBlue();
            }
          }
        }, standardCatch);
    } else if (post /* && this.state.postHeight !== 0*/) {
      this.setState({
        postHeight: this.state.lastPostHeight,
        comments: this.state.lastChosenComments,
        postMessage: lastChosenPost.message,
        chosenPostId: lastChosenPost.id,
        chosenPost: lastChosenPost
      });
    } /*if (this.state.postHeight === 0) {
      this.setState({ chosenPostId: null });
    } else */ else {
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
                  .collection(type.currentComments)
                  .where("authorId", "==", profile.id)
                  .orderBy("time", "desc")
                  .endBefore(this.state[type.last])
                  .limitToLast(14);
              } else {
                close = firebase
                  .firestore()
                  .collection(type.currentComments)
                  .where("authorId", "==", profile.id)
                  .orderBy("time", "desc")
                  .startAfter(this.state[type.undo])
                  .limit(14);
              }
            }
          } else {
            close = firebase
              .firestore()
              .collection(type.currentComments)
              .where("authorId", "==", profile.id)
              .orderBy("time", "desc")
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
                      foo.currentComments = type.currentComments;
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
      commentsCombined.forEach((com) => {
        if (!comms.includes(com.id)) {
          comms.push(com.id);
          commms.push(com);
        }
      });
      Promise.all(
        commms.map(async (post) => {
          return await new Promise(async (resolve) => {
            var foo = await this.findPost(post.forumpostId);
            if (foo) {
              foo.collection = post.collection;
              foo.currentComments = post.currentComments;
              var buff = await this.handleCommSnapshot([foo], foo.collection);
              var bar = buff[0];
              if (bar.droppedId) {
                var postt = await this.handleDropId(foo.droppedId).promise();
                bar.droppedPost = postt && JSON.parse(post);
              }
              bar.comments = comments.filter(
                (x) => x.forumpostId === foo.forumpostId
              );
              bar.author = profile; //JSON.parse(author);
              bar.isOfComment = true;
              bar && (!bar.droppedId || bar.droppedPost) && resolve(bar);
            }
          });
        })
      ).then((profilePosts) => {
        const old = this.props.profilePosts.filter(
          (post) =>
            !profilePosts.find((x) => x.forumpostId === post.forumpostId)
        );
        //console.log(profilePosts);
        //console.log(old);
        this.props.setForumDocs({
          profilePosts: [...old, ...profilePosts]
        });
      });
      if (paginate) {
        this.props.unloadGreenBlue();
      } else {
        this.getPosts(profile);
        this.props.loadGreenBlue("getting posts from " + profile.username);
      }
    });
  };

  lastComments = (profile) => this.handleProfileComments(profile, "last");

  undoComments = (profile) => this.handleProfileComments(profile, "undo");

  getComments = (profile) => this.handleProfileComments(profile);

  againBackDocs = () =>
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
      .onSnapshot(async (querySnapshot) => {
        let p = 0;
        let myDocs = [];
        querySnapshot.docs.forEach(async (doc) => {
          p++;
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;

            myDocs.push(foo);
          }
        });
        if (p === querySnapshot.docs.length && this.state.myDocs !== myDocs) {
          myDocs = await this.handleChatSnapshot(myDocs);
          var lastDoc = myDocs[myDocs.length - 1];
          var againDoc = myDocs[0];
          this.setState({
            myDocs,
            lastDoc: lastDoc ? lastDoc : null,
            againDoc: againDoc ? againDoc : null
          });
        }
      }, standardCatch);

  moreDocs = () =>
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
      .onSnapshot(async (querySnapshot) => {
        let p = 0;
        let myDocs = [];
        querySnapshot.docs.forEach(async (doc) => {
          p++;
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;

            myDocs.push(foo);
          }
        });
        if (p === querySnapshot.docs.length && this.state.myDocs !== myDocs) {
          myDocs = await this.handleChatSnapshot(myDocs);
          var lastDoc = myDocs[myDocs.length - 1];
          var againDoc = myDocs[0];
          this.setState({
            myDocs,
            lastDoc: lastDoc ? lastDoc : null,
            againDoc: againDoc ? againDoc : null
          });
        }
      }, standardCatch);

  handleChatSnapshot = async (chats) =>
    Promise.all(
      chats.map(async (foo) => {
        foo.recipientsProfiled = await this.hydrateUsers(foo.recipients);
        var author = await this.hydrateUser(foo.authorId).user();
        foo.author = author && JSON.parse(author);
        return foo;
      })
    );
  hydrateUsers = async (users) =>
    await Promise.all(
      users.map(async (recipientId) => {
        var recipient = await this.hydrateUser(recipientId).user();
        return recipient && JSON.parse(recipient);
      })
    );
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
              foo.recipientsProfiled = await this.hydrateUsers(foo.recipients);
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
              foo.recipientsProfiled = await this.hydrateUsers(foo.recipients);
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
    /*if (
      this.state.users !== this.state.lastUsers ||
      this.state.communities !== this.state.lastCommunities ||
      this.state.postsWithChatMetas !== this.state.lastPostsWithChatMetas
    ) {
      this.setState(
        {
          lastUsers: this.state.users,
          lastCommunities: this.state.communities,
          lastPostsWithChatMetas: this.state.postsWithChatMetas
        },
        () => {
          let set = {};
          [
            "forumPosts",
            "classes",
            "departments",
            ...profileDirectory.map((g) => g.currentCollection),
            "profilePosts"
          ].forEach((g) => {
            if (this.props[g]) {
              set[g] = [];
              let i = 0;
              this.props[g].forEach((y) => {
                i++;
                var x = { ...y };
                var community = this.state.communities.find(
                  (a) => a.id === x.communityId
                );
                x.community = community ? community : x.community;
                var videos = this.state.postsWithChatMetas[shortHandId(x)];

                x.videos = videos ? videos : x.videos;
                var user = this.state.users.find((a) => a.id === x.authorId);
                x.author = user ? user : x.author;

                set[g].push(x);
              });
              if (this.props[g].length === i) {
                if (!this.props.isProfile && this.props.community) {
                  var community = this.state.communities.find(
                    (x) => x.id === this.props.community.id
                  );
                  this.props.setCommunity({ community });
                }
                 this.props.setForumDocs({ [g]: set[g] });
              }
            }
          });
        }
      );
    }*/
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
          var close = firebase
            .firestore()
            .collection("chatMeta")
            .where("threadId", "==", shortId)
            .onSnapshot((querySnapshot) => {
              var videos = [];
              var existing = [];

              querySnapshot.docs.forEach((doc) => {
                if (doc.exists) {
                  var newVideo = doc.data();
                  newVideo.id = doc.id;
                  newVideo.folder = newVideo.folder ? newVideo.folder : "*";
                  existing.push(newVideo);
                }
              });
              const rested = this.state.postsWithChatMetas[shortId];
              var rest = rested ? Object.values(rested) : [];
              existing.forEach(
                (newVideo) => (rest = rest.filter((x) => x.id !== newVideo.id))
              );
              videos = [...rest, ...existing];
              var copy = { ...this.state.postsWithChatMetas };
              delete copy[shortId];
              this.setState({
                postsWithChatMetas: { ...copy, [shortId]: videos }
              });
            }, standardCatch);
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!parent) {
              reject(shortId);
            }
            firebase
              .firestore()
              .collection("chatMeta")
              .where("threadId", "==", shortId)
              .get()
              .then((querySnapshot) => {
                var videos = [];
                var existing = [];

                querySnapshot.docs.forEach((doc) => {
                  if (doc.exists) {
                    var newVideo = doc.data();
                    newVideo.id = doc.id;
                    newVideo.folder = newVideo.folder ? newVideo.folder : "*";
                    existing.push(newVideo);
                  }
                });
                const rested = this.state.postsWithChatMetas[shortId];
                var rest = rested ? Object.values(rested) : [];
                existing.forEach(
                  (newVideo) =>
                    (rest = rest.filter((x) => x.id !== newVideo.id))
                );
                videos = [...rest, ...existing];
                var copy = { ...this.state.postsWithChatMetas };
                delete copy[shortId];
                this.setState(
                  { postsWithChatMetas: { ...copy, [shortId]: videos } },
                  () => resolve(JSON.stringify(videos))
                );
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
          return await new Promise((resolve, reject) => {
            !fine && reject(!fine);
            const tmt = setInterval(() => {
              var videos = this.state.postsWithChatMetas[shortId];
              if (videos) {
                clearInterval(tmt);
                resolve(JSON.stringify(videos));
              }
            }, 2000);
            this.recheck.push(tmt);
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
          var close = firebase
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
            firebase
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
            const tmt = setInterval(() => {
              var user = this.state.users.find(
                (x) => x.username === profileUserName
              );

              if (user) {
                clearInterval(tmt);
                resolve(JSON.stringify(user));
              }
            }, 2000);
            this.recheck.push(tmt);
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
          var close = firebase
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
            firebase
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

            const tmt = setInterval(() => {
              var user = this.state.users.find((x) => x.id === userId);

              if (user) {
                clearInterval(tmt);
                resolve(JSON.stringify(user));
              }
            }, 2000);
            this.recheck.push(tmt);
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
          var close = firebase
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
            firebase
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
            const tmt = setInterval(() => {
              var community = this.state.communities.find(
                (x) => x.id === communityId
              );

              if (community) {
                clearInterval(tmt);
                resolve(JSON.stringify(community));
              }
            }, 2000);
            this.recheck.push(tmt);
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
          var close = firebase
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
            firebase
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
            const tmt = setInterval(() => {
              var community = this.state.communities.find(
                (x) => x.message.toLowerCase() === communityName.toLowerCase()
              );

              if (community) {
                clearInterval(tmt);
                resolve(JSON.stringify(community));
              }
            }, 2000);

            this.recheck.push(tmt);
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
          var close = firebase
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
            firebase
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
              const tmt = setInterval(() => {
                var entity = this.state.entities.find(
                  (x) =>
                    x.message.toLowerCase() === name.toLowerCase() &&
                    x.communityId === community.id
                );

                if (entity) {
                  clearInterval(tmt);
                  resolve(JSON.stringify(entity));
                }
              }, 2000);

              this.recheck.push(tmt);
            } else {
              const tmt = setInterval(() => {
                var entity = this.state.entities.find(
                  (x) =>
                    x.message.toLowerCase() === name.toLowerCase() &&
                    x.communityId === community.id
                );

                if (entity) {
                  clearInterval(tmt);
                  resolve(JSON.stringify(entity));
                }
              });
              this.recheck.push(tmt);
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
          var close = firebase
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
            firebase
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
            if (!fine) {
              close();
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!entityId) {
              reject(!entityId);
            }
            const tmt = setTimeout(() => {
              var entity = this.state.entities.find(
                (x) => x.id === entityId && x.entityType === entityType
              );

              if (entity) {
                clearTimeout(tmt);
                resolve(JSON.stringify(entity));
              }
            }, 2000);
            this.recheck.push(tmt);
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
        start = "oldCases";
      } else if (droppedId.startsWith("oldElection")) {
        collection = "oldElections";
        start = "oldElection";
      } else if (droppedId.startsWith("elections")) {
        collection = "elections";
        start = "elections";
      } else if (droppedId.startsWith("case")) {
        collection = "cases";
        start = "cases";
      } else if (droppedId.startsWith("budget")) {
        collection = "budget";
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

          var close = firebase
            .firestore()
            .collection(collection)
            .doc(id)
            .onSnapshot(async (doc) => {
              if (doc.exists) {
                var droppedPost = doc.data();
                droppedPost.id = doc.id;
                droppedPost.collection = collection;

                this.setState({
                  droppedPosts: [
                    ...this.state.droppedPosts.filter(
                      (x) =>
                        x.id !== droppedPost.id &&
                        x.collection !== droppedPost.collection
                    ),
                    droppedPost
                  ]
                });
              }
            });
          return await new Promise((resolve, reject) => {
            !fine && reject(!fine);
            firebase
              .firestore()
              .collection(collection)
              .doc(id)
              .get()
              .then(async (doc) => {
                if (doc.exists) {
                  var droppedPost = doc.data();
                  droppedPost.id = doc.id;
                  droppedPost.collection = collection;

                  this.setState({
                    droppedPosts: [
                      ...this.state.droppedPosts.filter(
                        (x) =>
                          x.id !== droppedPost.id &&
                          x.collection !== droppedPost.collection
                      ),
                      droppedPost
                    ]
                  });
                  var string = JSON.stringify(droppedPost);
                  resolve(string);
                } else resolve("");
              })
              .catch(standardCatch);
            if (!fine) {
              close(!droppedId);
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!droppedId) {
              reject(!droppedId);
            }
            const tmt = setInterval(() => {
              var droppedPost = this.state.droppedPosts.find(
                (x) => x.id === id && x.collection === collection
              );

              if (droppedPost) {
                clearInterval(tmt);
                resolve(JSON.stringify(droppedPost));
              }
            }, 2000);

            this.recheck.push(tmt);
          });
        }
      },
      closer: () => {
        fine = false;
      }
    };
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
          note.recipientsProfiled = await this.hydrateUsers(note.recipients);
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

    const old =
      targetid === "event"
        ? "oldPlanner"
        : targetid === "job"
        ? "oldJobs"
        : false;

    //freshen = clearTimeout(timeout) if timeout = setTimeout(close(onSnapshot),1200000)
    //if onSnapshot = firebase.firestore().collection(collection).where("communityId", "==", community.id).onSnapshot
    const keepalive = 3600000;
    //postIdToSubdocument: local field forged for subobject, like hydratePost/User in data.js for class (no Promise/awaits)
    //if dropId, drop = (dropId) => postIdToSubdocument(foo.dropId, keepalive);
    //if dropIds, drops = (dropIds) => foo.dropIds.map((f) => postIdToSubdocument(f, keepalive)); make-a-da-"[]"
    //if doc().data.message, messageAsArray = (doc().data.message) => lowercased array-string-buffer

    const jailclass = {
      uuid: "fetchCommEvents", //forumPosts
      docsOutputLabel: null,
      stateAfterLabel: "eventsCommLast",
      endBeforeLabel: "eventsCommUndo",
      state: {
        oldCollection: old,
        currentCollection: collection
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
      verbose: false, //verbose
      whenOn: false //whenOn
    };

    this.setState({
      jailclasses: [
        ...this.state.jailclasses.filter((x) => x.uuid !== "fetchCommEvents"),
        jailclass
      ]
    });
  };

  getProfileFutureEvents = async (profile) => {
    const keepalive = 3600000;
    const jailclass = {
      uuid: "getProfileFutureEvents", //forumPosts
      docsOutputLabel: null,
      stateAfterLabel: "eventsProfileLast",
      endBeforeLabel: "eventsProfileUndo",
      state: {},
      //for each: foo = {...doc.data(),doc.id}
      snapshotQuery: firebase
        .firestore()
        .collection("planner")
        .where("authorId", "==", profile.id), //optional canIncludes()?
      keepalive,
      sort: { order: "time", by: "desc" }, //sort
      near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      limit: 5, //limit
      startAfter: null, //startAfter
      endBefore: null, //endBefore
      verbose: false, //verbose
      whenOn: false //whenOn
    };

    this.setState({
      jailclasses: [
        ...this.state.jailclasses.filter(
          (x) => x.uuid !== "getProfileFutureEvents"
        ),
        jailclass
      ]
    });
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
      const jailclass = {
        uuid: "paginateProfilePosts" + type.collection, //forumPosts
        docsOutputLabel: null,
        stateAfterLabel: type.last,
        endBeforeLabel: type.undo,
        state: {
          currentComments: type.oppositeCommentsName
        },
        //for each: foo = {...doc.data(),doc.id}
        snapshotQuery: fbbb, //optional canIncludes()?
        keepalive,
        sort: { order: "time", by: "desc" }, //sort
        near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        limit: 8, //limit
        startAfter: null, //startAfter
        endBefore: null, //endBefore
        verbose: false, //verbose
        whenOn: false //whenOn
      };

      this.setState({
        jailclasses: [
          ...this.state.jailclasses.filter(
            (x) => x.uuid !== "paginateProfilePosts" + type.collection
          ),
          jailclass
        ]
      });
      /**
        foo.collection = type.oldCollection;
        foo.currentComments = type.oppositeCommentsName;
        reverst(foo, type.collection);
       */
    }
  };
  getPostsAs = async (chosenEntity) => {
    this.props.setForumDocs({
      entityPosts: []
    });

    const keepalive = 3600000;
    const jailclass = {
      uuid: "getPostsAs", //forumPosts
      docsOutputLabel: "entityPosts",
      stateAfterLabel: "groupLast",
      endBeforeLabel: "groupUndo",
      state: {},
      //for each: foo = {...doc.data(),doc.id}
      snapshotQuery: firebase
        .firestore()
        .collection("forum")
        .where("entityId", "==", chosenEntity.id)
        .where("entityType", "==", chosenEntity.entityType), //optional canIncludes()?
      keepalive,
      sort: { order: "time", by: "desc" }, //sort
      near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      limit: 14, //limit
      startAfter: null, //startAfter
      endBefore: null, //endBefore
      verbose: false, //verbose
      whenOn: false //whenOn
    };

    this.setState({
      jailclasses: [
        ...this.state.jailclasses.filter((x) => x.uuid !== "getPostsAs"),
        jailclass
      ]
    });
  };

  getPosts = (profile) =>
    profileDirectory.map((type) => {
      const keepalive = 3600000;
      const jailclass = {
        uuid: "getPosts" + type.currentCollection, //forumPosts
        docsOutputLabel: "profilePosts",
        stateAfterLabel: type.last,
        endBeforeLabel: type.undo,
        state: {
          currentComments: type.currentComments
        },
        //for each: foo = {...doc.data(),doc.id}
        snapshotQuery: firebase
          .firestore()
          .collection(type.currentCollection)
          .where("authorId", "==", profile.id), //optional canIncludes()?
        keepalive,
        sort: { order: "time", by: "desc" }, //sort
        near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        limit: 14, //limit
        startAfter: null, //startAfter
        endBefore: null, //endBefore
        verbose: false, //verbose
        whenOn: false //whenOn
      };

      return this.setState({
        jailclasses: [
          ...this.state.jailclasses.filter(
            (x) => x.uuid !== "getPosts" + type.currentCollection
          ),
          jailclass
        ]
      });
    });

  lastCityForum = async (city, commtype) => {
    if (!this.state.lastCityPost) {
      window.alert("no more");
    } else {
      var message = "fetching forum for " + city;
      this.props.loadGreenBlue(message);

      const keepalive = 3600000;
      const jailclass = {
        uuid: "fetchForum", //forumPosts
        docsOutputLabel: "forumPosts",
        stateAfterLabel: "lastCityPost",
        endBeforeLabel: "undoCityPost",
        state: {
          currentComments: "forumcomments"
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
        verbose: false, //verbose
        whenOn: false //whenOn
      };

      this.setState({
        jailclasses: [
          ...this.state.jailclasses.filter((x) => x.uuid !== "fetchForum"),
          jailclass
        ]
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
        uuid: "fetchForum", //forumPosts
        docsOutputLabel: "forumPosts",
        stateAfterLabel: "lastCityPost",
        endBeforeLabel: "undoCityPost",
        state: {
          currentComments: "forumcomments"
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
        verbose: false, //verbose
        whenOn: false //whenOn
      };

      this.setState({
        jailclasses: [
          ...this.state.jailclasses.filter((x) => x.uuid !== "fetchForum"),
          jailclass
        ]
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
          uuid: "fetchCommForum", //forumPosts
          docsOutputLabel: name,
          stateAfterLabel: last,
          endBeforeLabel: undo,
          state: {
            currentComments: NewcommentsName,
            oldComments: ExpiredcommentsName,
            oldCollection: old,
            currentCollection: collection
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
          verbose: false, //verbose
          whenOn: false //whenOn
        };

        this.setState({
          jailclasses: [
            ...this.state.jailclasses.filter(
              (x) => x.uuid !== "fetchCommForum"
            ),
            jailclass
          ]
        });

        if (postOld) {
          const jailclass = {
            uuid: "fetchCommForum", //forumPosts
            docsOutputLabel: old,
            stateAfterLabel: lastOld,
            endBeforeLabel: undoOld,
            state: {
              currentComments: NewcommentsName,
              oldComments: ExpiredcommentsName,
              oldCollection: old,
              currentCollection: collection
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
            verbose: false, //verbose
            whenOn: false //whenOn
          };

          this.setState({
            jailclasses: [
              ...this.state.jailclasses.filter(
                (x) => x.uuid !== "fetchCommForum"
              ),
              jailclass
            ]
          });
        }
      } else if (collection === "forum") {
        const keepalive = 3600000;
        const jailclass = {
          uuid: "fetchCommForum", //forumPosts
          docsOutputLabel: name,
          stateAfterLabel: last,
          endBeforeLabel: undo,
          state: {
            currentComments: NewcommentsName
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
          verbose: false, //verbose
          whenOn: false //whenOn
        };

        this.setState({
          jailclasses: [
            ...this.state.jailclasses.filter(
              (x) => x.uuid !== "fetchCommForum"
            ),
            jailclass
          ]
        });
      } else {
        const keepalive = 3600000;
        const jailclass = {
          uuid: "fetchCommForum", //forumPosts
          docsOutputLabel: name,
          stateAfterLabel: last,
          endBeforeLabel: undo,
          state: {
            currentComments: NewcommentsName
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
          verbose: false, //verbose
          whenOn: false //whenOn
        };

        this.setState({
          jailclasses: [
            ...this.state.jailclasses.filter(
              (x) => x.uuid !== "fetchCommForum"
            ),
            jailclass
          ]
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
      undo
      //lastOld,
      //undoOld
    } = fillQuery(commtype);
    var message = "fetching " + collection + " for " + community.message;
    this.props.loadGreenBlue(message);
    if (filterTime && !isForms) {
      const keepalive = 3600000;
      const jailclass1 = {
        uuid: "fetchCommForum", //forumPosts
        docsOutputLabel: name,
        stateAfterLabel: last,
        endBeforeLabel: undo,
        state: {
          currentComments: NewcommentsName,
          oldComments: ExpiredcommentsName,
          oldCollection: old,
          currentCollection: collection
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
        verbose: false, //verbose
        whenOn: false //whenOn
      };

      this.setState({
        jailclasses: [
          ...this.state.jailclasses.filter((x) => x.uuid !== "fetchCommForum"),
          jailclass1
        ]
      });
      /*
      const jailclass = {
        uuid: "fetchCommForum", //forumPosts
        docsOutputLabel: old,
        stateAfterLabel: lastOld,
        endBeforeLabel: undoOld,
        state: {
          currentComments: NewcommentsName,
          oldComments: ExpiredcommentsName,
          oldCollection: old,
          currentCollection: collection
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
        verbose:false, //verbose
        whenOn: false //whenOn
      };

      this.setState({
        jailclasses: [
          ...this.state.jailclasses.filter((x) => x.uuid !== "fetchCommForum"),
          jailclass
        ]
      });*/
    } else {
      //ordinances, departments
      const keepalive = 3600000;
      const jailclass = {
        uuid: "fetchCommForum", //forumPosts
        docsOutputLabel: name,
        stateAfterLabel: last,
        endBeforeLabel: undo,
        state: { currentComments: NewcommentsName },
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
        verbose: false, //verbose
        whenOn: false //whenOn
      };

      this.setState({
        jailclasses: [
          ...this.state.jailclasses.filter((x) => x.uuid !== "fetchCommForum"),
          jailclass
        ]
      });
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

    const old =
      targetid === "event"
        ? "oldPlanner"
        : targetid === "job"
        ? "oldJobs"
        : false;

    console.log(location[0], location[1]);
    this.props.setForumDocs({
      distance
    });
    const keepalive = 3600000;
    //for each: foo = {...doc.data(),doc.id}
    //sort && near cannot be true (coexist, orderBy used by geohashing)
    const jailclass = {
      uuid: "fetchEvents", //forumPosts
      docsOutputLabel: "forumPosts",
      stateAfterLabel: "lastCityPost",
      endBeforeLabel: "undoCityPost",
      state: {
        //events/entities, not comments
        oldCollection: old,
        currentCollection: collection
      },
      //
      snapshotQuery: this.GeoFirestore.collection(collection), //optional canIncludes()?
      keepalive,
      sort: null, //sort firestore orderBy { order: "time", by: "desc" }
      near: {
        center: new firebase.firestore.GeoPoint(location[1], location[0]),
        radius: distance
      }, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      limit: 14, //limit
      startAfter: null, //startAfter
      endBefore: null, //endBefore
      verbose: false, //verbose
      whenOn: false //whenOn
    };
    this.setState({
      jailclasses: [
        ...this.state.jailclasses.filter((x) => x.uuid !== "fetchEvents"),
        jailclass
      ]
    });
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
    this.setState(newPostingsClass, () => {
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
        uuid: "fetchForum", //forumPosts
        docsOutputLabel: "forumPosts",
        stateAfterLabel: "lastCityPost",
        endBeforeLabel: "undoCityPost",
        state: { currentComments: "forumcomments" },
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
        verbose: false, //verbose
        whenOn: false //whenOn
      };
      this.setState({
        jailclasses: [
          ...this.state.jailclasses.filter((x) => x.uuid !== "fetchForum"),
          jailclass
        ]
      });
    });
  };

  finFetchForum = (product) => {
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
      let p = 0;
      let forumPosts = [];
      Promise.all(
        product.docs.map(async (f, i) => {
          var foo = { ...f };
          foo.videos = foo.videos ? foo.videos : [];
          if (
            this.props.auth !== undefined &&
            product.state &&
            product.state.oldCollection
          ) {
            var datel =
              product.docsOutputLabel === "classes"
                ? foo.endDate.seconds * 1000
                : foo.date.seconds * 1000;
            foo.datel = new Date(datel);
            var other,
              reverst = null;
            if (
              !["oldClasses", "oldBudget", "oldPlanner", "oldCases"].includes(
                foo.collection
              ) &&
              foo.datel < new Date()
            ) {
              reverst = true;
              other = product.state.oldCollection;
              foo.currentComments = product.state.oldComments;
            } else if (
              ["oldClasses", "oldBudget", "oldPlanner", "oldCases"].includes(
                foo.collection
              ) &&
              foo.datel > new Date()
            ) {
              reverst = true;
              other = foo.collection;
              foo.currentComments = product.state.currentComments;
            }
            reverst &&
              reverst(
                foo,
                other,
                product.state.uuid === "fetchEvents" && this.GeoFirestore
              );
          }
          var buff = await this.handleCommSnapshot([foo], foo.collection);
          if (buff) {
            foo = buff[0];
          }

          foo.shortId = shortHandId(foo);
          return await new Promise(
            (resolve) =>
              foo.author &&
              (!foo.droppedId || foo.droppedPost) &&
              (!foo.communityId || foo.community) &&
              (!foo.entityId || foo.entity) &&
              resolve(foo)
          );
          //buff && forumPosts.push(buff[0]);
          //});
        })
      ).then((forumPosts) => {
        //console.log("forumPosts");
        //console.log(forumPosts);
        // console.log(p);
        //if (p === product.docs.length) {
        //forumPosts = forumPosts.forEach((foo) => JSON.parse(foo));
        //console.log(forumPosts[0].collection);
        this.props.unloadGreenBlue();
        const collection = forumPosts[0] && forumPosts[0].collection;
        if (this.props.isProfile) {
          if (
            [
              "budget",
              "oldBudget",
              "cases",
              "oldCases",
              "departments",
              "classes",
              "oldClasses",
              "forum",
              "ordinances"
            ].includes(collection)
          ) {
            const old = this.props.profilePosts.filter(
              (post) =>
                !forumPosts.find(
                  (x) => x.collection + x.id === post.collection + post.id
                )
            );
            console.log(collection, old, forumPosts);
            this.props.setForumDocs({
              profilePosts: [...old, ...forumPosts]
            });
          } else {
            //console.log(collection + product.state.role, forumPosts);
            this.setState({
              [product.docsOutputLabel]: forumPosts
            });
          }
        } else if (collection === "planner") {
          this.timeFilterEvents(
            forumPosts,
            this.state.edmStore[
              this.state.cityapi +
                this.state.stateapi +
                this.state.queriedDate +
                this.state.range
            ]
          );
        } else if (collection === "jobs") {
          this.timeFilterJobs(forumPosts);
        } else {
          this.props.setForumDocs({
            [product.docsOutputLabel]: forumPosts
          });
        }

        //}
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
      width,
      loadingHeight,
      isProfile
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
      jailclasses,
      updatedclasses,
      deletedclasses
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
    const counterPlz = this.state.counterEar && this.state.counterEar !== 0;
    if (true) {
      //console.log(profileEntities);
      return (
        <div>
          <div
            onMouseEnter={() =>
              this.setState({ hoveredear: true }, () => {
                clearTimeout(this.hoverear);
                this.hoverear = setTimeout(
                  () => this.setState({ hoveredear: false }),
                  3000
                );
              })
            }
            draggable={true}
            ref={this.ear}
            //onMouseMove={this.handleTooltipMove}
            onDrag={this.handleTooltipMove}
            //onMouseUp
            onDragEnd={this.resetTooltip}
            onTouchMove={this.handleTooltipMove}
            onTouchEnd={this.resetTooltip}
            style={{
              backgroundColor: !this.state.holdingEar ? "" : "white",
              borderRadius: "23px",
              overflow: "hidden",
              height: "46px",
              width: "46px",
              display: this.props.loadingMessage ? "none" : "flex",
              alignItems: "center",
              justifyContent: !counterPlz ? "center" : "space-between",
              position: "absolute",
              left: this.state.openAnyway ? "20px" : this.state.earSideways,
              top: this.state.openAnyway ? "20px" : this.state.earUpwards,
              zIndex: "11",
              //transform: `translate(${this.state.earSideways}px,${this.state.earUpwards}px)`,
              transition: "1s ease-in"
            }}
          >
            {!counterPlz ? (
              <div
                style={{
                  border: !this.state.openAnyway ? "0px solid" : "3px solid",
                  fontSize: !this.state.openAnyway ? "0px" : "14px",
                  transition: ".6s ease-in",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: this.state.holdingEar
                    ? "rgb(250,250,190)"
                    : "white",
                  height: this.state.openAnyway ? "56px" : "0px",
                  width: this.state.openAnyway ? "56px" : "0px"
                }}
                onClick={() => this.setState({ openAnyway: false })}
              >
                &times;
              </div>
            ) : (
              <div
                style={{
                  transition: ".2s ease-in",
                  fontSize:
                    this.state.counterEar === 3
                      ? "0px"
                      : this.state.counterEar === 1
                      ? "24px"
                      : "18px"
                }}
              >
                {this.state.counterEar}
              </div>
            )}
            <img
              alt="firestore snapshot listeners icon"
              style={{
                transition: ".7s ease-in",
                fontSize: counterPlz ? "10px" : "0px",
                backgroundColor: this.state.holdingEar
                  ? "rgb(250,250,190)"
                  : "white",
                height:
                  counterPlz || !this.state.openAnyway
                    ? this.state.counterEar === 2
                      ? "44px"
                      : this.state.counterEar === 1
                      ? "33px"
                      : "56px"
                    : "0px",
                width:
                  counterPlz || !this.state.openAnyway
                    ? this.state.counterEar === 2
                      ? "44px"
                      : this.state.counterEar === 1
                      ? "33px"
                      : "56px"
                    : "0px"
              }}
              src="https://www.dl.dropboxusercontent.com/s/pcko3nxl8arakkw/listeners%20icon%20%281%29.png?dl=0"
            />
          </div>
          {deletedclasses.length > 0 &&
            this.state.hoveredear &&
            !this.state.holdingEar &&
            !this.state.openAnyway && (
              <div
                onMouseEnter={() => this.setState({ hoverearquick: true })}
                onMouseLeave={() => this.setState({ hoverearquick: false })}
                onClick={() => this.setState({ openAnyway: true })}
                style={{
                  fontSize: "40px",
                  border: "1.5px solid",
                  backgroundColor: "white",
                  borderRadius: "6px",
                  color: this.state.hoverearquick ? "blue" : "grey",
                  position: "absolute",
                  padding: "4px",
                  left: this.state.deletedclassesopen
                    ? "20px"
                    : this.state.earSideways,
                  top: this.state.deletedclassesopen
                    ? "20px"
                    : this.state.earUpwards,
                  zIndex: "10",
                  //transform: `translate(${this.state.earSideways}px,${this.state.earUpwards}px)`,
                  transition: `${this.state.hoverearquick ? 0.1 : 1}s ease-in`,
                  transform: "translate(30px,-30px)"
                }}
              >
                &bull;
              </div>
            )}
          {deletedclasses.length > 0 &&
            this.state.hoveredear &&
            !this.state.holdingEar &&
            !this.state.openAnyway && (
              <div
                onMouseEnter={() => this.setState({ hovereartrashed: true })}
                onMouseLeave={() => this.setState({ hovereartrashed: false })}
                className="fas fa-trash"
                onClick={() => this.setState({ deletedclassesopen: true })}
                style={{
                  border: "1.5px solid",
                  backgroundColor: "white",
                  borderRadius: "6px",
                  color:
                    !this.state.holdingEar && this.state.hovereartrashed
                      ? "red"
                      : "grey",
                  position: "absolute",
                  padding: "4px",
                  left: this.state.deletedclassesopen
                    ? "20px"
                    : this.state.earSideways,
                  top: this.state.deletedclassesopen
                    ? "20px"
                    : this.state.earUpwards,
                  zIndex: "10",
                  //transform: `translate(${this.state.earSideways}px,${this.state.earUpwards}px)`,
                  transition: `${
                    this.state.hovereartrashed ? 0.1 : 1
                  }s ease-in`,
                  transform: "translate(30px,30px)"
                }}
              />
            )}
          {this.state.deletedclassesopen && (
            <div
              onClick={() => this.setState({ deletedclassesopen: false })}
              style={{
                position: "fixed",
                zIndex: "9",
                width: "100%",
                backgroundColor: "rgba(20,20,20,.7)",
                height: "100%"
              }}
            />
          )}
          {this.state.deletedclassesopen && (
            <div
              style={{
                border: "1.5px solid",
                backgroundColor: "white",
                borderRadius: "6px",
                position: "absolute",
                padding: "4px",
                left: this.state.deletedclassesopen
                  ? "20px"
                  : this.state.earSideways,
                top: this.state.deletedclassesopen
                  ? "20px"
                  : this.state.earUpwards,
                zIndex: "10",
                //transform: `translate(${this.state.earSideways}px,${this.state.earUpwards}px)`,
                transition: `${this.state.hovereartrashed ? 0.1 : 1}s ease-in`,
                transform: "translate(30px,30px)"
              }}
            >
              <div
                onClick={() => this.setState({ deletedclassesopen: false })}
                style={{
                  width: "max-content",
                  borderRadius: "10px",
                  border: "1px solid",
                  padding: "4px 10px"
                }}
              >
                close
              </div>
              {deletedclasses.map((x) => {
                return (
                  <div key={x.id}>
                    {x.id}
                    <div
                      //className="fas fa-trash"
                      className="fas fa-rocket"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid",
                        padding: "4px 10px",
                        color:
                          !this.state.holdingEar && this.state.hovereartrashed
                            ? "red"
                            : "grey"
                      }}
                      /*onClick={() =>
                      this.setState({
                        deletedclasses: this.props.deletedclasses.filter(
                          (u) => u.id !== x.id
                        )
                      })
                    }*/
                      onClick={() => {
                        const thisresnap = this.state.resnaps.find(
                          (y) => y[x.id]
                        );
                        this.setState({
                          deletedclasses: this.state.deletedclasses.filter(
                            (y) => x.id !== y.id
                          ),
                          jailclasses: [
                            ...this.state.jailclasses,
                            thisresnap[x.id]
                          ],
                          resnaps: this.state.resnaps.filter((y) => !y[x.id])
                        });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <JailClass
            fuffer={this.fuffer}
            jailclasses={jailclasses}
            updateLiberty={(productFuffer) =>
              this.setState(
                {
                  freedocs: [
                    ...this.state.freedocs.filter(
                      (x) => x.id !== productFuffer.id
                    ),
                    productFuffer
                  ]
                },
                () => {
                  clearTimeout(this.stop);
                  this.stop = setTimeout(
                    () =>
                      this.state.freedocs.forEach(
                        (product) =>
                          product &&
                          this.setState(
                            {
                              [product.stateAfterLabel]: product.startAfter,
                              [product.endBeforeLabel]: product.endBefore
                            },
                            () => this.finFetchForum(product)
                          )
                      ),
                    800
                  );
                }
              )
            }
            updatedclasses={updatedclasses}
            setJail={(x) => this.setState(x)}
            alivefors={this.state.alivefors}
            closes={this.state.closes}
            //={this.state.immutableRegister}
            resnaps={this.state.resnaps}
            freedocs={this.state.freedocs}
          />
          <WakeSnapshot
            jailclasses={jailclasses}
            deletedclasses={deletedclasses}
            setJail={(x) => this.setState(x)}
            updatedclasses={updatedclasses}
            freedocs={this.state.freedocs}
            loadingHeight={loadingHeight}
            isProfile={isProfile}
            openAnyway={this.state.openAnyway}
            remount={(x, func) => {
              this.setState(x, () => {
                clearTimeout(this.freetime);
                this.freetime = setTimeout(
                  () =>
                    this.setState({
                      freedocs: [
                        ...this.state.freedocs.filter((x) => x.id !== func.id),
                        func
                      ]
                    }),
                  200
                );
              });
            }}
            alivefors={this.state.alivefors}
            closes={this.state.closes}
            resnaps={this.state.resnaps}
          />
          <Folder
              setAuth={this.props.setAuth}
            profilePosts={this.props.profilePosts}
            setToUser={this.props.setToUser}
            unmountFirebase={this.props.unmountFirebase}
            width={width}
            commtype={commtype}
            history={this.props.history}
            getProfileEntities={this.getProfileEntities}
            getPostsAs={this.getPostsAs}
            item={item}
            containerStyle={containerStyle}
            height={appHeight}
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
            helper={this.handleComments}
            /*helper={async (c) => {
            var comments = c && (await this.handleComments(c).promise());
            return comments && JSON.parse(comments);
          }}*/
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
              var community =
                x && (await this.getCommunityByName(x).community());
              return community && JSON.parse(community);
            }}
            hydrateUserFromUserName={async (username) => {
              var userResult =
                username &&
                (await this.hydrateUserFromUserName(username).user());
              return userResult && JSON.parse(userResult);
            }}
            hydrateUser={async (userId) => {
              var userResult =
                userId && (await this.hydrateUser(userId).user());
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
    } else {
      return <div>welcome to Thumbprint.us - Social Calendar</div>;
    }
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
