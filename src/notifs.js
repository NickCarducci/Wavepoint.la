import React from "react";
import firebase from "./init-firebase";
import { profileCommentsDirectory } from "./widgets/arraystrings";
import { standardCatch } from "./widgets/authdb";

class Notifs extends React.Component {
  componentDidUpdate = (prevProps) => {
    if (
      this.props.openNotifs &&
      this.props.user !== undefined &&
      this.props.user !== prevProps.user
    ) {
      if (
        prevProps.user !== undefined &&
        this.props.user.newReaction !== prevProps.user.newReaction
      ) {
        this.setState({ newReaction: this.props.user.newReaction }, () =>
          setTimeout(() => {
            this.setState({ newReaction: null });
          }, 5555)
        );
      }
      firebase
        .firestore()
        .collection("reactions")
        .where("parentAuthorId", "==", this.props.auth.uid)
        .orderBy("time", "desc")
        .limit(10)
        .onSnapshot((querySnapshot) => {
          let reactionParents = [];
          let latestReactions = [];
          let p = 0;
          querySnapshot.docs.forEach(async (doc) => {
            p++;
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              foo.author = await this.props.hydrateUser(foo.authorId);
              reactionParents.push(foo.collection + foo.id);
              latestReactions.push(foo);
            }
          });
          if (querySnapshot.docs.length === p) {
            //if empty it is object, this always uses Array constructor, spread is agn
            var reactionparents = [...new Set(reactionParents)];
            let notificationReactions = [];
            reactionparents.map((parent) => {
              var result = latestReactions.filter(
                (reaction) => reaction.parentId
              );
              return notificationReactions.push({
                reactions: result,
                key: parent
              });
            });
            this.props.setNotifOpen({ notificationReactions });
          }
        }, standardCatch);
      /**
         *  {
    commentsName: "forumcomments",
    commentsSource: "forum",
    last: "lastForumComment",
    undo: "undoWeekComment"
  },
         */
      profileCommentsDirectory.map((collection) => {
        return firebase
          .firestore()
          .collection(collection.commentsSource)
          .where("parentAuthorId", "==", this.props.auth.uid)
          .orderBy("time", "desc")
          .limit(10)
          .onSnapshot((querySnapshot) => {
            let commentParents = [];
            let latestComments = [];
            let p = 0;
            if (!querySnapshot.empty) {
              querySnapshot.docs.forEach(async (doc) => {
                p++;
                if (doc.exists) {
                  var foo = doc.data();
                  foo.id = doc.id;
                  foo.author = await this.props.hydrateUser(foo.authorId);
                  commentParents.push(foo.collection + foo.id);
                  latestComments.push(foo);
                }
              });
              if (querySnapshot.docs.length === p) {
                var commentparents = new Set(commentParents);
                let notificationComments = [];
                commentparents.map((parent) => {
                  var result = latestComments.filter(
                    (reaction) => reaction.parentId
                  );
                  return notificationComments.push({
                    reactions: result,
                    key: parent
                  });
                });
                this.props.setNotifOpen({ notificationComments });
              }
            }
          }, standardCatch);
      });
    }
  };
  render() {
    const {
      openNotifs,
      forumOpen,
      notificationReactions,
      //notificationComments,
      newFollowers
    } = this.props;
    var open = openNotifs && forumOpen;
    return (
      <div
        style={{
          zIndex: "9999",
          overflow: "hidden",
          height: open ? "calc(100% - 56px)" : "0%",
          width: open ? "100%" : "0%",
          display: "flex",
          position: "absolute",
          transition: `.3s ease-out`
        }}
      >
        <div
          onClick={() =>
            openNotifs &&
            this.props.setNotifOpen({
              openNotifs: false
            })
          }
          style={{
            zIndex: "-1",
            lineHeight: "calc(100vh - 56px)",
            fontWeight: "bolder",
            fontSize: "30px",
            color: "rgba(130,220,250,.4)",
            overflow: "hidden",
            backgroundColor: "rgba(20,20,40,.9)",
            width: open ? "100%" : "0%",
            textAlign: "center",
            position: "absolute",
            transition: `.3s ease-out`
          }}
        >
          notifs
        </div>
        <div
          onClick={
            this.props.user !== undefined
              ? this.props.logoutofapp
              : this.props.getUserInfo
          }
          style={{
            height: "min-content",
            color: "white",
            padding: "3px 1px",
            border: "1px solid",
            width: "max-content"
          }}
        >
          {this.props.user === undefined ? (
            <i className="fas fa-user-secret" />
          ) : this.props.user.username ? (
            this.props.user.username
          ) : (
            "try again"
          )}
        </div>
        <div
          style={{
            height: "min-content",
            color: "white"
          }}
        >
          <span
            style={{
              height: "min-content",
              backgroundColor: "white",
              color: "rgb(20,20,40)"
            }}
          >
            Notifications
          </span>
          <br />
          {newFollowers.constructor !== Array || newFollowers.length === 0
            ? "nothing yet!"
            : newFollowers.map((x) => {
                return (
                  <div
                    onClick={() => {
                      firebase
                        .firestore()
                        .collection("users")
                        .doc(this.props.auth.uid)
                        .update({
                          followingNoticed: firebase.firestore.FieldValue.arrayUnion(
                            x.id
                          )
                        });
                    }}
                  >
                    <img
                      style={{ height: "30px", width: "30px" }}
                      src={x.photoThumbnail}
                      alt={x.username}
                    />
                    {x.name}@{x.username}
                    <div
                      style={{
                        marginLeft: "4px",
                        color: "grey",
                        fontSize: "12px",
                        border: "1px solid grey",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        height: "14px",
                        right: "0px",
                        wordBreak: "break-all",
                        paddingRight: "3px"
                      }}
                    >
                      dismiss
                    </div>
                  </div>
                );
              })}
          {notificationReactions.map((x) => {
            return (
              <div key={x.key}>
                {x.reactions.map((y, i) => {
                  return (
                    <div
                      key={i}
                      style={{
                        height: "44px",
                        width: "100%",
                        display: "flex"
                      }}
                    >
                      {x.reaction}&nbsp;<span>from</span>&nbsp;
                      {x.author.username}&nbsp;{x.author.name}&nbsp;
                      <span>
                        <img src={x.photoThumbnail} alt={`${x.username}`} />
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Notifs;
