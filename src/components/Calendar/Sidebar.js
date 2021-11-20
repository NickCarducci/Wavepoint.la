import React from "react";
import { CALENDAR_MONTHS } from "../../widgets/acalendar";
import refresh from ".././Icons/Images/refresh.png";

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.scroll = React.createRef();
  }
  render() {
    const {
      notes,
      todayTime,
      month,
      year,
      diffMonths,
      calendardays,
      lastDay,
      firstDay
    } = this.props;
    var themeColor1 = "rgb(226, 226, 266)";
    var themeColor2 = "rgb(126, 126, 166)";
    var themeColor3 = "rgb(186, 186, 226)";
    return (
      <div
        style={{
          display: "flex",
          position: "fixed",
          top: "56px",
          width: "33px",
          height: "calc(100% - 56px)",
          flexDirection: "column",
          fontSize: "12px",
          paddingTop: "1.23263px",
          borderBottom: "5px black solid",
          background: `linear-gradient(black,${themeColor3})`
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            width: "32px",
            height: "min-content",
            flexDirection: "column",
            fontSize: "12px",
            paddingTop: "1.23263px",
            borderBottom: "5px black solid"
          }}
        >
          <img
            src={refresh}
            style={{
              display: "flex",
              position: "relative",
              width: "19px",
              fontSize: "12px",
              padding: "6.5px"
            }}
            onClick={this.props.refresh}
            alt="error"
          />
          <div
            style={{
              color: "rgb(200,200,200)",
              fontSize: "12px"
            }}
          >
            {CALENDAR_MONTHS[month]}
          </div>
          <div
            style={{
              color: "rgb(200,200,200)",
              fontSize: "12px"
            }}
          >
            {year}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            position: "relative",
            transform: "translateX(11px)",
            width: "20px",
            fontSize: "15px",
            justifySelf: "center",
            paddingTop: "4px",
            right: "2px",
            color: `rgb(170,170,170)`,
            justifyContent: "flex-end"
          }}
        >
          {diffMonths}
        </div>
        <div
          onClick={() => {
            this.scroll.current.scrollIntoView("false");
            this.props.gotoPreviousMonth();
          }}
          style={{
            display: "flex",
            position: "relative",
            backgroundColor: "black",
            width: "29px",
            height: "29px",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            border: `2.5px grey solid`
          }}
        >
          <div
            style={{
              transform: "translate(-5%,10%)"
            }}
          >
            ^
          </div>
        </div>
        <div
          style={{
            display: "flex",
            position: "relative",
            height: "calc(100% - 129px - 28px)",
            width: "50px",
            left: "0px",
            flexDirection: "column",
            textDecoration: "none",
            overflowY: "auto",
            overflowX: "hidden"
          }}
        >
          <div
            ref={this.scroll}
            style={{
              display: "flex",
              position: "absolute",
              top: "0px",
              width: "30px",
              paddingBottom: "5px",
              border: "1px solid black",
              left: "0px",
              height: "min-content",
              flexDirection: "column",
              textDecoration: "none",
              background: `linear-gradient(${themeColor1},${themeColor2})`
            }}
          >
            {calendardays.map((_date) => {
              var eventDate = _date.getTime();
              var isFirstDay = firstDay === eventDate;
              var isLastDay = lastDay === eventDate;
              var noteCount = notes.filter((x) => {
                var noteDate = x.date.seconds ? x.date.seconds * 1000 : x.date;
                return (
                  noteDate - eventDate < 86400000 &&
                  noteDate - eventDate > 0 &&
                  x.message
                );
              });
              var isToday =
                todayTime - eventDate < 86400000 && todayTime - eventDate > 0;
              var unbullet = isFirstDay || isLastDay;
              return (
                <div
                  key={_date}
                  onClick={() => {
                    this.setState({ dateChosen: eventDate });
                    const noted = notes.find(
                      (x) =>
                        x.date - eventDate > 0 && x.date - eventDate < 86400000
                    );
                    if (noted) {
                      var note = noted.constructor === Array ? noted[0] : noted;
                      var ref = note._id ? note._id : noted.id;
                      this[ref].current.scrollIntoView("smooth");
                    }
                  }}
                >
                  <div
                    style={{
                      display: unbullet ? "flex" : "none",
                      position: "relative",
                      color: "black",
                      fontSize: "12px",
                      alignSelf: "center",
                      paddingLeft: "2px"
                    }}
                  >
                    {CALENDAR_MONTHS[_date.getMonth()].toUpperCase()}
                    <br />
                    {_date.getDate()}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      color: isToday ? "blue" : "black",
                      fontSize: "15px"
                    }}
                  >
                    &#x2022;
                    {noteCount.length > 0 ? noteCount.length : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          onClick={() => {
            this.scroll.current.scrollIntoView("smooth");
            this.props.gotoNextMonth();
          }}
          style={{
            display: "flex",
            position: "relative",
            backgroundColor: "black",
            width: "29px",
            height: "29px",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            transform: "rotate(180deg)",
            border: `2.5px grey solid`
          }}
        >
          <div
            style={{
              transform: "translate(-5%,10%)"
            }}
          >
            ^
          </div>
        </div>
      </div>
    );
  }
}
export default Sidebar;
