function buildCapacityStepCard_() {
  const config = getConfig_();

  const card = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle('Setup Wizard')
        .setSubtitle('Step 2: Session Capacities')
    );

  const section = CardService.newCardSection()
    .addWidget(
      CardService.newTextParagraph()
        .setText('Enter the maximum number of registrants for each session.')
    );

  config.sessions.forEach(function(session, index) {
    section.addWidget(
      CardService.newTextInput()
        .setFieldName('capacity_' + index)
        .setTitle(session.key)
        .setValue(String(session.capacity || 1))
    );
  });

  section.addWidget(
    CardService.newTextButton()
      .setText('Continue')
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setOnClickAction(CardService.newAction().setFunctionName('saveCapacityStep'))
  );

  card.addSection(section);
  return card.build();
}

function saveCapacityStep(e) {
  const config = getConfig_();

  for (let i = 0; i < config.sessions.length; i++) {
    const raw = getInput_(e, 'capacity_' + i);
    const capacity = Number(raw);

    if (
      !raw ||
      !capacity ||
      capacity < 1 ||
      capacity > WRM_DEFAULTS.MAX_CAPACITY ||
      Math.floor(capacity) !== capacity
    ) {
      return notify_('Enter a whole number from 1 to ' + WRM_DEFAULTS.MAX_CAPACITY + ' for every session.');
    }

    config.sessions[i].capacity = capacity;
  }

  saveConfig_(config);

  return pushCard_(buildCalendarStepCard_());
}