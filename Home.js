function buildHomeCard_() {
  const configured = isConfigured_();
  const automationInstalled = isSubmitTriggerInstalled_();

  const card = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle(WRM.APP_NAME)
        .setSubtitle('Version ' + WRM.VERSION)
    );

  const statusSection = CardService.newCardSection()
    .setHeader('Status')
    .addWidget(
      CardService.newTextParagraph().setText(
        configured
          ? '🟢 <b>Configured</b>'
          : '🟡 <b>Setup required</b>'
      )
    )
    .addWidget(
      CardService.newTextParagraph().setText(
        automationInstalled
          ? '🟢 <b>Automation installed</b>'
          : '🟡 <b>Automation not installed</b>'
      )
    );

  const actions = CardService.newCardSection()
    .setHeader('Actions')
    .addWidget(
      CardService.newTextButton()
        .setText('Setup Wizard')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(CardService.newAction().setFunctionName('showQuestionStep'))
    );

  if (configured) {
    actions.addWidget(
      CardService.newTextButton()
        .setText('Refresh Capacity')
        .setOnClickAction(CardService.newAction().setFunctionName('manualRefresh'))
    );
  }

  if (configured && !automationInstalled) {
    actions.addWidget(
      CardService.newTextButton()
        .setText('Install Automation')
        .setOnClickAction(CardService.newAction().setFunctionName('installAutomation'))
    );
  }

  if (automationInstalled) {
    actions.addWidget(
      CardService.newTextButton()
        .setText('Remove Automation')
        .setOnClickAction(CardService.newAction().setFunctionName('removeAutomation'))
    );
  }

  actions.addWidget(
    CardService.newTextButton()
      .setText('Help')
      .setOnClickAction(CardService.newAction().setFunctionName('showHelp'))
  );

  card.addSection(statusSection);
  card.addSection(actions);

  if (configured) {
    card.addSection(buildDashboardSection_());
  }

  return card.build();
}

function buildDashboardSection_() {
  const section = CardService.newCardSection()
    .setHeader('Sessions');

  const sessionCounts = getSessionCounts_();

  sessionCounts.forEach(function(session) {
    const label = session.full
      ? '<b>' + session.key + '</b>: FULL (' + session.used + '/' + session.capacity + ')'
      : '<b>' + session.key + '</b>: ' + session.used + '/' + session.capacity +
        ' registered, ' + session.remaining + ' open';

    section.addWidget(
      CardService.newTextParagraph().setText(label)
    );
  });

  return section;
}