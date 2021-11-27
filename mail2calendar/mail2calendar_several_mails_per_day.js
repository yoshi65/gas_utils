const QUERY_RESERVE = 'subject:(<RESERVE MAIL TITLE>)'
const QUERY_CANCEL = 'subject:(<CANCEL MAIL TITLE>)'
const LOCATION = '<LOCATION>'
const TITLE = '<EVENT TITLE>'
const LABEL = '<EVENT LABEL>'
const DATE_PREFIX = '<DATE PREFIX>'

function main() {
  Logger.log("Reserve")
  pickUpMessage(QUERY_RESERVE, function (message) {
    parseReserve(message);
  });
  Logger.log("Cancel")
  pickUpMessage(QUERY_CANCEL, function (message) {
    parseCANCEL(message);
  });
}

function pickUpMessage(query, callback) {
  const threads = GmailApp.search(query, 0, 5);
  var label = GmailApp.getUserLabelByName(LABEL);

  for (var i in threads) {
    const thread = threads[i];
    const messages = thread.getMessages()
    for (var j in messages) {
      if (!messages[j].isStarred()) {
        callback(messages[j])
        label.addToThread(thread)
        messages[j].star()
      }
    }
  }
}

function createEvent(title, description, location, year, month, dayOfMonth,
  startTimeHour, startTimeMinutes, endTimeHour, endTimeMinutes) {

  const calendar = CalendarApp.getDefaultCalendar();
  const startTime = new Date(year, month - 1, dayOfMonth, startTimeHour, startTimeMinutes, 0);
  const endTime = new Date(year, month - 1, dayOfMonth, endTimeHour, endTimeMinutes, 0);
  const option = {
    description: description,
    location: location,
  }

  console.log("start time: " + startTime);
  console.log("end time: " + endTime);
  var calendarEvent = calendar.createEvent(title, startTime, endTime, option);
  calendarEvent.setColor(CalendarApp.EventColor.GRAY)
}

function deleteEvent(year, month, dayOfMonth, startTimeHour, startTimeMinutes, endTimeHour, endTimeMinutes) {

  const calendar = CalendarApp.getDefaultCalendar();
  const startTime = new Date(year, month - 1, dayOfMonth, startTimeHour, startTimeMinutes, 0);
  const endTime = new Date(year, month - 1, dayOfMonth, endTimeHour, endTimeMinutes, 0);

  console.log("start time: " + startTime);
  console.log("end time: " + endTime);
  var calendarEvents = calendar.getEvents(startTime, endTime);
  for (var i in calendarEvents) {
    const calendarEvent = calendarEvents[i];
    if (calendarEvent.getTitle() == TITLE) {
      calendarEvent.deleteEvent()
      Logger.log("Delete")
    }
  }
}

function parseReserve(message) {
  const strDate = message.getDate();
  const strMessage = message.getPlainBody();

  const regexp = RegExp(DATE_PREFIX + '.*', 'gi');

  const result = strMessage.match(regexp);
  if (result == null) {
    console.log("This message doesn't have info.");
    return;
  }
  const parsedDate = result[0].replace(DATE_PREFIX, '');

  const year = parsedDate.match(/20[0-9]{2}年/gi)[0].replace('年', '');
  const month = parsedDate.match(/[0-9]{2}月/gi)[0].replace('月', '');
  const dayOfMonth = parsedDate.match(/[0-9]{2}日/gi)[0].replace('日', '');
  const startTimeHour = parsedDate.match(/[0-9]{2}:/gi)[0].replace(':', '');
  const endTimeHour = String(Number(startTimeHour) + 1);

  createEvent(TITLE, "mailDate: " + strDate,
   LOCATION, year, month, dayOfMonth, startTimeHour, 0, endTimeHour, 0);
}

function parseCANCEL(message) {
  const strMessage = message.getPlainBody();

  const regexp = RegExp(DATE_PREFIX + '.*', 'gi');

  const result = strMessage.match(regexp);
  if (result == null) {
    console.log("This message doesn't have info.");
    return;
  }
  const parsedDate = result[0].replace(DATE_PREFIX, '');

  const year = parsedDate.match(/20[0-9]{2}年/gi)[0].replace('年', '');
  const month = parsedDate.match(/[0-9]{2}月/gi)[0].replace('月', '');
  const dayOfMonth = parsedDate.match(/[0-9]{2}日/gi)[0].replace('日', '');
  const startTimeHour = parsedDate.match(/[0-9]{2}:/gi)[0].replace(':', '');
  const endTimeHour = String(Number(startTimeHour) + 1);

  deleteEvent(year, month, dayOfMonth, startTimeHour, 0, endTimeHour, 0);
}
