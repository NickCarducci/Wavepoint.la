import React from "react";
import getBlobDuration from "get-blob-duration";
//import LabelVideo from "./LabelVideo";
import VideoPause from "./VideoPause";
import LiveChat from "./live/LiveChat";
import Video2 from "./Video2";
import LiveStream from "./live/LiveStream";

class VideoRecorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blobs: [],
      recordedChunks: [],
      videos: [],
      startTime: 0,
      endTime: 0,
      duration: 0
    };
    this.video = React.createRef();
    this.video2 = React.createRef();
    this.URL = window.URL;
  }
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
  render() {
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
          color: "white",
          backgroundColor: "rgba(20,20,30)"
        }}
      >
        <VideoPause
          collection={this.props.collection}
          unloadGreenBlue={this.props.unloadGreenBlue}
          loadGreenBlue={this.props.loadGreenBlue}
          getUserInfo={this.props.getUserInfo}
          storageRef={this.props.storageRef}
          topic={this.props.topic}
          previousSegments={this.state["videos" + this.state.videos.length]}
          openFolder={this.state.openFolder}
          toggleFolder={
            this.state.openFolder
              ? () => this.setState({ openFolder: false })
              : () => this.props.cancel()
          }
          openFolderNow={() => this.setState({ openFolder: true })}
          threadId={this.props.threadId}
          isPost={true}
          getVideos={this.props.getVideos}
          getFolders={this.props.getFolders}
          folders={this.props.folders}
          videos={this.state.videos}
          videosAll={this.props.videos}
          user={this.props.user}
          auth={this.props.auth}
          entityType={this.props.entityType}
          entityId={this.props.entityId}
          //
          video2={this.video2.current}
          recorder={this.recorder}
          stream={this.stream}
          recording={this.state.recording}
          live={this.state.live}
          //videos={this.state.videos}
          video={this.video.current}
          play={() => {
            if (!this.recorder) {
              try {
                this.recorder = new MediaRecorder(this.stream, {
                  mimeType: "video/webm"
                });
              } catch (e) {
                return console.error(
                  "Exception while creating MediaRecorder: " + e
                );
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
          }}
          record={() => {
            if (!this.recorder) {
              try {
                this.recorder = new MediaRecorder(this.stream, {
                  mimeType: "video/webm"
                });
              } catch (e) {
                return console.error(
                  "Exception while creating MediaRecorder: " + e
                );
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
          }}
          pauseRecording={async () => {
            try {
              this.recorder.pause();
              this.setState({
                ["videos" + this.state.videos.length]:
                  new Date().getTime() -
                  this.state["videos" + this.state.videos.length]
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
              this.setState({
                videos
              });

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
            } catch (err) {
              console.log(err.message);
            }
          }}
          delete={async () => {
            try {
              this.recorder.stop();
              //this.recorder.stream.stop();

              this.stream.getVideoTracks().forEach((track) => {
                this.stream.removeTrack(track);
                track.stop();
              });
              this.stream.getAudioTracks().forEach((track) => {
                this.stream.removeTrack(track);
                track.stop();
              });

              this.video.current.srcObject = null;
              this.video2.current.srcObject = null;
              this.video2.current.src = null;
              this.video.current.src = null;

              this.recorder = null;
              this.stream = null;
              this.localPeerConnection = null;

              console.log(`deleting (${this.state.videos.length}) videos`);
              this.setState({
                recording: false,
                track: [],
                videos: [],
                recordedChunks: [],
                blob: null,
                blobs: [],
                url: "",
                recorderPaused: false
              });
              //this.props.cancel();
              setTimeout(
                () =>
                  window.alert(
                    "camera & audio input have been successfully dismounted.  reload page to reset stream-indication light"
                  ),
                200
              );
            } catch (err) {
              console.log(err.message);
            }
          }}
          cancel={() => {
            if (
              this.stream &&
              this.video &&
              this.video.current &&
              this.video.current.readyState === 4
            )
              try {
                this.stream.getVideoTracks().forEach((track) => {
                  this.stream.removeTrack(track);
                  track.stop();
                });
                this.stream.getAudioTracks().forEach((track) => {
                  this.stream.removeTrack(track);
                  track.stop();
                });

                this.recorder = null;
                this.stream = null;
                console.log("mediaDevices cancelled");
                this.setState({
                  recording: false
                });
              } catch (err) {
                console.log(err);
              }
          }}
          startTrack={this.startTrack}
        />
        {!this.state.openFolder &&
          this.state.videos.length === 0 &&
          !this.state.recording && (
            <div
              style={{
                display: "flex",
                right: "10px",
                top: "10px",
                height: this.stream ? "0px" : "50px",
                color: "grey"
              }}
            >
              <div
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
                style={{
                  display: "flex",
                  right: "40px",
                  position: "absolute",
                  height: "min-content",
                  color: "grey"
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
            </div>
          )}
        {this.stream &&
          this.state.videos.length > 0 &&
          this.props.auth !== undefined &&
          !this.state.live && (
            <div
              className="fa"
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
        <Video2
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
          <LiveStream
            auth={this.props.auth}
            videos={this.state.videos}
            stream={this.stream}
            recording={this.state.recording}
            ref={this.video}
          />
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
export default VideoRecorder;
