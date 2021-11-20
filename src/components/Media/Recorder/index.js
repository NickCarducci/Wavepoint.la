import React from "react";
import rsa from "js-crypto-rsa";
import getBlobDuration from "get-blob-duration";
import LiveChat from "./Live";
import Playback from "./Playback";
import RollFiles from "../RollFiles";

class Recorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blobs: [],
      recordedChunks: [],
      videos: [],
      startTime: 0,
      endTime: 0,
      duration: 0,
      videoTitle: "",
      videoFolder: "*",
      openFrom: "Folder"
    };
    this.URL = window.URL;
    this.stream = window.stream;
    this.canvas = React.createRef();
    this.photo = React.createRef();
    this.video = React.createRef();
    this.video2 = React.createRef();
  }
  componentDidMount = () => {
    //this.startTrack();
  };
  startTrack = () => {
    if (this.stream !== "loading media devices") {
      this.stream = "loading media devices";
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            width: 4096,
            height: 2160,
            facingMode: "user"
          }
        })
        .then((stream) => {
          this.stream = stream; // make stream available to console
          this.video.current.srcObject = stream;

          const track = stream.getVideoTracks()[0];
          this.imageCapture = new ImageCapture(track);
          this.video.current.play();
        })
        .catch((err) => console.log(err.message));
    }
  };
  fetchf = () => {
    var folderReference = `personalCaptures/${this.props.auth.uid}`;
    this.props.getFolders(folderReference);
    var pathReference = `${folderReference}/${"*"}`;
    this.props.getVideos(pathReference);
    this.setState({ gotVideos: true });
  };
  videoUpload = async (x) => {
    var answer = window.confirm("begin upload?");
    if (answer) {
      if (x.title.includes("/")) return window.alert("/ forbidden in title");
      console.log(x.type);
      var filename = x.title; //+ x.type.split("/")[1].toLowerCase();
      var pathReference = `personalCaptures/${this.props.auth.uid}/${x.folder}`;
      var itemRef = this.props.storageRef.child(pathReference + "/" + filename);
      const create = () => {
        console.log("no doc exists by name of: " + x.title);
        // Create a root reference
        console.log(`adding to ${x.folder}...`);
        itemRef
          .put(x.blob)
          .then((snapshot) => {
            console.log(snapshot);
            console.log(
              `${x.title}.${x.type.split("/")[1]}` +
                " added to " +
                `personalCaptures/${this.props.auth.uid}/${x.folder}`
            );
            if (this.props.videos !== []) {
              var folderReference = `personalCaptures/${this.props.auth.uid}/${x.folder}`;
              this.setState({ openFrom: "Store" });
              this.props.getVideos(pathReference);
              this.props.getFolders(folderReference);
            } else this.props.getVideos(pathReference);
          })
          .catch((err) => console.log(err.message));
      };
      await itemRef
        .getDownloadURL()
        .then((url) => {
          window.alert(
            `capture exists with this name "${x.title}"` +
              ` in "${this.props.user.username}/personalCaptures/," Please rename this`
          );
          console.log(
            `capture exists with this name "${x.title}"` +
              ` in "${this.props.user.username}/personalCaptures/," Please rename this`
          );
        })
        .catch((error) => {
          // https://firebase.google.com/docs/storage/web/handle-errors
          if (error.code === "storage/object-not-found") {
            create();
          } else return console.log(error.code);
        });
    }
  };
  startTrack = async () => {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 4096,
          height: 2160,
          facingMode: "user"
        }
      });
      /* use the this.stream */
      const videoTracks = this.stream.getTracks();
      const track =
        videoTracks[0]; /*.applyConstraints({
        echoCancellation: true,
        googEchoCancellation: true,
        googAutoGainControl: true,
        googNoiseSuppression: true,
        mozEchoCancellation: true,
        mozAutoGainControl: true,
        mozNoiseSuppression: true
      });*/
      this.setState({ track });

      this.video.current.srcObject = this.stream;
      //this.localPeerConnection.addStream(this.video.current.srcObject);
      this.video.current.play();
    } catch (err) {
      /* handle the error */
      console.log(err.message);
      if (err.message === "Permission denied") {
        window.alert("camera off, edit this in browser settings");
      } else return window.alert("camera off");
    }
  };
  play = () => {
    if (!this.recorder) {
      try {
        this.recorder = new MediaRecorder(this.stream, {
          mimeType: "video/webm"
        });
      } catch (e) {
        return console.error("Exception while creating MediaRecorder: " + e);
      }
      let recordedChunks = [];
      this.recorder.ondataavailable = (event) => {
        if (!this.recorder || event.data.size === 0) return;

        recordedChunks.push(event.data);
        this.setState({
          recordedChunks
        });
      };
      this.recorder.start(100);
    } else {
      this.recorder.resume();
    }
    console.log("start recording video " + this.state.videos.length);
    this.startTrack();
    this.setState({
      recording: true,
      play: false,
      ["videos" + this.state.videos.length]: new Date()
    });
  };
  record = () => {
    if (!this.recorder) {
      try {
        this.recorder = new MediaRecorder(this.stream, {
          mimeType: "video/webm"
        });
      } catch (e) {
        return console.error("Exception while creating MediaRecorder: " + e);
      }
      let recordedChunks = [];
      this.recorder.ondataavailable = (event) => {
        if (!this.recorder || event.data.size === 0) return;

        recordedChunks.push(event.data);
        this.setState({
          recordedChunks
        });
      };
      this.recorder.start(100);
    } else {
      this.recorder.resume();
    }
    console.log("start recording video " + this.state.videos.length);
    this.startTrack();
    this.setState({
      recording: true,
      play: false,
      ["videos" + this.state.videos.length]: new Date()
    });
  };
  pauseRecording = async () => {
    try {
      this.recorder.pause();
      this.setState({
        ["videos" + this.state.videos.length]:
          new Date().getTime() - this.state["videos" + this.state.videos.length]
      });
      console.log("stop recording video " + this.state.videos.length);
      var newBlob = new Blob(this.state.recordedChunks, {
        type: "video/webm"
      });

      var blobs = [...this.state.blobs, newBlob];
      this.setState({ blobs });

      let videos = [];
      blobs.map(async (x) => {
        var url = this.URL.createObjectURL(x);
        return videos.push({
          url,
          time: new Date()
        });
      });
      videos.sort((a, b) => b.time.getTime() - a.time.getTime());
      this.setState(
        {
          videos
        },
        async () => {
          var compositeBlob = new Blob(blobs, {
            type: "video/webm"
          });
          var url = this.URL.createObjectURL(compositeBlob);
          var duration = await getBlobDuration(url);
          console.log("load preview");
          this.setState({ url, blob: compositeBlob, duration });
          this.video2.current.src =
            url + `#t=${this.state.startTime},${duration}`;
          this.video2.current.load();
          this.video2.current.onloadeddata = () => {
            this.video2.current && this.video2.current.play();
            this.setState({ play: true });
          };

          this.setState({
            recording: false
          });
        }
      );
    } catch (err) {
      console.log(err.message);
    }
  };
  delete = async () => {
    try {
      this.recorder.stop();
      //this.recorder.stream.stop();

      this.removeTracks(this.stream);
    } catch (err) {
      console.log(err.message);
    }
    console.log(`deleting (${this.state.videos.length}) videos`);
    this.setState(
      {
        recording: false,
        track: [],
        videos: [],
        recordedChunks: [],
        blob: null,
        blobs: [],
        url: "",
        recorderPaused: false
      },
      () => {
        this.video.current.srcObject = null;
        if (this.video2 && this.video2.current) {
          this.video2.current.srcObject = null;
          this.video2.current.src = null;
        }
        this.video.current.src = null;

        this.recorder = null;
        this.stream = null;
        this.localPeerConnection = null;
        //this.props.cancel();
        window.alert(
          "camera & audio input have been successfully dismounted.  reload page to reset stream-indication light"
        );
      }
    );
  };
  removeTracks = (stream) => {
    stream.getVideoTracks().forEach((track) => {
      stream.removeTrack(track);
      track.stop();
    });
    stream.getAudioTracks().forEach((track) => {
      stream.removeTrack(track);
      track.stop();
    });
  };
  cancel = async () => {
    if (
      this.stream &&
      this.video &&
      this.video.current &&
      this.video.current.readyState === 4
    )
      try {
        this.removeTracks(this.stream);

        /*const devices = await navigator.mediaDevices.enumerateDevices();
        const capabilities = devices.map((d) =>
          d.getCapabilities ? d.getCapabilities() : d.toJSON()
        );*/
        this.stream = null;
        this.recorder = null;
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: false })
          .then(() =>
            this.setState(
              {
                recording: false
              },
              () => {
                window.alert(
                  "the app has nullified the stream object, lo the light" +
                    " remains because your browser has its own settings to persist"
                );
              }
            )
          );
        /*capabilities.map(x=>{
        navigator.mediaDevices
          .getUserMedia({ audio: false, video: { deviceId: { exact: x.deviceId } } })
          .then(() =>
            this.setState({
              recording: false
            })
          );
        })*/
      } catch (err) {
        console.log(err);
      }
  };
  save = async () => {
    if (this.state.navigate) return null;
    const { url, blob, type, videoTitle, videoFolder } = this.state;
    //e.stopPropagation();
    if (url && blob) {
      if (videoTitle) {
        if (this.props.auth !== undefined) {
          console.log("initiating upload...");
          console.log(url);
          console.log(blob.size);
          if (blob.size < 1288490188) {
            //1,288,490,188.8 (1.2 gb / 2 hours)
            //this.state.blob) {

            const saltedBlob = rsa.encrypt(
              blob,
              this.props.user.box,
              "SHA-256",
              {
                name: "RSA-PSS"
              }
            );
            saltedBlob &&
              this.videoUpload({
                type,
                folder: videoFolder,
                title: videoTitle,
                blob: saltedBlob,
                authorId: this.props.auth.uid,
                date: new Date()
              });
          } else
            return window.alert(
              `${type} file is too big.  ` +
                `Folder a file below 1,288,490,188 byte (1.2 gb / ~2 hours)`
            );
        } else {
          var answer1 = window.confirm("you will have to login");
          if (answer1) this.setState({ navigate: true });
        }
      } else {
        window.alert("choose title/location");
        this.setState({ selectedFile: blob });
      }
      /* else if (this.stream) {
        this.imageCapture
          .takePhoto()
          .then((blob) => {
            var mediaRecorder = new MediaRecorder(
              this.stream
            );
            this.photo.current.src = window.URL.createObjectURL(
              blob
            );
            this.setState({
              blob,
              type: mediaRecorder.mimeType
            });
          })
          .catch((err) => console.log(err.message));
      }*/
    } else this.startTrack();
  };
  render() {
    var { videos, recording, live, openFolder } = this.state;
    var isSafari = navigator.userAgent.includes("safari"); //navigator.vendor === "Apple Computer, Inc."//window.safari !== undefined;

    var videoDurations = { ...this.state };
    //videoDurations.filter((x) => x.split("video")[1]);

    const filterObject = (obj) => {
      Object.keys(obj).forEach((x) => {
        if (!x.split("video")[1]) {
          delete obj[x];
        }
      });
    };
    filterObject(videoDurations);
    const savable =
      (this.state.openFrom === "Folder" && this.state.selectedFile) ||
      (this.stream && this.state.blob);
    return (
      <div
        style={{
          overflowX: "hidden",
          overflowY: "auto",
          maxHeight: "100%",
          maxWidth: "100%",
          width: "min-content",
          position: "relative",
          bottom: "0px",
          color: "white"
        }}
      >
        {!this.stream && (
          <div style={{ position: "absolute", right: "4px" }}>
            {!this.state.openFolder ? "recorder" : "uploader"}
          </div>
        )}
        <div
          style={{
            backgroundColor: "rgba(20,20,30)",
            margin: this.stream ? "10px" : "0px",
            minHeight: this.stream && recording ? "56px" : "0px"
          }}
        >
          {!this.stream && !openFolder && (
            <div
              onClick={
                this.state.openFolder
                  ? () => this.setState({ openFolder: false })
                  : () => this.props.setPost({ videoRecorderOpen: false })
              }
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "red",
                bottom: "0px",
                zIndex: "9999",
                height: "26px",
                width: "46px",
                left: "20px",
                display: "flex",
                fontSize: "25px",
                color: "white",
                textShadow: `"-1px -1px 0 #000",  
              "1px -1px 0 #000",
              "-1px 1px 0 #000",
              "1px 1px 0 #000"`
              }}
            >
              &times;
            </div>
          )}
          <div
            style={{
              display: !this.stream && openFolder ? "flex" : "none",
              flexDirection: "column",
              height: "min-content"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                height: "40px",
                width: "100%",
                position: "relative",
                backgroundColor: "rgb(220,220,220)"
              }}
            >
              <div
                onClick={() => this.setState({ openFrom: "Folder" })}
                style={{
                  color: this.state.openFrom === "Folder" ? "black" : "grey",
                  fontSize: "17px",
                  textDecoration:
                    this.state.openFrom === "Folder" ? "underline" : "none"
                }}
              >
                Folder
              </div>
              <div
                onClick={() => this.setState({ openFrom: "Store" })}
                style={{
                  color: this.state.openFrom === "Store" ? "black" : "grey",
                  fontSize: "17px",
                  textDecoration:
                    this.state.openFrom === "Store" ? "underline" : "none"
                }}
              >
                Private Cloud
              </div>
              <div
                onMouseEnter={() =>
                  this.setState({ hoverCloseFolder: true }, () => {
                    clearTimeout(this.resetHoverCloser);
                    this.resetHoverCloser = setTimeout(() => {
                      this.setState({ hoverCloseFolder: false });
                    }, 200);
                  })
                }
                style={{
                  color: this.state.hoverCloseFolder ? "black" : "grey",
                  padding: "10px",
                  border: "1px dotted"
                }}
                onClick={() => {
                  if (this.state.selectedFile || this.state.url) {
                    this.setState({
                      blob: null,
                      video: null,
                      selectedFile: null,
                      url: null,
                      clear: true
                    });
                    setTimeout(() => {
                      this.setState({
                        clear: false
                      });
                    }, 200);
                  } else {
                    this.setState({ openFolder: false });
                  }
                }}
              >
                &times;
              </div>
              {/*this.props.user !== undefined && (
                <Link
                  to="/files" //{`/files/${this.props.user.id}`}
                  style={{
                    color: "black",
                    height: "13px",
                    width: "13px",
                    borderBottom: "1px solid",
                    borderLeft: "1px solid"
                  }}
                >
                  <div style={{ transform: "rotate(45deg)" }}>&#x2191;</div>
                </Link>
                )*/}
            </div>
            {this.state.openFrom === "Folder" && (
              <div>
                {this.state.video ? (
                  <video
                    style={{
                      width: "60%",
                      height: "300px",
                      marginTop: "5px",
                      border: "3px solid",
                      borderRadius: "10px"
                    }}
                    width="320"
                    height="240"
                    controls
                    ref={this.video}
                  >
                    <p>Video stream not available. </p>
                  </video>
                ) : this.state.video === false ? (
                  <img
                    //id="photo"
                    ref={this.photo}
                    style={{
                      margin: "10px",
                      marginBottom: "0px",
                      marginTop: "5px",
                      border: "3px solid",
                      borderRadius: "10px",
                      height: "90px",
                      width: "63px"
                    }}
                    src={this.state.url}
                    alt={this.state.selectedFile.name}
                  />
                ) : this.state.frame ? (
                  <div style={{ height: "min-content", zIndex: "6" }}>
                    {/*canvasEl*/}
                    <div
                      style={{
                        height: "min-content",
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between"
                      }}
                    >
                      <div style={{ color: "white" }} onClick={this.save}>
                        send{/*this.state.blob ? "send" : "capture"*/}
                      </div>
                      <div
                        onClick={() => {
                          this.photo.current.src = null;
                          if (this.state.blob) {
                            this.setState({ blob: null, type: null });
                          } else {
                            this.stream.getTracks().forEach(function (track) {
                              track.stop();
                            });
                            this.setState({ blob: null, type: null });
                            this.stream = null;
                            this.setState({ frame: false });
                          }
                        }}
                      >
                        {this.state.blob ? "delete" : "close"}
                      </div>
                    </div>
                    <img
                      style={{
                        height: "150px",
                        display: !this.state.blob ? "none" : "flex"
                      }}
                      ref={this.photo}
                      alt="camera"
                    />
                    <video
                      style={{
                        height: "150px",
                        zIndex: "9",
                        display: this.state.blob ? "none" : "flex"
                      }}
                      ref={this.video}
                      autoplay
                    ></video>
                  </div>
                ) : this.state.selectedFile ? (
                  <iframe
                    style={{
                      margin: "10px",
                      marginBottom: "0px",
                      overflow: "auto",
                      marginTop: "5px",
                      border: "3px solid",
                      borderRadius: "10px",
                      height: "180px",
                      width: "126px"
                    }}
                    src={this.state.url}
                    title={this.state.selectedFile.name}
                  />
                ) : (
                  <div
                    onClick={() => this.setState({ frame: true })}
                    style={{
                      margin: "10px",
                      marginBottom: "0px",
                      border: "3px solid",
                      borderRadius: "10px",
                      height: "60px",
                      width: "42px"
                    }}
                  />
                )}
                {!this.state.frame && (
                  <input
                    key={this.state.clear ? 0 : 1}
                    style={{
                      width: "80%",
                      display: "flex",
                      flexDirection: "column",
                      margin: "10px 15px",
                      borderRadius: "6px",
                      border: "3px solid blue"
                    }}
                    type="file"
                    onChange={(event) => {
                      // Update the state
                      // const fileReader = new window.FileReader();
                      var selectedFile = event.target.files[0];
                      if (selectedFile) {
                        console.log(selectedFile);
                        var blob;
                        var url;
                        if (
                          selectedFile.type.includes("video") ||
                          selectedFile.type.includes("image") ||
                          selectedFile.type.includes("application/pdf")
                        ) {
                          blob = new Blob([selectedFile], {
                            type: selectedFile.type //"video/mp4"
                          });
                          url = this.URL.createObjectURL(blob);
                          console.log(url);
                          this.setState({ selectedFile, url, blob });
                          if (selectedFile.type.includes("video")) {
                            this.videoObj = this.video.current;
                            if (this.videoObj) {
                              //this.videoObj.srcObject = selectedFile.stream;
                              this.videoObj.src = this.state.url;
                              this.setState({ video: true });
                            }
                          } else if (selectedFile.type.includes("image")) {
                            this.setState({ video: false });
                          }
                        } else
                          return window.alert(
                            `unsupported file type ${selectedFile.type}`
                          );
                      }
                    }}
                  />
                )}
                {!this.state.frame && (
                  <div
                    style={{ textDecoration: "none" }}
                    onClick={
                      this.props.auth === undefined && this.state.navigate
                        ? () => this.props.getUserInfo() //"/login"
                        : null //window.location.pathname
                    }
                  >
                    <button
                      onClick={this.save}
                      style={{
                        color: "white",
                        width: "max-content",
                        margin: "10px",
                        marginTop: "5px",
                        display: "flex",
                        flexDirection: "column",
                        padding: "5px",
                        borderRadius: "6px",
                        backgroundColor: "blue"
                      }}
                    >
                      {this.state.navigate ? "Login" : "Save"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {this.state.openFrom === "Store" && this.props.auth !== undefined && (
              <div
                style={{
                  top: `${this.props.top ? this.props.top : 0}px`,
                  width: "100%",
                  height: this.props.openFullScreen ? "100%" : "min-content"
                }}
              >
                {this.props.videos && (
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <RollFiles
                      user={this.props.user}
                      showStuff={true}
                      collection={this.props.collection}
                      unloadGreenBlue={this.props.unloadGreenBlue}
                      loadGreenBlue={this.props.loadGreenBlue}
                      topic={this.props.topic}
                      getUserInfo={this.props.getUserInfo}
                      auth={this.props.auth}
                      entityId={this.props.entityId}
                      entityType={this.props.entityType}
                      videos={this.props.parent.videos}
                      getVideos={this.props.getVideos}
                      threadId={this.props.threadId}
                      inCloud={true}
                    />
                  </div>
                )}
                {!this.props.videos && !this.state.gotVideos ? (
                  <div
                    style={{
                      fontSize: "12px",
                      margin: "10px",
                      textDecoration: "underline"
                    }}
                    onClick={this.fetchf}
                  >
                    fetch (takes ~10 seconds)
                  </div>
                ) : !this.props.videos ? (
                  <div className="loader">loading</div>
                ) : null}
                {this.props.videos && this.props.videos.length < 0 && (
                  <div style={{ margin: "5px", fontSize: "12px" }}>
                    no files stored
                  </div>
                )}
              </div>
            )}
          </div>
          {savable && (
            <select
              value={this.state.videoFolder}
              onChange={(e) => this.setState({ videoFolder: e.target.value })}
              className="input"
              style={{ width: "80%" }}
            >
              {this.props.user !== undefined && this.props.user.folders ? (
                this.props.user.folders.map((x) => {
                  return <option key={x}>{x}</option>;
                })
              ) : (
                <option>*</option>
              )}
            </select>
          )}
          {savable && (
            <input
              value={this.state.videoTitle}
              onChange={(e) => this.setState({ videoTitle: e.target.value })}
              placeholder="name"
              className="input"
              style={{ width: "80%" }}
            />
          )}
          {!this.stream && (
            <span
              onClick={() => this.setState({ openFolder: true })}
              //folder
              style={{
                display: openFolder ? "none" : "flex",
                left: "10px",
                position: "absolute",
                margin: "10px 0px"
              }}
              role="img"
              aria-label="upload folder or file"
            >
              &#128193;
            </span>
          )}
          <div
            //pause record
            style={{
              height: "min-content",
              display: "flex",
              top: "10px"
            }}
          >
            {this.stream && !live ? (
              recording ? (
                <div onClick={this.pauseRecording}>
                  <b>|</b>
                  <b>|</b>
                </div>
              ) : (
                <div
                  onMouseEnter={() => this.setState({ hoverRec: true })}
                  onMouseLeave={() => this.setState({ hoverRec: false })}
                  //record
                  onClick={this.record}
                >
                  <div
                    style={{
                      backgroundColor: "rgba(20,20,30)",
                      opacity: recording || this.state.hoverRec ? "1" : ".7",
                      color: recording ? "red" : "rgb(250,200,200)"
                    }}
                  >
                    &#9673;
                  </div>
                </div>
              )
            ) : null}
          </div>
          {!this.stream || live || recording ? null : videos.length === 0 ? (
            <div
              onMouseEnter={() => this.setState({ hoverCancel: true })}
              onMouseLeave={() => this.setState({ hoverCancel: false })}
              style={{
                width: "max-content",
                color: this.state.hoverCancel ? "white" : "grey",
                display: "flex",
                left: "0px",
                position: "relative",
                margin: "5px",
                fontSize: "12px"
              }}
              onClick={this.cancel}
            >
              cancel
            </div>
          ) : (
            <button onClick={this.save}>send</button>
          )}
          {this.stream && !recording && !live && videos.length > 0 && (
            <div
              style={{
                display: "flex",
                right: "0px",
                position: "absolute"
              }}
              onClick={this.delete}
            >
              delete
            </div>
          )}
        </div>
        {!this.state.openFolder &&
          this.state.videos.length === 0 &&
          !this.state.recording && (
            <div
              style={{
                backgroundColor: "rgba(40,30,90)",
                textAlign: "right",
                textIndent: "10px",
                padding: this.stream ? "0px" : "15px 5px",
                color: "grey"
              }}
              onClick={() => {
                if (isSafari) {
                  return window.alert("not available in Apple's safari");
                } else {
                  if (!this.stream) {
                    //if (navigator.mediaDevices) {
                    this.startTrack();
                    //} else return window.alert("video loading failure");
                  } else {
                    return window.alert(
                      "camera enabled, edit this in browser settings"
                    );
                  }
                }
              }}
            >
              {!this.stream ? (
                "enable camera"
              ) : !this.state.hovered ? (
                <div
                  onMouseEnter={() => this.setState({ hoverSettings: true })}
                  onMouseLeave={() => this.setState({ hoverSettings: false })}
                  style={{
                    color: this.state.hoverSettings ? "white" : "grey",
                    height: "min-content",
                    width: "min-content"
                  }}
                >
                  &#9881;
                </div>
              ) : (
                "camera enabled, edit this in browser settings"
              )}
            </div>
          )}
        {this.stream &&
          this.state.videos.length > 0 &&
          this.props.auth !== undefined &&
          !this.state.live && (
            <div
              style={{
                top: "10px",
                display: "flex",
                right: "10px",
                position: "absolute"
              }}
              onClick={() => {
                this.setState({ sendSaveVideo: true });
              }}
              //send paper airplane
            >
              &#xf1d9;
            </div>
          )}
        {this.stream &&
          !this.state.recording &&
          !this.state.live &&
          this.state.videos.length > 0 && (
            <div
              onClick={() => {
                this.video2.current.srcObject = null;
                this.video2.current.src = this.state.url;
                this.video2.current.load();
                this.video2.current.onloadeddata = () => {
                  this.video2.current.play();
                  this.setState({ play: true });
                };
              }}
            >
              play
            </div>
          )}
        <Playback
          {...videoDurations}
          videos={this.state.videos}
          live={this.state.live}
          stream={this.stream}
          play={this.state.play}
          url={this.state.url}
          ref={this.video2}
        />
        {this.localPeerConnection && (
          <div>
            <div
              style={{
                display: "flex",
                backgroundColor: "white",
                color: "rgb(20,20,30)",
                borderRadius: "23px",
                width: "20px",
                height: "20px",
                justifyContent: "center",
                alignItems: "center"
              }}
              onClick={async () => {
                await this.localPeerConnection.createOffer({
                  iceRestart: true
                });
              }}
            >
              &#8634;
            </div>
            connection
          </div>
        )}
        {this.props.isPost ? (
          <div>
            <div
              style={{
                display: "flex",
                right: "10px",
                position: "absolute",
                top: "10px"
              }}
            >
              {this.stream &&
                !this.state.recording &&
                this.state.videos.length === 0 && (
                  <div
                    style={{
                      color: "white",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid",
                      flexDirection: "column",
                      display: "flex"
                    }}
                  >
                    &#9880;
                    <div
                      style={{
                        fontSize: "12px"
                      }}
                    >
                      live
                    </div>{" "}
                  </div>
                )}
            </div>
            {this.stream && (
              <video
                //live video
                style={{
                  left: "50%",
                  opacity: "1",
                  zIndex: "5",
                  display: "flex",
                  position: "relative",
                  width: "100%",
                  maxWidth: "600px",
                  backgroundColor: "white",
                  color: "white"
                }}
                ref={this.video}
              >
                <p>Audio stream not available. </p>
              </video>
            )}
          </div>
        ) : (
          <LiveChat
            auth={this.props.auth}
            videos={this.state.videos}
            room={this.props.room}
            stream={this.stream}
            recording={this.state.recording}
            ref={this.video}
          />
        )}
      </div>
    );
  }
}
export default Recorder;
