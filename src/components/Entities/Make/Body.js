import React from "react";
import back from "../.././Icons/Images/back.png";

class Body extends React.Component {
  render() {
    const { eventInitial, entityType, submitPaused } = this.props;
    let drawerClasses = "eventsettings-drawer";
    if (this.props.eventSettingsOpen) {
      drawerClasses = "eventsettings-drawer open";
    }
    return (
      <div>
        <div className="New_EventSettings_Header">
          {submitPaused ? null : (
            <img
              src={back}
              className="backnew"
              alt="error"
              onClick={this.props.eventSettingsCloser}
            />
          )}
          {entityType}
          details
        </div>
        <div className={drawerClasses}>
          <div
            style={{
              flexDirection: "column",
              display: "flex",
              position: "absolute",
              width: "100%",
              height: "min-content"
            }}
          >
            <textarea
              type="search"
              className="event-form-details"
              name="body"
              id="body"
              rows="2"
              cols="20"
              wrap="hard"
              onChange={this.props.handleChangeBody}
              placeholder="Write details here"
              autoComplete="off"
              onFocus={() => window.scrollTo(0, 0)}
            />
            {eventInitial && (
              <div
                style={{
                  margin: "30px",
                  fontSize: "15px",
                  display: "flex",
                  position: "relative",
                  height: "min-content",
                  width: "90%",
                  top: "15px",
                  color: "grey",
                  left: "50%",
                  transform: "translateX(-50%)",
                  justifyContent: "center"
                }}
              >
                Add tickets from event edit page after you post item
                <br />
                Access this event page from your profile, or search for it
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default Body;
