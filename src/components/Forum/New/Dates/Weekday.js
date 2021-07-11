import React from "react";

class Weekday extends React.Component {
  render() {
    const { weekdays } = this.props;
    return (
      <div
        onClick={(e) => {
          if (weekdays.includes(e.target.id)) {
            var left = weekdays.filter((x) => x !== e.target.id);
            this.props.setWeekday({ weekdays: left });
          } else {
            this.props.setWeekday({
              weekdays: [...weekdays, e.target.id]
            });
          }
        }}
        style={{
          marginTop: "10px",
          breakInside: "avoid",
          display: "flex",
          width: "284px",
          backgroundColor: "navy",
          color: "white",
          marginBottom: "15px",
          alignItems: "center",
          flexDirection: "column"
        }}
        name="weekdays"
        size="7"
      >
        <div
          style={weekdays.includes("Monday") ? {} : { color: "grey" }}
          id="Monday"
        >
          Monday
        </div>
        <div
          style={weekdays.includes("Tuesday") ? {} : { color: "grey" }}
          id="Tuesday"
        >
          Tuesday
        </div>
        <div
          style={weekdays.includes("Wednesday") ? {} : { color: "grey" }}
          id="Wednesday"
        >
          Wednesday
        </div>
        <div
          style={weekdays.includes("Thursday") ? {} : { color: "grey" }}
          id="Thursday"
        >
          Thursday
        </div>
        <div
          style={weekdays.includes("Friday") ? {} : { color: "grey" }}
          id="Friday"
        >
          Friday
        </div>
        <div
          style={weekdays.includes("Saturday") ? {} : { color: "grey" }}
          id="Saturday"
        >
          Saturday
        </div>
        <div
          style={weekdays.includes("Sunday") ? {} : { color: "grey" }}
          id="Sunday"
        >
          Sunday
        </div>
      </div>
    );
  }
}
export default Weekday;
