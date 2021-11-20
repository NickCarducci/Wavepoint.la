import React from "react";
import Comment from "./Comment";
import imagesl from "../.././SwitchCity/Community/standardIMG.jpg";
import { RegisterCurseWords } from "../../../Forum";

class Comments extends React.Component {
  state = { insideComment: "", fetchingComments: null };
  componentDidUpdate = (prevProps) => {
    if (
      this.props.chosenPostId &&
      this.props.chosenPostId !== prevProps.chosenPostId
    ) {
      if (!this.props.comments) {
        this.int = setInterval(() => {
          if (this.state.fetchingComments === null) {
            this.setState({ fetchingComments: true });
          } else if (this.state.fetchingComments) {
            this.setState({ fetchingComments: false });
          } else {
            this.setState({ fetchingComments: null });
          }
        }, 1200);
      } else {
        if (this.int) {
          this.setState({ fetchingComments: null });
          clearInterval(this.int);
        }
      }
    }
  };
  componentWillUnmount = () => {
    clearInterval(this.int);
  };
  render() {
    const { comments } = this.props;
    let users = [];
    comments &&
      comments.map(
        (comment) =>
          !users.find((x) => x === comment.author) && users.push(comment.author)
      );
    let allpeanuts = [];
    users.map((y) => {
      var commentSet = comments && comments.filter((x) => y.id === x.authorId);
      var user = {};
      user.id = y.id;
      user.comments = commentSet;
      return allpeanuts.push(user);
    });
    let allusers = [];
    let firstPostPerPerson = [];

    comments &&
      comments.map(
        (x) => !allusers.includes(x.authorId) && allusers.push(x.authorId)
      );
    allusers.map((x) => {
      var m = comments.find((y) => y.authorId === x && !y.insideComment);
      if (!firstPostPerPerson.includes(m)) {
        return firstPostPerPerson.push(m);
      } else return null;
    });
    if (this.props.post && this.props.commtype === "cases") {
      firstPostPerPerson.sort(
        (a, b) =>
          this.props.post.jury.includes(b.authorId) -
          !this.props.post.jury.includes(a.authorId)
      );
      firstPostPerPerson.sort(
        (a, b) =>
          this.props.post.prosecution.includes(b.authorId) -
          !this.props.post.prosecution.includes(a.authorId)
      );
      firstPostPerPerson.sort(
        (a, b) =>
          this.props.post.defense.includes(b.authorId) -
          !this.props.post.defense.includes(a.authorId)
      );
      firstPostPerPerson.sort(
        (a, b) =>
          this.props.post.judges.includes(b.authorId) -
          !this.props.post.judges.includes(a.authorId)
      );
      firstPostPerPerson.sort(
        (a, b) =>
          this.props.post.testimonies.includes(b.authorId) -
          !this.props.post.testimonies.includes(a.authorId)
      );
    }
    const on = comments && comments.length > 0;
    return (
      <div
        style={{
          width: "100%"
        }}
      >
        <div
          style={{
            top: "0",
            display: "flex",
            width: "100%",
            height: on ? "min-content" : "10px",
            overflow: "hidden",
            opacity: on ? 1 : 0,
            transition: ".3s ease-in",
            color: "grey",
            fontSize: "15px",
            backgroundColor: "white",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              display: "flex",
              position: "relative",
              width: "100%",
              fontSize: "20px",
              color: on ? "rgb(100,100,100)" : "rgb(200,200,220)",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            {
              //allpeanuts
              !comments
                ? `fetching comments.
            ${
              this.state.fetchingComments !== null && (
                <span>.{!this.state.fetchingComments && <span>.</span>}</span>
              )
            }`
                : comments.length === 0
                ? "no one's commented yet..."
                : firstPostPerPerson.map((x) => {
                    //var user = this.props.users.find(y => y.id === x.id);

                    var theseones = allpeanuts.find(
                      (user) => user.id === x.authorId
                    );
                    var isJudge =
                      x.community && x.community.judges.includes(x.authorId);
                    var isJury =
                      x.community && x.community.jury.includes(x.authorId);
                    var isProsecution =
                      x.community &&
                      x.community.prosecution.includes(x.authorId);
                    var isDefense =
                      x.community && x.community.defense.includes(x.authorId);
                    var isTestimoner =
                      x.community &&
                      x.community.testimonies.includes(x.authorId);
                    var isConsult =
                      x.community && x.community.consults.includes(x.authorId);
                    return (
                      <div key={x.id}>
                        <div
                          style={{
                            display: "flex",
                            position: "relative",
                            width: "100%",
                            height: "46px",
                            color: "black"
                          }}
                        >
                          <div
                            //onClick={() => this.handleFollow(user)}
                            style={{
                              backgroundColor: "rgb(245,245,250)",
                              paddingBottom: "3px",
                              justifyContent: "center",
                              alignItems: "center",
                              zIndex: "6",
                              borderRadius: "14px",
                              border:
                                this.props.user &&
                                this.props.user.following &&
                                this.props.user.following.includes(x.authorId)
                                  ? "2px solid rgb(150,200,250)"
                                  : "",
                              display: "flex",
                              position: "absolute",
                              width: "21px",
                              height: "18px",
                              top: "42px",
                              left: "46px",
                              transition: ".3s ease-out"
                            }}
                          >
                            {x.author.smiley}
                          </div>
                          <div
                            //onClick={() => this.handleFollow(user)}
                            style={{
                              padding: "0px 10px",
                              backgroundColor: "rgb(245,245,250)",
                              paddingBottom: "3px",
                              justifyContent: "center",
                              alignItems: "center",
                              zIndex: "6",
                              borderRadius: "14px",
                              border:
                                this.props.user &&
                                this.props.user.following &&
                                this.props.user.following.includes(x.authorId)
                                  ? "2px solid rgb(150,200,250)"
                                  : "",
                              display: "flex",
                              position: "absolute",
                              width: "max-content",
                              height: "18px",
                              top: "42px",
                              left: "76px",
                              transition: ".3s ease-out"
                            }}
                          >
                            {isJudge
                              ? "isJudge"
                              : isJury
                              ? "isJury"
                              : isProsecution
                              ? "isProsecution"
                              : isDefense
                              ? "isDefense"
                              : isTestimoner
                              ? "isTestimoner"
                              : isConsult
                              ? "isConsult"
                              : "peep"}
                          </div>
                          <img
                            style={{
                              display: "flex",
                              position: "relative",
                              width: "46px",
                              height: "46px",
                              left: "10px",
                              top: "10px"
                            }}
                            src={
                              x.author.photoThumbnail
                                ? x.author.photoThumbnail
                                : imagesl
                            }
                            alt="error"
                          />
                          <div
                            style={{
                              display: "flex",
                              position: "relative",
                              width: "calc(100% - 76px)",
                              height: "46px",
                              left: "20px",
                              top: "10px",
                              flexDirection: "column"
                            }}
                          >
                            <div
                              style={{
                                color: "rgb(70,70,70)",
                                width: "max-content"
                              }}
                            >
                              <b>{x.author.name}</b>@{x.author.username}
                            </div>
                            <div
                              style={{
                                color: "grey",
                                fontSize: "15px",
                                width: "max-content"
                              }}
                            >
                              {new Date(x.time.seconds * 1000).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        {theseones.comments.map((c, index) => {
                          var mTTT = c
                            ? theseones.comments[index].message.substring(
                                0,
                                theseones.comments[index].message.length
                              )
                            : "";

                          var mTT = "";
                          var isGood =
                            this.props.auth !== undefined &&
                            this.props.user !== undefined &&
                            !this.props.user.under13 &&
                            this.props.user.showCurses;
                          if (isGood) {
                            mTT = RegisterCurseWords(mTTT, isGood);
                          } else {
                            mTT = RegisterCurseWords(mTTT, isGood);
                          }
                          return (
                            <Comment
                              chosenPost={this.props.chosenPost}
                              mTT={mTT}
                              key={index}
                              commtype={this.props.commtype}
                              comments={theseones.comments}
                              index={index}
                              img={
                                x.author.photoThumbnail
                                  ? x.author.photoThumbnail
                                  : imagesl
                              }
                              x={c}
                              auth={this.props.auth}
                              commentType={this.props.commentType}
                              width={this.props.width}
                            />
                          );
                        })}
                      </div>
                    );
                  })
            }
          </div>
          {
            <div
              style={{
                height: "30px",
                display: "flex",
                position: "relative",
                top: "0",
                width: "100%",
                fontSize: "20px",
                color: "grey",
                justifyContent: "center",
                alignItems: "center"
              }}
            />
          }
        </div>
      </div>
    );
  }
}
export default Comments;
