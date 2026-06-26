function buildCalendarStepCard_() {
  const config = getConfig_();
  const calendars = listCalendars_();

  const card = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle('Setup Wizard')
        .setSubtitle('Step 3: Calendar Mapping')
    );

  const section = CardService.newCardSection()
    .addWidget(
      CardService.newTextParagraph()
        .setText('Choose the calendar that contains your workshop session events.')
    );

  const calendarSelect = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle('Calendar')
    .setFieldName('calendarId');

  calendars.forEach(function(calendar, index) {
    calendarSelect.addItem(
      calendar.name,
      calendar.id,
      config.calendarId
        ? calendar.id === config.calendarId
        : index === 0
    );
  });

  section.addWidget(calendarSelect);

  section.addWidget(
    CardService.newTextButton()
      .setText('Load Events')
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setOnClickAction(CardService.newAction().setFunctionName('saveCalendarChoiceStep'))
  );

  card.addSection(section);
  return card.build();
}

function saveCalendarChoiceStep(e) {
  const calendarId = getInput_(e, 'calendarId');

  if (!calendarId) {
    return notify_('Please choose a calendar.');
  }

  const calendar = CalendarApp.getCalendarById(calendarId);

  if (!calendar) {
    return notify_('Calendar could not be found.');
  }

  const config = getConfig_();

  config.calendarId = calendar.getId();
  config.calendarName = calendar.getName();

  saveConfig_(config);

  return pushCard_(buildEventMappingStepCard_());
}

function buildEventMappingStepCard_() {
  const config = getConfig_();
  const events = listUpcomingEvents_(config.calendarId);

  const card = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle('Setup Wizard')
        .setSubtitle('Step 4: Match Sessions to Events')
    );

  const section = CardService.newCardSection()
    .addWidget(
      CardService.newTextParagraph()
        .setText('Select the calendar event for each session. Registrants will be added as guests to the mapped event.')
    );

  if (events.length === 0) {
    section.addWidget(
      CardService.newTextParagraph()
        .setText('No upcoming events were found on this calendar.')
    );
  }

  config.sessions.forEach(function(session, index) {
    const eventSelect = CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.DROPDOWN)
      .setTitle(session.key)
      .setFieldName('event_' + index);

    eventSelect.addItem('Do not send calendar invite', '', !session.eventId);

    events.forEach(function(event) {
      eventSelect.addItem(
        event.label,
        event.id,
        session.eventId === event.id
      );
    });

    section.addWidget(eventSelect);
  });

  section.addWidget(
    CardService.newTextButton()
      .setText('Save Calendar Mapping')
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setOnClickAction(CardService.newAction().setFunctionName('saveEventMappingStep'))
  );

  card.addSection(section);
  return card.build();
}

function saveEventMappingStep(e) {
  const config = getConfig_();
  const events = listUpcomingEvents_(config.calendarId);

  config.sessions = config.sessions.map(function(session, index) {
    const eventId = getInput_(e, 'event_' + index);
    const event = events.find(function(item) {
      return item.id === eventId;
    });

    session.eventId = eventId || '';
    session.eventTitle = event ? event.title : '';
    session.eventStart = event ? String(event.startTime) : '';

    return session;
  });

  saveConfig_(config);

  return pushCard_(buildFinishStepCard_());
}

function buildFinishStepCard_() {
  const triggerInstalled = isSubmitTriggerInstalled_();

  const card = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle('Setup Complete')
        .setSubtitle(WRM.APP_NAME)
    );

  const section = CardService.newCardSection()
    .addWidget(
      CardService.newTextParagraph()
        .setText(
          'Your questions, capacities, and calendar mappings are saved.<br><br>' +
          'Install automation so the add-on runs whenever someone submits the form.'
        )
    );

  if (!triggerInstalled) {
    section.addWidget(
      CardService.newTextButton()
        .setText('Install Automation')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(CardService.newAction().setFunctionName('installAutomation'))
    );
  }

  section.addWidget(
    CardService.newTextButton()
      .setText('Back Home')
      .setOnClickAction(CardService.newAction().setFunctionName('showHome'))
  );

  card.addSection(section);
  return card.build();
}