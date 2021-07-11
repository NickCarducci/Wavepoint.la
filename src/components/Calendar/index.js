import React from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import firebase from "../.././init-firebase";
import PlannerHeader from "./PlannerHeader";
import PlanObject from "./Invites/PlanObject";
import Day from "./Day";
import Month from "./Month";
import Sidebar from "./Sidebar";
import imagesl from ".././SwitchCity/Community/standardIMG.jpg";

import "./Day/DayCalBackdrop.css";
import {
  handlePreviousDay,
  handleNextDay,
  isSameDay,
  handleInvites,
  sortDates,
  layCalendar,
  gotoPreviousMonth,
  gotoNextMonth,
  getMonthDays,
  notesOutput,
  hydrateDates,
  CALENDAR_MONTHS,
  WEEK_DAYS
} from "../../widgets/acalendar";

export const localize = new Date().setHours(0, 0, 0, 0);
class Calendar extends React.Component {
  constructor(props) {
    super(props);

    const { noteList, noteTitles, notesWithDates } = notesOutput(props.notes);
    this.state = {
      calByRecipient: {},
      noteList,
      noteTitles,
      notes: props.notes,
      notesWithDates,
      plansAlone: notesWithDates,
      plansWithInvites: notesWithDates,
      //
      viewSet: "cloud",
      stillHidden: false,
      recipients: [],
      opened: [],
      calendar: props.calendarInitial ? [] : null,
      freeTime: props.bookInitial ? true : false,
      batterUp: true,
      monthCalOpen: props.calendarInitial ? "month" : false,
      search: "",
      invites: [],
      schedule: [],
      calendardays: [],
      datecelestial: new Date(),
      chosen: new Date(props.queriedDate),
      month: new Date(props.queriedDate).getMonth(),
      year: new Date(props.queriedDate).getFullYear()
    };

    this.todayRef = React.createRef();
    notesWithDates.map((x) => (this[x._id] = React.createRef()));
  }
  switchPlansShowing = () =>
    !this.props.planInitial &&
    this.setState({ plansShowing: !this.state.plansShowing });
  updateSearch = (event) =>
    this.setState({ search: event.target.value.substr(0, 20) });
  componentWillUnmount = () => {
    setInterval(this.searchStop);
  };

  loadDataSource = (
    eventsInitial,
    bookInitial,
    sdInitial,
    calendarInitial,
    notesWithDates
  ) => {
    if (eventsInitial) {
      //city-based
      this.handleEvents(notesWithDates, this.props.events);
    } else if (bookInitial) {
      //personal
      this.props.match.params.id && this.handleBook(notesWithDates);
    } else if (calendarInitial) {
      //group (entity-chat)
      this.handleCal(notesWithDates);
    } else if (sdInitial) {
      //entity-schedule
      const d = window.location.pathname.split("/sd/")[1];
      if (d) {
        this.handleSchedule(d, notesWithDates);
      } else window.alert(`url path must be /sd/entity/id for schedule`);
    } else {
      const inv = handleInvites(notesWithDates);

      this.setState({
        plansAlone: inv.plansAlone,
        invites: inv.invites,
        plansWithInvites: inv.plansWithInvites
      });
    }
  };
  componentDidMount = () => {
    const {
      location,
      calendarInitial,
      eventsInitial,
      bookInitial,
      sdInitial
    } = this.props;
    if (this.state.notesWithDates) {
      if (!calendarInitial && window.location.pathname === "/calendar")
        this.props.history.push("/invites");

      this.loadDataSource(
        eventsInitial,
        bookInitial,
        sdInitial,
        calendarInitial,
        this.state.notesWithDates
      );
    }
    //
    if (
      location.state &&
      location.state.monthCalOpen &&
      !this.state.monthCalOpen
    )
      this.setState({ monthCalOpen: true, dayCalOpen: false });
    this.searchStop = setInterval(() => {
      this.setState({ datecelestial: new Date() });
    }, 15000);
    const { month, year } = this.state;
    var f = layCalendar(month, year);
    f.lastMonth = month;
    f.lastYear = year;
    f && this.setState(f);
  };
  componentDidUpdate = (prevProps) => {
    const {
      eventsInitial,
      bookInitial,
      sdInitial,
      calendarInitial,
      notes
    } = this.props;
    if (notes !== prevProps.notes) {
      const { noteList, noteTitles, notesWithDates } = notesOutput(
        this.props.notes
      );
      this.setState(
        {
          noteList,
          noteTitles,
          notesWithDates,
          plansWithInvites: notesWithDates,
          plansOpen: notesWithDates
        },
        () =>
          this.loadDataSource(
            eventsInitial,
            bookInitial,
            sdInitial,
            calendarInitial,
            this.state.notesWithDates
          )
      );
    }
    const {
      calByRecipient,
      notesWithDates,
      month,
      year,
      lastMonth,
      lastYear
    } = this.state;
    if (month !== lastMonth || year !== lastYear) {
      var f = layCalendar(month, year);
      f.lastMonth = month;
      f.lastYear = year;
      f && this.setState(f);
    }
    if (notesWithDates && calByRecipient !== this.state.lastCalendar) {
      this.setState({ lastCalendar: calByRecipient }, () => {
        clearTimeout(this.setCalendar);
        this.setCalendar = setTimeout(() => {
          const { calendar, plansWithCalendar } = sortDates(
            calByRecipient,
            notesWithDates
          );
          this.setState({
            calendar,
            plansWithCalendar
          });
        });
      });
    }
  };
  handleBook = async (notesWithDates) => {
    var profileId = this.props.match.params.id;
    var profile = await this.props.hydrateUser(profileId);
    this.setState({ profile });
    firebase
      .firestore()
      .collection("calendar")
      .where("authorId", "==", this.props.match.params.id)
      //.where("recipients", "array-contains", auth.uid)
      //.where("date", ">=", new Date())
      .get()
      .then(
        (querySnapshot) => {
          let calendar = [];
          let p = 0;
          if (querySnapshot.empty) {
            console.log("empty book for " + profile.username);
          } else
            querySnapshot.docs.forEach((doc) => {
              p++;
              if (doc.exists) {
                var foo = doc.data();
                foo.id = doc.id;
                foo.date = foo.date ? foo.date.seconds * 1000 : null;
                if (foo.date) {
                  calendar.push(foo);
                }
              }
            });

          if (p === querySnapshot.docs.length) {
            var calendarWithDates = [...calendar];

            this.setState({
              calendar: hydrateDates(calendarWithDates),
              plansWithCalendar: [...notesWithDates, ...calendar]
            });
          }
        },
        (e) => console.log(e.message)
      );
  };
  handleSchedule = async (d, notesWithDates) => {
    const entityCollection = d.split("/")[0];
    const id = d.split("/")[1];

    var entity = await this.hydrateEntity(id, entityCollection);
    if (entity) {
      let p = 0;
      let schedule = [];
      this.setState({ entityCollection, entityId: id });
      firebase
        .firestore()
        .collection("planner")
        .where("entityId", "==", id)
        .where("entityType", "==", entityCollection)
        .onSnapshot((querySnapshot) => {
          if (querySnapshot.empty) {
          } else
            querySnapshot.docs.forEach((doc) => {
              p++;
              if (doc.exists) {
                var foo = doc.data();
                foo.id = doc.id;
                schedule.push(foo);
              }
            });

          if (querySnapshot.docs === p) {
            var scheduleWithDates = [...schedule];

            this.setState({
              schedule: hydrateDates(scheduleWithDates),
              plansWithSchedule: [...notesWithDates, ...schedule]
            });
          }
        });
      var members = entity.members ? entity.members : [];
      var admin = entity.admin ? entity.admin : [];
      entity.recipients = [...members, ...admin, entity.authorId];
      var recipients = new Set(entity.recipients);
      const e = this.hydrateCalendar(recipients);
      this.setState({
        calendar: e.calendar,
        plansWithCalendar: e.plansWithCalendar,
        recipients,
        entity: entity
      });
    }
  };
  handleCal = (notesWithDates) => {
    var threadId =
      this.props.entityType +
      this.props.entityId +
      this.props.recipients.sort();
    const handle = (doc, p, invites, length) => {
      p++;
      if (doc.exists) {
        var foo = doc.data();
        foo.id = doc.id;
        foo.date = foo.date ? foo.date.seconds * 1000 : null;
        if (foo.date) {
          invites.push(foo);
          if (p === length) {
            var invitesWithDates = [...invites];

            var plansWithInvites = [...notesWithDates, ...invites];

            this.setState({
              plansAlone: hydrateDates(invitesWithDates),
              invites,
              plansWithInvites
            });
          }
        }
      }
    };
    firebase
      .firestore()
      .collection("chats")
      /*.where("entityId", "==", this.state.entityId)
      .where("entityType", "==", this.state.entityType)
      .where("recipients", "==", this.props.recipients.sort())*/
      .where("threadId", "==", threadId)
      .get()
      .then(
        (querySnapshot) => {
          let invites = [];
          let p = 0;
          if (querySnapshot.empty) {
            console.log("empty");
          } else
            querySnapshot.docs.forEach((doc) =>
              handle(doc, p, invites, querySnapshot.docs.length)
            );
        },
        (e) => console.log(e.message)
      );

    const { calendar, plansWithCalendar } = this.hydrateCalendar(
      this.props.recipients
    );
    this.setState({
      calendar,
      plansWithCalendar
    });
  };
  hydrateCalendar = async (recipients) => {
    const { notesWithDates } = this.state;
    return Promise.all(
      recipients.map((authorId) =>
        firebase
          .firestore()
          .collection("calendar")
          .where("authorId", "==", authorId)
          //.where("recipients", "array-contains", auth.uid)
          //.where("date", ">=", new Date())
          .get()
          .then((querySnapshot) => {
            let calByRecipient = [];
            let p = 0;
            querySnapshot.docs.forEach((doc) => {
              p++;
              if (doc.exists) {
                var foo = doc.data();
                foo.id = doc.id;
                foo.date = foo.date ? foo.date.seconds * 1000 : null;

                if (foo.date) {
                  calByRecipient.push(foo);
                }
              }
            });
            if (!querySnapshot.empty && p === querySnapshot.docs.length) {
              return hydrateDates(calByRecipient);
            }
          })
      )
    ).then((cal) => {
      var newCal = [];
      cal.map((x) => newCal.concat(x));
      const calendar = cal.filter((x) => x);
      return {
        calendar: hydrateDates(calendar),
        plansWithCalendar: [...notesWithDates, ...calendar]
      };
    });
  };
  handleEvents = (notesWithDates, events) => {
    var invitesWithDates = [...events];

    var plansWithInvites = [...notesWithDates, ...invitesWithDates];

    this.setState({
      plansAlone: [...notesWithDates],
      invites: [...events],
      plansWithInvites: hydrateDates(plansWithInvites)
    });
  };

  backtotoday = () => {
    var chosen = new Date(localize);
    this.setState({
      chosen,
      month: chosen.getMonth(),
      year: chosen.getFullYear()
    });
  };

  gotoDate = (date) =>
    this.setState({
      monthCalOpen: "day",
      chosen: new Date(date),
      month: new Date(date).getMonth(),
      year: new Date(date).getFullYear()
    });
  render() {
    const {
      today,
      noteList,
      noteTitles,
      month,
      year,
      hoverViewCloud,
      hoverViewSave,
      viewSet,
      profile,
      plansWithCalendar,
      showSkedge,
      plansWithSchedule,
      plansWithInvites,
      plansAlone,
      datecelestial,
      chosen,
      calendardays
    } = this.state;
    var showThis = this.props.freeTime
      ? plansWithCalendar
      : showSkedge
      ? plansWithSchedule
      : viewSet === "invites"
      ? plansWithInvites
      : plansAlone;
    const {
      notes,
      invites,
      user,
      auth,
      calendarInitial,
      eventsInitial
    } = this.props;

    var todayTime = today.getTime();
    var num = Number(Math.round((chosen - todayTime) / 2453300000)); //2592000000
    var diffMonths = num > 0 ? num : num + 1;
    var saveSurely =
      (hoverViewCloud && viewSet === "cloud") ||
      (hoverViewSave && viewSet === "device");

    var isCurrent = isSameDay(new Date(datecelestial), chosen);
    var filteredPlans = notes.filter(
      (plan) =>
        new Date(plan.date).getMonth() === month &&
        new Date(plan.date).getFullYear() === year
    );
    var filteredInvites = invites.filter(
      (plan) =>
        new Date(plan.date).getMonth() === month &&
        new Date(plan.date).getFullYear() === year
    );
    return (
      <div
        style={{
          width: "100%"
        }}
      >
        {this.props.bookInitial && profile && (
          <Helmet>
            <meta
              content="text/html; charset=UTF-8"
              http-equiv="Content-Type"
            />
            {/*<meta name="twitter:card" content="player" />*/}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@viaThumbprint" />
            <meta name="twitter:title" content={`Book ${profile.name}`} />
            <meta
              name="twitter:description"
              content={`@${profile.username} calendar on  ${window.location.href}`}
            />
            <meta
              name="twitter:image"
              content={
                profile.photoThumbnail ? profile.photoThumbnail : imagesl
              }
            />
          </Helmet>
        )}
        <PlannerHeader
          communities={this.props.communities}
          hide={this.state.stillHidden}
          user={user}
          city={this.props.city}
          community={this.props.community}
          eventsInitial={eventsInitial}
          calendarInitial={calendarInitial}
          inviteInitial={this.state.viewSet === "invites"}
          sdInitial={this.props.sdInitial}
          monthCalOpener={() => {
            this.setState({
              monthCalOpen: "month"
            });
          }}
          search={this.state.search}
          updateSearch={this.updateSearch}
        />
        {/*<HoldCal
          passChosen={x => this.setState({ chosen: x })}
          notes={this.state.notesInCal}
          
          dayCalOpen={this.props.dayCalOpen}
          monthCalOpen={this.props.monthCalOpen}
          monthCalOpener={this.props.monthCalOpener}
          monthCalCloser={this.props.monthCalCloser}
          dayCalCloseMonthCalOpener={this.props.dayCalCloseMonthCalOpener}
          dayCalCloser={this.props.dayCalCloser}
        />*/}
        <Day
          communities={this.props.communities}
          eventsInitial={eventsInitial}
          switchPlansShowing={this.switchPlansShowing}
          backtotoday={this.backtotoday}
          dayCalCloseMonthCalOpener={() => {
            this.setState({
              monthCalOpen: "month"
            });
          }}
          dayCalOpener={() => {
            this.setState({
              monthCalOpen: "day"
            });
          }}
          monthCalOpener={() => {
            this.setState({
              monthCalOpen: "month"
            });
          }}
          dayCalCloser={() => {
            this.setState({
              stillHidden: false,
              monthCalOpen: null
            });
          }}
          monthCalCloser={() => {
            this.setState({
              monthCalOpen: null
            });
          }}
          closeBat={this.props.closeBat}
          openBat={this.props.openBat}
          monthCalOpen={this.state.monthCalOpen}
          notes={notes}
          invites={invites}
          schedule={this.state.schedule}
          events={this.props.events}
          datecelestial={datecelestial}
          chosen={chosen}
          handleNextDay={() => {
            const e = handleNextDay(chosen);
            this.setState({ month: e.month, year: e.year, chosen: e.chosen });
          }}
          handlePreviousDay={() => {
            const e = handlePreviousDay(chosen);
            this.setState({ month: e.month, year: e.year, chosen: e.chosen });
          }}
          gotoDate={this.gotoDate}
          isSameDay={isSameDay}
          month={this.state.month}
          year={this.state.year}
          plansShowing={this.state.plansShowing}
          inviteInitial={this.state.viewSet === "invites"}
          calendarInitial={calendarInitial}
          //date={this.state.date}
        />
        <Month
          isSameDay={isSameDay}
          communities={this.props.communities}
          auth={auth}
          eventsInitial={eventsInitial}
          entity={this.state.entity}
          sdInitial={this.props.sdInitial}
          bookInitial={this.props.bookInitial}
          membersSelected={this.state.membersSelected}
          chooseMember={(x) => {
            if (this.state.membersSelected.includes(x.id)) {
              var copy = [...this.state.membersSelected];
              copy.splice(this.state.membersSelected.lastIndexOf(x.id), 1);
              this.setState({ membersSelected: copy });
            } else {
              this.setState({
                membersSelected: [...this.state.membersSelected, x.id]
              });
            }
          }}
          freeTimeOn={() =>
            this.setState({ freeTime: true, invitesFromEntityChat: false })
          }
          freeTime={this.state.freeTime}
          invitesFromEntityOn={() =>
            this.setState({ invitesFromEntityChat: true, freeTime: false })
          }
          invitesFromEntityChat={this.state.invitesFromEntityChat}
          fromFilter={this.state.fromFilter}
          fromFilterOn={() =>
            this.setState({
              fromFilter: true,
              freeTime: false,
              invitesFromEntityChat: false
            })
          }
          fromFilterOff={() =>
            this.setState({
              fromFilter: false,
              freeTime: false,
              invitesFromEntityChat: false
            })
          }
          foundEntity={this.props.foundEntity}
          recipients={
            this.props.bookInitial
              ? profile
                ? [profile.id]
                : []
              : this.props.sdInitial
              ? this.state.recipients
              : this.props.recipients
          }
          users={this.props.users}
          calendarInitial={calendarInitial}
          offtho={this.switchPlansShowing}
          plansShowing={this.state.plansShowing}
          inviteInitial={this.state.viewSet === "invites"}
          calendardays={this.state.calendardays}
          chosen={chosen}
          month={this.state.month}
          year={this.state.year}
          isCurrent={isCurrent}
          gotoNextMonth={() => {
            const e = gotoNextMonth(month, year);
            this.setState(
              { month: e.month, year: e.year },
              () => eventsInitial && this.props.queryDate(e.e)
            );
          }}
          gotoPreviousMonth={() => {
            const e = gotoPreviousMonth(month, year);
            this.setState(
              { month: e.month, year: e.year },
              () => eventsInitial && this.props.queryDate(e.e)
            );
          }}
          diffMonths={diffMonths}
          dayCalOpener={() => {
            if (isCurrent) {
              this.todayRef.current.scrollIntoView("smooth");
            }
            this.setState({
              monthCalOpen: "day"
            });
          }}
          monthCalCloser={() =>
            this.setState({
              monthCalOpen: null
            })
          }
          monthCalOpener={() =>
            this.setState({
              monthCalOpen: "month"
            })
          }
          monthCalOpen={this.state.monthCalOpen}
          notes={notes}
          invites={invites}
          schedule={this.state.schedule}
          events={invites}
          calendar={this.state.calendar ? this.state.calendar : []}
          chooseDay={this.chooseDay}
          datecelestial={datecelestial}
          gotoDate={this.gotoDate}
        />

        <Sidebar
          refresh={() => {
            this.todayRef.current.scrollIntoView("smooth");
            var date = new Date(datecelestial);
            var month = date.getMonth();
            var year = date.getFullYear();
            this.setState({
              month,
              year
            });
            eventsInitial &&
              this.props.queryDate([
                new Date(year, month, 1, 0, 0, 0, 0).getTime(),
                new Date(
                  year,
                  month,
                  getMonthDays(month, year),
                  0,
                  0,
                  0,
                  0
                ).getTime()
              ]);
          }}
          notes={notes}
          todayTime={todayTime}
          month={this.state.month}
          year={this.state.year}
          diffMonths={diffMonths}
          calendardays={this.state.calendardays}
          lastDay={this.state.lastDay}
          firstDay={this.state.firstDay}
          gotoNextMonth={() => {
            const e = gotoNextMonth(month, year);
            this.setState(
              { month: e.month, year: e.year },
              () => eventsInitial && this.props.queryDate(e.e)
            );
          }}
          gotoPreviousMonth={() => {
            const e = gotoPreviousMonth(month, year);
            this.setState(
              { month: e.month, year: e.year },
              () => eventsInitial && this.props.queryDate(e.e)
            );
          }}
        />
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            position: "fixed",
            top: "56px",
            left: "33px",
            right: "0px",
            bottom: "0px",
            overflowY: "auto",
            overflowX: "hidden"
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              position: "relative",
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "flex-start",
              top: "0px",
              height: "min-content",
              textDecoration: "none"
            }}
          >
            {showThis.map((x, index) => {
              var id = x._id ? x._id : x.id;
              var eventDate = x.date.seconds
                ? x.date.seconds * 1000
                : isNaN(x.date)
                ? new Date(x.date).getTime()
                : x.date;

              var isEvent = x.name || x.message;
              /*var notANumber = isNaN(x.date);

              var showInvites =
                this.state.fromFilter &&
                this.state.membersSelected.includes(x.authorId) &&
                !notANumber &&
                !this.state.freeTime;
              var showPlansOk =
                showPlans ||
                (!notANumber && !this.state.fromFilter && !this.state.freeTime);
              var importedFromApi = eventsInitial && x.name;

              var showCard =
                (isEvent && showPlansOk) ||
                (this.state.plansShowing && notANumber) ||
                showInvites ||
                importedFromApi;
*/
              var today =
                (!isEvent || x.time) && Math.abs(eventDate - todayTime) < 10;
              var isthere = filteredPlans.find(
                (p) => (p._id ? p._id : p.id) === id
              );
              var isthereAsInvite = filteredInvites.find(
                (p) => (p._id ? p._id : p.id) === id
              );
              var plan = isthere || isthereAsInvite; // && showCard;
              var dateObj = !plan && new Date(eventDate);
              if (plan) {
                return (
                  <div key={index} ref={this[id]}>
                    <PlanObject
                      notes={notes}
                      auth={auth}
                      edmInitial={x.name}
                      eventsInitial={eventsInitial}
                      chooseInvite={this.props.chooseInvite}
                      onDelete={this.props.onDelete}
                      handleSave={this.props.handleSave}
                      noteList={noteList}
                      noteTitles={noteTitles}
                      note={x}
                      users={this.props.users}
                      height={this.props.height}
                      opened={this.state.opened}
                      open={(x) => this.setState({ opened: x })}
                    />
                  </div>
                );
              } else if (today) {
                return (
                  <div
                    key={index}
                    ref={this.todayRef}
                    style={{
                      color: "rgb(146, 266, 176)",
                      display: "flex",
                      position: "relative",
                      width: "100%",
                      justifyContent: "flex-start",
                      paddingLeft: "30px",
                      alignItems: "center",
                      height: "36px",
                      backgroundColor: "rgb(20,20,20)",
                      fontSize: "16px"
                    }}
                  >
                    <div
                      style={{
                        textDecoration: "underline",
                        fontSize: "16px"
                      }}
                    >
                      {CALENDAR_MONTHS[dateObj.getMonth()]}&nbsp;
                      {dateObj.getDate()},&nbsp;
                      {dateObj.getFullYear()}
                    </div>
                    <div
                      style={{
                        textDecoration: "none",
                        fontSize: "16px"
                      }}
                    >
                      &nbsp;&bull;&nbsp;today&nbsp;&bull;&nbsp;
                      {WEEK_DAYS[dateObj.getDay()]}
                    </div>
                  </div>
                );
              } else if (!x.message) {
                const show =
                  dateObj.getDate() === 1 &&
                  Math.abs(eventDate - chosen) < 1460000000;
                return (
                  <div
                    key={index}
                    onClick={this.switchPlansShowing}
                    style={{
                      display: "flex",
                      position: "relative",
                      width: "100%",
                      justifyContent: show ? "flex-start" : "center",
                      paddingLeft: "30px",
                      alignItems: "center",
                      height: show ? "56px" : "0px",
                      backgroundColor: "rgb(20,20,20)",
                      color: show ? "grey" : "rgb(20,20,20,0)",
                      transition: ".3s ease-in",
                      fontSize: show ? "15px" : "0px",
                      zIndex: show ? "1" : "-9999"
                    }}
                  >
                    {CALENDAR_MONTHS[dateObj.getMonth()]}&nbsp;
                    {dateObj.getDate()},&nbsp;
                    {dateObj.getFullYear()}&nbsp;&bull;&nbsp;
                    {this.state.viewSet === "invites" ||
                    calendarInitial ||
                    eventsInitial
                      ? filteredInvites.length
                      : filteredPlans.length}
                    &nbsp;
                    {this.state.viewSet === "invites" ||
                    calendarInitial ||
                    eventsInitial
                      ? `invite${filteredInvites.length === 1 ? "" : "s"}`
                      : `plan${filteredPlans.length === 1 ? "" : "s"}`}
                    &nbsp;
                    {this.state.viewSet === "invites"
                      ? filteredPlans.length
                      : ""}
                    &nbsp;
                    {this.state.viewSet === "invites" ||
                    calendarInitial ||
                    eventsInitial
                      ? `plan${filteredPlans.length === 1 ? "" : "s"} ${
                          this.state.plansShowing ? "" : "hidden"
                        }`
                      : null}
                  </div>
                );
              } else return null;
            })}
          </div>
          <div
            onClick={() => {
              if (user !== undefined && auth !== undefined) {
                var array = [
                  "purple",
                  "blue",
                  "green",
                  "red",
                  "orange",
                  "default"
                ];
                var next = array[array.lastIndexOf(user.backgroundColor) + 1];
                firebase
                  .firestore()
                  .collection("users")
                  .doc(auth.uid)
                  .update({
                    backgroundColor:
                      user.backgroundColor === "orange" ? array[0] : next
                  })
                  .catch((err) => console.log(err.message));
              }
            }}
            style={{
              display: "flex",
              position: "relative",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              backgroundColor:
                user !== undefined && user.backgroundColor
                  ? user.backgroundColor === "purple"
                    ? "rgba(40,20,60,.3)"
                    : user.backgroundColor === "blue"
                    ? "rgba(20,20,60,.3)"
                    : user.backgroundColor === "green"
                    ? "rgba(20,60,20,.3)"
                    : user.backgroundColor === "red"
                    ? "rgba(60,20,30,.3)"
                    : user.backgroundColor === "orange"
                    ? "rgba(40,20,20,.3)"
                    : "rgba(40,20,60,.3)"
                  : "rgba(40,20,60,.3)"
            }}
          />
          <div
            onClick={() => {
              var entry = window.prompt(
                "type either 'fill' or 'replace' " +
                  this.state.viewSet +
                  " items on " +
                  `${this.state.viewSet === "device" ? "cloud" : "device"}`
              );
              if (["replace", "fill"].includes(entry.toLowerCase())) {
                if (entry && entry.toLowerCase() === "replace") {
                  var clearDownload = window.prompt(
                    `type 'clearDownload' to move plans from ${
                      this.state.viewSet === "device"
                        ? "local storage"
                        : "cloud"
                    } (` +
                      this.props.selfvites.length +
                      `) to ${
                        this.state.viewSet === "device"
                          ? "cloud"
                          : "local storage"
                      } "Thumbprint".  WARNING: ${
                        this.state.viewSet === "device"
                          ? "CLOUD"
                          : "LOCAL STORAGE"
                      } PLANS WILL NOT BE RECOVERED`
                  );
                  if (clearDownload === "clearDownload") {
                    console.log("overwrite");
                  } else if (clearDownload) {
                    window.alert(
                      "you entered not 'clearDownload' but " + clearDownload
                    );
                  }
                } else {
                  //fill
                  var upsert = window.prompt(
                    `type 'upsert' to move plans from ${
                      this.state.viewSet === "device"
                        ? "local storage"
                        : "cloud"
                    }, updating whatever (` +
                      this.props.selfvites.length +
                      `) to ${
                        this.state.viewSet === "device"
                          ? "cloud"
                          : "local storage"
                      } "Thumbprint".  WARNING: ${
                        this.state.viewSet === "device"
                          ? "CLOUD"
                          : "LOCAL STORAGE"
                      } PLAN NOTES WILL BE OVERRIDDEN`
                  );
                  if (upsert && upsert.toLowerCase() === "upsert") {
                    console.log("hydrate");
                    if (this.state.viewSet === "device") {
                      this.props.selfvites.map((v) => {
                        var vite = notes.find((n) => n.id === v.id);
                        if (vite) {
                          var invite = notes.filter((x) => vite.id !== x.id);
                          delete invite.id;
                          return firebase
                            .firestore()
                            .collection("chats")
                            .doc(vite.id)
                            .update({
                              ...invite
                            });
                        } else return null;
                      });
                    }
                  } else if (upsert) {
                    window.alert("you entered not 'upsert' but " + upsert);
                  }
                }
              } else if (entry) {
                window.alert("you entered neither 'fill', nor 'replace'");
              }
            }}
            onMouseEnter={() =>
              this.setState({
                hoverViewCloud: this.state.viewSet === "cloud",
                hoverViewSave: this.state.viewSet === "device"
              })
            }
            onMouseLeave={() =>
              this.setState({ hoverViewCloud: false, hoverViewSave: false })
            }
            style={{
              position: "fixed",
              borderRadius: "20px",
              border: "3px solid",
              color:
                this.state.viewSet !== "atom"
                  ? saveSurely
                    ? "green"
                    : "rgb(200,200,255)"
                  : saveSurely
                  ? "black"
                  : "white",
              display: "flex",
              width: "34px",
              height: "34px",
              right: "50px",
              //transform:`translateY(${this.state.viewSet === "cloud" ? "":""})`,
              bottom: this.state.viewSet === "cloud" ? "40px" : "10px",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                this.state.viewSet !== "atom" ? "white" : "rgb(200,200,255)",
              transition: ".3s ease-in"
            }}
          >
            <i className="fas fa-atom" style={{ position: "absolute" }}></i>
          </div>
          <div
            onClick={() => {
              var dumpAll = window.prompt(
                "type 'dumpAllPlans' to delete plans on " +
                  this.state.viewSet +
                  " (" +
                  this.state.viewSet ===
                  "cloud"
                  ? this.props.selfvites.length
                  : notes.length + `)`
              );
              if (dumpAll === "dumpAllPlans") {
                console.log("purge " + this.state.viewSet);
              } else if (dumpAll) {
                window.alert("you entered not 'dumpAllPlans' but " + dumpAll);
              }
            }}
            onMouseEnter={() =>
              this.setState({
                hoverViewCloud: this.state.viewSet === "cloud",
                hoverViewSave: this.state.viewSet === "device"
              })
            }
            onMouseLeave={() =>
              this.setState({ hoverViewCloud: false, hoverViewSave: false })
            }
            style={{
              position: "fixed",
              borderRadius: "20px",
              border: "3px solid",
              color:
                this.state.viewSet !== "transfer"
                  ? saveSurely
                    ? "red"
                    : "rgb(200,200,255)"
                  : saveSurely
                  ? "black"
                  : "white",
              display: "flex",
              width: "34px",
              height: "34px",
              right: "85px",
              bottom: this.state.viewSet === "cloud" ? "40px" : "10px",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                this.state.viewSet !== "transfer"
                  ? "white"
                  : "rgb(200,200,255)",
              transition: ".46s ease-in"
            }}
          >
            <i className="fas fa-dumpster" style={{ position: "absolute" }}></i>
          </div>
          <div
            style={{
              border: "3px solid",
              flexDirection: "column",
              position: "fixed",
              display: "flex",
              borderRadius: "20px",
              backgroundColor: "white",
              width: "34px",
              height: "102px",
              right: "10px",
              bottom: "10px"
            }}
          >
            <div
              onClick={() => this.setState({ viewSet: "invites" })}
              onMouseEnter={() => this.setState({ hoverViewInvites: true })}
              onMouseLeave={() => this.setState({ hoverViewInvites: false })}
              style={{
                color:
                  this.state.viewSet !== "invites"
                    ? this.state.hoverViewInvites
                      ? "red"
                      : "rgb(200,200,255)"
                    : this.state.hoverViewInvites
                    ? "black"
                    : "white",
                display: "flex",
                borderTopRightRadius: "16px",
                borderTopLeftRadius: "16px",
                width: "34px",
                height: "34px",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  this.state.viewSet !== "invites"
                    ? "white"
                    : "rgb(200,200,255)"
              }}
            >
              <i className="fas fa-inbox" style={{ position: "absolute" }}></i>
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  width: "20px",
                  height: "20px",
                  marginLeft: "5px",
                  fontSize: "15px",
                  color: "rgb(250,220,220)",
                  borderRadius: "45px",
                  backgroundColor: "rgb(240,80,80)",
                  border: "1px solid black",
                  justifyContent: "center",
                  alignItems: "center",
                  transform: "translate(70%,-70%)"
                }}
              >
                {this.props.invites
                  ? this.props.invites.length > 9
                    ? "+"
                    : this.props.invites.length
                  : ""}
              </div>
            </div>
            <div
              onClick={() => this.setState({ viewSet: "cloud" })}
              onMouseEnter={() => this.setState({ hoverViewCloud: true })}
              onMouseLeave={() => this.setState({ hoverViewCloud: false })}
              style={{
                color:
                  this.state.viewSet !== "cloud"
                    ? this.state.hoverViewCloud
                      ? "red"
                      : "rgb(200,200,255)"
                    : this.state.hoverViewCloud
                    ? "black"
                    : "white",
                display: "flex",
                width: "34px",
                height: "34px",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  this.state.viewSet !== "cloud" ? "white" : "rgb(200,200,255)"
              }}
            >
              <i
                className="fas fa-cloud-sun-rain"
                style={{ position: "absolute" }}
              ></i>
            </div>
            <div
              onClick={() => this.setState({ viewSet: "device" })}
              onMouseEnter={() => this.setState({ hoverViewSave: true })}
              onMouseLeave={() => this.setState({ hoverViewSave: false })}
              style={{
                color:
                  this.state.viewSet !== "device"
                    ? this.state.hoverViewSave
                      ? "red"
                      : "rgb(200,200,255)"
                    : this.state.hoverViewSave
                    ? "black"
                    : "white",
                display: "flex",
                borderBottomRightRadius: "16px",
                borderBottomLeftRadius: "16px",
                width: "34px",
                height: "34px",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  this.state.viewSet !== "device" ? "white" : "rgb(200,200,255)"
              }}
            >
              <i className="far fa-save" style={{ position: "absolute" }}></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Calendar);
//Sync / # plans not backed up and on free time
