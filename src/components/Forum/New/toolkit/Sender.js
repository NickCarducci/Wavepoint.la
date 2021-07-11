import React from "react";
import VideoRecorder from "../../../.././widgets/Video/VideoRecorder";

class Sender extends React.Component {
  state = {};
  render() {
    const { showVideoRecorder, commtype } = this.props;
    return (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "66px",
          justifyContent: "flex-start",
          alignItems: "center",
          border: ".5px dotted grey"
        }}
      >
        {["lesson", "show", "game"].includes(commtype) && showVideoRecorder && (
          <VideoRecorder
            getVideos={this.props.getVideos}
            getFolders={this.props.getFolders}
            folders={this.props.folders}
            videos={this.props.videos}
            onDeleteVideo={this.props.onDeleteVideo}
            handleSaveVideo={this.props.handleSaveVideo}
            isPost={true}
            auth={this.props.auth}
            room={{ id: "forum" + showVideoRecorder.id }}
            threadId={`threadCaptures/${"forum" + showVideoRecorder.id}`}
            cancel={this.props.handleClose}
          />
        )}
        {commtype !== "new" && (
          <div
            style={{
              fontSize: "12px",
              marginLeft: "10px",
              display: "flex",
              position: "relative",
              width: `calc(100% - 110px)`,
              justifyContent: "flex-start"
            }}
          >
            press send to enable recorder or upload for this {commtype}
          </div>
        )}
        <button
          style={{
            userSelect: "none",
            display: "flex",
            position: "absolute",
            right: "5px",
            padding: "0px 20px",
            height: "56px",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "blue",
            color: "white",
            zIndex: "6"
          }}
          type="submit"
        >
          Send
        </button>
      </div>
    );
  }
}
export default Sender;
