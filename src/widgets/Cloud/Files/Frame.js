import React from "react";

class Frame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.stream = window.stream;
    this.canvas = React.createRef();
    this.video = React.createRef();
    this.photo = React.createRef();
    this.URL = window.URL;
    this.stream = window.stream;
  }
  componentDidMount = () => {
    this.startTrack();
  };
  startTrack = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.stream = stream; // make stream available to console
        this.video.current.srcObject = stream;
        /*if (window.stream) {
        window.stream.getTracks().forEach(function (track) {
          track.stop();
        });
      }*/
        const track = stream.getVideoTracks()[0];
        this.imageCapture = new ImageCapture(track);
        this.video.current.play();
        /*if (
        this.canvas &&
        this.canvas.current &&
        this.video &&
        this.video.current
      ) {
        var video = this.video.current;
        var canvas = this.canvas.current;
        var photo = this.photo.current;
        canvas.width = 80;
        canvas.height = 200;
        canvas.getContext("2d").drawImage(video, 0, 0, 80, 200);

        const dataURL = canvas.toDataURL();
        photo.src = dataURL;
        this.video.current.play();
      }*/
      })
      .catch((err) => console.log(err.message));
  };
  render() {
    /*const canvasEl = (
      <canvas
        id="canvas"
        width="640"
        height="480"
        className="photoCard"
        ref={this.canvas}
      />
    );*/
    return (
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
          {" "}
          <div
            style={{ color: "white" }}
            onClick={() => {
              if (this.state.blob) {
                this.props.send(this.state.blob, this.state.type);
              } else if (this.stream) {
                this.imageCapture
                  .takePhoto()
                  .then((blob) => {
                    var mediaRecorder = new MediaRecorder(this.stream);
                    this.photo.current.src = this.URL.createObjectURL(blob);
                    this.setState({ blob, type: mediaRecorder.mimeType });
                  })
                  .catch((err) => console.log(err.message));
              } else {
                this.startTrack();
              }
            }}
          >
            {this.state.blob ? "send" : "capture"}
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
                this.props.close();
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
    );
  }
}
export default Frame;
