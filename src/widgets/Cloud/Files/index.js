import React from "react";
import Image from "./Image";
import Video from "./Video";
import Paper from "./Paper";
import ImageSetting from "../ImageSetting";
import firebase from "../../.././init-firebase";

class Files extends React.Component {
  state = { swipe: "grid", chosenHighlight: "", int: 3 };
  componentDidUpdate = () => {
    if (this.state.opening !== this.state.lastOpening) {
      this.setState({ lastOpening: this.state.opening }, () => {
        if (this.state.opening) {
          this.clearIn = setInterval(
            () => this.setState({ int: this.state.int - 1 }),
            1000
          );
        } else {
          this.setState({ int: 3 }, () => clearInterval(this.clearIn));
        }
      });
    }
  };
  render() {
    const { isAuthor } = this.props;
    const { swipe, chosenHighlight } = this.state;

    var videos = this.props.videos.sort(
      (a, b) => a.gsUrl === chosenHighlight - b.gsUrl
    );
    return (
      <div
        style={{
          width: "100%"
        }}
      >
        <div style={{ width: "100%", display: "flex" }}>
          <div
            style={{
              textDecoration: swipe === "highlight" ? "underline" : "none",
              height: "30px",
              width: "50%",
              display: "flex",
              justifyContent: "center"
            }}
            onClick={() => {
              if (chosenHighlight) {
                this.setState({ chosenHighlight: "" });
              } else {
                this.setState({ swipe: "highlight" });
              }
            }}
          >
            highlight
          </div>

          <div
            style={{
              borderLeft: "1px solid",
              textDecoration: swipe === "grid" ? "underline" : "none",
              height: "30px",
              width: "50%",
              display: "flex",
              justifyContent: "center"
            }}
            onClick={() => this.setState({ swipe: "grid" })}
          >
            grid
          </div>
        </div>
        <div
          style={{
            backgroundColor: "rgb(230,100,170)",
            paddingBottom: "20px",
            height: "min-content",
            display: "flex",
            position: "relative",
            width: "100%",
            flexWrap: "wrap"
          }}
        >
          {videos.map((x, i) => {
            if (x.topic === this.props.selectedFolder) {
              const type = x.contentType ? x.contentType : x.type;
              const mine = this.props.inCloud || isAuthor;
              const highlight =
                swipe !== "grid" &&
                (x.gsUrl === chosenHighlight ||
                  (chosenHighlight === "" && i === 0));
              const openingThisOne = x.gsUrl === this.state.opening;
              return (
                <div
                  key={this.props.threadId + x.gsURL}
                  onMouseEnter={() =>
                    swipe !== "grid" &&
                    this.setState({ opening: x.gsUrl }, () => {
                      clearTimeout(this.holding);
                      this.holding = setTimeout(() => {
                        this.setState({ opening: false }, () => {
                          window.open(x.gsUrl);
                        });
                      }, 3000);
                    })
                  }
                  onMouseLeave={() => {
                    this.state.opening &&
                      this.setState({ opening: false }, () =>
                        clearTimeout(this.holding)
                      );
                  }}
                  style={{
                    border: !highlight ? "0px solid" : "3px solid",
                    borderRadius: !highlight ? "0px" : "10px",
                    width: !highlight ? "100%" : "30%",
                    position: "relative",
                    height: "min-content"
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      color: "rgb(210,210,225)",
                      top: "0px",
                      right: "0px",
                      opacity: openingThisOne ? 1 : 0,
                      backgroundColor: openingThisOne
                        ? "rgba(40,40,80,1)"
                        : "rgba(40,40,80,.4)",
                      zIndex: "1000",
                      position: "absolute",
                      padding: "20px 0px",
                      width: openingThisOne ? "100%" : "0%",
                      transition: openingThisOne
                        ? "3s ease-out"
                        : ".3s ease-in",
                      minWidth: "max-content"
                    }}
                  >
                    opening in&nbsp;{this.state.int}
                  </div>
                  {mine && (
                    <ImageSetting
                      collection={this.props.collection}
                      unloadGreenBlue={this.props.unloadGreenBlue}
                      loadGreenBlue={this.props.loadGreenBlue}
                      topic={this.props.topic}
                      x={x}
                      getVideos={this.props.getVideos}
                      auth={this.props.auth}
                      entityId={this.props.entityId}
                      entityType={this.props.entityType}
                      threadId={this.props.threadId}
                    />
                  )}
                  {type.includes("video") ? (
                    <Video swipe={swipe} x={x} threadId={this.props.threadId} />
                  ) : type.includes("image") ? (
                    <Image
                      wide={highlight}
                      x={x}
                      threadId={this.props.threadId}
                    />
                  ) : (
                    type.includes("application/pdf") && (
                      <Paper
                        swipe={swipe}
                        x={x}
                        threadId={this.props.threadId}
                      />
                    )
                  )}
                  {this.state.requestConfirmDelete && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        this.setState({ requestConfirmDelete: false });
                        if (this.state.requestConfirmDelete === "delete") {
                          firebase
                            .firestore()
                            .collection("chatMeta")
                            .doc(x.id)
                            .delete()
                            .then(() => {
                              this.setState({
                                deletedItems: [...this.state.deletedItems, x.id]
                              });
                              window.alert("item deleted successful");
                            })
                            .catch((err) => console.log(err.message));
                        } else
                          window.alert(`to delete, enter "delete" exactly`);
                      }}
                    >
                      <input
                        defaultValue=""
                        onChange={(e) =>
                          this.setState({
                            requestConfirmDelete: e.target.value
                          })
                        }
                        className="input"
                        placeholder="delete"
                      />
                      <div
                        onClick={() =>
                          this.setState({ requestConfirmDelete: false })
                        }
                      >
                        &times;
                      </div>
                    </form>
                  )}
                  {swipe !== "grid" &&
                    (x.gsUrl === chosenHighlight ||
                      (chosenHighlight === "" && i === 0)) && (
                      <div
                        onClick={() => {
                          if (isAuthor) {
                            var answer = window.confirm("delete?");
                            if (answer) {
                              this.setState({ requestConfirmDelete: true });
                            }
                          } else if (x.gsUrl !== chosenHighlight) {
                            this.props.chooseHighlight(x.gsUrl);
                          }
                        }}
                      >
                        1 of {videos.length}
                      </div>
                    )}
                </div>
              );
            } else return null;
          })}
        </div>
      </div>
    );
  }
}
export default Files;
