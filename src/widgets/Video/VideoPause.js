import React from "react";
import Cloud from ".././Cloud";

class VideoPause extends React.Component {
  state = {};
  render() {
    var { videos, stream, recording, live, openFolder } = this.props;
    if (videos)
      return (
        <div
          style={{
            margin: stream ? "10px" : "0px",
            minHeight: stream && recording ? "56px" : "0px"
          }}
        >
          {!stream ? (
            !openFolder ? (
              <div
                onClick={this.props.toggleFolder}
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
            ) : (
              <Cloud
                collection={this.props.collection}
                unloadGreenBlue={this.props.unloadGreenBlue}
                loadGreenBlue={this.props.loadGreenBlue}
                getUserInfo={this.props.getUserInfo}
                storageRef={this.props.storageRef}
                topic={this.props.topic}
                //
                threadId={this.props.threadId}
                close={this.props.toggleFolder}
                isPost={true}
                inPrivate={true}
                getVideos={this.props.getVideos}
                getFolders={this.props.getFolders}
                folders={this.props.folders}
                videos={this.props.videosAll}
                user={this.props.user}
                auth={this.props.auth}
                entityType={this.props.entityType}
                entityId={this.props.entityId}
              />
            )
          ) : null}
          {!stream && (
            <span
              onClick={this.props.openFolderNow}
              //folder
              style={{
                display: openFolder ? "none" : "flex",
                left: "10px",
                position: "absolute",
                top: "35px"
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
            {stream && !live ? (
              recording ? (
                <div onClick={this.props.pauseRecording}>
                  <b>|</b>
                  <b>|</b>
                </div>
              ) : (
                <div
                  onMouseEnter={() => this.setState({ hoverRec: true })}
                  onMouseLeave={() => this.setState({ hoverRec: false })}
                  //record
                  onClick={this.props.record}
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
          {stream && !live && videos.length === 0 && !recording && (
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
              onClick={this.props.cancel}
            >
              cancel
            </div>
          )}
          {stream && !recording && !live && videos.length > 0 && (
            <div
              style={{
                display: "flex",
                right: "0px",
                position: "absolute"
              }}
              onClick={this.props.delete}
            >
              delete
            </div>
          )}
        </div>
      );
  }
}
export default VideoPause;
