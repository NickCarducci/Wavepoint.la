import React from "react";
import "./CalendarStyle.css";
import back777 from "../.././Icons/Images/back777.png";
import refresh from "../.././Icons/Images/refresh.png";
import Calendar from "./Calendar";
import CalendarDay from "./CalendarDay";

class Month extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assignments: [],
      height: 0,
      width: 0
      //isMonthRunning: false
    };
    this.month = React.createRef();
  }

  componentDidMount = () => {
    this.onresize();
    window.addEventListener("resize", this.onresize);
  };
  componentWillUnmount = () => {
    clearTimeout(this.resizeTimeout);
    window.removeEventListener("resize", this.onresize);
  };
  onresize = () => {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      var height = this.month.current && this.month.current.offsetHeight;
      var width = this.month.current && this.month.current.offsetWidth;
      this.setState({ height, width });
    }, 20);
  };
  render() {
    const months = {
      January: "Jan",
      February: "Feb",
      March: "Mar",
      April: "Apr",
      May: "May",
      June: "Jun",
      July: "Jul",
      August: "Aug",
      September: "Sep",
      October: "Oct",
      November: "Nov",
      December: "Dec"
    };
    const { isCurrent, diffMonths, entity } = this.props;
    var maxHeight =
      this.month.current && this.month.current.offsetHeight > 400
        ? Math.min(this.state.height * 0.8, this.state.width * 1.5)
        : "min-content";

    var filteredPlans = this.props.notes.filter((plan) => {
      var thisdate = new Date(
        plan.date.seconds ? plan.date.seconds * 1000 : plan.date
      );
      var zerodate = new Date(thisdate.setHours(0, 0, 0, 0));
      return (
        zerodate.getMonth() === this.props.month &&
        zerodate.getFullYear() === this.props.year
      );
    });
    var datecelestial = new Date(this.props.datecelestial);
    var isToday = this.props.isSameDay(this.props.chosen, datecelestial);
    var recipientProfiles = [];
    var assignments =
      this.props.invites.length > 0
        ? this.props.invites.filter(
            (x) => x.authorId === this.props.foundEntity.authorId
          )
        : [];
    return (
      <div
        ref={this.month}
        style={{
          display: "flex",
          overflowY: "auto",
          overflowX: "hidden",
          userSelect: "none",
          width: "100vw",
          height: "min-content"
        }}
      >
        <div
          className="fullcal_backdrop"
          style={{
            display: this.props.monthCalOpen === "month" ? "flex" : "none",
            height: "100vh"
          }}
          onClick={this.props.monthCalCloser}
        />
        <div
          style={{
            display: "grid",
            position:
              this.props.monthCalOpen === "month" ? "absolute" : "fixed",
            gridTemplateColumns: "1fr",
            backgroundColor: "rgba(0, 0, 0, 0.699)",
            top: "2%",
            left: "50%",
            width: "min-content",
            borderRadius: "30px",
            color: "white",
            boxShadow:
              this.props.monthCalOpen === "month"
                ? "1px 0px 7px rgba(0, 0, 0, 0.5)"
                : "none",
            transform:
              this.props.monthCalOpen === "month"
                ? "translate(-50%, 0)"
                : "translate(50%, 0%)",
            transition: "0.3s transform ease-in",
            zIndex: this.props.monthCalOpen === "month" ? "4" : "-9999",
            marginBottom: this.state.started ? "200px" : "20px",
            padding: "20px 0px"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "min-content",
              maxHeight: maxHeight,
              position: "relative",
              borderRadius: "5px",
              backgroundImage:
                "radial-gradient(rgba(255, 0, 0, 0), rgba(0, 0, 0, 0.878))"
            }}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div
              onClick={this.props.dayCalOpener}
              style={{
                display: "flex",
                position: "absolute",
                flexDirection: "row"
              }}
            >
              <div
                style={{
                  height: "56px",
                  display: "flex",
                  position: "relative"
                }}
              >
                {this.props.chosen && (
                  <CalendarDay
                    communities={this.props.communities}
                    key={this.props.chosen}
                    events={this.props.events}
                    freeTime={this.props.freeTime}
                    invitesFromEntityChat={this.props.invitesFromEntityChat}
                    smallplz={true}
                    inviteInitial={
                      this.props.inviteInitial || this.props.calendarInitial
                    }
                    plansShowing={this.props.plansShowing}
                    invites={this.props.invites}
                    schedule={this.props.schedule}
                    calendar={this.props.calendar ? this.props.calendar : []}
                    isToday={isToday}
                    isCurrent={isCurrent}
                    _date={this.props.chosen}
                    notes={this.props.notes}
                    chosen={this.props.chosen}
                    month={this.props.month}
                    year={this.props.year}
                    gotoDate={this.props.gotoDate}
                    datecelestial={datecelestial}
                  />
                )}
              </div>
              <img
                src={back777}
                className="back"
                style={{
                  display: this.state.width < 600 ? "none" : "flex",
                  position: "relative"
                }}
                onClick={this.props.dayCalOpener}
                alt="error"
              />
            </div>
            <img
              src={refresh}
              className="gototoday"
              onClick={() => this.props.gotoDate(datecelestial)}
              alt="error"
            />
            <div onClick={this.props.offtho} className="CalendarHeader">
              <div
                style={
                  this.props.plansShowing ||
                  (!this.props.inviteInitial && !this.props.calendarInitial)
                    ? {
                        position: "absolute",
                        display: "flex",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        color: "rgb(60,120,160)"
                      }
                    : {
                        position: "absolute",
                        display: "flex",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        color: "rgb(120,120,140)"
                      }
                }
              >
                {filteredPlans.length}{" "}
                {this.props.plansShowing ||
                (!this.props.inviteInitial &&
                  !this.props.calendarInitial &&
                  !this.props.calendarInitial)
                  ? `plan${filteredPlans.length === 1 ? "" : "s"} ${
                      this.props.inviteInitial || this.props.calendarInitial
                        ? "showing"
                        : ""
                    }`
                  : `hidden plan${filteredPlans.length === 1 ? "" : "s"}`}
              </div>
              <div
                onClick={this.state.offtho}
                className={
                  datecelestial.getMonth() === this.props.month &&
                  datecelestial.getFullYear() === this.props.year
                    ? "CalendarMonth"
                    : datecelestial <
                      new Date(
                        `${this.props.year}-${
                          this.props.month
                        }-${datecelestial.getDate()}`
                      )
                    ? "CalendarMonthFuture"
                    : "CalendarMonthOff"
                }
              >
                {
                  Object.keys(months)[
                    Math.max(0, Math.min(this.props.month, 11))
                  ]
                }{" "}
                {this.props.chosen.getMonth() === this.props.month &&
                this.props.chosen.getFullYear() === this.props.year
                  ? isCurrent
                    ? datecelestial.getDate()
                    : this.props.chosen.getDate()
                  : null}
                {this.props.chosen.getMonth() === this.props.month &&
                this.props.chosen.getFullYear() === this.props.year
                  ? ", "
                  : ""}
                {this.props.year}
              </div>
              <div
                style={{
                  marginTop: "-10px",
                  marginBottom: "5px",
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  color: "rgba(250,250,250,.7)"
                }}
              >
                {isCurrent && diffMonths === 0
                  ? "Today"
                  : diffMonths === 0
                  ? "This month"
                  : diffMonths < 0
                  ? `${Math.abs(diffMonths)} month${
                      diffMonths !== -1 ? "s" : ""
                    } ago`
                  : `In ${diffMonths} month${diffMonths !== 1 ? "s" : ""}`}
              </div>
            </div>
            {this.props.calendarInitial && (
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  height: "min-content",
                  width: "calc(100% - 2px)",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px white solid",
                  flexWrap: "wrap"
                }}
              >
                {this.props.entityType === "classes" && (
                  <div
                    style={{
                      display: "flex",
                      height: "56px",
                      alignItems: "center",
                      padding: "0px 20px",
                      width: "max-content"
                    }}
                  >
                    Assignments
                  </div>
                )}
                {!this.props.sdInitial && (
                  <div
                    onClick={() =>
                      !this.props.bookInitial && this.props.fromFilterOff()
                    }
                    style={
                      !this.props.fromFilter && !this.props.freeTime
                        ? {
                            display: "flex",
                            height: "56px",
                            alignItems: "center",
                            padding: "0px 20px",
                            width: "max-content",
                            textDecoration: "underline",
                            opacity: !this.props.bookInitial ? 1 : 0.3
                          }
                        : {
                            display: "flex",
                            height: "56px",
                            alignItems: "center",
                            padding: "0px 20px",
                            width: "max-content",
                            opacity: !this.props.bookInitial ? 1 : 0.3
                          }
                    }
                  >
                    Invites
                  </div>
                )}
                {this.props.sdInitial ? (
                  <div
                    onClick={() =>
                      !this.props.bookInitial && this.props.fromFilterOff()
                    }
                    style={
                      !this.props.freeTime && !this.props.invitesFromEntityChat
                        ? {
                            display: "flex",
                            height: "56px",
                            alignItems: "center",
                            padding: "0px 20px",
                            width: "max-content",
                            textDecoration: "underline",
                            opacity: !this.props.bookInitial ? 1 : 0.3
                          }
                        : {
                            display: "flex",
                            height: "56px",
                            alignItems: "center",
                            padding: "0px 20px",
                            width: "max-content",
                            opacity: !this.props.bookInitial ? 1 : 0.3
                          }
                    }
                  >
                    Events
                  </div>
                ) : (
                  <div
                    onClick={() =>
                      !this.props.bookInitial && this.props.fromFilterOn()
                    }
                    style={
                      this.props.fromFilter && !this.props.freeTime
                        ? {
                            display: "flex",
                            height: "56px",
                            alignItems: "center",
                            padding: "0px 20px",
                            width: "max-content",
                            textDecoration: "underline",
                            opacity: !this.props.bookInitial ? 1 : 0.3
                          }
                        : {
                            display: "flex",
                            height: "56px",
                            alignItems: "center",
                            padding: "0px 20px",
                            width: "max-content",
                            opacity: !this.props.bookInitial ? 1 : 0.3
                          }
                    }
                  >
                    From
                  </div>
                )}
                {this.props.sdInitial &&
                  this.props.auth !== undefined &&
                  entity &&
                  ((entity.membersSelected &&
                    entity.membersSelected.includes(this.props.auth.uid)) ||
                    (entity.admin &&
                      entity.admin.includes(this.props.auth.uid)) ||
                    (entity.authorId &&
                      entity.authorId === this.props.auth.uid)) && (
                    <div
                      onClick={() =>
                        !this.props.bookInitial &&
                        this.props.invitesFromEntityOn()
                      }
                      style={
                        this.props.invitesFromEntityChat
                          ? {
                              display: "flex",
                              height: "56px",
                              alignItems: "center",
                              padding: "0px 20px",
                              width: "max-content",
                              textDecoration: "underline",
                              opacity: !this.props.bookInitial ? 1 : 0.3
                            }
                          : {
                              display: "flex",
                              height: "56px",
                              alignItems: "center",
                              padding: "0px 20px",
                              width: "max-content",
                              opacity: !this.props.bookInitial ? 1 : 0.3
                            }
                      }
                    >
                      Invites
                      <br />
                      Members only
                    </div>
                  )}
                <div
                  onClick={this.props.freeTimeOn}
                  style={
                    this.props.freeTime
                      ? {
                          display: "flex",
                          height: "56px",
                          alignItems: "center",
                          padding: "0px 20px",
                          width: "max-content",
                          textDecoration: "underline"
                        }
                      : {
                          display: "flex",
                          height: "56px",
                          alignItems: "center",
                          padding: "0px 20px",
                          width: "max-content"
                        }
                  }
                >
                  Free Time
                </div>
              </div>
            )}
            {this.props.calendarInitial && (
              <div
                style={
                  this.props.fromFilter || this.props.freeTime
                    ? {
                        position: "relative",
                        display: "flex",
                        height: "56px",
                        maxHeight: "56px",
                        width: "calc(100% - 2px)",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px white solid",
                        zIndex: "1",
                        transition: "maxHeight .3s ease-out",
                        overflowX: "auto",
                        overflowY: "hidden"
                      }
                    : {
                        position: "relative",
                        display: "flex",
                        zIndex: "-1",
                        height: "min-content",
                        maxHeight: "0px",
                        width: "calc(100% - 2px)",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px white solid",
                        color: "rgba(0,0,0,0)",
                        transition: "maxHeight .3s ease-in",
                        overflowX: "auto",
                        overflowY: "hidden"
                      }
                }
              >
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "56px",
                    display: "flex"
                  }}
                >
                  {recipientProfiles &&
                    recipientProfiles.map((x, i) => {
                      return (
                        <div
                          key={i}
                          onClick={() => this.props.chooseMember(x)}
                          style={
                            this.props.membersSelected.includes(x.id)
                              ? {
                                  position: "relative",
                                  display: "flex",
                                  height: "56px",
                                  alignItems: "center",
                                  padding: "0px 20px",
                                  width: "max-content",
                                  textDecoration: "underline"
                                }
                              : {
                                  position: "relative",
                                  display: "flex",
                                  height: "56px",
                                  alignItems: "center",
                                  padding: "0px 20px",
                                  width: "max-content"
                                }
                          }
                        >
                          {x.username}
                        </div>
                      );
                    })}
                  <div
                    onClick={() => this.props.chooseMember(this.props.auth.uid)}
                    style={
                      true
                        ? {
                            position: "relative",
                            display: "flex",
                            height: "56px",
                            alignItems: "center",
                            padding: "0px 20px",
                            width: "max-content",
                            textDecoration: "underline"
                          }
                        : {
                            position: "relative",
                            display: "flex",
                            height: "56px",
                            alignItems: "center",
                            padding: "0px 20px",
                            width: "max-content"
                          }
                    }
                  >
                    {this.props.user !== undefined && this.props.user.username}
                  </div>
                </div>
              </div>
            )}
            <Calendar
              isSameDay={this.props.isSameDay}
              communities={this.props.communities}
              membersSelected={this.props.membersSelected}
              freetime={this.props.freeTime || this.props.fromFilter}
              events={this.props.events}
              inviteInitial={
                this.props.inviteInitial || this.props.calendarInitial
              }
              plansShowing={this.props.plansShowing}
              notes={this.props.notes}
              invites={this.props.invites}
              schedule={this.props.schedule}
              calendar={this.props.calendar ? this.props.calendar : []}
              assignments={assignments ? assignments : []}
              calendardays={this.props.calendardays}
              month={this.props.month}
              year={this.props.year}
              gotoDate={this.props.gotoDate}
              chosen={this.props.chosen}
              datecelestial={datecelestial}
            />
          </div>
          <div className="monthlyskip">
            <div
              className="monthlyl"
              onClick={this.props.gotoPreviousMonth}
              style={{ userSelect: "none" }}
              //onMouseUp={this.clearPressureTimer}
            >
              Last
              <br />
              Month
            </div>
            <div
              // to="/"
              className="closecal"
              onClick={this.props.monthCalCloser}
            >
              <div style={{ marginTop: "20px", fontSize: "15px" }}>
                <div style={{ fontSize: "10px", color: "rgb(100,100,250)" }}>
                  {new Date().toLocaleDateString()}
                </div>
                {Object.keys(months)[this.props.month]}
              </div>
              Close
            </div>
            <div
              className="monthlyr"
              onClick={this.props.gotoNextMonth}
              style={{ userSelect: "none" }}
              //onMouseUp={this.clearPressureTimer}
            >
              Next
              <br />
              Month
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Month;
