import React from "react";
import firebase from "../../.././init-firebase";
import { withRouter } from "react-router-dom";
import Linker from "./toolkit/Linker";
import Sender from "./toolkit/Sender";
import EmbeddedRebeat from "./EmbeddedRebeat";
import NewDrop from "../.././Post/NewDrop";
import UseEntity from "./UseEntity";
import { arrayMessage, specialFormatting } from "../../../widgets/authdb";

class NewForum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textBoxHeight: 30,
      comments: [],
      chosenEntity: null,
      closeDrop: true,
      chosenIssue: "Miscellaneous",
      entityId: null,
      lastEntityId: null,
      entityType: "users",
      setURL: "",
      settedURL: "",
      message: "",
      height: 100,
      optionsToPost: [],
      twitterString: ""
    };
    this.post = React.createRef();
    this.size = React.createRef();
    this.textBox = React.createRef();
  }
  componentWillUnmount = () => {
    if (this.state.droppedPost) {
      this.handleDelete();
    }
    this.props.cancelRebeat({ rebeat: null });
    this.setState({ droppedPost: null, closeDrop: true });
    clearTimeout(this.resizeTimer);
  };
  refresh = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      var height = this.size.current && this.size.current.offsetHeight;
      this.setState({
        height
      });
    }, 50);
  };
  handleDelete = () => {
    const { droppedPost } = this.state;
    firebase
      .firestore()
      .collection("forum")
      .doc(droppedPost.id)
      .delete()
      .then(() => {
        this.props.cancelRebeat({ rebeat: null });
        this.setState({
          droppedPost: null,
          closeDrop: true
        });
        console.log("deleted progress");
      })
      .catch((e) => console.log(e.message));
  };
  handleNewDroppedPost = () => {
    var add = { authorId: "" };
    if (this.props.auth !== undefined) add = { authorId: this.props.auth.uid };

    firebase
      .firestore()
      .collection("forum")
      .add(add)
      .then((doc) => {
        console.log("droppedPost made " + JSON.stringify(add));
        this.setState({ droppedPost: { id: doc.id, ...add } });
        firebase
          .firestore()
          .collection("forum")
          .doc(doc.id)
          .onSnapshot(
            (doc) => {
              if (doc.exists) {
                var foo = doc.data();
                foo.id = doc.id;
                foo.collection = "forum";
                this.setState({ droppedPost: foo });
              }
            },
            (e) => console.log(e.message)
          );
      })
      .catch((e) => console.log(e.message));
  };
  openDrop = (x) => {
    const { droppedPost } = this.state;
    this.setState(x);
    if (!droppedPost) {
      this.handleNewDroppedPost();
    } else if (droppedPost) {
      console.log("droppedPost deleted");
      this.handleDelete();
    } else {
      window.alert("unhandled");
    }
  };
  componentDidUpdate = async (prevProps) => {
    if (this.state.message !== this.state.lastMessage) {
      this.refresh();
      this.setState({ lastMessage: this.state.message });
      if (this.state.message !== "" && this.props.auth !== undefined) {
        clearTimeout(this.saveDraft);
        this.saveDraft = setTimeout(() => {
          !this.props.user.dontSaveDrafts &&
            this.state.message.length - this.props.user.savedDraft > 3 &&
            firebase
              .firestore()
              .collection("userDatas")
              .doc(this.props.auth.uid)
              .update({
                savedDraft: this.state.message
              })
              .then(() => this.setState({ savedDraft: this.state.message }))
              .catch((err) => console.log(err.message));
        });
      }
    }
    if (
      this.state.settedURL !== this.state.lastSettedURL &&
      this.state.settedURL
    ) {
      this.setState({ lastSettedURL: this.state.settedURL });
      var thisIsATweet =
        this.state.settedURL.includes("https://twitter.com") ||
        this.state.settedURL.includes("https://www.twitter.com");
      if (thisIsATweet) {
        var twitterString = `${
          this.state.settedURL.split("/status/")[1].split("?")[0]
        }`;
        this.setState({ twitterString }, () => {});
        //this.tweetEmbed(string)

        var result = this.state.settedURL.replace(/:/g, "%3A");
        result = result.replace(/\//g, "%2F");
        await fetch(`https://publish.twitter.com/oembed?url=${result}`, {
          mode: "no-cors",
          headers: {
            Accept: "jsonp",
            "Accept-Encoding": "gzip",
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
          //.then(async (res) => await res.json())
          .then((x) => {
            const element = document.createElement(twitterString);
            element.type = "text/html";
            element.async = true;
            element.innerHTML = x.html;
            window.twttr.widgets.createTweet(
              "20",
              document.getElementById(twitterString),
              {
                theme: "dark"
              }
            );
            document.getElementById(twitterString).append(element);
            document.getElementById(twitterString).style.width = `100%`;
            document.getElementById(twitterString).style.position = `relative`;
          })
          .catch((e) => console.log(e.message));
      }
    }
    if (
      this.state.entityId &&
      this.state.entityId !== this.state.lastEntityId
    ) {
      firebase
        .firestore()
        .collection(this.state.entityType)
        .doc(this.state.entityId)
        .onSnapshot((doc) => {
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            this.setState({ chosenEntity: foo });
          }
        });
      this.setState({ lastEntityId: this.state.entityId });
    }
    if (this.props.rebeat && this.props.rebeat !== prevProps.rebeat) {
      this.setState({
        droppedPost: this.props.rebeat
      });
    }
  };
  handleSubmit = (e) => {
    const { droppedPost } = this.state;
    e.preventDefault();
    if (this.props.auth === undefined) {
      var answer = window.confirm("Please sign in");
      answer && this.props.getUserInfo();
    } else {
      if (
        !this.props.community ||
        (this.props.community &&
          (!this.props.community.privateToMembers ||
            (this.props.auth !== undefined &&
              (this.props.community.authorId === this.props.auth.uid ||
                (this.props.community.admin &&
                  this.props.community.admin.includes(this.props.auth.uid)) ||
                (this.props.community.faculty &&
                  this.props.community.faculty.includes(this.props.auth.uid)) ||
                (this.props.community.members &&
                  this.props.community.members.includes(
                    this.props.auth.uid
                  )))))) ||
        (this.state.chosenEntity &&
          this.props.community &&
          this.state.chosenEntity.communityId === this.props.community.id)
      ) {
        var answer2 = window.confirm(
          `Are you sure you want to post?: "${this.state.message}" to ${
            this.props.community
              ? this.props.community.message
              : this.props.city
          }${
            this.state.chosenEntity
              ? ` as ${this.state.chosenEntity.message}`
              : ""
          }` +
            ` in ${
              this.state.chosenIssue ? this.state.chosenIssue : "Miscellaneous"
            }`
        );
        if (answer2) {
          //.replace(/[^\w\s0-9]/g, " ")//
          //.toLowerCase()
          var messageAsArray = arrayMessage(this.state.message);

          var add = {
            droppedId: droppedPost ? droppedPost.id : null,
            eventId: this.state.eventId ? this.state.eventId : null,
            newLessonShow: this.props.commtype,
            issue: this.state.chosenIssue,
            settedURL:
              this.state.settedURL !== "" &&
              this.state.settedURL.startsWith("https://")
                ? this.state.settedURL
                : null,
            twitterString: this.state.twitterString,
            communityId: this.props.community ? this.props.community.id : "",
            city: this.props.city,
            message: this.state.message,
            authorId: this.props.auth.uid,
            entityId: this.state.entityId,
            entityType: this.state.entityType,
            time: new Date(),
            messageAsArray
          };
          !this.props.community && delete add.communityId;
          firebase
            .firestore()
            .collection("forum")
            .add(add)
            .then((doc) => {
              this.setState({ droppedPost: null }, () => {
                var foo = { ...add };
                console.log("posted " + foo.message);
                foo.id = doc.id;
                this.props.cancelRebeat({ rebeat: null });
                this.updateIssues(foo);
              });
            })
            .catch((err) => console.log(err.message));
        } else {
          this.props.closeNewForum();
        }
      }
    }
  };
  updateIssues = (foo) => {
    var collection = null;
    var query = null;
    var cityOrComm = null;
    if (this.props.community) {
      cityOrComm = { communityId: this.props.community.id };
      collection = firebase.firestore().collection("issues");
      query = collection
        .where("communityId", "==", this.props.community.id)
        .where("title", "==", this.state.chosenIssue);
    } else {
      cityOrComm = { city: this.props.city };
      collection = firebase.firestore().collection("issues");
      query = collection
        .where("city", "==", this.props.city)
        .where("title", "==", this.state.chosenIssue);
    }
    query.get().then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        if (doc.exists) {
          return collection.update({
            ...cityOrComm, //[Object.keys(cityOrComm)]:Object.values(cityOrComm),
            time: new Date(),
            title: this.state.chosenIssue
          });
        } else {
          return collection.add({
            ...cityOrComm,
            time: new Date(),
            title: this.state.chosenIssue
          });
        }
      });
    });

    if (!["lesson", "show", "game"].includes(this.props.commtype)) {
      this.setState({
        message: "",
        height: 100,
        optionsToPost: [],
        twitterString: ""
      });
      this.props.closeNewForum();
    } else {
      window.alert(`${foo.message} posted, you can now begin streaming`);
    }
  };
  handleClose = () => {
    const { droppedPost } = this.props;
    if (droppedPost && !droppedPost.time) {
      var answer = window.confirm(
        "all progress will be lost for " + JSON.stringify(droppedPost)
      );
      if (answer) {
        this.handleDelete();
      }
    }
    this.setState(
      {
        droppedPost: null,
        lastDropped: null,
        lastParent: null,
        deletedDrop: null
      },
      () => {
        this.props.cancelRebeat({ rebeat: null });
        this.props.closeNewForum();
      }
    );
  };
  toggleSaveability = () =>
    firebase
      .firestore()
      .collection("userDatas")
      .doc(this.props.auth.uid)
      .update({
        dontSaveDrafts: this.props.user.dontSaveDrafts
          ? !this.props.user.dontSaveDrafts
          : true
      })
      .then(() =>
        console.log(
          `drafts will ${!this.props.user.dontSaveDrafts ? "" : "not "}be saved`
        )
      )
      .catch((err) => console.log(err.message));

  render() {
    const { comments, profileEntities } = this.props;
    const { droppedPost } = this.state;
    var turnOnPlayer =
      this.state.settedURL &&
      [
        "https://youtube.com",
        "https://soundcloud.com",
        "https://facebook.com",
        "https://vimeo.com",
        "https://twitch.com",
        "https://streamable.com",
        "https://wistia.com",
        "https://dailymotion.com",
        "https://mixcloud.com",
        "https://vidyard.com",
        //
        "https://www.youtube.com",
        "https://www.soundcloud.com",
        "https://www.facebook.com",
        "https://www.vimeo.com",
        "https://www.twitch.com",
        "https://www.streamable.com",
        "https://www.wistia.com",
        "https://www.dailymotion.com",
        "https://www.mixcloud.com",
        "https://www.vidyard.com"
      ].find((x) => this.state.settedURL.includes(x));
    var issuess =
      this.props.issues && this.props.issues.length > 0
        ? ["Miscellaneous", ...this.props.issues]
        : ["Miscellaneous"];
    var issues = [...new Set(issuess)];
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
    return (
      <div
        style={{
          overflow: "hidden",
          zIndex: 3,
          width: "100%",
          transition: ".5s ease-out",
          height: !this.props.openNewForum ? "0%" : "100%",
          position: "absolute"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            position: "relative",
            backgroundColor: "white",
            borderBottom: "1px solid black",
            width: "100%",
            height: "55px"
          }}
        >
          <div
            style={{
              width: "max-content"
            }}
          >
            {this.props.community
              ? this.props.community.message
              : this.props.city}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {this.props.user === undefined ? (
              <div
                onClick={this.props.getUserInfo}
                //to="/login"
                style={{
                  color: "black",
                  flexDirection: "column",
                  alignText: "center",
                  opacity: ".5",
                  left: "20px"
                }}
              >
                <div
                  style={{
                    padding: "3px 1px",
                    border: "1px solid",
                    width: "max-content"
                  }}
                >
                  <i className="fas fa-user-secret"></i>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex"
                }}
              >
                {!this.state.chosenEntity && (
                  <img
                    onClick={
                      this.state.openOptions
                        ? () =>
                            this.setState({
                              openOptions: false,
                              chosenEntity: null,
                              entityId: null,
                              entityType: null
                            })
                        : () => this.setState({ openOptions: true })
                    }
                    style={{
                      display: "flex",
                      position: "absolute",
                      width: "100%",
                      height: "auto"
                    }}
                    src={this.props.user.photoThumbnail}
                    alt="error"
                  />
                )}
                <img
                  onClick={
                    this.state.openOptions
                      ? () => this.setState({ openOptions: false })
                      : () => this.setState({ openOptions: true })
                  }
                  style={{
                    display: !this.state.chosenEntity ? "none" : "flex",
                    position: "absolute",
                    width: "100%",
                    height: "auto"
                  }}
                  src={
                    this.state.chosenEntity &&
                    this.state.chosenEntity.chosenPhoto &&
                    this.state.chosenEntity.chosenPhoto.small
                  }
                  alt="error"
                />
              </div>
            )}
            {this.state.chosenIssue === this.state.newIssue ? (
              <div style={{ display: "flex" }}>
                <b>{this.state.chosenIssue}</b>
                <button onClick={() => this.setState({ newIssue: null })}>
                  &times;
                </button>
              </div>
            ) : (
              <div>
                <select
                  style={{
                    userSelect: "none"
                  }}
                  onChange={(e) =>
                    this.setState({ chosenIssue: e.target.value })
                  }
                >
                  {issues.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
                {!this.state.newIssue && this.state.newIssue !== "" ? (
                  <button
                    onClick={() => {
                      this.setState({ newIssue: "" });
                    }}
                  >
                    +
                  </button>
                ) : (
                  <form
                    style={{ display: "flex" }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      this.setState({
                        chosenIssue: this.state.newIssue
                      });
                    }}
                  >
                    <input
                      value={this.state.newIssue}
                      className="input"
                      placeholder="new issue"
                      onChange={(e) =>
                        this.setState({
                          newIssue: specialFormatting(e.target.value)
                        })
                      }
                    />
                    <div onClick={() => this.setState({ newIssue: null })}>
                      &nbsp;
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
          <div
            onClick={this.handleClose}
            style={{
              userSelect: "none",
              borderLeft: "10px solid rgb(80,50,190)",
              borderTopLeftRadius: "50px",
              borderBottomLeftRadius: "50px",
              display: "flex",
              position: "absolute",
              right: "0px",
              top: "0px",
              width: "56px",
              height: "56px",
              alignItems: "center",
              justifyContent: "center",
              color: "rgb(200,200,200)",
              backgroundColor: "rgb(20,20,20)"
            }}
          >
            &times;
          </div>
        </div>
        <form
          onSubmit={this.handleSubmit}
          style={{
            display: "flex",
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            flexDirection: "column",
            alignItems: "center",
            overflowY: "auto",
            overflowX: "hidden"
          }}
        >
          <div
            style={{
              top: "0px",
              height: "min-content",
              flexDirection: "column",
              display: "flex",
              position: "absolute",
              width: "100%"
            }}
          >
            <UseEntity
              openOptions={this.state.openOptions}
              profileEvents={profileEvents}
              profileJobs={profileJobs}
              profileClubs={profileClubs}
              profileServices={profileServices}
              profileClasses={profileClasses}
              profileDepartments={profileDepartments}
              profileRestaurants={profileRestaurants}
              profileShops={profileShops}
              profilePages={profilePages}
              profileVenues={profileVenues}
              profileHousing={profileHousing}
              submit={(x) => this.setState(x)}
            />
            <Linker
              setUrl={(x) => this.setState(x)}
              turnOnPlayer={turnOnPlayer}
              settedURL={this.state.settedURL}
              twitterString={this.state.twitterString}
              handleClose={this.handleClose}
            />
            {/**for size (hidden from user) */}
            <div
              ref={this.size}
              style={{
                display: "flex",
                position: "absolute",
                width: "98%",
                height: this.state.message !== "" ? this.state.height : 100,
                top: "0px",
                left: "1%",
                backgroundColor: "white",
                flexDirection: "column",
                alignItems: "center",
                textIndent: "10px",
                fontSize: "16px"
              }}
            >
              {this.state.message}
            </div>
            {this.props.user !== undefined && (
              <div
                style={{
                  backgroundColor: "white",
                  display: "flex",
                  color: "grey"
                }}
              >
                {this.state.message.length}/500 &nbsp;{" "}
                {this.state.message.length > 3 && (
                  <div>
                    {this.state.message !== this.props.user.savedDraft && (
                      <div
                        onClick={() => {
                          var answer = window.confirm("erase draft?");
                          if (answer) {
                            firebase
                              .firestore()
                              .collection("userDatas")
                              .doc(this.props.auth.uid)
                              .update({ savedDraft: "" })
                              .then(() => this.setState({ message: "" }))
                              .catch((err) => console.log(err.message));
                          }
                        }}
                      >
                        saved!
                      </div>
                    )}
                    <div
                      onClick={this.toggleSaveability}
                      style={{
                        zIndex: !this.props.user.dontSaveDrafts ? "-9999" : "1",
                        height: !this.props.user.dontSaveDrafts
                          ? "min-content"
                          : "0px",
                        padding: "10px 0px",
                        margin: "0px 10px",
                        display: "flex",
                        position: "relative",
                        transition: ".3s ease-in"
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: !this.props.user.dontSaveDrafts
                            ? ""
                            : "green",
                          display: "flex",
                          borderRadius: "50px",
                          border: "1px solid black",
                          position: "absolute",
                          height: "22px",
                          width: "46px",
                          right: "30px",
                          transition: ".3s ease-out"
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          borderRadius: "50px",
                          border: "1px solid black",
                          position: "absolute",
                          transform: "translate(-3px,3px)",
                          height: "16px",
                          width: "16px",
                          right: !this.props.user.dontSaveDrafts
                            ? "30px"
                            : "50px",
                          transition: ".3s ease-out",
                          backgroundColor: !this.props.user.dontSaveDrafts
                            ? ""
                            : "lightgreen"
                        }}
                      />
                    </div>
                  </div>
                )}
                <div
                  onClick={this.toggleSaveability}
                  style={{
                    minHeight: "min-content"
                  }}
                >
                  {!this.props.user.dontSaveDrafts
                    ? `drafts are saving`
                    : "not going to be saved"}
                </div>
              </div>
            )}
            <div
              style={{
                borderTop: "1px solid rgb(160,160,160)",
                top: "0px",
                padding: "5px",
                display: "flex",
                position: "relative",
                width: "100%",
                minHeight: "30px",
                color: "black",
                flexDirection: "column",
                fontSize: "15px"
              }}
            >
              <div
                ref={this.textBox}
                style={{
                  maxHeight: "70vh",
                  minHeight: "30px",
                  width: "calc(100% - 14px)",
                  position: "absolute",
                  zIndex: "-9999",
                  wordBreak: "break-all"
                }}
              >
                {this.state.message.split("\n").map((item, i) => (
                  <span key={i}>
                    {item}
                    <br />
                  </span>
                ))}
              </div>
              <textarea
                value={this.state.message}
                onChange={(e) => {
                  this.setState({ message: e.target.value }, () => {
                    if (this.textBox && this.textBox.current) {
                      var textBoxHeight = this.textBox.current.offsetHeight;
                      this.setState({
                        textBoxHeight
                      });
                    }
                  });
                }}
                style={{
                  userSelect: "none",
                  height: this.state.textBoxHeight,
                  maxHeight: "70vh",
                  width: "100%",
                  position: "relative",
                  resize: "none",
                  wordBreak: "break-all",
                  display: "flex",
                  top: "0px",
                  left: "0%",
                  backgroundColor: "white",
                  flexDirection: "column",
                  alignItems: "center",
                  zIndex: "9999",
                  paddingTop: "20px",
                  marginBottom: "5px",
                  textIndent: "10px",
                  minWidth: "98%",
                  maxWidth: "98%",
                  fontSize: "16px"
                }}
                placeholder="what's happening?"
                maxLength="500"
                required
              />
            </div>
            {!this.state.videoRecorderOpen ? (
              droppedPost ? (
                <EmbeddedRebeat
                  isNew={true}
                  showStuff={true}
                  linkDrop={this.props.linkDrop}
                  dropId={this.props.dropId}
                  rebeat={droppedPost}
                  getCommunity={this.props.getCommunity}
                  issues={this.props.issues}
                  setDelete={() => {
                    var answer = window.confirm("remove drop?");
                    if (answer) this.setState({ droppedPost: null });
                  }}
                  userMe={this.props.user}
                  auth={this.props.auth}
                  community={this.props.community} //
                  etypeChanger={this.props.etypeChanger}
                  chosenPostId={this.state.chosenPostId}
                  //helper={() => this.props.helper(droppedPost.droppedPost)}
                  delete={() =>
                    this.setState({
                      deletedForumPosts: [
                        ...this.state.deletedForumPosts,
                        droppedPost.id
                      ]
                    })
                  }
                  comments={comments}
                  clear={() => {
                    var answer = window.confirm(
                      "are you sure you want to clear this comment?"
                    );
                    if (answer) {
                      this.setState({ comment: "" });
                    }
                  }}
                  height={this.props.height}
                  postHeight={this.props.postHeight}
                  globeChosen={this.props.globeChosen}
                  user={this.props.user}
                />
              ) : (
                <NewDrop
                  linkDrop={this.props.linkDrop}
                  dropId={this.props.dropId}
                  parent={droppedPost}
                  openDrop={this.openDrop}
                  closeDrop={this.state.closeDrop}
                  auth={this.props.auth}
                  height={this.props.height}
                  width={this.props.width}
                  users={this.props.users}
                  user={this.props.user}
                  communities={this.props.communities}
                />
              )
            ) : null}
            {this.props.auth === undefined && (
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  width: "100%",
                  height: "56px",
                  backgroundColor: "rgba(200,200,255,.5)",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <div
                  style={{
                    userSelect: "none",
                    display: "flex",
                    width: "max-content",
                    height: "36px",
                    backgroundColor: "rgb(250,250,250)",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "0px 20px",
                    alignItems: "center",
                    borderRadius: "50px"
                  }}
                  //to="/login"
                  onClick={this.props.getUserInfo}
                >
                  Please login to post
                </div>
              </div>
            )}
            <Sender
              showVideoRecorder={droppedPost}
              commtype={this.props.commtype}
            />
          </div>
        </form>
      </div>
    );
  }
}
export default withRouter(NewForum);

/*componentDidMount = () => {
    window.twttr = (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function (f) {
        t._e.push(f);
      };

      return t;
    })(document, "script", "twitter-wjs");

    window.addEventListener("resize", this.refresh);
  };
  componentWillUnmount() {
    window.removeEventListener("resize", this.refresh);
  }
  tweetEmbed = (id) => {
    var url =
        "https://api.twitter.com/1/statuses/oembed.json?id=" +
        id +
        "&callback=",
      fn = "TE_" + Date.now();

    url += fn;

    window[fn] = (data) => {
      document.body.removeChild(script);
      console.log(data);
      this.setState({ data });
    };

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;

    document.body.appendChild(script);
  };*/
