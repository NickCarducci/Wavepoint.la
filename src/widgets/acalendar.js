import { localize } from "../components/Calendar";

export const getLastMonth = (month, year) => {
  const lastMonth = month - 1 > -1 ? month - 1 : 11;
  const lastMonthYear = month - 1 > -1 ? year : year - 1;

  return { lastMonth, lastMonthYear };
};

export const getNextMonth = (month, year) => {
  const nextMonth = month + 1 < 12 ? month + 1 : 0;
  const nextMonthYear = month + 1 < 12 ? year : year + 1;

  return { nextMonth, nextMonthYear };
};
export const getMonthDays = (
  month = new Date(localize).getMonth(), //func default, localize
  year = new Date(localize).getFullYear() //for Date construction
) => {
  const months30 = [3, 5, 8, 10];
  const leapYear = year % 4 === 0;
  return month === 1
    ? leapYear
      ? 29
      : 28
    : months30.includes(month)
    ? 30
    : 31;
};
export const layCalendar = (month, year) => {
  const daysPrior = new Date(year, month, 1, 0, 0, 0, 0).getDay();
  const { lastMonth, lastMonthYear } = getLastMonth(month, year);
  const { nextMonth, nextMonthYear } = getNextMonth(month, year);
  const lastMonthDays = getMonthDays(lastMonth, lastMonthYear);
  const days = getMonthDays(month, year);
  const priorDays = {};
  for (let x = 0; x < daysPrior; x++)
    priorDays[daysPrior - x] = new Date(
      lastMonthYear,
      lastMonth,
      lastMonthDays - x,
      0,
      0,
      0,
      0
    );
  const theseDays = {};
  for (let x = 0; x < days; x++) {
    theseDays[x] = new Date(year, month, x + 1, 0, 0, 0, 0);
  }
  const daysFollowing = 6 - new Date(year, month, days, 0, 0, 0, 0).getDay();
  const nextDays = {};
  for (let x = 0; x < daysFollowing; x++) {
    nextDays[x] = new Date(nextMonthYear, nextMonth, x + 1, 0, 0, 0, 0);
  }

  var calendardays = [
    ...Object.values(priorDays),
    ...Object.values(theseDays),
    ...Object.values(nextDays)
  ];

  var firstDay = new Date(
    lastMonthYear,
    lastMonth,
    lastMonthDays,
    0,
    0,
    0,
    0
  ).setHours(0, 0, 0, 0);

  var lastDay = new Date(year, month, days, 0, 0, 0, 0).setHours(0, 0, 0, 0);

  return {
    firstDay,
    lastDay,
    calendardays
  };
};
/*const zeroPad = (num) => {
  var res = "0";
  if (String(num).length === 1) {
    res = `0${num}`;
  } else {
    res = num;
  }
  return res;
};*/
const returnNotesWithDates = (
  notesInput,
  priorDates,
  forwardDates,
  today,
  first
) => {
  let noteList = [];
  let noteTitles = [];
  let notes = Object.values({ ...notesInput });
  notes.map((x) => {
    noteTitles.push(x.message);
    return noteList.push(String(x._id));
  });

  let notesWithDates = Object.values({ ...notes });
  priorDates.map((x) =>
    notesWithDates.push({
      date: x
    })
  );
  if (1 !== today.getDate()) {
    notesWithDates.push({
      date: today
    });
  }

  notesWithDates.push({
    date: first
  });
  forwardDates.map((x) =>
    notesWithDates.push({
      date: x
    })
  );
  notesWithDates.sort((a, b) => new Date(a.date) - new Date(b.date));
  return { notesWithDates, noteList, noteTitles };
};

export const gotoPreviousMonth = (month, year) => {
  var lastMonth = month - 1 > -1 ? month - 1 : 11;
  var lastMonthYear = month - 1 > -1 ? year : year - 1;
  return {
    month: lastMonth,
    year: lastMonthYear,
    e: [
      new Date(lastMonthYear, lastMonth, 1, 0, 0, 0, 0).getTime(),
      new Date(
        lastMonthYear,
        lastMonth,
        getMonthDays(lastMonth, lastMonthYear),
        0,
        0,
        0,
        0
      ).getTime()
    ]
  };
};

export const gotoNextMonth = (month, year) => {
  var nextMonth = month + 1 < 12 ? month + 1 : 0;
  var nextMonthYear = month + 1 < 12 ? year : year + 1;

  return {
    month: nextMonth,
    year: nextMonthYear,
    e: [
      new Date(nextMonthYear, nextMonth, 1, 0, 0, 0, 0).getTime(),
      new Date(
        nextMonthYear,
        nextMonth,
        getMonthDays(nextMonth, nextMonthYear),
        0,
        0,
        0,
        0
      ).getTime()
    ]
  };
};

export const handlePreviousDay = (chosen) => {
  const today = chosen.getDate();
  const thismonth = chosen.getMonth();
  const thisyear = chosen.getFullYear();
  let yesterday, yesterdayMonth, yesterdayYear;

  if (today > 1) {
    yesterday = today - 1;
    yesterdayMonth = thismonth;
    yesterdayYear = thisyear;
  } else {
    yesterday = getMonthDays(yesterdayMonth, yesterdayYear);
    yesterdayMonth = thismonth - 1 > -1 ? thismonth - 1 : 11;
    yesterdayYear = thismonth - 1 > -1 ? thisyear : thisyear - 1;
  }

  return {
    chosen: new Date(yesterdayYear, yesterdayMonth, yesterday, 0, 0, 0, 0),
    year: yesterdayYear,
    month: yesterdayMonth
  };
};
export const handleNextDay = (chosen) => {
  const today = chosen.getDate();
  const thismonth = chosen.getMonth();
  const thisyear = chosen.getFullYear();
  let tomorrow, tomorrowMonth, tomorrowYear;

  if (today < getMonthDays(thismonth, thisyear)) {
    tomorrow = today + 1;
    tomorrowMonth = thismonth;
    tomorrowYear = thisyear;
  } else {
    tomorrow = 1;
    tomorrowMonth = thismonth + 1 < 12 ? thismonth + 1 : 0;
    tomorrowYear = thismonth + 1 < 12 ? thisyear : thisyear + 1;
  }
  return {
    chosen: new Date(tomorrowYear, tomorrowMonth, tomorrow, 0, 0, 0, 0),
    year: tomorrowYear,
    month: tomorrowMonth
  };
};
export const isSameDay = (date, dte) => {
  const basedateDate = dte.getDate();
  const basedateMonth = dte.getMonth();
  const basedateYear = dte.getFullYear();

  const dateDate = date.getDate();
  const dateMonth = date.getMonth();
  const dateYear = date.getFullYear();

  return (
    basedateDate === dateDate &&
    basedateMonth === dateMonth &&
    basedateYear === dateYear
  );
};

var priorDates = [];
var dO = new Date();
const ind = [dO.getFullYear(), dO.getMonth(), dO.getDate(), 0, 0, 0, 0];
var before = new Date(...ind); //fulcrum
for (let loop = 100; loop > 0; loop--) {
  var last = new Date(before);
  const month = last.getMonth();
  const year = last.getFullYear();
  const yesterdayMonth = month - 1 > -1 ? month - 1 : 11;
  const yesterdayYear = month - 1 > -1 ? year : year - 1;

  before = new Date(yesterdayYear, yesterdayMonth, 1, 0, 0, 0, 0).setHours(
    0,
    0,
    0,
    0
  );
  priorDates.push(before);
}
export const getPriorDates = () => priorDates;
var after = new Date(...ind); //fulcrum2
var forwardDates = [];
for (let loop = 100; loop > 0; loop--) {
  var next = new Date(after);
  const month = next.getMonth();
  const year = next.getFullYear();
  const nextMonth = month + 1 < 12 ? month + 1 : 0;
  const nextMonthYear = month + 1 < 12 ? year : year + 1;

  after = new Date(nextMonthYear, nextMonth, 1, 0, 0, 0, 0).setHours(
    0,
    0,
    0,
    0
  );
  forwardDates.push(after);
}
export const getForwardDates = () => forwardDates;

const checkDate = (a) =>
  a.date.seconds
    ? a.date.seconds * 1000
    : isNaN(a.date)
    ? new Date(a.date).getTime()
    : a.date;
export const hydrateDates = (calendarWithDates) => {
  priorDates.map((x) =>
    calendarWithDates.push({
      date: x
    })
  );
  forwardDates.map((x) =>
    calendarWithDates.push({
      date: x
    })
  );

  return calendarWithDates.sort(
    (a, b) => new Date(checkDate(a)) - new Date(checkDate(b))
  );
};

export const sortDates = (calByRecipient, notesWithDates) => {
  let calendar = [];
  let calendarFlat = Object.values(calByRecipient).map((x) =>
    calendar.concat(x)
  );
  var calendarWithDates = [...calendarFlat];

  return {
    calendar: hydrateDates(calendarWithDates),
    plansWithCalendar: [...notesWithDates, ...calendarFlat]
  };
};
export const handleInvites = (notesWithDates, invites) => {
  var invitesWithDates = [...invites];
  var plansWithInvites = [...notesWithDates, ...invites];

  return {
    plansAlone: hydrateDates(invitesWithDates),
    invites,
    plansWithInvites
  };
};

var today = new Date(dO.setHours(0, 0, 0, 0));
var first = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
export const notesOutput = (notes) =>
  returnNotesWithDates(notes, priorDates, forwardDates, today, first);

export const CALENDAR_MONTHS = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec"
};

export const WEEK_DAYS = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday"
};
