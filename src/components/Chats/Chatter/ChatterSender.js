import React from "react";
import { Link } from "react-router-dom";
import firebase from "../../.././init-firebase";

class ChatterSender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authoritarianTopic: false,
      sendTitlePlan: "",
      message: "",
      heightOfText: "36px"
    };
    this.getHeightOfText = React.createRef();
  }

  sendChat = async ({
    droppedId,
    rangeChosen,
    threadId,
    authorId,
    recipients,
    message,
    topic,
    authoritarianTopic,
    time,
    entityType,
    entityId
  }) => {
    if (!this.props.vintageName)
      return window.alert("you'll have to name a vintage for encrypted chats");
    var add = {
      droppedId: this.props.droppedId,
      rangeChosen,
      threadId,
      authorId,
      recipients,
      message,
      topic,
      authoritarianTopic,
      time,
      entityType,
      entityId,
      vintage: this.props.vintageName
    };
    (this.state.parent
      ? firebase
          .firestore()
          .collection("chats")
          .doc(this.state.parent.id)
          .update(add)
      : firebase.firestore().collection("chats").add(add)
    ).catch((err) => console.log(err.message));
  };

  componentDidUpdate = async (prevProps) => {
    if (this.state.message !== this.state.lastMessage) {
      this.setState({
        lastMessage: this.state.message,
        heightOfText: this.getHeightOfText.current.offsetHeight
      });
    }
    if (this.state.sendTitlePlan !== this.state.lastSendTitlePlan) {
      let spaces = [];
      for (let x = 0; x < this.state.sendTitlePlan.length; x++) {
        spaces.push(<p>&nbsp;</p>);
      }
      this.setState({ lastSendTitlePlan: this.state.sendTitlePlan, spaces });
    }
  };
  render() {
    const { recipientsProfiled } = this.props;

    let devices = [];
    recipientsProfiled.map((x) => {
      return (
        x &&
        x.devices &&
        x.devices.map((dev) => {
          return devices.push(dev);
        })
      );
    });
    return (
      <form
        style={{
          display: "flex",
          position: "relative",
          zIndex: "5",
          width: "100%",
          height: "min-content",
          textIndent: "5px",
          fontSize: "10px",
          transition: ".3s ease-in"
        }}
        onSubmit={(e) => {
          e.preventDefault();
          if (
            (this.state.message !== "" && this.props.chosenTopic !== "") ||
            (this.props.parent && this.props.parent.droppedPost)
          ) {
            // now you get the result of verification in boolean
            this.sendChat({
              rangeChosen: this.props.rangeChosen,
              threadId:
                this.props.entityType +
                this.props.entityId +
                this.props.recipients.sort(),
              authorId: this.props.auth.uid,
              recipients: this.props.recipients,
              message: this.state.message,
              topic: this.props.chosenTopic,
              authoritarianTopic: this.state.authoritarianTopic,
              time: new Date(),
              entityType: this.props.entityType,
              entityId: this.props.entityId
            });
            this.setState({ message: "" });
            if (this.props.recentChats.length === 0) {
              this.props.achatisopenfalse("erasequery");
            }
          }
        }}
      >
        {/*<div
        style={
          this.state.askIfPlan
            ? {
                display: "flex",
                position: "absolute",
                bottom: "56px",
                width: "100%",
                minHeight: "56px",
                zIndex: "9999",
                textIndent: "20px",
                wordBreak: "break-all",
                fontSize: "15px",
                color: "grey"
              }
            : {
                display: "none"
              }
        }
      >
        "{spaces}"
      </div>*/}
        {this.state.message !== "" && (
          <div
            style={{
              display: "flex",
              width: "56px",
              justifyContent: "center",
              color: "rgb(211, 211, 211)",
              fontSize: "15px"
            }}
          >
            {this.state.message.length}
            <br />
            /1001
          </div>
        )}
        <div
          ref={this.getHeightOfText}
          style={{
            zIndex: "-1",
            opacity: 0,
            width: "70%",
            display: "flex",
            position: "fixed",
            left: "56px",
            bottom: "100px",
            padding: "10px",
            paddingBottom: "11px",
            height: "min-content",
            minHeight: "56px",
            textIndent: "20px",
            wordWrap: "break-word",
            wordBreak: "break-all",
            resize: "none",
            border: "1px solid white",
            whiteSpace: "pre-line"
          }}
        >
          {this.state.message}
        </div>
        <div
          onClick={() => {
            if (this.state.message !== "") {
              var answer = window.confirm("remove progress?");
              if (answer) {
                this.setState({ message: "" });
              }
            } else if (this.state.sendTitlePlan === "") {
              this.setState({ message: "reminder to " });
            }
          }}
          style={{
            boxShadow: "inset 0px 0px 5px 1px rgb(0,0,0)",
            display: "flex",
            position: "absolute",
            maxWidth: "300px",
            wordBreak: "break-all",
            height: "36px",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "40px",
            padding: "5px 10px",
            color: "grey",
            bottom: "137px",
            right: "10px",
            backgroundColor: "rgb(200,200,250)",
            opacity:
              this.state.message &&
              !this.state.message.startsWith("reminder to ")
                ? 0.5
                : 1,
            fontSize: "18px"
          }}
        >
          {this.state.sendTitlePlan}
        </div>
        <Link
          //to="/new"
          to={{
            pathname: "/new",
            state: {
              sendTitlePlan: this.state.sendTitlePlan,
              entityId: this.props.entityId,
              entityType: this.props.entityType,
              recipients: this.props.recipients,
              topics:
                this.props.topics && this.props.topics.length > 0
                  ? this.props.topics
                  : ["*"]
            }
          }}
          style={
            this.state.sendTitlePlan
              ? {
                  textDecoration: "none",
                  boxShadow: "inset 0px 0px 5px 1px rgb(0,0,0)",
                  display: "flex",
                  position: "absolute",
                  width: "max-content",
                  height: "36px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "40px",
                  padding: "5px 20px",
                  color: "blue",
                  bottom: "77px",
                  right: "10px",
                  backgroundColor: "rgb(200,200,250)",
                  fontSize: "18px"
                }
              : {
                  display: "none"
                }
          }
        >
          send as plan
        </Link>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            left: "56px",
            right: "60px",
            height: "min-content"
          }}
        >
          <div style={{ display: "flex" }}>
            {" "}
            <button
              type="submit"
              style={
                this.state.message !== "" ||
                (this.props.parent && this.props.parent.droppedPost)
                  ? {
                      display: "flex",
                      position: "relative",
                      bottom: "0px",
                      height: "36px",
                      width: "max-content",
                      padding: "0px 5px",
                      backgroundColor: "white",
                      color: "black",
                      transition: ".3s ease-out"
                    }
                  : {
                      display: "flex",
                      position: "relative",
                      bottom: "-56px",
                      height: "36px",
                      width: "max-content",
                      padding: "0px 5px",
                      backgroundColor: "white",
                      color: "black",
                      transition: ".3s ease-in"
                    }
              }
            >
              Send it
            </button>
            <div
              onClick={() => {
                if (!["", "reminder to "].includes(this.state.message)) {
                  var answer = window.confirm("remove progress?");
                  if (answer) this.setState({ message: "" });
                } else {
                  this.setState({ message: "" });
                }
              }}
              style={
                this.state.message !== ""
                  ? {
                      display: "flex",
                      position: "relative",
                      bottom: "0px",
                      height: "36px",
                      width: "max-content",
                      padding: "0px 5px",
                      backgroundColor: "white",
                      color: "black",
                      transition: ".3s ease-out"
                    }
                  : {
                      display: "flex",
                      position: "relative",
                      bottom: "-56px",
                      height: "36px",
                      width: "max-content",
                      padding: "0px 5px",
                      backgroundColor: "white",
                      color: "black",
                      transition: ".3s ease-in"
                    }
              }
            >
              &times;
            </div>
          </div>
          {(this.props.user !== undefined || this.props.entity) && (
            <div style={{ color: "blue" }}>
              Private RSA Key . Used on {devices.length} devices
            </div>
          )}
          <textarea
            placeholder=" •••"
            className="chatinput1"
            style={
              this.state.message !== ""
                ? {
                    height: this.state.heightOfText,
                    maxHeight: "90vh",
                    display: "flex",
                    position: "relative",
                    padding: "10px",
                    left: "0px",
                    right: "-56px",
                    minHeight: "36px",
                    zIndex: "9999",
                    textIndent: "20px",
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    resize: "none",
                    border: "1px solid blue"
                  }
                : {
                    height: "36px",
                    maxHeight: "90vh",
                    display: "flex",
                    position: "relative",
                    padding: "10px",
                    left: "0px",
                    right: "-56px",
                    minHeight: "36px",
                    zIndex: "9999",
                    textIndent: "20px",
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    resize: "none",
                    border: "1px solid white"
                  }
            }
            value={this.state.message}
            onChange={(e) => {
              var bee = e.target.value;
              if (
                bee.toLowerCase().startsWith("reminder to") &&
                bee.length > 12
              ) {
                this.setState({
                  askIfPlan: true,
                  sendTitlePlan: bee.substring(
                    bee.lastIndexOf("reminder to") + 12,
                    bee.length
                  )
                });
              } else if (this.state.askIfPlan) {
                this.setState({ askIfPlan: false, sendTitlePlan: "" });
              }
              this.setState({ message: bee });
            }}
            maxLength="1001"
          />
        </div>
      </form>
    );
  }
}
export default ChatterSender;
/*let b = 0;
            let le = [];
            const words = this.state.message.split(/\s/);
            this.state.message.match(/https:\/\//) &&
              words.map((word) => {
                b++;
                if (word.match(/^https:\/\//)) {
                  var thumbnail = `https://drive.google.com/thumbnail?id=${word.substring(
                    word.lastIndexOf("/d/") + 3,
                    word.lastIndexOf("/edit")
                  )}`;
                  var couple = {};
                  couple.content = word;
                  couple.thumbnail = thumbnail;
                  couple.topic = this.props.chosenTopic;
                  //console.log(couple);
                  le.push(couple);
                }
                if (words.length === b) {
                  this.sendChatWDoc({
                    contents: le,
                    threadId:
                      this.props.entityType +
                      this.props.entityId +
                      this.props.recipients.sort(),
                    authorId: this.props.auth.uid,
                    recipients: this.props.recipients,
                    message:
                      this.state.message !== ""
                        ? this.state.message
                        : this.props.parent.droppedPost,
                    topic: this.props.chosenTopic,
                    authoritarianTopic: this.state.authoritarianTopic,
                    time: new Date(),
                    entityType: this.props.entityType,
                    entityId: this.props.entityId
                  });
                }
                return word;
              });*/
/**
 *  sendChatWDoc = async ({
    contents,
    threadId,
    authorId,
    authorName,
    recipients,
    message,
    topic,
    authoritarianTopic,
    time,
    entityType,
    entityId
  }) =>
    firebase
      .firestore()
      .collection("chats")
      .add({
        contents,
        threadId,
        authorId,
        authorName,
        recipients,
        message,
        topic,
        authoritarianTopic,
        time,
        entityType,
        entityId
      })
      .then(() =>
        firebase
          .firestore()
          .collection("users")
          .doc(this.props.auth.uid)
          .update({
            docsSentCount: firebase.firestore.FieldValue.increment(+1)
          })
          .catch((err) => console.log(err.message))
      )
      .catch((err) => console.log(err.message));

 */
