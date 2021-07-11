import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

class Dates extends React.Component {
  state = {};
  render() {
    const { endDate, startDate, chooseMeets } = this.props;
    const { openDate } = this.state;
    return (
      <div>
        {openDate ? (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(e) => {
                this.props.setDates({
                  startDate: e,
                  endDate: e
                });
              }}
              onClose={() => {
                this.setState({ openDate: false });
              }}
              onOpen={() => {}}
              animateYearScrolling
              showTodayButton={true}
              disablePast={true}
            />
          </MuiPickersUtilsProvider>
        ) : (
          <div
            style={{
              border: "0px solid white",
              color: "rgb(0,30,60)",
              breakInside: "avoid",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div
              style={{
                fontSize: "14px",
                display: "flex",
                alignItems: "flex-end",
                right: "0px",
                position: "relative"
              }}
            >
              Starts&nbsp;&nbsp;
              <div
                onClick={
                  chooseMeets
                    ? () => this.props.setDates({ chooseMeets: false })
                    : () => this.setState({ openDate: true })
                }
                style={{
                  backgroundColor: "rgb(0,30,60)",
                  color: "white",
                  breakInside: "avoid",
                  padding: "5px",
                  borderRadius: "2px",
                  fontSize: "10px"
                }}
              >
                {chooseMeets ? "BACK" : "EDIT"}
              </div>
            </div>
          </div>
        )}
        {!openDate && (
          <div
            style={{
              color: "rgb(0,30,60)",
              marginBottom: "10px",
              breakInside: "avoid",
              padding: "2px 5px",
              borderRadius: "5px",
              paddingRight: "40px",
              display: "flex"
            }}
          >
            {startDate && new Date(startDate).toLocaleDateString()}
          </div>
        )}
        {startDate ? (
          this.state.openEndDate ? (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(e) => {
                  this.setState({ openEndDate: false });
                  this.props.setDates({ endDate: e });
                }}
                onClose={() => {
                  this.setState({ openEndDate: false });
                }}
                onOpen={() => {}}
                animateYearScrolling
                showTodayButton={true}
                disablePast={true}
              />
            </MuiPickersUtilsProvider>
          ) : (
            <div
              style={{
                border: "0px solid white",
                color: "rgb(0,30,60)",
                breakInside: "avoid",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "flex-end",
                  right: "0px",
                  position: "relative"
                }}
              >
                Ends&nbsp;&nbsp;
                <div
                  onClick={() => this.setState({ openEndDate: true })}
                  style={{
                    backgroundColor: "rgb(0,30,60)",
                    color: "white",
                    breakInside: "avoid",
                    padding: "5px",
                    borderRadius: "2px",
                    fontSize: "10px"
                  }}
                >
                  EDIT
                </div>
              </div>
            </div>
          )
        ) : null}
        {startDate && !this.state.openEndDate && (
          <div
            style={{
              color: "rgb(0,30,60)",
              marginBottom: "10px",
              breakInside: "avoid",
              padding: "2px 5px",
              borderRadius: "5px",
              paddingRight: "40px",
              display: "flex"
            }}
          >
            {endDate && new Date(endDate).toLocaleDateString()}
          </div>
        )}
      </div>
    );
  }
}
export default Dates;
