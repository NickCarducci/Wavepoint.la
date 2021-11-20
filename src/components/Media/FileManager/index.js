import React from "react";
import { Link } from "react-router-dom";
//import Folder from "../Recorder/Store";
//import Events from "../Explore/Events";

export const THIS_YEAR = new Date().getFullYear();
export const THIS_MONTH = new Date().getMonth() + 1;

export const CALENDAR_MONTHS = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec"
};

export const WEEK_DAYS = {
  0: "S",
  1: "M",
  2: "T",
  3: "W",
  4: "T",
  5: "F",
  6: "S"
};
export const WEEK_DAYSs = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday"
};
export const CALENDAR_WEEKS = 6;

class FileManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date().toLocaleDateString() };
  }
  render() {
    return (
      <div
        style={{
          display: "flex",
          position: "fixed",
          top: "0px",
          width: "100%",
          bottom: "0px",
          overflowY: "auto",
          overflowX: "hidden",
          backgroundColor: "white",
          userSelect: "none"
        }}
      >
        <div>
          {/*<Folder
            top={56}
            openFullScreen={true}
            unloadGreenBlue={this.props.unloadGreenBlue}
            loadGreenBlue={this.props.loadGreenBlue}
            topic={false}
            auth={this.props.auth}
            videos={this.props.videos}
            folders={this.props.folders}
            getVideos={this.props.getVideos}
            getFolders={this.props.getFolders}
            threadId={``} //`${collection + parent.id}`
            entityType={"users"}
            entityId={null}
            getUserInfo={this.props.getUserInfo}
          />*/}
        </div>
        <div style={{ width: "min-content", padding: "10px" }}>
          {this.state.date}
        </div>
        <Link to="/" style={{ width: "min-content", padding: "10px" }}>
          &times;
        </Link>
      </div>
    );
  }
}

export default FileManager;
