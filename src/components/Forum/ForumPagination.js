import React from "react";
import settings from ".././Icons/Images/settings.png";
import firebase from "../.././init-firebase";
import refresh from ".././Icons/Images/refresh.png";

class ForumPagination extends React.Component {
  state = { queryWord: "", lastQueryWord: "", fetchingComments: null };

  handleCommentSet = (type, profile, paginate, queryWord) => {
    var fine = true;
    return {
      promise: async () =>
        await new Promise((resolve, reject) => {
          if (!fine) reject(!fine);
          let comments = [];
          var close = false;
          if (paginate) {
            if (this.state[type[paginate]]) {
              if (paginate === "undo") {
                close = firebase
                  .firestore()
                  .collection(type.commentsName)
                  .where(
                    "messageAsArray",
                    "array-contains",
                    this.state.queryWord
                  )
                  .where("authorId", "==", profile.id)
                  .orderBy("time", "desc")
                  .endBefore(this.state[type.undo])
                  .limitToLast(14);
              } else {
                close = firebase
                  .firestore()
                  .collection(type.commentsName)
                  .where(
                    "messageAsArray",
                    "array-contains",
                    this.state.queryWord
                  )
                  .where("authorId", "==", profile.id)
                  .orderBy("time", "desc")
                  .startAfter(this.state[type.last])
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
                  .catch((e) => console.log(e.message));
            } else resolve("none");
          } else {
            close = firebase
              .firestore()
              .collection(type.commentsName)
              .where("messageAsArray", "array-contains", queryWord)
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
  handleProfileComments = (profile, paginate, queryWord) => {
    this.props.setForumDocs({
      postsOfComments: []
    });
    this.props.loadGreenBlue("loading more commented posts");
    Promise.all(
      this.state.profileCommentsDirectory.map(async (type, i) => {
        return await this.handleCommentSet(
          type,
          profile,
          paginate,
          queryWord
        ).promise();
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
      commms.map((post) =>
        firebase
          .firestore()
          .collection(post.collection)
          .doc(post.forumpostId)
          .onSnapshot(
            async (doc) => {
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
                var rest = this.props.postsOfComments.filter(
                  (post) =>
                    foo.id !== post.id || foo.collection !== post.collection
                );
                this.props.setForumDocs({
                  postsOfComments: [...rest, foo]
                });
              }
            },
            (e) => console.log(e.message)
          )
      );
      this.props.unloadGreenBlue();
    });
  };

  getComments = (profile, queryWord) =>
    this.handleProfileComments(profile, null, queryWord);

  lastComments = (profile) => this.handleProfileComments(profile, "last");

  undoComments = (profile) => this.handleProfileComments(profile, "undo");

  componentDidUpdate = (prevProps) => {
    const { community, city } = this.props;
    if (community !== prevProps.community || city !== prevProps.city) {
      this.setState({ queryWord: "" });
    }
    if (
      this.state.queryWord !== "" &&
      this.state.queryWord !== this.state.lastQueryWord
    ) {
      if (!this.state.done) {
        clearInterval(this.int);
        this.int = setInterval(() => {
          if (this.state.fetchingComments === null) {
            this.setState({ fetchingComments: true });
          } else if (this.state.fetchingComments) {
            this.setState({ fetchingComments: false });
          } else {
            this.setState({ fetchingComments: null });
          }
        }, 1500);
      } else {
        clearInterval(this.int);
        this.setState({ fetchingComments: null });
        this.reset();
      }
    }
  };
  componentWillUnmount = () => {
    clearInterval(this.int);
  };
  paginateCapture = (collection, way) => {
    const { community } = this.props;
    var snap = false;

    if (this.props.chosenEntity) {
      if (way === "undo") {
        snap = firebase
          .firestore()
          .collection(collection)
          .where("messageAsArray", "array-contains", this.state.queryWord)
          .where("entityId", "==", this.props.chosenEntity.id)
          .where("entityType", "==", this.props.chosenEntity.entityType)
          .orderBy("time", "desc")
          .endBefore(this.state.undo)
          .limitToLast(5);
      } else {
        snap = firebase
          .firestore()
          .collection(collection)
          .where("messageAsArray", "array-contains", this.state.queryWord)
          .where("entityId", "==", this.props.chosenEntity.id)
          .where("entityType", "==", this.props.chosenEntity.entityType)
          .orderBy("time", "desc")
          .startAfter(this.state.last)
          .limit(5);
      }
    } else if (this.props.profile) {
      if (way === "undo") {
        snap = firebase
          .firestore()
          .collection(collection)
          .where("messageAsArray", "array-contains", this.state.queryWord)
          .where("authorId", "==", this.props.profile.id)
          .orderBy("time", "desc")
          .endBefore(this.state.undo)
          .limitToLast(5);
      } else {
        snap = firebase
          .firestore()
          .collection(collection)
          .where("messageAsArray", "array-contains", this.state.queryWord)
          .where("authorId", "==", this.props.profile.id)
          .orderBy("time", "desc")
          .startAfter(this.state.last)
          .limit(5);
      }
    } else {
      if (way === "undo") {
        if (community) {
          snap = firebase
            .firestore()
            .collection(collection)
            .where("messageAsArray", "array-contains", this.state.queryWord)
            .where("communityId", "==", community.id)
            .orderBy("time", "desc")
            .endBefore(this.state.undo)
            .limitToLast(5);
        } else {
          snap = firebase
            .firestore()
            .collection(collection)
            .where("messageAsArray", "array-contains", this.state.queryWord)
            .where("city", "==", this.props.city)
            .orderBy("time", "desc")
            .endBefore(this.state.undo)
            .limitToLast(5);
        }
      } else {
        if (community) {
          snap = firebase
            .firestore()
            .collection(collection)
            .where("messageAsArray", "array-contains", this.state.queryWord)
            .where("communityId", "==", community.id)
            .orderBy("time", "desc")
            .startAfter(this.state.last)
            .limit(5);
        } else {
          snap = firebase
            .firestore()
            .collection(collection)
            .where("messageAsArray", "array-contains", this.state.queryWord)
            .where("city", "==", this.props.city)
            .orderBy("time", "desc")
            .startAfter(this.state.last)
            .limit(5);
        }
      }
    }
    snap &&
      snap.onSnapshot(
        (querySnapshot) => {
          let queryTermResults = [];
          let p = 0;
          if (querySnapshot.empty) {
            this.reset();
          } else
            querySnapshot.docs.forEach(async (doc) => {
              p++;
              if (doc.exists) {
                var foo = doc.data();
                foo.id = doc.id;
                foo.droppedPost =
                  foo.droppedId && (await this.props.findPost(foo.droppedId));
                foo.community =
                  foo.communityId &&
                  (await this.props.getCommunity(foo.communityId));
                foo.author = await this.props.hydrateUser(foo.authorId);
                if (this.props.profile) {
                  var rest = this.props.profilePosts.filter(
                    (post) =>
                      !(
                        foo.id === post.id && foo.collection === post.collection
                      )
                  );
                  this.props.setForumDocs({
                    profilePosts: [...rest, foo]
                  });
                } else queryTermResults.push(foo);
              }
              if (querySnapshot.docs.length === p) {
                if (!this.props.profile)
                  this.props.setForumDocs({
                    forumPosts: queryTermResults
                  });
                this.setState({
                  done: true,
                  last: querySnapshot.docs[querySnapshot.docs.length - 1],
                  undo: querySnapshot.docs[0]
                });
              }
            });
        },
        (e) => console.log(e.message)
      );
  };
  paginateWordQuery = (way) => {
    this.setState({
      done: false
    });
    if (!this.state[way]) {
      return window.alert("no more");
    }
    if (this.props.swipe === "comments" && this.props.profile) {
      this.props.setForumDocs({
        postsOfComments: []
      });
      if (way === "undo") {
        this.undoComments(this.props.profile);
      } else {
        this.lastComments(this.props.profile);
      }
    } else if (this.props.chosenEntity) {
      this.paginateCapture("forum", way);
    } else if (this.props.profile) {
      this.props.setForumDocs({
        profilePosts: []
      });
      let o = 0;
      this.props.profileDirectory.forEach((type) => {
        o++;
        return this.paginateCapture(type.collection, way);
      });
      if (o === this.props.profileDirectory.length) {
        this.props.unloadGreenBlue();
      }
    } else {
      this.paginateCapture(this.props.collection, way);
    }
  };
  capture = (collection, queryWord) => {
    const { community } = this.props;
    this.setState(
      {
        done: false
      },
      () => {
        var snap = false;
        if (this.props.swipe === "comments" && this.props.profile) {
          this.getComments(this.props.profile, queryWord);
        } else if (this.props.chosenEntity) {
          snap = firebase
            .firestore()
            .collection(collection)
            .where("messageAsArray", "array-contains", queryWord)
            .where("entityId", "==", this.props.chosenEntity.id)
            .where("entityType", "==", this.props.chosenEntity.entityType)
            .orderBy("time", "desc")
            .limit(5);
        } else if (this.props.profile) {
          snap = firebase
            .firestore()
            .collection(collection)
            .where("messageAsArray", "array-contains", queryWord)
            .where("authorId", "==", this.props.profile.id)
            .orderBy("time", "desc")
            .limit(5);
        } else {
          if (community) {
            snap = firebase
              .firestore()
              .collection(collection)
              .where("messageAsArray", "array-contains", queryWord)
              .where("communityId", "==", community.id)
              .orderBy("time", "desc")
              .limit(5);
          } else {
            snap = firebase
              .firestore()
              .collection(collection)
              .where("messageAsArray", "array-contains", queryWord)
              .where("city", "==", this.props.city)
              .orderBy("time", "desc")
              .limit(5);
          }
        }
        snap &&
          snap.onSnapshot(
            (querySnapshot) => {
              let queryTermResults = [];
              let p = 0;
              if (querySnapshot.empty) {
                this.reset();
              } else
                querySnapshot.docs.forEach(async (doc) => {
                  p++;
                  if (doc.exists) {
                    var foo = doc.data();
                    foo.id = doc.id;
                    foo.droppedPost =
                      foo.droppedId &&
                      (await this.props.findPost(foo.droppedId));
                    foo.community =
                      foo.communityId &&
                      (await this.props.getCommunity(foo.communityId));
                    foo.author = await this.props.hydrateUser(foo.authorId);
                    if (this.props.profile) {
                      var rest = this.props.profilePosts.filter(
                        (post) =>
                          !(
                            foo.id === post.id &&
                            foo.collection === post.collection
                          )
                      );
                      this.props.setForumDocs({
                        profilePosts: [...rest, foo]
                      });
                    } else foo.author && queryTermResults.push(foo);
                  }
                  if (querySnapshot.docs.length === p) {
                    if (!this.props.profile) {
                      this.props.setForumDocs({
                        forumPosts: queryTermResults
                      });
                    }
                    this.setState({
                      done: true,
                      last: querySnapshot.docs[querySnapshot.docs.length - 1],
                      undo: querySnapshot.docs[0]
                    });
                  }
                });
            },
            (e) => console.log(e.message)
          );
      }
    );
  };
  handleQueryWord = (queryWord) => {
    clearTimeout(this.queryTermTimeout);
    if (queryWord !== "" && queryWord !== this.state.lastQueryWord) {
      this.queryTermTimeout = setTimeout(() => {
        if (this.props.commtype === "bills" && this.props.bills !== []) {
          this.props.getBills(null, null, queryWord);
        } else if (this.props.swipe === "comments" && this.props.profile) {
          this.setState({ savedProfileComments: this.props.postsOfComments });
          this.capture(null, queryWord);
        } else if (this.props.chosenEntity) {
          this.setState({ savedProfilePosts: this.props.profilePosts });
          this.capture("forum", queryWord);
        } else if (this.props.profile) {
          this.setState({ savedProfilePosts: this.props.profilePosts });
          this.props.setForumDocs({
            profilePosts: []
          });
          let o = 0;
          this.props.profileDirectory.forEach((type) => {
            o++;
            return this.capture(type.collection, queryWord);
          });
          if (o === this.props.profileDirectory.length) {
            this.props.unloadGreenBlue();
          }
        } else {
          this.setState({ savedForumPosts: this.props.forumPosts });
          this.capture(this.props.collection, queryWord);
        }
      }, 1200);
      this.setState({ lastQueryWord: queryWord });
    }
  };
  reset = () =>
    this.setState(
      {
        done: true,
        queryWord: "",
        savedProfileComments: [],
        savedProfilePosts: [],
        savedForumPosts: [],
        undo: null,
        last: null
      },
      () => {
        if (this.props.swipe === "comments" && this.props.profile) {
          this.props.setForumDocs({
            postsOfComments: this.state.savedProfileComments
          });
        } else if (this.props.chosenEntity) {
          this.props.setForumDocs({
            profilePosts: this.state.savedProfilePosts
          });
        } else if (this.props.profile) {
          this.props.setForumDocs({
            profilePosts: this.state.savedProfilePosts
          });
        } else {
          this.props.setForumDocs({
            forumPosts: this.state.savedForumPosts
          });
        }
      }
    );

  render() {
    const { show, auth, community } = this.props;
    var isCommunityAdmin =
      this.props.commtype === "new" &&
      community &&
      auth !== undefined &&
      (auth.uid === community.authorId || community.admin.includes(auth.uid));
    const last = this.props.forumPosts[this.props.forumPosts.length - 1];
    const first = this.props.forumPosts[0];
    return (
      <div
        style={{
          overflow: "hidden",
          position: "relative",
          transition: ".3s ease-in",
          height: show ? "min-content" : "0px",
          backgroundColor: "rgb(20,20,25)",
          width: "100%"
        }}
      >
        <div
          style={{
            padding: show ? "10px 0px" : "0px 0px",
            margin: show ? "0px 10px" : "0px 0px"
          }}
        >
          {this.props.tagsOpen && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "rgb(10,70,60)",
                color: "white"
              }}
            >
              {community && community.tags && community.tags.length > 0 && (
                <input className="input" placeholder="search tags" />
              )}

              {community && community.tags && community.tags.length > 0 ? (
                this.props.tagsOpen ? (
                  this.props.tagResults &&
                  this.props.tagResults.map((x) => {
                    return <div>{x}</div>;
                  })
                ) : community.tags ? (
                  community.tags.map((x) => {
                    return <div>{x}</div>;
                  })
                ) : null
              ) : (
                <div>No tags made</div>
              )}
            </div>
          )}
          <div
            style={{
              display: "flex",
              width: "100%"
            }}
          >
            {isCommunityAdmin && (
              <div style={{ position: "relative" }}>
                <img
                  onClick={() => {
                    this.props.toggleEditing();
                  }}
                  src={settings}
                  alt="settings"
                  style={{
                    padding: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: "5px",
                    width: "12px",
                    borderRadius: "15px",
                    border: "1px solid",
                    backgroundColor: "rgb(20,20,20)",
                    color: "white"
                  }}
                />
              </div>
            )}
            {this.props.billSubject &&
            this.props.commtype === "bills" &&
            this.props.bills !== [] ? (
              <div onClick={this.props.clearBillSubject}>
                &times;&nbsp;{this.props.billSubject}
              </div>
            ) : (
              <input
                className="input"
                style={{
                  width: `calc(100% - ${
                    isCommunityAdmin ? "40px" : community ? "20px" : "10px"
                  })`
                }}
                placeholder="word-query"
                value={this.state.queryWord}
                onChange={(e) => {
                  var queryWord = e.target.value.toLowerCase();
                  this.setState({ queryWord });
                  this.handleQueryWord(queryWord);
                }}
              />
            )}
            {community && (
              <div
                onClick={() => window.alert(community.body)}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "5px",
                  width: "20px",
                  borderRadius: "15px",
                  border: "1px solid",
                  backgroundColor: "rgb(20,20,20)",
                  color: "white"
                }}
              >
                i
              </div>
            )}
            {this.state.queryWord && (
              <div
                style={{ color: "white" }}
                onClick={() => {
                  var answer = window.alert(
                    "clear " + this.state.queryWord + "?"
                  );
                  if (answer) {
                    this.reset();
                  }
                }}
              >
                <div>
                  fetch{!this.state.done ? "ing" : "ed"} {this.state.queryWord}{" "}
                  posts{!this.state.done ? "" : "."}
                  {this.state.fetchingComments !== null && (
                    <span>
                      .{!this.state.fetchingComments && <span>.</span>}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundImage:
                "linear-gradient(to right, rgba(20,20,25,.8), rgba(255,255,255,.8), rgba(20,20,25,.8))"
            }}
          >
            <div
              style={{
                display: "flex",
                color: this.props.undoCommPost ? "grey" : ""
              }}
              onClick={
                this.state.queryWord &&
                this.props.commtype === "bills" &&
                this.props.bills !== []
                  ? this.props.getBills(null, "undo", this.state.queryWord)
                  : this.state.queryWord
                  ? () => this.paginateWordQuery("undo")
                  : this.props.back
              }
            >
              <div
                style={{
                  borderLeft: `4px solid rgba(220,250,220,${
                    this.props.undoCommPost ? "1" : ".5"
                  })`,
                  borderBottom: `4px solid rgba(220,250,220,${
                    this.props.undoCommPost ? "1" : ".5"
                  })`,
                  display: "flex",
                  //backgroundColor: "rgb(10,120,90)",
                  transform: "rotate(45deg)",
                  height: "15px",
                  width: "15px",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "30px",
                  marginLeft: "20px"
                }}
              />
              {this.props.profile ? "next" : "undo"}
            </div>
            {this.props.bills !== [] && this.props.commtype === "bills"
              ? this.props.bills[0] &&
                new Date(this.props.bills[0].updated_at).toLocaleDateString()
              : first &&
                new Date(
                  (first.time?first.time:first.date).seconds * 1000
                ).toLocaleDateString()}
            &nbsp;-
            <br />
            {this.props.bills !== [] && this.props.commtype === "bills"
              ? this.props.bills[this.props.bills.length - 1] &&
                new Date(
                  this.props.bills[this.props.bills.length - 1].updated_at
                ).toLocaleDateString()
              : last
              ? new Date(
                  (last.time ? last.time : last.date).seconds * 1000
                ).toLocaleDateString()
              : new Date().toLocaleDateString()}
            <div
              style={{
                display: "flex",
                color: this.props.lastCommPost ? "grey" : ""
              }}
              onClick={
                this.state.queryWord &&
                this.props.commtype === "bills" &&
                this.props.bills !== []
                  ? this.props.getBills(null, "last", this.state.queryWord)
                  : this.state.queryWord
                  ? () => this.paginateWordQuery("last")
                  : this.props.late
              }
            >
              {this.props.profile ? "undo" : "next"}
              {this.props.profile && this.state.noChange ? (
                <img
                  style={{
                    display: "flex",
                    height: "15px",
                    width: "15px",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "30px",
                    marginRight: "20px"
                  }}
                  src={refresh}
                  alt="refresh"
                />
              ) : (
                <div
                  style={{
                    borderTop: `4px solid rgba(220,250,220,${
                      this.props.lastCommPost ? "1" : ".5"
                    })`,
                    borderRight: `4px solid rgba(220,250,220,${
                      this.props.lastCommPost ? "1" : ".5"
                    })`,
                    display: "flex",
                    //backgroundColor: "rgb(10,90,120)",
                    transform: "rotate(45deg)",
                    height: "15px",
                    width: "15px",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "30px",
                    marginRight: "20px"
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ForumPagination;
