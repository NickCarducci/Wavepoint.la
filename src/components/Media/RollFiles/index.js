import React from "react";
import rsa from "js-crypto-rsa";
import Image from "./Image";
import Video from "./Video";
import Paper from "./Paper";
import firebase from "../../.././init-firebase";
import { RSA, specialFormatting } from "../../../widgets/authdb";

class Files extends React.Component {
  constructor(props) {
    super(props);
    let rsaPrivateKeys = new RSA();
    this.state = {
      swipe: "grid",
      chosenHighlight: "",
      int: 3,
      rsaPrivateKeys,
      videos: []
    };
  }
  componentDidUpdate = async (prevProps) => {
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
    if (
      this.props.auth !== undefined &&
      this.props.videos !== prevProps.videos &&
      this.state.vintageName !== this.state.lastVintageName
    ) {
      this.setState({ lastVintageName: this.state.vintageName }, async () => {
        console.log(this.props.videos);
        await this.state.rsaPrivateKeys
          .readPrivateKeys()
          .then(async (keysOutput) => {
            const keyBoxes = Object.values(keysOutput);
            if (keyBoxes) {
              let p = 0;
              let videos = [];
              const accountBox = keyBoxes.find(
                (x) =>
                  x._id === this.props.auth.uid &&
                  this.state.vintageName === x.vintage
              );
              this.props.videos.map(async (x) => {
                p++;
                var foo = { ...x };
                var readFile = new FileReader();
                await fetch(x.gsUrl, {
                  "Access-Control-Allow-Origin": "*"
                })
                  .then((blob) => blob.blob())
                  .then((img) => {
                    if (!/image/.test(img.type)) {
                      return null; //not an image
                    }

                    readFile.readAsDataURL(img);
                    /*var reader = new FileReader();
                    reader.readAsArrayBuffer(img);
                    FileReader.readAsDataURL:
                    "returns base64 that contains many characters, 
                    and use more memory than blob url, but removes
                    from memory when you don't use it (by garbage collector)"*/
                  })
                  .catch((err) =>
                    this.setState(
                      {
                        Errorf: err.message,
                        Photo: null
                      },
                      () => console.log("REACT-LOCAL-PHOTO: " + err.message)
                    )
                  );

                //readFile.onerror = (err) => console.log(err.message);
                readFile.onloadend = (reader) => {
                  this.setState({ readFile }, async () => {
                    if (reader.target.readyState === 2) {
                      const gsUrl =
                        foo.vintage === accountBox.vintage
                          ? await rsa.decrypt(
                              reader.target.result,
                              accountBox.key,
                              "SHA-256",
                              {
                                name: "RSA-PSS"
                              }
                            )
                          : reader.target.result;
                      if (gsUrl) {
                        foo.gsUrl = gsUrl;
                        videos.push(foo);
                      }
                    }
                  });
                };
              });
              if (p === this.props.videos.length) this.setState({ videos });
            }
          });
      });
    }
  };
  render() {
    const { isAuthor } = this.props;
    const { swipe, chosenHighlight } = this.state;

    var folders = ["Miscellaneous"];
    this.state.videos &&
      this.state.videos.map(
        (x) =>
          x.topic &&
          !folders.includes(specialFormatting(x.topic)) &&
          folders.push(specialFormatting(x.topic))
      );
    var videos = this.state.videos.sort(
      (a, b) => a.gsUrl === chosenHighlight - b.gsUrl
    );

    return (
      <div
        style={{
          width: "100%"
        }}
      >
        <div style={{ position: "absolute", right: "4px" }}>files</div>
        <div
          style={{
            position: "relative",
            width: "min-content",
            display: "flex",
            justifyContent: "flex-start"
          }}
        >
          <div
            className="fa fa-folder"
            style={{
              padding: "4px 0px",
              width: "36px",
              textAlign: "center",
              border: "1px solid"
            }}
          />
          {this.state.addFolder && isAuthor ? (
            <form
              style={{ width: "min-content" }}
              onSubmit={(e) => {
                e.preventDefault();
                var entry = this.state.newFolder;
                this.setState(
                  {
                    addFolder: null,
                    newFolder: ""
                  },
                  () =>
                    entry !== "" &&
                    (folders = [
                      ...folders.filter((parent) => parent !== entry),
                      entry
                    ])
                );
              }}
            >
              <input
                style={{ width: "min-content" }}
                placeholder="new folder"
                onChange={(e) =>
                  this.setState({
                    newFolder: specialFormatting(e.target.value)
                  })
                }
                value={this.state.newFolder}
              />
            </form>
          ) : (
            <select
              style={{ width: "min-content", minWidth: "100px" }}
              value={this.state.selectedFolder}
              onChange={(e) =>
                this.setState({ selectedFolder: e.target.value })
              }
            >
              {folders.map((parent, i) => (
                <option key={i}>{parent}</option>
              ))}
            </select>
          )}
          {/**
          
                {this.props.folders && this.props.folders.includes("*") && (
                  <select
                    value={this.state.videoFolder}
                    onChange={(e) => {
                      var videoFolder = e.target.value;
                      this.setState({ videoFolder });
                      var folderReference = `personalCaptures/${this.props.auth.uid}`;
                      var pathReference = `${folderReference}/${this.state.videoFolder}`;
                      this.props.getVideos(pathReference);
                    }}
                    style={{ width: "100%" }}
                  >
                    {this.props.folders.map((x) => {
                      return <option key={x}>{x}</option>;
                    })}
                  </select>
                )}
          */}
          {isAuthor && (
            <div
              onClick={() =>
                this.setState({
                  addFolder: !this.state.addFolder,
                  newFolder: "",
                  folders: this.state.addFolder
                    ? folders.filter(
                        (parent) => parent !== this.state.newFolder
                      )
                    : folders
                })
              }
              style={{
                padding: "3px 0px",
                width: "36px",
                textAlign: "center",
                border: "1px solid"
              }}
            >
              {this.state.addFolder ? "-" : "+"}
            </div>
          )}
        </div>
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
        {this.props.user.vintages && (
          <select
            onChange={(e) => this.setState({ vintageName: e.target.value })}
          >
            {this.props.user.vintages.map((x) => {
              return <option>{x}</option>;
            })}
          </select>
        )}
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
                  {/*mine && (
                    <Controls
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
                  )*/}
                  {type.includes("video") ? (
                    <Video
                      wide={highlight}
                      x={x}
                      threadId={this.props.threadId}
                      unloadGreenBlue={this.props.unloadGreenBlue}
                      getVideos={this.props.getVideos}
                      inCloud={this.props.inCloud}
                    />
                  ) : type.includes("image") ? (
                    <Image
                      wide={highlight}
                      x={x}
                      threadId={this.props.threadId}
                      unloadGreenBlue={this.props.unloadGreenBlue}
                      getVideos={this.props.getVideos}
                      inCloud={this.props.inCloud}
                    />
                  ) : (
                    type.includes("application/pdf") && (
                      <Paper
                        wide={highlight}
                        x={x}
                        threadId={this.props.threadId}
                        unloadGreenBlue={this.props.unloadGreenBlue}
                        getVideos={this.props.getVideos}
                        inCloud={this.props.inCloud}
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
