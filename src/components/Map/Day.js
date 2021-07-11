import React from "react";
import clockbordersun from ".././Icons/Images/clockbordersun.png";
//import clockbordermoon from "../.././Icons/Images/clockbordermoon.png";
import clockborderempty from ".././Icons/Images/clockborderempty.png";
import { mgetDateISO } from "./Mapp";

class Day extends React.Component {
  state = {
    isCurrent: false,
    isToday: false,
    inMonth: false
  };
  componentDidUpdate = () => {
    if (
      this.state.isToday !==
      this.props.misSameDay(this.props._date, this.props.today)
    ) {
      this.setState({
        isToday: this.props.misSameDay(this.props._date, this.props.today)
      });
    }
    if (
      this.props.current &&
      this.state.isCurrent !== true &&
      (this.props.misSameDay(this.props._date, this.props.current) ||
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() + 86400000)
        ) ||
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() + 172800000)
        ) ||
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() + 259200000)
        ) ||
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() + 345600000)
        ) ||
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() + 432000000)
        ) ||
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() + 518400000)
        ) ||
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() + 604800000)
        ) ||
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() - 86400000)
        ) ||
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() - 172800000)
        ) ||
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() - 259200000)
        ) ||
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() - 345600000)
        ))
    ) {
      this.setState({
        isCurrent: true //this.props.misSameDay(this.props._date, this.props.current)
      });
    }
    if (
      this.props.current &&
      this.state.isCurrent !== false &&
      (this.props.misSameDay(this.props._date, this.props.current) === false &&
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() + 86400000)
        ) === false &&
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() + 172800000)
        ) === false &&
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() + 259200000)
        ) === false &&
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() + 345600000)
        ) === false &&
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() + 432000000)
        ) === false &&
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() + 518400000)
        ) === false &&
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() + 604800000)
        ) === false &&
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() - 86400000)
        ) === false &&
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() - 172800000)
        ) === false &&
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() - 259200000)
        ) === false &&
        this.props.misSameDay(
          this.props._date,
          new Date(new Date(this.props.current).getTime() - 345600000)
        ) === false)
    ) {
      this.setState({
        isCurrent: false //this.props.misSameDay(this.props._date, this.props.current)
      });
    }
    if (
      this.state.inMonth !==
      this.props.misSameMonth(
        this.props._date,
        new Date([this.props.year, this.props.month, 1].join("-"))
      )
    ) {
      this.setState({
        inMonth: this.props.misSameMonth(
          this.props._date,
          new Date([this.props.year, this.props.month, 1].join("-"))
        )
      });
    }
  };
  render() {
    //const onClick = this.gotoDate(_date);
    /*
  isCurrent
    ? () => {
        console.log("clicked");
        this.gotoDate(_date);
        //this.props.monthCalCloser();
        //this.props.chooseDay(_date);
      }
    : () => {
        console.log("clickedfirst");
  this.gotoDate(_date);
        
        //this.chooseDay(_date);
      };*/

    const props = {
      index: this.props.index, //onClick,
      title: this.props._date.toDateString()
    };
    const { hour, totaldegrees } = this.props;
    return (
      <div
        className={
          this.state.isCurrent
            ? "mHighlightedCalendarDate"
            : this.state.isToday
            ? "mTodayCalendarDate"
            : this.state.inMonth
            ? "mCalendarDateNumber"
            : "mPrevPostDateNumber"
        }
        key={mgetDateISO(this.props._date)}
        {...props}
      >
        <img src={clockborderempty} className="mclockdialcal" alt="error" />
        {this.state.isToday ? (
          hour === 20 ||
          hour === 21 ||
          hour === 22 ||
          hour === 23 ||
          hour === 0 ||
          hour === 1 ||
          hour === 2 ||
          hour === 3 ||
          hour === 4 ? (
            <img
              src="https://www.dl.dropboxusercontent.com/s/tqw39uh4mcywirx/clockbordermoonmenu%20%288%29.png?dl=0"
              className="mclockbordercal"
              style={{
                transform: `rotate(${totaldegrees}deg)`
              }}
              alt="error"
            />
          ) : (
            <img
              src={clockbordersun}
              className="mclockbordercal"
              style={{
                transform: `rotate(${totaldegrees}deg)`
              }}
              alt="error"
            />
          )
        ) : null}

        <div className="mcontainplanscal">
          <div className="mplacePlansOnCal">
            {/*<this.PlanArc date={date} />*/}
          </div>
        </div>
        {this.props._date.getDate()}
      </div>
    );
  }
}
export default Day;
