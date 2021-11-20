import React from "react";
import { Link } from "react-router-dom";
import firebase from "../.././init-firebase.js";
import { standardCatch } from "../../widgets/authdb.js";
import NewDrop from "./NewDrop.js";

class Helper extends React.Component {
  state = { fire: false };
  takeOutTheTrash = (parent) => {
    const { confirmDelete } = this.state;
    if (confirmDelete) {
      this.setState({
        confirmDelete: null
      });
    } else {
      var answer = window.confirm(
        `want to really delete ${
          this.props.commtype === "new" ? "post" : this.props.commtype
        } ${parent.message} and all comments therein? you cannot undo this!`
      );
      if (answer) {
        this.setState({
          confirmDelete: ""
        });
      }
    }
  };
  editReaction = (reactions, reaction) =>
    this.setState(
      {
        reaction: reactions[reactions.lastIndexOf(reaction) + 1]
      },
      (reaction) => {
        const { parent } = this.props;
        const newReaction = reactions[reactions.lastIndexOf(reaction) + 1];
        clearTimeout(this.reactionaryFunction);
        this.reactionaryFunction = setTimeout(
          () =>
            firebase
              .firestore()
              .collection("users")
              .doc(parent.authorId)
              .update({
                newReaction
              })
              .then(() => {
                if (this.props.auth !== undefined) {
                  firebase
                    .firestore()
                    .collection(parent.collection)
                    .doc(parent.id)
                    .update({
                      reactions: !newReaction
                        ? firebase.firestore.FieldValue.arrayRemove(
                            this.props.auth.uid
                          )
                        : firebase.firestore.FieldValue.arrayUnion(
                            this.props.auth.uid
                          )
                    })
                    .then(() => {
                      const reactions = firebase
                        .firestore()
                        .collection("reactions");
                      const reactionObject = {
                        authorId: this.props.auth.uid,
                        parentAuthorId: parent.authorId,
                        parentCollection: parent.collection,
                        parentId: parent.id,
                        reaction: newReaction,
                        time: new Date()
                      };
                      reactions
                        .where("authorId", "==", this.props.auth.uid)
                        .where("parentId", "==", parent.id)
                        .where("parentCollection", "==", parent.collection)
                        .get()
                        .then((querySnapshot) => {
                          querySnapshot.docs.forEach((doc) => {
                            if (doc.exists) {
                              if (newReaction) {
                                reactions
                                  .doc(doc.id)
                                  .update(reactionObject)
                                  .catch(standardCatch);
                              } else {
                                reactions
                                  .doc(doc.id)
                                  .delete()
                                  .catch(standardCatch);
                              }
                            } else {
                              if (newReaction)
                                reactions
                                  .add(reactionObject)
                                  .catch(standardCatch);
                            }
                          });
                        });
                    })
                    .catch(standardCatch);
                } else {
                  clearTimeout(this.notified);
                  this.notified = setTimeout(
                    () =>
                      window.alert(
                        "they'll get the message, but you'll have to login to keep them notified"
                      ),
                    5555
                  );
                }
              })
              .catch(standardCatch),
          8888
        );
      }
    );
  yesDelete = (e) => {
    e.preventDefault();
    const { confirmDelete } = this.state;
    const { parent } = this.props;
    const deleteReactions = () => {
      const reactions = firebase.firestore().collection("reactions");
      reactions
        .where("parentId", "==", parent.id)
        .where("parentCollection", "==", parent.collection)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            console.log(
              "no reactions to delete for " +
                parent.collection +
                " " +
                parent.message
            );
          } else
            querySnapshot.docs.forEach((doc) => {
              if (doc.exists) {
                reactions.doc(doc.id).delete().catch(standardCatch);
              }
            });
        })
        .catch(standardCatch);
    };
    const deleteComments = () => {
      const comments = firebase.firestore().collection(parent.commentsName);
      comments
        .where("forumpostId", "==", parent.id)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            console.log(
              "no comments to delete for " +
                parent.collection +
                " " +
                parent.message
            );
          } else
            querySnapshot.docs.forEach((doc) => {
              comments.doc(doc.id).delete().catch(standardCatch);
            });
          deleteReactions();
        })
        .catch(standardCatch);
    };
    const deleteVideos = () => {
      //var thisone = this.props.commtype;
      const chatMeta = firebase.firestore().collection("chatMeta");
      chatMeta
        .where("threadId", "==", parent.collection + parent.id)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            console.log(
              "no videos to delete for " +
                parent.collection +
                " " +
                parent.message
            );
          } else
            querySnapshot.docs.forEach((doc) => {
              chatMeta.doc(doc.id).delete().catch(standardCatch);
            });
          deleteComments();
        });
    };
    if (confirmDelete.toLowerCase() === "delete") {
      this.setState(
        {
          confirmDelete: false
        },
        () => {
          const issues = firebase.firestore().collection("issues");
          firebase
            .firestore()
            .collection(parent.collection)
            .doc(parent.id)
            .delete()
            .then(() =>
              issues
                .where("title", "==", parent.issue)
                .get()
                .then((querySnapshot) => {
                  querySnapshot.docs.forEach(
                    (doc) =>
                      doc.exists &&
                      issues
                        .doc(doc.id)
                        .update({
                          issueCount: firebase.firestore.FieldValue.increment(
                            -1
                          )
                        })
                        .then(() => {
                          var o = null;
                          if (this.props.community) {
                            o = firebase
                              .firestore()
                              .collection("communities")
                              .doc(this.props.community.id);
                          } else {
                            o = firebase
                              .firestore()
                              .collection("cities")
                              .doc(this.props.city);
                          }
                          o.update({
                            ["issue" +
                            parent.issue]: firebase.firestore.FieldValue.increment(
                              -1
                            )
                          })
                            .then(() => {
                              this.props.delete(parent.id);
                              console.log("deleted post" + parent.id);
                              deleteVideos();
                            })
                            .catch(standardCatch);
                        })
                        .catch(standardCatch)
                  );
                })
            )
            .catch(standardCatch);
        }
      );
    }
  };
  render() {
    const { confirmDelete } = this.state;
    const { parent, opened, videoRecorderOpen } = this.props;
    const lit =
      "https://www.dl.dropboxusercontent.com/s/756f3108r08yerc/lit%20icon%20%282%29.png?dl=0";
    const shocked =
      "https://www.dl.dropboxusercontent.com/s/vfm52e6kcelapdz/Shocked%20icon.png?dl=0";
    const laughing =
      "https://www.dl.dropboxusercontent.com/s/zznekjklhmhnw9o/Laughing%20icon%20%281%29.png?dl=0";
    const contempt =
      "https://www.dl.dropboxusercontent.com/s/ash7v6zps0e9cag/Contempt%20icon.png?dl=0";
    const love =
      "https://www.dl.dropboxusercontent.com/s/o3s4bag8xmorigh/Love%20icon.png?dl=0";

    const reactions = ["lit", "shocked", "laughing", "contempt", "love"];
    const openingThisOne = opened === parent.shortId && !videoRecorderOpen;
    return (
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          height: openingThisOne ? "min-content" : "0px",
          width: "100%"
        }}
      >
        <div
          style={{
            height: "min-content",
            fontSize: "15px",
            width: "100%",
            color: "grey",
            alignItems: "center",
            justifyContent: "space-around",
            display: "flex"
          }}
        >
          {confirmDelete && (
            <form
              style={{
                right: "66px",
                position: "relative",
                bottom: "46px"
              }}
              onSubmit={this.yesDelete}
            >
              <input
                placeholder="delete"
                className="input"
                value={confirmDelete}
                onChange={(e) =>
                  this.setState({
                    [`confirmInput+${parent.id}`]: e.target.value
                  })
                }
              />
            </form>
          )}
          {(this.props.auth === undefined ||
            this.props.auth.uid !== parent.authorId) && (
            <div
              style={{ width: "40px", height: "40px", position: "relative" }}
            >
              {this.state.reaction ? (
                reactions.map((reaction) => {
                  var reactionSrc =
                    reaction === "lit"
                      ? lit
                      : reaction === "shocked"
                      ? shocked
                      : reaction === "laughing"
                      ? laughing
                      : reaction === "contempt"
                      ? contempt
                      : reaction === "love"
                      ? love
                      : null;
                  return (
                    <img
                      key={reaction}
                      onClick={() => this.editReaction(reactions, reaction)}
                      style={{
                        width:
                          this.state.reaction === reaction ? "40px" : "0px",
                        height:
                          this.state.reaction === reaction ? "40px" : "0px",
                        transition: ".3s ease-in"
                      }}
                      src={reactionSrc}
                      alt={`reaction ${reaction}`}
                    />
                  );
                })
              ) : (
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    width: "100%",
                    height: "min-content",
                    textAlign: "center"
                  }}
                  onClick={() => this.setState({ reaction: "lit" })}
                >
                  o
                </div>
              )}
            </div>
          )}

          {/*this.props.comment !== "" && (
          <div
            onClick={this.props.clear}
            style={{
              display: "flex",
              position: "relative",
              top: "0px",
              height: "46px",
              justifyContent: "flex-start",
              alignItems: "center",
              textIndent: "10px",
              color: "grey",
              flexDirection: "row",
              fontSize: "15px"
            }}
          >
            Clear
          </div>
          )*/}
          {this.props.showRebeats &&
            !parent.droppedPost &&
            this.props.auth !== undefined &&
            this.props.auth.uid === parent.authorId && (
              <NewDrop
                linkDrop={this.props.linkDrop}
                dropId={this.props.dropId}
                parent={parent}
                droppedCommentsOpen={this.props.droppedCommentsOpen}
                getUserInfo={this.props.getUserInfo}
                openDrop={this.props.openDrop}
                closeDrop={this.props.closeDrop}
                auth={this.props.auth}
                height={this.props.height}
                width={this.props.width}
                user={this.props.user}
              />
            )}
          {this.props.auth !== undefined &&
            parent.authorId === this.props.auth.uid &&
            this.props.closeDrop &&
            this.props.closeFilter && (
              <div
                onMouseEnter={() => this.setState({ hoverTrash: true })}
                onMouseLeave={() => this.setState({ hoverTrash: false })}
                onClick={() => this.takeOutTheTrash(parent)}
                //trash
                style={{
                  display: "flex",
                  color: "grey",
                  opacity: this.state.hoverTrash ? "1" : ".3",
                  transition: ".1s ease-in"
                }}
              >
                &#128465;
              </div>
            )}
          {!this.props.isDroppedIn &&
            this.props.auth !== undefined &&
            parent.authorId === this.props.auth.uid && (
              <div
                style={{
                  zIndex: "7",
                  color: "black",
                  height: "15px",
                  border: "1px solid",
                  width: "min-content"
                }}
                onClick={() => this.props.setPost({ videoRecorderOpen: true })}
              >
                +
              </div>
            )}
          {this.props.chosenPostId !== parent.id ||
          this.props.postHeight === 0 ||
          (this.props.chosenPostId !== parent.id &&
            this.props.postHeight > 0) ? null : (
            <div
              onClick={this.props.helper}
              style={{
                display: this.props.postHeight === 0 ? "none" : "flex",
                position: "relative",
                width:
                  this.props.chosenPostId === parent.id &&
                  this.props.postHeight > 0
                    ? ""
                    : "0px",
                minWidth: "30px",
                padding: "5px",
                paddingTop: "8px",
                color: "grey",
                fontSize: "15px",
                transition: "width .3s ease-in",
                border:
                  this.props.chosenPostId === parent.id &&
                  this.props.postHeight > 0
                    ? "1px black solid"
                    : "none",
                justifyContent: "center",
                alignItems: "center",
                zIndex: "9999"
              }}
            >
              &times;
            </div>
          )}
          <div
            style={{
              border: "1px solid",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "grey",
              height: "min-content",
              width: "min-content",
              borderRight: "1px solid"
            }}
          >
            <Link
              to={{ pathname: "/doc", state: { parent } }}
              style={{
                position: "relative",
                fontSize: "12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "grey",
                width: "min-content",
                margin: "5px",
                borderTop: "1px solid",
                borderLeft: "1px solid",
                borderRight: "1px solid"
              }}
            >
              <div
                style={{
                  height: "1px",
                  width: "9px",
                  margin: "2px",
                  backgroundColor: "grey"
                }}
              />
              <div
                style={{
                  height: "1px",
                  width: "9px",
                  margin: "2px",
                  backgroundColor: "grey"
                }}
              />
              <div
                style={{
                  height: "1px",
                  width: "9px",
                  margin: "2px",
                  backgroundColor: "grey"
                }}
              />
            </Link>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "black",
                width: "38px",
                borderLeft: "1px solid"
              }}
            >
              <i
                className="fas fa-phone"
                style={{
                  color: "grey",
                  position: "absolute"
                }}
              ></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Helper;
