function showConfigSidebar() {
  const html = HtmlService
    .createHtmlOutputFromFile('Sidebar')
    .setTitle('Workshop Registration');

  FormApp.getUi().showSidebar(html);
}

function getSidebarData() {
  const config = getConfig_();

  return {
    config: config,
    registrationQuestions: listRegistrationQuestions_(),
    emailQuestions: listEmailQuestions_(),
    calendars: listCalendars_(),
    collectsEmail: isCollectingEmail_()
  };
}

function getChoicesForSidebar(questionId) {
  return getChoiceValues_(questionId);
}

function getEventsForSidebar(calendarId) {
  try {
    if (!calendarId) {
      return [];
    }

    const calendar = CalendarApp.getCalendarById(calendarId);

    if (!calendar) {
      return [];
    }

    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + 90);

    const events = calendar.getEvents(start, end);

    return events.slice(0, 50).map(function(event) {
      return {
        id: event.getId(),
        title: event.getTitle(),
        label: event.getTitle() + ' - ' + formatDateTime_(event.getStartTime())
      };
    });
  } catch (err) {
    logError_('Could not load calendar events.', err);
    throw new Error('Could not load calendar events. Try a different calendar or check permissions.');
  }
}

function saveSidebarConfig(data) {
  const registrationItem = getItemById_(data.registrationQuestionId);

  if (!registrationItem) {
    throw new Error('Selected session question could not be found.');
  }

  const calendar = data.calendarId
    ? CalendarApp.getCalendarById(data.calendarId)
    : null;

  // IMPORTANT:
  // Load the existing configuration instead of starting over.
  const config = getConfig_();

  config.registrationQuestion = {
    id: String(registrationItem.getId()),
    title: registrationItem.getTitle(),
    type: String(registrationItem.getType())
  };

  config.emailQuestion = {
    id: '',
    title: 'Google Forms collected email',
    type: 'COLLECTED_EMAIL'
  };

  config.calendarId = calendar ? calendar.getId() : '';
  config.calendarName = calendar ? calendar.getName() : '';

  // Preserve existing sessions.
  const existingSessions = config.sessions || [];

  data.sessions.forEach(function(sessionData) {

    let session = existingSessions.find(function(existing) {
      return existing.key === sessionData.key;
    });

    if (!session) {
      session = {
        key: sessionData.key,
        originalKey: sessionData.key,
        enabled: true
      };

      existingSessions.push(session);
    }

    session.capacity = Number(sessionData.capacity);
    session.eventId = sessionData.eventId || '';
    session.eventTitle = sessionData.eventTitle || '';
  });

  config.sessions = existingSessions;

  config.options.removeFullChoices = true;
  config.options.closeFormWhenFull = true;
  config.options.sendCalendarInvites = true;

  saveConfig_(config);

  return true;
}

function installTriggerFromMenu() {
  installSubmitTrigger_();
  FormApp.getUi().alert('Trigger installed.');
}

function removeTriggerFromMenu() {
  removeSubmitTrigger_();
  FormApp.getUi().alert('Trigger removed.');
}

function showHelpDialog() {
  FormApp.getUi().alert(
    'Workshop Registration Manager\n\n' +
    '1. Configure your session question.\n' +
    '2. Set capacities.\n' +
    '3. Map each session to a calendar event if desired.\n' +
    '4. Install the trigger.\n\n' +
    'When a session fills, it disappears from the form. When all sessions fill, the form closes.'
  );
}





function getDashboardData() {
  return getDashboardData_();
}