import React from "react";
import TodaySun from "./TodaySun";
import TodayPlans from "./TodayPlans";

class CalendarDay extends React.Component {
  constructor(props) {
    super(props);
    var _datezero = this.props._date;
    _datezero.setHours(0, 0, 0, 0);
    let filtered = [];
    var assignments = this.props.assignments
      ? this.props.assignments.filter((x) => {
          //const isToday = isSameDay(_date, today);
          const plandate = new Date(
            x.date.seconds ? x.date.seconds * 1000 : x.date
          );
          plandate.setHours(0, 0, 0, 0);
          if (plandate.getTime() === _datezero.getTime()) {
            filtered.push(x);
          }
          return filtered;
        })
      : [];
    var schedule = this.props.schedule.filter((x) => {
      //const isToday = isSameDay(_date, today);
      const plandate = new Date(
        x.date.seconds ? x.date.seconds * 1000 : x.date
      );
      plandate.setHours(0, 0, 0, 0);
      if (plandate.getTime() === _datezero.getTime()) {
        filtered.push(x);
      }
      return filtered;
    });
    var invites = this.props.invites.filter((x) => {
      //const isToday = isSameDay(_date, today);
      const plandate = new Date(
        x.date.seconds ? x.date.seconds * 1000 : x.date
      );
      plandate.setHours(0, 0, 0, 0);
      if (plandate.getTime() === _datezero.getTime()) {
        filtered.push(x);
      }
      return filtered;
    });
    var calendar = this.props.calendar.filter((x) => {
      //const isToday = isSameDay(_date, today);
      const plandate = new Date(
        x.date.seconds ? x.date.seconds * 1000 : x.date
      );
      plandate.setHours(0, 0, 0, 0);
      if (plandate.getTime() === _datezero.getTime()) {
        filtered.push(x);
      }
      return filtered;
    });
    var thePlans = this.props.notes.filter((x) => {
      //const isToday = isSameDay(_date, today);
      const plandate = new Date(
        x.date.seconds ? x.date.seconds * 1000 : x.date
      );
      plandate.setHours(0, 0, 0, 0);
      if (plandate.getTime() === _datezero.getTime()) {
        filtered.push(x);
      }
      return filtered;
    });
    let width = window.innerWidth; // * 0.01;
    let height = window.innerHeight; // * 0.01;
    this.state = {
      thePlans,
      invites,
      calendar,
      assignments,
      schedule,
      width,
      height
    };
    this.is = React.createRef();
  }
  componentWillUnmount() {
    clearTimeout(this.resizeTimer);
    window.removeEventListener("resize", this.refresh);
  }
  refresh = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      let width = this.state.width; // * 0.01;
      let height = this.state.height; // * 0.01;
      var boxHeight = this.is.current && this.is.current.offsetHeight;
      this.setState({ boxHeight, width, height });
    }, 200);
  };
  componentDidMount = () => {
    this.refresh();
    window.addEventListener("resize", this.refresh);
  };
  getDateISO = (date = new Date()) => {
    return [
      date.getFullYear(),
      this.zeroPad(date.getMonth() + 1, 2),
      this.zeroPad(date.getDate(), 2)
    ].join("-");
  };

  zeroPad = (value, length) => `${value}`.padStart(length, "0");
  componentDidUpdate = (prevProps) => {
    if (this.props.notes !== prevProps.notes) {
      var _datezero = this.props._date;
      _datezero.setHours(0, 0, 0, 0);
      let filtered = [];
      var thePlans = this.props.notes.filter((x) => {
        //const isToday = isSameDay(_date, today);
        const plandate = new Date(
          x.date.seconds ? x.date.seconds * 1000 : x.date
        );
        plandate.setHours(0, 0, 0, 0);
        if (plandate.getTime() === _datezero.getTime()) {
          filtered.push(x);
        }
        return filtered;
      });
      this.setState({ thePlans });
    }
    if (this.props.schedule !== prevProps.schedule) {
      var _datezero0 = this.props._date;
      _datezero0.setHours(0, 0, 0, 0);
      let filtered = [];
      var schedule = this.props.schedule.filter((x) => {
        //const isToday = isSameDay(_date, today);
        const plandate = new Date(
          x.date.seconds ? x.date.seconds * 1000 : x.date
        );
        plandate.setHours(0, 0, 0, 0);
        if (plandate.getTime() === _datezero1.getTime()) {
          filtered.push(x);
        }
        return filtered;
      });
      this.setState({ schedule });
    }
    if (this.props.invites !== prevProps.invites) {
      var _datezero1 = this.props._date;
      _datezero1.setHours(0, 0, 0, 0);
      let filtered = [];
      var invites = this.props.invites.filter((x) => {
        //const isToday = isSameDay(_date, today);
        const plandate = new Date(
          x.date.seconds ? x.date.seconds * 1000 : x.date
        );
        plandate.setHours(0, 0, 0, 0);
        if (plandate.getTime() === _datezero1.getTime()) {
          filtered.push(x);
        }
        return filtered;
      });
      this.setState({ invites });
    }
    if (this.props.calendar !== prevProps.calendar) {
      var _datezero3 = this.props._date;
      _datezero3.setHours(0, 0, 0, 0);
      let filtered = [];
      var calendar = this.props.calendar.filter((x) => {
        //const isToday = isSameDay(_date, today);
        const plandate = new Date(
          x.date.seconds ? x.date.seconds * 1000 : x.date
        );
        plandate.setHours(0, 0, 0, 0);
        if (plandate.getTime() === _datezero3.getTime()) {
          filtered.push(x);
        }
        return filtered;
      });
      this.setState({ calendar });
    }
    if (this.props.assignments !== prevProps.assignments) {
      var _datezero2 = this.props._date;
      _datezero2.setHours(0, 0, 0, 0);
      let filtered = [];
      var assignments = this.props.assignments
        ? this.props.assignments.filter((x) => {
            //const isToday = isSameDay(_date, today);
            const plandate = new Date(
              x.date.seconds ? x.date.seconds * 1000 : x.date
            );
            plandate.setHours(0, 0, 0, 0);
            if (plandate.getTime() === _datezero2.getTime()) {
              filtered.push(x);
            }
            return filtered;
          })
        : [];
      this.setState({ assignments });
    }
  };
  render() {
    const { isToday, isCurrent, datecelestial } = this.props;
    const { boxHeight } = this.state;
    const yest = this.props._date < datecelestial.getTime();
    var datet = this.props._date.getDate();
    var inMonth =
      this.props.month === this.props._date.getMonth() &&
      this.props.year === this.props._date.getFullYear();

    return (
      <div
        ref={this.is}
        className={
          isCurrent
            ? "HighlightedCalendarDate"
            : isToday
            ? "TodayCalendarDate"
            : inMonth && !yest
            ? "CalendarDateNumber"
            : "PrevPostDateNumber"
        }
        onClick={() => this.props.gotoDate(this.props._date)}
      >
        {isToday && (
          <TodaySun
            height={boxHeight}
            smallplz={this.props.smallplz}
            _date={this.props._date}
            date={this.props.date}
            chosen={this.props.chosen}
            month={this.props.month}
            year={this.props.year}
            isToday={isToday}
            datecelestial={datecelestial}
          />
        )}
        {(this.state.schedule.length > 0 ||
          this.state.thePlans.length > 0 ||
          this.state.invites.length > 0 ||
          (this.props.assignments && this.props.assignments.length > 0) ||
          this.props.events.length > 0) && (
          <TodayPlans
            communities={this.props.communities}
            members={this.props.members ? this.props.members : []}
            freetime={this.props.freeTime}
            events={this.props.events}
            invitesFromEntityChat={this.props.invitesFromEntityChat}
            height={boxHeight}
            smallplz={this.props.smallplz}
            inviteInitial={this.props.inviteInitial}
            plansShowing={this.props.plansShowing}
            thePlans={this.state.thePlans}
            invites={this.state.invites}
            schedule={this.state.schedule}
            calendar={this.state.calendar}
            assignments={this.state.assignments}
            _date={this.props._date}
          />
        )}
        <div
          className={
            this.props.smallplz && boxHeight < 100
              ? "square"
              : this.props.smallplz
              ? "squaretop"
              : "square"
          }
          style={
            yest && inMonth && !isCurrent && !isToday
              ? {
                  color: "rgb(100,100,130)",
                  backgroundColor: "rgba(28,124,132,.4)",
                  border: "rgba(28,124,132,.1) 8px solid",
                  borderRadius: "100px",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "22px"
                }
              : inMonth
              ? { color: "#888", fontSize: "22px" }
              : { color: "#555", fontSize: "22px" }
          }
        >
          <div className="content">{datet}</div>
        </div>
        <div style={{ position: "absolute", bottom: "0px", fontSize: "12px" }}>
          {
            ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"][
              this.props.weekday
            ]
          }
        </div>
      </div>
    );
  }
}

export default CalendarDay;
