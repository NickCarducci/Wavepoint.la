import React from "react";
import CalendarDay from "./CalendarDay";

class Calendar extends React.Component {
  render() {
    const { datecelestial, calendardays } = this.props;
    return (
      <div className="CalendarGrid">
        <div className="CalendarWeekday">Sun</div>
        <div className="CalendarWeekday">Mon</div>
        <div className="CalendarWeekday">Tue</div>
        <div className="CalendarWeekday">Wed</div>
        <div className="CalendarWeekday">Thu</div>
        <div className="CalendarWeekday">Fri</div>
        <div className="CalendarWeekday">Sat</div>
        {calendardays &&
          calendardays.map((_date, index) => {
            var weekday = _date.getDay();
            var isToday = this.props.isSameDay(_date, datecelestial);
            var isCurrent = this.props.isSameDay(_date, this.props.chosen);
            return (
              <div key={index}>
                <CalendarDay
                  communities={this.props.communities}
                  members={this.props.members}
                  freetime={this.props.freeTime}
                  invitesFromEntityChat={this.props.invitesFromEntityChat}
                  events={this.props.events}
                  weekday={weekday}
                  inviteInitial={this.props.inviteInitial}
                  plansShowing={this.props.plansShowing}
                  invites={this.props.invites}
                  schedule={this.props.schedule}
                  calendar={this.props.calendar ? this.props.calendar : []}
                  isToday={isToday}
                  isCurrent={isCurrent}
                  _date={_date}
                  assignments={this.props.assignments}
                  notes={this.props.notes}
                  chosen={this.props.chosen}
                  month={this.props.month}
                  year={this.props.year}
                  gotoDate={this.props.gotoDate}
                  datecelestial={datecelestial}
                />
              </div>
            );
          })}
      </div>
    );
  }
}
export default Calendar;
