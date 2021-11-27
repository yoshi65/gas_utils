const QUERY_RESERVE = 'subject:(<RESERVE MAIL TITLE>)'
const TITLE = '<EVENT TITLE>'
const LABEL = '<EVENT LABEL>'
const LOCALE_PREFIX = '<LOCALE PREFIX>'

function main() {
  pickUpMessage(QUERY_RESERVE, function (message) {
    parseReserve(message);
  });
}

function pickUpMessage(query, callback) {
  const threads = GmailApp.search(query, 0, 5);
  var label = GmailApp.getUserLabelByName(LABEL);

  for (var i in threads) {
    const thread = threads[i];
    const labels = thread.getLabels();
    var backlog = true;
    for (var j in labels) {
      if (labels[j].getName() == label.getName()) backlog = false;
    }
    if (backlog) {
      const message = thread.getMessages()[0]
      callback(message)
      label.addToThread(thread)
    }
  }
}

function createEvent(title, description, location, year, month, dayOfMonth,
  startTimeHour, startTimeMinutes, endTimeHour, endTimeMinutes) {

  const calendar = CalendarApp.getDefaultCalendar();
  const startTime = new Date(year, month, dayOfMonth, startTimeHour, startTimeMinutes, 0);
  const endTime = new Date(year, month, dayOfMonth, endTimeHour, endTimeMinutes, 0);
  const option = {
    description: description,
    location: location,
  }

  console.log("start time: " + startTime);
  console.log("end time: " + endTime);
  var calendarEvent = calendar.createEvent(title, startTime, endTime, option);
  calendarEvent.setColor(CalendarApp.EventColor.GRAY)
}

function parseReserve(message) {
  const strDate = message.getDate();
  const strMessage = message.getPlainBody();

  const regexp = RegExp(LOCALE_PREFIX + '.*', 'gi');

  const result = strMessage.match(regexp);
  if (result == null) {
    console.log("This message doesn't have info.");
    return;
  }
  const location = result[0].replace(LOCALE_PREFIX, '');

  const year = strDate.getFullYear()
  const month = strDate.getMonth()
  const dayOfMonth = strDate.getDate()
  var startTimeHour = strDate.getHours()
  var mins = strDate.getMinutes()
  if (15 < mins && mins <= 45) {
    mins = 30;
  } else if (45 < mins) {
    startTimeHour += 1;
    mins = 0;
  }
  const endTimeHour = String(Number(startTimeHour) + 2);

  createEvent(TITLE, "mailDate: " + strDate,
   location, year, month, dayOfMonth, startTimeHour, mins, endTimeHour, mins);
}
