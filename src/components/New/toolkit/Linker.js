import React from "react";
import ReactPlayer from "react-player";
import TwitterTweetEmbed from "../../../widgets/TwitterTweetEmbed";

class Linker extends React.Component {
  state = {};
  render() {
    const { turnOnPlayer, twitterString } = this.props;
    if (!this.props.closeLinker) {
      return (
        <div
          style={{
            paddingBottom:
              this.state.setURL && !twitterString && !turnOnPlayer
                ? "6px"
                : "0px",
            width: "90%",
            left: "5px",
            position: "relative",
            height: "min-content"
          }}
        >
          <div
            style={{
              alignItems: "center",
              height: "min-content",
              display: "flex"
            }}
          >
            <input
              className="input"
              placeholder="link for widget"
              value={this.state.setURL}
              onChange={(e) => this.setState({ setURL: e.target.value })}
              style={{
                textIndent: "4px",
                border: "none",
                height: "36px"
              }}
            />
            {!this.props.settedURL ? (
              <div
                onClick={() =>
                  this.props.setUrl({ settedURL: this.state.setURL })
                }
                style={{
                  borderRadius: "14px",
                  userSelect: "none",
                  padding: "10px",
                  margin: "4px",
                  display: "flex",
                  color: "rgb(200,200,220)",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "12px",
                  width: "min-content",
                  height: "100%",
                  backgroundColor:
                    this.props.settedURL === this.state.setURL
                      ? "rgb(20,20,40)"
                      : ""
                }}
              >
                {this.props.settedURL === this.state.setURL
                  ? "Save"
                  : "Not saved"}
              </div>
            ) : (
              <div
                onClick={() => this.props.setUrl({ settedURL: false })}
                style={{
                  userSelect: "none",
                  fontSize: "20px"
                }}
              >
                &times;
              </div>
            )}
          </div>
          {twitterString && (
            <TwitterTweetEmbed key={twitterString} tweetId={twitterString} />
          )}
          {!this.state.setURL ? null : twitterString ? (
            <div id={twitterString} />
          ) : turnOnPlayer ? (
            <div
              style={{
                top: "10px",
                flexDirection: "column",
                display: "flex",
                position: "relative",
                width: "80%",
                maxWidth: "90%",

                height: "min-content"
              }}
            >
              <ReactPlayer
                width={Math.min("90vw", "700px")}
                url={this.state.settedURL}
              />
            </div>
          ) : (
            <div
              onClick={() => {
                this.setState({ setURL: "" });
                this.props.setUrl({ settedURL: false });
              }}
            >
              link not yet supported
              <br />
              Try these
              <br />
              "https://youtube.com", "https://soundcloud.com",
              "https://facebook.com", "https://vimeo.com", "https://twitch.com",
              "https://streamable.com", "https://wistia.com",
              "https://dailymotion.com", "https://mixcloud.com",
              "https://vidyard.com", "https://twitter.com"
              <br />
              or enter it as text
            </div>
          )}
        </div>
      );
    } else return null;
  }
}
export default Linker;
