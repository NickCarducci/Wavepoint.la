import React from "react";
import Files from "./Files";

class Private extends React.Component {
  state = {};
  componentDidMount = () => {
    //this.props.openFullScreen && this.props.auth !== undefined && this.fetchf();
  };
  fetchf = () => {
    var folderReference = `personalCaptures/${this.props.auth.uid}`;
    this.props.getFolders(folderReference);
    var pathReference = `${folderReference}/${"*"}`;
    this.props.getVideos(pathReference);
    this.setState({ gotVideos: true });
  };
  render() {
    return (
      <div
        style={
          this.props.openFullScreen
            ? {
                top: `${this.props.top ? this.props.top : 0}px`,
                position: "fixed",
                width: "100%",
                height: "100%"
              }
            : {
                height: "min-content"
              }
        }
      >
        {this.props.folders && this.props.folders.includes("*") && (
          <select
            value={this.state.videoFolder}
            onChange={(e) => {
              var videoFolder = e.target.value;
              this.setState({ videoFolder });
              var folderReference = `personalCaptures/${this.props.auth.uid}`;
              var pathReference = `${folderReference}/${this.state.videoFolder}`;
              this.props.getVideos(pathReference);
            }}
            style={{ width: "100%" }}
          >
            {this.props.folders.map((x) => {
              return <option key={x}>{x}</option>;
            })}
          </select>
        )}
        {this.props.videos && (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <Files
              showStuff={true}
              collection={this.props.collection}
              unloadGreenBlue={this.props.unloadGreenBlue}
              loadGreenBlue={this.props.loadGreenBlue}
              topic={this.props.topic}
              getUserInfo={this.props.getUserInfo}
              auth={this.props.auth}
              entityId={this.props.entityId}
              entityType={this.props.entityType}
              videos={this.props.videos}
              getVideos={this.props.getVideos}
              threadId={this.props.threadId}
              inCloud={true}
            />
          </div>
        )}
        {!this.props.videos && !this.state.gotVideos ? (
          <div
            style={{
              fontSize: "12px",
              margin: "10px",
              textDecoration: "underline"
            }}
            onClick={this.fetchf}
          >
            fetch (takes ~10 seconds)
          </div>
        ) : !this.props.videos ? (
          <div className="loader">loading</div>
        ) : null}

        {this.props.videos && this.props.videos.length < 0 && (
          <div style={{ margin: "5px", fontSize: "12px" }}>no files stored</div>
        )}
      </div>
    );
  }
}
export default Private;
