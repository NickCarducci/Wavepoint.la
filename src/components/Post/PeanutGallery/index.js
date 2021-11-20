import React from "react";
import Comments from "./Comments";
import back from "../.././Icons/Images/back.png";
//import GroupFilter from "../../../Chats/GroupFilter/GroupFilter";
import firebase from "../../.././init-firebase.js";
import { arrayMessage, standardCatch } from "../../../widgets/authdb";

class PeanutGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = { comment: "", textBoxHeight: 30 };
    this.textBox = React.createRef();
  }
  componentDidUpdate = (prevProps) => {
    if (this.props.chosenPostId !== prevProps.chosenPostId) {
      this.setState({ continueWriting: false });
    }
  };
  render() {
    const {
      vertical,
      postHeight,
      comments,
      auth,
      height,
      chosenPost
    } = this.props;
    var mine = [];
    if (auth !== undefined && comments)
      mine = comments.filter((x) => x.authorId === auth.uid);
    var commentType = chosenPost
      ? ["budget", "oldBudget"].includes(chosenPost.collection)
        ? "budgetcomments" +
          (chosenPost.collection === "oldBudget" ? "expired" : "new")
        : ["elections", "oldElection"].includes(chosenPost.collection)
        ? "electioncomments" +
          (chosenPost.collection === "oldElection" ? "expired" : "new")
        : ["cases", "oldCases"].includes(chosenPost.collection)
        ? "casecomments" +
          (chosenPost.collection === "oldCases" ? "expired" : "new")
        : chosenPost.collection === "ordinances"
        ? "ordinancecomments"
        : "forumcomments"
      : null;
    return (
      <div>
        {postHeight > 0 && height > 600 && postHeight < height * 0.7 && (
          <div
            onClick={() => this.props.helper()}
            style={{
              backgroundColor: "rgba(20,20,40,.5)",
              display: "flex",
              left: "0px",
              width: "100%"
            }}
          />
        )}
        <div
          style={{
            right: "0px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            /*top:
              height > 599 && postHeight > 0 && postHeight < height * 0.7
                ? postHeight
                : 0,*/
            width: vertical ? "calc(100% - 56px)" : "100%",
            /*height:
              postHeight === 0
                ? 0
                : height > 599 && postHeight > 0 && postHeight < height * 0.7
                ? `calc(100% - ${postHeight}px)`
                : "100%",*/
            color: "grey",
            fontSize: "15px",
            opacity: postHeight > 0 ? "1" : "0",
            backgroundColor: "rgb(20,20,20)",
            transition: "height .3s ease-in"
          }}
        >
          {postHeight > 0 && (
            <div
              onClick={() => this.props.helper()}
              style={{
                zIndex: 10,
                borderTopRightRadius: "18px",
                borderTopLeftRadius: "9px",
                borderBottomRightRadius: "9px",
                borderBottomLeftRadius: "2px",
                color: "black",
                position: "absolute",
                right: "0px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                backgroundColor: "rgb(100,200,250)"
              }}
            >
              &times;
            </div>
          )}
          <Comments
            chosenPost={chosenPost}
            chosenPostId={this.props.chosenPostId}
            textBoxHeight={this.state.textBoxHeight}
            vertical={this.props.vertical}
            commentType={commentType}
            commtype={this.props.commtype}
            width={this.props.width}
            height={height}
            comments={comments}
            forumPosts={this.props.forumPosts}
            user={this.props.user}
            auth={auth}
          />
          {mine && mine.length > 5
            ? null
            : postHeight > 0 && (
                <div
                  style={{
                    display: "flex",
                    position: "relative",
                    width: "100%",
                    height: "min-content",
                    color: "white",
                    opacity: "1",
                    transition: "opacity .3s ease-in"
                  }}
                >
                  <div
                    style={{
                      borderTop: "1px solid rgb(160,160,160)",
                      top: "0px",
                      padding: "5px",
                      display: "flex",
                      position: "relative",
                      width: "100%",
                      minHeight: "30px",
                      height: this.state.textBoxHeight,
                      color: "black",
                      flexDirection: "column",
                      fontSize: "15px"
                    }}
                  >
                    <div
                      ref={this.textBox}
                      style={{
                        maxHeight: "calc(100vh - 12px)",
                        minHeight: "30px",
                        width: "calc(100% - 12px)",
                        position: "absolute",
                        zIndex: "-9999",
                        wordBreak: "break-all"
                      }}
                    >
                      {this.state.comment.split("\n").map((item, i) => (
                        <span key={i}>
                          {item}
                          <br />
                        </span>
                      ))}
                    </div>
                    <textarea
                      style={{
                        maxHeight: "calc(100vh - 12px)",
                        width: "calc(100% - 12px)",
                        position: "absolute",
                        height: this.state.textBoxHeight,
                        resize: "none",
                        wordBreak: "break-all"
                      }}
                      maxLength="500"
                      value={this.state.comment}
                      onChange={(e) => {
                        if (
                          !this.state.continueWriting &&
                          this.props.auth === undefined
                        ) {
                          var answer = window.confirm("sign in?");
                          if (answer) {
                            return this.props.getUserInfo();
                          } else {
                            this.setState({ continueWriting: true });
                          }
                        } else if (
                          this.props.auth !== undefined ||
                          this.state.continueWriting
                        ) {
                          this.setState({ comment: e.target.value }, () => {
                            if (this.textBox && this.textBox.current) {
                              var textBoxHeight = this.textBox.current
                                .offsetHeight;
                              this.setState({
                                textBoxHeight
                              });
                            }
                          });
                        }
                      }}
                      placeholder="respond here"
                    />
                  </div>
                  <div
                    onClick={() => {
                      if (auth !== undefined) {
                        if (this.state.comment !== "") {
                          var messageAsArray = arrayMessage(this.state.comment);
                          firebase
                            .firestore()
                            .collection(commentType)
                            .add({
                              messageAsArray,
                              parentAuthorId: chosenPost.authorId,
                              forumpostId: chosenPost.id,
                              message: this.state.comment,
                              authorId: auth.uid,
                              time: new Date()
                            })
                            .then(() => {
                              firebase
                                .firestore()
                                .collection(chosenPost.collection)
                                .doc(chosenPost.id)
                                .update({
                                  commentCount: firebase.firestore.FieldValue.increment(
                                    1
                                  )
                                })
                                .then(() => {
                                  this.setState({ comment: "" });
                                })
                                .catch(standardCatch);
                            })
                            .catch(standardCatch);
                        }
                      } else {
                        var answer = window.confirm("sign in?");
                        if (answer) {
                          this.props.getUserInfo();
                        }
                      }
                    }}
                    style={{
                      backgroundColor: "rgba(200,200,200,.6)",
                      display: "flex",
                      position: "relative",
                      padding: "0px 25px",
                      paddingRight: "35px",
                      paddingTop: "8px",
                      color: "white",
                      width: "max-content",
                      fontSize: "15px",
                      transition: "width .3s ease-in"
                    }}
                  >
                    Send
                  </div>
                </div>
              )}
        </div>
        <div
          style={{
            display: height < 600 && postHeight > 0 ? "flex" : "none",
            width: "100%",
            height: "56px",
            top: "0px",
            transform: "translateY(0%)",
            left: "56px",
            backgroundColor: "rgb(20,20,30)",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <img onClick={this.props.close} src={back} alt="error" />
          {this.props.user && this.props.user.username}:{" "}
          {this.props.postMessage &&
          this.props.postMessage.length > this.props.width / 8
            ? `${this.props.postMessage.substr(0, this.props.width / 15)}...`
            : this.props.postMessage}
        </div>
      </div>
    );
  }
}
export default PeanutGallery;
