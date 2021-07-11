import React from "react";

class LiveStream extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    var { videos, stream, recording } = this.props;
    return (
      <div>
        <div
          style={{
            display: "flex",
            right: "10px",
            position: "absolute",
            top: "10px"
          }}
        >
          {stream && !recording && videos.length === 0 && (
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
        {stream && (
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
            ref={this.props.video}
          >
            <p>Audio stream not available. </p>
          </video>
        )}
      </div>
    );
  }
}
export default React.forwardRef((props, ref) => (
  <LiveStream {...props} video={ref} />
));
