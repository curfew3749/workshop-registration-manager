function showQuestionStep(e) {
  return pushCard_(buildQuestionStepCard_());
}

function buildQuestionStepCard_() {
  const config = getConfig_();
  const registrationQuestions = listRegistrationQuestions_();
  const emailQuestions = listEmailQuestions_();

  const card = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle('Setup Wizard')
        .setSubtitle('Step 1: Choose Questions')
    );

  const section = CardService.newCardSection()
    .addWidget(
      CardService.newTextParagraph()
        .setText('Choose the question that contains your session options and the question that collects the registrant email.')
    );

  const registrationSelect = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle('Session Question')
    .setFieldName('registrationQuestionId');

  registrationQuestions.forEach(function(question, index) {
    registrationSelect.addItem(
      question.title + ' (' + question.type + ')',
      question.id,
      config.registrationQuestion.id
        ? question.id === config.registrationQuestion.id
        : index === 0
    );
  });

  const emailSelect = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle('Email Question')
    .setFieldName('emailQuestionId');

  emailQuestions.forEach(function(question, index) {
    emailSelect.addItem(
      question.title + ' (' + question.type + ')',
      question.id,
      config.emailQuestion.id
        ? question.id === config.emailQuestion.id
        : index === 0
    );
  });

  section.addWidget(registrationSelect);
  section.addWidget(emailSelect);

  section.addWidget(
    CardService.newTextButton()
      .setText('Continue')
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setOnClickAction(CardService.newAction().setFunctionName('saveQuestionStep'))
  );

  card.addSection(section);
  return card.build();
}

function saveQuestionStep(e) {
  const registrationQuestionId = getInput_(e, 'registrationQuestionId');
  const emailQuestionId = getInput_(e, 'emailQuestionId');

  if (!registrationQuestionId || !emailQuestionId) {
    return notify_('Please choose both questions.');
  }

  if (registrationQuestionId === emailQuestionId) {
    return notify_('The session question and email question must be different.');
  }

  const registrationItem = getItemById_(registrationQuestionId);
  const emailItem = getItemById_(emailQuestionId);
  const choices = getChoiceValues_(registrationQuestionId);

  if (!registrationItem || !emailItem || choices.length === 0) {
    return notify_('Please choose a valid session question with choices.');
  }

  const config = getConfig_();

  config.registrationQuestion = {
    id: String(registrationItem.getId()),
    title: registrationItem.getTitle(),
    type: String(registrationItem.getType())
  };

  config.emailQuestion = {
    id: String(emailItem.getId()),
    title: emailItem.getTitle(),
    type: String(emailItem.getType())
  };

  config.sessions = choices.map(function(choice) {
    const existing = config.sessions.find(function(session) {
      return session.key === choice;
    });

    return {
      key: choice,
      capacity: existing ? existing.capacity : 1,
      enabled: existing ? existing.enabled : true,
      eventId: existing ? existing.eventId : '',
      eventTitle: existing ? existing.eventTitle : '',
      eventStart: existing ? existing.eventStart : ''
    };
  });

  saveConfig_(config);

  return pushCard_(buildCapacityStepCard_());
}