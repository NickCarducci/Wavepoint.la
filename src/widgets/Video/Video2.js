import React from "react";
import VideoBlob from "./VideoBlob";

class Video2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0
    };
  }
  componentDidUpdate = async (prevProps) => {
    if (this.props.videos !== prevProps.videos) {
      let totalDuration = 0;
      for (let i = 0; i < this.props.videos.length; i++) {
        totalDuration = totalDuration + this.props["videos" + i];
      }
      this.setState({ totalDuration });
    }
  };
  render() {
    const { videos, live, stream, play, url } = this.props;
    const { totalDuration } = this.state;
    return (
      <div
        style={{
          zIndex: "5",
          minWidth: "240px",
          display: "flex",
          position: "relative",
          justifyContent: "center",
          height: "min-content"
        }}
      >
        {stream && !live && videos.length > 0 && (
          <div
            style={{
              height: "min-content",
              opacity: "1",
              display: "flex",
              position: "relative",
              width: "300px",
              color: "white"
            }}
          >
            <div
              onClick={(e) => {
                var x = e.clientX;
                var shownTime =
                  Math.round(
                    (x / 300) * this.props.video2.current.duration * 100
                  ) / 100;
                this.props.video2.current.currentTime = shownTime;
                this.setState({ shownTime, left: x });
              }}
              style={{
                opacity: ".5",

                display: "flex",
                position: "absolute",
                height: "100%",
                width: "300px",
                backgroundColor: "white",
                color: "white"
              }}
            />
            <video
              onTimeUpdate={(e) => {
                //currentTarget
                if (play) {
                  var target = e.currentTarget;
                  var currentTime = target.currentTime;
                  this.setState({ currentTime });
                }
              }}
              //editable video
              style={{
                opacity: "1",
                display: !url ? "none" : "flex",
                position: "relative",
                width: "300px",
                backgroundColor: "white",
                color: "white"
              }}
              ref={this.props.video2}
            >
              <p>Video/Audio stream not available. </p>
            </video>
          </div>
        )}
        {stream && !live && videos.length > 0 && (
          <div
            style={{
              left: "0px",
              zIndex: "5",
              width: "300px",
              bottom: "0px",
              position: "absolute",
              display: "flex"
            }}
          >
            {videos.map((x, i) => {
              return (
                <VideoBlob
                  key={i}
                  x={x}
                  i={i}
                  duration={this.props["videos" + i]}
                  totalDuration={totalDuration}
                />
              );
            })}
          </div>
        )}
        {stream && !live && videos.length > 0 && (
          <div
            //player ticker
            style={{
              bottom: "0px",
              zIndex: "5",
              left: (this.state.currentTime / totalDuration) * 300,
              opacity: "1",

              display: "flex",
              position: "absolute",
              height: "20px",
              width: "2px",
              backgroundColor: "white",
              color: "black"
            }}
          />
        )}
        {stream && !live && videos.length > 0 && this.state.shownTime && (
          <div
            style={{
              zIndex: "5",
              left: this.state.left,
              opacity: ".5",

              display: "flex",
              position: "absolute",
              height: "min-content",
              width: "300px",
              backgroundColor: "white",
              color: "black"
            }}
          >
            {this.state.shownTime}s
          </div>
        )}
      </div>
    );
  }
}
export default React.forwardRef((props, ref) => (
  <Video2 {...props} video2={ref} />
));
