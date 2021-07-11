import React from "react";
import DayCalPlanArcs from "./DayCalPlanArcs";

class DayCalAccessories extends React.Component {
  render() {
    const { diffDays, change } = this.props;
    return (
      <div className="containplans">
        <div
          style={
            diffDays < 1
              ? { display: "none" }
              : {
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%,-50%)",
                  backgroundColor: "rgba(28,124,132,.4)",
                  border: "rgba(28,124,132,.1) 8px solid",
                  borderRadius: "50%",
                  width: change,
                  height: change
                }
          }
        />
        <div className="placePlansOnClock">
          <DayCalPlanArcs
            communities={this.props.communities}
            height={this.props.height}
            width={this.props.width}
            notes={this.props.notes}
            invites={this.props.invites}
            schedule={this.props.schedule}
            chosen={this.props.chosen}
            datecelestial={this.props.datecelestial}
            plansShowing={this.props.plansShowing}
            inviteInitial={this.props.inviteInitial}
            //
            events={this.props.events}
            eventsInitial={this.props.eventsInitial}
            edmInitial={this.props.edmInitial}
            //freeSpace={true}
            calendarInitial={this.props.calendarInitial}
          />
        </div>
      </div>
    );
  }
}
export default DayCalAccessories;
