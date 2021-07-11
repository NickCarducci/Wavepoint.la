import React from "react";
import { Link, withRouter } from "react-router-dom";
import Private from "./Private";
import Upload from "./Upload";

class Cloud extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openFrom: "Upload"
    };
  }
  render() {
    return (
      <div
        style={{
          display: "flex",
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
            onClick={() => this.setState({ openFrom: "Upload" })}
            style={{
              color: this.state.openFrom === "Upload" ? "black" : "grey",
              fontSize: "17px",
              textDecoration:
                this.state.openFrom === "Upload" ? "underline" : "none"
            }}
          >
            Upload
          </div>
          <div
            onClick={() => this.setState({ openFrom: "Cloud" })}
            style={{
              color: this.state.openFrom === "Cloud" ? "black" : "grey",
              fontSize: "17px",
              textDecoration:
                this.state.openFrom === "Cloud" ? "underline" : "none"
            }}
          >
            Private Cloud
          </div>
          <div
            style={{ color: "grey" }}
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
                this.props.close();
              }
            }}
          >
            &times;
          </div>
          {this.props.user !== undefined && (
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
          )}
        </div>
        {this.state.openFrom === "Upload" && (
          <Upload
            getUserInfo={this.props.getUserInfo}
            storageRef={this.props.storageRef}
            getVideosAndFolds={(pathReference, folderReference) => {
              this.setState({ openFrom: "Cloud" });
              this.props.getVideos(pathReference);
              this.props.getFolders(folderReference);
            }}
            videos={this.props.videos}
            auth={this.props.auth}
            getVideos={(pathReference) => {
              this.setState({ openFrom: "Cloud" });
              this.props.getVideos(pathReference);
            }}
            getFolders={this.props.getFolders}
          />
        )}
        {this.state.openFrom === "Cloud" && this.props.auth !== undefined ? (
          <Private
            collection={this.props.collection}
            openFullScreen={false}
            unloadGreenBlue={this.props.unloadGreenBlue}
            loadGreenBlue={this.props.loadGreenBlue}
            topic={this.props.topic}
            inCloud={this.props.inCloud}
            auth={this.props.auth}
            videos={this.props.videos}
            folders={this.props.folders}
            getVideos={this.props.getVideos}
            getFolders={this.props.getFolders}
            threadId={this.props.threadId}
            entityType={this.props.entityType}
            entityId={this.props.entityId}
          />
        ) : null}
      </div>
    );
  }
}

export default withRouter(Cloud);
