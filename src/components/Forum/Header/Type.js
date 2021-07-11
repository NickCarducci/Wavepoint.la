import React from "react";
import refresh from "../.././Icons/Images/refresh.png";

class Type extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          margin: "0px 14px",
          height: "56px",
          width: "56px",
          justifyContent: "center",
          alignItems: "center"
        }}
        onClick={
          this.props.subForum
            ? this.props.unSubForum
            : this.props.eventTypes
        }
      >
        {this.props.forumOpen &&
        (this.props.subForum || this.props.showFilters) ? (
          <img
            src={refresh}
            alt="error"
            style={{
              width: "26px",
              height: "26px"
            }}
          />
        ) : (
          //#333
          <div>
            <div
              style={{
                borderRadius: "6px",
                border: "1px solid rgb(50,100,250)",
                display: "flex",
                position: "relative",
                width: "33px",
                height: "3px",
                backgroundColor: "rgb(50,50,50)",
                margin: "2px 0"
              }}
            />
            <div
              style={{
                borderRadius: "6px",
                border: "1px solid rgb(50,100,250)",
                display: "flex",
                position: "relative",
                width: "30px",
                height: "3px",
                backgroundColor: "#444",
                margin: "2px 0"
              }}
            />
            <div
              style={{
                borderRadius: "6px",
                border: "1px solid rgb(50,100,250)",
                display: "flex",
                position: "relative",
                width: "35px",
                height: "3px",
                backgroundColor: "#555",
                margin: "2px 0"
              }}
            />
          </div>
        )}
      </div>
    );
  }
}
export default Type;
