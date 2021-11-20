import React from "react";
import firebase from "../../.././init-firebase";
//import Files from "../../Media/Folder/Files";
import Media from "../../Media";

class TopicsVids extends React.Component {
  state = {};
  render() {
    const {
      topics //, contents
    } = this.props;
    /*var docsWithinTopic = this.props.recentChats.filter((x) => {
      return x.topic === this.props.chosenTopic && x.contents;
    });*/
    var foldersCarry =
      this.props.folders.length > 0
        ? [...topics, ...this.props.folders]
        : topics;
    var folders = [...new Set(foldersCarry)];
    return (
      <div
        style={{
          top: "10px",
          height: "min-content",
          display: "flex",
          position: "relative",
          color: "grey",
          width: "100%",
          flexDirection: "column"
        }}
      >
        {this.props.sidemenuWidth === "50%" && this.props.openWhat === "docs" && (
          <select
            value={this.props.selectedFolder}
            onChange={this.props.handleFolder}
          >
            {folders.map((x, i) => {
              return <option key={i}>{x}</option>;
            })}
          </select>
        )}
        {this.props.openWhat === "docs" ? (
          <Media
            auth={this.props.auth}
            shortId={this.props.threadId}
            parent={{ videos: [] }}
            opened={false}
          />
        ) : this.props.openWhat === "topics" ? (
          <div
            style={{
              display: "flex",
              position: "relative",
              color: "white",
              zIndex: "0",
              overflowY: "auto",
              width: "inherit",
              height: "100%",
              backgroundColor: "rgb(5,5,5)",
              flexDirection: "column",
              paddingBottom: "70px"
            }}
          >
            {topics &&
              topics.map((topic) => {
                let hee = [];
                return (
                  <div
                    key={topic}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      //console.log(JSON.parse(e.dataTransfer.getData("text")));
                      //e.stopPropagation();
                      //var link = e.dataTransfer.getData("URL");
                      //console.log(link);
                    }}
                    onDrop={(e) => {
                      //let link = e.dataTransfer.getData("moveDoc");
                      e.preventDefault();
                      e.stopPropagation();
                      try {
                        var link = e.dataTransfer.getData("URL");
                        const thiss = this.props.chats.find((x) => {
                          return x.message === link;
                        });
                        firebase
                          .firestore()
                          .collection("chats")
                          .doc(thiss.id)
                          .update({
                            topic,
                            time: new Date()
                          })
                          .catch((err) => console.log(err.message));
                      } catch (e) {
                        console.log(e.message);
                        // If the text data isn't parsable we'll just ignore it.
                        return;
                      }
                    }}
                    onClick={
                      topic === this.props.chosenTopic
                        ? this.props.openWhat === "topics"
                          ? this.props.openDocs
                          : () => this.props.chooseTopic(topic)
                        : () => this.props.chooseTopic(topic)
                    }
                    style={
                      topic === this.props.chosenTopic
                        ? {
                            padding: "10px",
                            borderLeft: "3px solid white",
                            width: "calc(100% - 23px)",
                            color: "white",
                            wordBreak: "break-word",
                            fontSize: "16px"
                          }
                        : {
                            padding: "10px",
                            border: "1px solid #333",
                            width: "calc(100% - 23px)",
                            color: "grey",
                            wordBreak: "break-word",
                            fontSize: "12px"
                          }
                    }
                  >
                    {topic.toString()}
                    {this.props.contents.filter((x) => x.topic === topic)
                      .length > 0 && (
                      <div style={{ display: "flex" }}>
                        <p>&#9776;</p>
                        <p>
                          {
                            this.props.allcontents.filter(
                              (x) => x.topic === topic
                            ).length
                          }
                        </p>
                      </div>
                    )}
                    {this.props.chats &&
                      this.props.auth !== undefined &&
                      this.props.chats
                        .filter((chat) => {
                          let foo = [];
                          if (
                            chat.recipients.map((recipient) =>
                              this.props.recipients
                                .map((pq) => foo.push(pq.id))
                                .includes(recipient)
                            )
                          ) {
                            hee.push(chat);
                          }
                          return hee;
                        })
                        .filter((x) => x.topic === topic)
                        .filter(
                          (chat) =>
                            !chat.readUsers ||
                            !chat.readUsers.includes(this.props.auth.uid)
                        ).length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            position: "absolute",
                            transform: "translate(-10%,10%)",
                            alignItems: "flex-end",
                            justifyContent: "flex-end",
                            width: "100%"
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              position: "absolute",
                              bottom: "-17px",
                              width: "0",
                              height: "0",
                              borderTop: "15px solid transparent",
                              borderBottom: "15px solid transparent",

                              borderLeft: "15px solid green",
                              transform: "rotate(45deg)"
                            }}
                          />
                          <p
                            style={{
                              bottom: "-7px",
                              right: "6px",
                              position: "absolute",
                              fontSize: "10px"
                            }}
                          >
                            {this.props.chats &&
                              this.props.auth !== undefined &&
                              this.props.chats
                                .filter((chat) => {
                                  let foo = [];
                                  if (
                                    chat.recipients.map((recipient) =>
                                      this.props.recipients
                                        .map((pq) => foo.push(pq.id))
                                        .includes(recipient)
                                    )
                                  ) {
                                    hee.push(chat);
                                  }
                                  return hee;
                                })
                                .filter((x) => x.topic === topic)
                                .filter(
                                  (chat) =>
                                    !chat.readUsers ||
                                    !chat.readUsers.includes(
                                      this.props.auth.uid
                                    )
                                ).length}
                          </p>
                        </div>
                      )}
                  </div>
                );
              })}
          </div>
        ) : null}
      </div>
    );
  }
}
export default TopicsVids;
