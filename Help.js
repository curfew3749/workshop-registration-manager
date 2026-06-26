function showHelp(e) {
  const card = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle('Help')
        .setSubtitle(WRM.APP_NAME)
    );

  const section = CardService.newCardSection()
    .addWidget(
      CardService.newTextParagraph()
        .setText(
          '<b>Quick Start</b><br><br>' +
          '1. Create a multiple-choice or dropdown question for sessions.<br>' +
          '2. Create a question that collects registrant email addresses.<br>' +
          '3. Run the Setup Wizard.<br>' +
          '4. Set capacities for each session.<br>' +
          '5. Map sessions to Google Calendar events.<br>' +
          '6. Install automation.<br><br>' +
          '<b>What happens next?</b><br><br>' +
          'When someone submits the form, this add-on recounts registrations, removes full sessions, closes the form if all sessions are full, and sends the registrant a Calendar invite if a session is mapped.'
        )
    )
    .addWidget(
      CardService.newTextButton()
        .setText('Back Home')
        .setOnClickAction(CardService.newAction().setFunctionName('showHome'))
    );

  card.addSection(section);

  return pushCard_(card.build());
}