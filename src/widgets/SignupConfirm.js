import React from "react";
//import { Link } from "react-router-dom";
import Slider from "react-input-slider";
import "./login.css";

class SignupConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      volume: 0,
      time: 0,
      playing: false,
      closeContinue: false
    };
    this.vidRef = React.Component();
  }
  componentDidMount = () => {
    this.vidRef &&
      this.vidRef.current.addEventListener("volumechange", this.handleVolume);
    this.vidRef &&
      this.vidRef.current.addEventListener("timeupdate", this.handleTime);
    if (this.props.menuOpen) {
      this.props.closeMenu();
    }
  };
  componentWillUnmount = () => {
    this.vidRef &&
      this.vidRef.current.removeEventListener("timeupdate", this.handleTime);
    this.vidRef &&
      this.vidRef.current.removeEventListener(
        "volumechange",
        this.handleVolume
      );
  };
  handleVolume = (event) => {
    this.setState({ volume: event });
  };
  handleTime = (e) => {
    const time = e.target.currentTime;
    const timecut = time.toString().substr(0, time.toString().length - 5);
    this.setState({
      time: timecut,
      duration: e.target.duration
    });
  };
  componentDidUpdate = () => {
    //if (this.props.watchingSignupVideo && !this.state.playing) {
    //  this.playVideo();
    //}
    if (!this.props.watchingSignupVideo && this.state.playing) {
      this.pauseVideo();
      this.props.signupConfirmClose();
      window.location.refresh();
    }
  };
  changeTime = (y) => {
    this.vidRef.current.currentTime = y;
    this.setState({ time: y });

    /*if(this.state.time !== this.vidRef.current.currentTime){
      this.setState({ time: this.vidRef.current.currentTime });
    }*/
  };
  playContinue = () => {
    this.setState({ closeContinue: true });
    this.playVideo();
  };
  playVideo() {
    this.vidRef.current.play();
    this.setState({ playing: true });
  }
  pauseVideo = () => {
    // Pause as well
    console.log("paused");
    this.vidRef.current.pause();
    this.setState({ playing: false });
  };
  render() {
    //console.log(this.state.time);
    //console.log(this.props.watchingSignupVideo, this.props.goSignupConfirmed);
    //var audioCtx = new window.AudioContext();
    return (
      <div
        className={
          this.props.watchingSignupVideo
            ? "signupConfirmVideo"
            : "signupConfirmHidden"
        }
      >
        <div className="hidesignup">
          <div
            onClick={this.playContinue}
            className={
              this.props.watchingSignupVideo &&
              this.props.goSignupConfirmed &&
              !this.state.closeContinue
                ? "signUpPushToplay"
                : "signUpPushToplayhidden"
            }
          >
            Sound on!!
          </div>
          <div>
            <img
              className={
                this.props.watchingSignupVideo
                  ? "alternative"
                  : "signupConfirmHidden"
              }
              src="https://www.dl.dropboxusercontent.com/s/9ctrgn3angb8zz4/Screen%20Shot%202019-10-02%20at%2011.30.21%20AM.png?dl=1"
              alt="error"
            />
            <video
              ref={this.vidRef}
              id="background-video"
              playsInline
              className="signupvideo"
            >
              <source
                src="https://www.dl.dropboxusercontent.com/s/7v6evlb9l9g5q8j/Thumbprint%2030.mp4?dl=1"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            {this.state.playing ? (
              <button
                className="playpausebutton"
                onClick={this.pauseVideo.bind(this)}
              >
                &#10074;&nbsp;&#10074;
              </button>
            ) : (
              <button
                className="playpausebutton"
                onClick={this.playVideo.bind(this)}
              >
                &nbsp;&#9658;
              </button>
            )}
            <div className="videoscroller">
              {this.state.time !== 0 ? this.state.time : null}
              <Slider
                axis="y"
                ymax={this.state.duration}
                y={this.state.time}
                onChange={({ y }) => {
                  this.setState((state) => ({ /*...state, */ y, time: y }));
                  this.changeTime(y);
                  /*this.props.scrollingRadius()
              this.setState({scrollingRadius: true}, () => {
                setTimeout(() => { this.setState({scrollingRadius: false})
               }, 1000);
              })*/
                }}
              />
            </div>

            <div
              className="closesignupvideobutton"
              onClick={
                () =>
                  //window.location.pathname !== "/login"
                  this.props.signupConfirmClose()
                //: window.location.reload()
              }
            >
              close
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignupConfirm;
