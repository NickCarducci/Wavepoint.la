import React from "react";
import { Link } from "react-router-dom";
import timer from "../.././Icons/Images/timer.png";
import settings from "../.././Icons/Images/settings.png";
import back from "../.././Icons/Images/back.png";

class Accessories extends React.Component {
  render() {
    const {
      entityTypeChosen,
      hasType,
      hasTime,
      planSettingsOpen,
      submitPaused,
      eventSettingsOpen
    } = this.props;
    return (
      <div>
        {submitPaused ? null : eventSettingsOpen ? (
          <img
            onClick={this.props.eventSettingsCloser}
            src={back}
            className="backnewcreateevent"
            alt="error"
          />
        ) : (
          <Link
            to={
              (this.props.location &&
                this.props.location.state &&
                this.props.location.state.sendTitlePlan) ||
              window.location.pathname !== "/new"
                ? "/"
                : "/plan"
            }
          >
            <img src={back} className="backnewcreateevent" alt="error" />
          </Link>
        )}
        <img
          src={settings}
          className="settings"
          onClick={this.props.eventSettingsOpener}
          alt="error"
        />
        {
          //onSubmit
          (this.props.place_name || this.props.planInitial) && submitPaused ? (
            <div
              onClick={this.props.go}
              style={{
                display: "flex",
                position: "fixed",
                padding: "30px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "85%",
                marginBottom: "5px",
                borderColor: "10px #999 solid",
                cursor: "pointer",
                justifyContent: "center",
                alignItems: "center",
                bottom: "0px",
                backgroundColor: "#333",
                border: "10px rgba(255, 255, 255, 0.381) solid",
                color: "white",
                fontSize: "23px",
                borderRadius: "20px"
              }}
            >
              {hasType || entityTypeChosen ? "Choose a type" : "Submit"}
            </div>
          ) : null
        }
        {hasTime && !planSettingsOpen && (
          <img
            src={timer}
            className="timero"
            onClick={() => this.props.materialDateOpener("futureOnly")}
            alt="error"
          />
        )}
      </div>
    );
  }
}
export default Accessories;
