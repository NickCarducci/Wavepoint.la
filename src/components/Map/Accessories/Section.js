import React from "react";
import IfEvents from "./IfEvents";

class Section extends React.Component {
  state = {};
  render() {
    const { queriedDate, commtype, tileChosen, diffDays, openCal } = this.props;
    var dateShortened =
      new Date(queriedDate).getMonth() +
      1 +
      "/" +
      new Date(queriedDate).getDate();
    return (
      <div
        style={{
          position: "absolute",
          transition: ".8s ease-out",
          transform: `translateX(${this.props.forumOpen ? -100 : 0}%)`,
          width: openCal ? "100%" : "67px"
        }}
      >
        {this.props.tileChosen === "event" && this.props.started && (
          <IfEvents
            dateShortened={dateShortened}
            current={this.props.current}
            current1={this.props.current1}
            start={this.props.start}
            queryDate={this.props.queryDate}
            setData={this.props.setData}
            started={this.props.started}
            queriedDate={queriedDate}
            diffDays={diffDays}
            openCal={openCal}
            setFoundation={this.props.setFoundation}
          />
        )}
        <div
          onMouseEnter={() => this.setState({ hoverCatalogOption: true })}
          onMouseLeave={() => this.setState({ hoverCatalogOption: false })}
          onClick={
            ["department", "classes"].includes(commtype)
              ? this.props.chooseEvents
              : () => this.props.eventTypes("tiles")
          }
          style={{
            borderBottomRightRadius: "5px",
            padding: openCal ? "0px" : "5px",
            backgroundColor: `rgba(20,20,20,${
              this.state.hoverCatalogOption ? ".9" : ".6"
            })`,
            display: "flex",
            position: "relative",
            width: openCal ? "0px" : "max-content",
            height: "min-content",
            flexDirection: "column",
            transition: ".3s ease-in",
            overflow: "hidden"
          }}
        >
          <span
            style={{
              display: "flex",
              position: "relative",
              width: "max-content",
              height: "18px",
              fontSize: "12px",
              WebkitTextStroke: "1px",
              WebkitTextStrokeColor: "#7848fa5d",
              color: "grey"
            }}
          >
            {["department", "classes"].includes(commtype) ? (
              `Back to ${tileChosen}`
            ) : (
              <i className="fas fa-calendar-day"></i>
            )}
            &nbsp;
            <b style={{ color: "rgb(120,160,255)" }}>{dateShortened}</b>
          </span>
          <span
            style={{
              fontSize: "16px",
              display: "flex",
              position: "relative",
              width: openCal ? "0px" : "max-content",
              height: "20px",
              WebkitTextStroke: ".5px",
              WebkitTextStrokeColor: "pink",
              color: "grey"
            }}
          >
            {["classes", "department"].includes(commtype)
              ? commtype
              : tileChosen}
          </span>
          <div
            style={{
              display:
                tileChosen === "event" && this.props.started ? "flex" : "none",
              position: "relative",
              color: "white",
              backgroundColor: "rgba(51, 51, 51, 0.421)",
              borderRadius: "5px"
            }}
            onClick={() => this.props.setFoundation({ openCal: !openCal })}
          >
            {openCal ? (
              <div style={{ padding: "10px" }}>&times;</div>
            ) : (
              <div style={{ padding: "10px" }}>: :</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default Section;
