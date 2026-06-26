function listRegistrationQuestions_() {
  return getForm_().getItems()
    .filter(function(item) {
      const type = item.getType();
      return type === FormApp.ItemType.MULTIPLE_CHOICE ||
             type === FormApp.ItemType.LIST;
    })
    .map(itemToQuestionRecord_);
}

function listEmailQuestions_() {
  return getForm_().getItems()
    .filter(function(item) {
      const type = item.getType();
      return type === FormApp.ItemType.TEXT ||
             type === FormApp.ItemType.PARAGRAPH_TEXT ||
             type === FormApp.ItemType.MULTIPLE_CHOICE ||
             type === FormApp.ItemType.LIST;
    })
    .map(itemToQuestionRecord_);
}

function itemToQuestionRecord_(item) {
  return {
    id: String(item.getId()),
    title: item.getTitle(),
    type: String(item.getType())
  };
}

function getItemById_(itemId) {
  const id = Number(itemId);

  return getForm_().getItems().find(function(item) {
    return item.getId() === id;
  }) || null;
}

function getChoiceValues_(itemId) {
  const item = getItemById_(itemId);
  if (!item) return [];

  if (item.getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
    return item.asMultipleChoiceItem().getChoices().map(function(choice) {
      return choice.getValue();
    });
  }

  if (item.getType() === FormApp.ItemType.LIST) {
    return item.asListItem().getChoices().map(function(choice) {
      return choice.getValue();
    });
  }

  return [];
}

function setRegistrationChoices_(config, choiceValues) {
  const item = getItemById_(config.registrationQuestion.id);

  if (!item) {
    throw new Error('Registration question not found.');
  }

  if (item.getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
    const mc = item.asMultipleChoiceItem();
    mc.setChoices(choiceValues.map(function(value) {
      return mc.createChoice(value);
    }));
    return;
  }

  if (item.getType() === FormApp.ItemType.LIST) {
    const list = item.asListItem();
    list.setChoices(choiceValues.map(function(value) {
      return list.createChoice(value);
    }));
    return;
  }

  throw new Error('Registration question must be Multiple Choice or Dropdown.');
}

function setFormOpen_(isOpen) {
  getForm_().setAcceptingResponses(isOpen);

  if (!isOpen) {
    getForm_().setCustomClosedFormMessage(WRM_DEFAULTS.CLOSED_MESSAGE);
  }
}

function isCollectingEmail_() {
  return getForm_().collectsEmail();
}