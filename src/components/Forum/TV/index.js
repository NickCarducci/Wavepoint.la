import React from "react";
import ForumPagination from "../.././Forum/ForumPagination";
import Post from "../.././Post";
import firebase from "../../.././init-firebase";

class TV extends React.Component {
  state = {
    tv: []
  };
  getGlobalVideo = () => {
    //
    firebase
      .firestore()
      .collection("chatMeta")
      .orderBy("time", "desc")
      .limit(25)
      .onSnapshot((querySnapshot) => {
        let q = 0;
        let globalVideos = [];
        let postsss = [];
        let tv = [];
        querySnapshot.docs.forEach((doc) => {
          q++;
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            globalVideos.push(foo);
            postsss.push(foo.threadId);
          }
        });
        if (querySnapshot.docs.length === q) {
          var postss = new Set(...postsss);
          postss.map(async (x) => {
            var videos = globalVideos.filter((f) => f.threadId === x);
            var post = await firebase
              .firestore()
              .collection("forum")
              .doc(x)
              .get();
            post.videos = videos;
            post && tv.push(post);
          });
          var lastTVPost = querySnapshot.docs[querySnapshot.docs.length - 1];
          var undoTVPost =
            querySnapshot.docs[querySnapshot.docs.length + 25 - 1];
          this.setState({ tv, undoTVPost, lastTVPost });
        }
      });
  };
  getTopPosts = () => {
    //

    /*var switcher = [];
    selectedBias.map(x=>{
      if(["new","games","shows","lessons"].includes(x)&&!switcher.includes("forum")){
      switcher.push("forum")}else{
        switcher.push(x)
      }
    })
    var mapThese = this.state.profileDirectory.filter((x) =>
      selectedBias.includes(x.collection)
    );*/
    this.props.setForumDocs({
      profilePosts: []
    });
    let o = 0;
    [
      {
        commentsName: "forumcomments",
        collection: "forum",
        last: "lastPost",
        undo: "undoPost"
      },
      {
        commentsName: "ordinancecomments",
        collection: "ordinances",
        last: "lastOrdinance",
        undo: "undoOrdinance"
      },
      {
        oppositeCollection: "oldBudget",
        oppositeCommentsName: "budgetcommentsexpired",
        commentsName: "budgetcommentsnew",
        collection: "budget & proposals",
        last: "lastBudget",
        undo: "undoBudget"
      },
      {
        oppositeCollection: "oldCases",
        oppositeCommentsName: "casecommentexpired",
        commentsName: "casecommentsnew",
        collection: "court cases",
        last: "lastCase",
        undo: "undoCase"
      },
      {
        oppositeCollection: "oldElections",
        oppositeCommentsName: "electioncommentsexpired",
        commentsName: "electioncommentsnew",
        collection: "elections",
        last: "lastElection",
        undo: "undoElection"
      },
      {
        oppositeCollection: "budget & proposals",
        oppositeCommentsName: "budgetcommentsnew",
        commentsName: "budgetcommentsexpired",
        collection: "oldBudget",
        last: "lastOldBudget",
        undo: "undoOldBudget"
      },
      {
        oppositeCollection: "court cases",
        oppositeCommentsName: "casecommentsnew",
        commentsName: "casecommentexpired",
        collection: "oldCases",
        last: "lastOldCase",
        undo: "undoOldCase"
      },
      {
        oppositeCollection: "elections",
        oppositeCommentsName: "electioncommentsnew",
        commentsName: "electioncommentsexpired",
        collection: "oldElections",
        last: "lastOldElection",
        undo: "undoOldElection"
      }
    ].forEach((type) => {
      o++;
      return firebase
        .firestore()
        .collection(type.collection)
        .where("authorId", "==", profile.id)
        .orderBy("time", "desc")
        .limit(5)
        .onSnapshot(
          async (querySnapshot) => {
            let q = 0;
            if (querySnapshot.empty) {
              this.props.unloadGreenBlue();
              this.setState({
                [type.last]: null,
                [type.undo]: null
              });
            } else {
              querySnapshot.docs.forEach(async (doc) => {
                q++;
                if (doc.exists) {
                  var foo = doc.data();
                  foo.id = doc.id;
                  foo.collection = type.collection;
                  foo.commentsName = type.commentsName;
                  var community =
                    foo.communityId &&
                    (await this.props.getCommunity(foo.communityId));
                  foo.community = community && JSON.parse(community);
                  var droppedPost =
                    foo.droppedId && (await this.props.getDrop(foo.droppedId));
                  foo.droppedPost = droppedPost && JSON.parse(droppedPost);
                  var entity =
                    foo.entityId &&
                    (await this.props.hydrateEntity(
                      foo.entityId,
                      foo.entityType
                    ));
                  foo.entity = entity && JSON.parse(entity);
                  foo.author = await this.props.hydrateUser(foo.author.id);
                  var datel = foo.date && foo.date.seconds * 1000;
                  foo.datel = datel && new Date(datel);
                  /*var messageAsArray = arrayMessage(foo.message)
                  if (foo.messageAsArray !== messageAsArray) {
                    firebase
                      .firestore()
                      .collection(foo.collection)
                      .doc(foo.id)
                      .update({ messageAsArray });
                  }*/
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
                    ([
                      "elections",
                      "budget & proposals",
                      "court cases"
                    ].includes(foo.collection) &&
                      foo.datel > new Date())
                  ) {
                    var canView = !community
                      ? true
                      : this.canIView(foo, community);
                    if (canView) {
                      var rest = this.props.profilePosts.filter(
                        (post) =>
                          foo.id !== post.id ||
                          foo.collection !== post.collection
                      );
                      this.props.setForumDocs({
                        profilePosts: [...rest, foo]
                      });
                    }
                  } else {
                    foo.collection = type.oppositeCollection;
                    foo.commentsName = type.oppositeCommentsName;
                    firebase
                      .firestore()
                      .collection(foo.collection)
                      .doc(foo.id)
                      .set(foo)
                      .catch((err) => console.log(err.message));
                    firebase
                      .firestore()
                      .collection(type.collection)
                      .doc(foo.id)
                      .delete()
                      .then(() => {
                        console.log(
                          `document moved to previous ${type.collection} collection ` +
                            foo.id
                        );
                      })
                      .catch((err) => console.log(err.message));
                  }
                }
                if (querySnapshot.docs.length === q) {
                  var lastPost =
                    querySnapshot.docs[querySnapshot.docs.length - 1];
                  var undoPost = querySnapshot.docs[0];
                  this.setState({
                    [type.last]: lastPost,
                    [type.undo]: undoPost
                  });
                }
              });
            }
          },
          (err) => console.log(err.message)
        );
    });
    if (o === this.state.profileDirectory.length) {
      var readyProfile = [...this.state.readyProfile];
      readyProfile.push("posts");
      this.setState({
        readyProfile
      });
    }
  };
  render() {
    var columncount =
      this.props.width > 1600
        ? 5
        : this.props.width > 1200
        ? 4
        : this.props.width > 900
        ? 3
        : this.props.width > 600
        ? 2
        : 1;
    return (
      <div
        style={{
          display: "flex",
          position: "fixed",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(20,20,20,.6)",
          zIndex: "6"
        }}
      >
        tv
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: "10px",
            top: "10px",
            zIndex: "1"
          }}
          onClick={() => this.props.setTV({ openTv: false })}
        >
          &times;
        </div>
        <div
          style={{
            position: "fixed",
            top: "0px",
            width: "100%",
            height: "max-content",
            columnCount: columncount,
            columnGap: "0"
          }}
        >
          {this.state.commtype === "forum" && (
            <select style={{ width: "100%" }}>
              {["new", "lessons", "shows", "games"].map((x) => {
                return <option key={x}>{x}</option>;
              })}
            </select>
          )}
          <ForumPagination
            globeChosen={false}
            undoTVPost={this.state.undoTVPost}
            lastTVPost={this.state.lastTVPost}
            users={this.props.users}
            late={this.lastTV}
            back={this.undoTV}
            forumPosts={this.state.tv}
            tagsOpen={this.state.tagsOpen}
            tagResults={this.state.tagResults}
            //city={this.props.city}
            //community={this.props.community}
            toggleTags={
              this.state.tagsOpen
                ? () => this.setState({ tagsOpen: false })
                : () => this.setState({ tagsOpen: true })
            }
          />
          {this.state.tv.map((x, i) => {
            var user = this.props.users.find((y) => y.id === x.authorId);
            var thiscommunity = this.props.communities.find(
              (c) => c.id === x.communityId
            );
            return (
              <div
                key={i}
                onMouseEnter={() => this.setState({ chosenPostIdo: x.id })}
                onMouseLeave={() => this.setState({ chosenPostIdo: "" })}
                ref={this.state.chosenPostId === x.id ? this.post : null}
                style={
                  this.state.chosenPostIdo !== x.id &&
                  this.props.height > 600 &&
                  this.state.chosenPostId !== x.id
                    ? {
                        display: "flex",
                        //maxWidth: "300px",
                        height: "min-content",
                        overflow: "hidden",
                        color: "black",
                        flexDirection: "column",
                        WebkitColumnBreakInside: "avoid",
                        pageBreakInside: "avoid",
                        breakInside: "avoid",
                        opacity: ".8",
                        backgroundColor: "white"
                      }
                    : {
                        display: "flex",
                        //maxWidth: "300px",
                        height: "min-content",
                        overflow: "hidden",
                        color: "black",
                        flexDirection: "column",
                        WebkitColumnBreakInside: "avoid",
                        pageBreakInside: "avoid",
                        breakInside: "avoid",
                        opacity: "1",
                        backgroundColor: "white"
                      }
                }
              >
                <Post
                  getVideos={this.props.getVideos}
                  getFolders={this.props.getFolders}
                  city={x.city}
                  commtype={
                    ["budget & proposals", "oldBudget"].includes(x.collection)
                      ? "budget & proposal"
                      : ["elections", "oldElections"].includes(x.collection)
                      ? "election"
                      : ["court cases", "oldCases"].includes(x.collection)
                      ? "court case"
                      : ["ordinances"].includes(x.collection)
                      ? "ordinance"
                      : "forum"
                  }
                  openWhen={
                    ["oldElections", "oldCases", "oldBudget"].includes(
                      x.collection
                    )
                      ? "expired"
                      : "new"
                  }
                  x={x}
                  user={user}
                  users={this.props.users}
                  userMe={this.props.user}
                  auth={this.props.auth}
                  community={x.community}
                  communities={this.props.communities}
                  tileChanger={this.props.tileChanger}
                  chosenPostId={this.state.chosenPostId}
                  yes={
                    this.state.openNewComment &&
                    this.state.chosenPostId === x.id
                  }
                  helper2={() => this.setState({ postHeight: 0 })}
                  helper={() => {
                    var user = this.props.users.find(
                      (y) => y.id === x.authorId
                    );
                    if (
                      this.state.openNewComment &&
                      this.state.chosenPostId === x.id
                    ) {
                      this.setState({ openNewComment: false }, () => {
                        if (this.post && this.post.current) {
                          this.setState({
                            postHeight: this.post.current.offsetHeight
                          });
                        }
                      });
                    } else if (
                      this.state.postHeight > 0 &&
                      this.state.chosenPostId === x.id
                    ) {
                      this.setState(
                        {
                          openNewComment: false,
                          user,
                          post: x.message
                        },
                        () =>
                          this.setState(
                            {
                              chosenPostId: x.id,
                              thisone: x
                            },
                            () => {
                              if (this.post && this.post.current) {
                                this.setState({
                                  lastPostHeight: this.state.postHeight,
                                  postHeight: 0
                                });
                              }
                            }
                          )
                      );
                    } else {
                      this.setState(
                        {
                          chosenPostId: x.id,
                          user,
                          post: x.message,
                          thisone: x
                        },
                        () => {
                          if (this.post && this.post.current) {
                            this.setState({
                              postHeight: this.post.current.offsetHeight
                            });
                          }
                          this.setState({ waitToScroll: true }, () => {
                            setTimeout(() => {
                              this.state.comments.length > 0 &&
                                this.post &&
                                this.post.current &&
                                this.post.current.scrollIntoView("smooth");
                              this.setState({
                                waitToScroll: false
                              });
                            }, 300);
                          });
                        }
                      );
                    }
                  }}
                  thiscommunity={thiscommunity}
                  delete={() =>
                    this.setState({
                      deletedForumPosts: [...this.state.deletedForumPosts, x.id]
                    })
                  }
                  comments={this.state.comments}
                  clear={() => {
                    var answer = window.confirm(
                      "are you sure you want to clear this comment?"
                    );
                    if (answer) {
                      this.setState({ comment: "" });
                    }
                  }}
                  height={this.props.height}
                  postHeight={this.state.postHeight}
                  globeChosen={this.props.globeChosen}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default TV;
