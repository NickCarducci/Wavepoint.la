import React from "react";

class Playback extends React.Component {
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
              var width = (this.props["videos" + i] / totalDuration) * 300;
              return (
                <div
                  onMouseEnter={() => {
                    this.setState({ ["hoverVideoPart" + i]: true });
                  }}
                  onMouseLeave={() =>
                    this.setState({ ["hoverVideoPart" + i]: false })
                  }
                  key={i}
                  style={{
                    borderRadius: "8px",
                    opacity: ".5",
                    display: "flex",
                    height: "15px",
                    width,
                    backgroundColor: "rgb(150,200,250)",
                    color: "white"
                  }}
                >
                  <video
                    //ref={this.ref}
                    src={x.url}
                    style={{
                      zIndex: "6",
                      position: "absolute",
                      width: "20px",
                      display: this.state["hoverVideoPart" + i]
                        ? "flex"
                        : "none"
                    }}
                  />
                </div>
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
  <Playback {...props} video2={ref} />
));
