function getForm_() {
  return FormApp.getActiveForm();
}

function getFormId_() {
  const form = getForm_();
  return form ? form.getId() : '';
}

function str_(value) {
  return value === null || value === undefined ? '' : String(value);
}

function getInput_(e, fieldName) {
  const inputs = e &&
    e.commonEventObject &&
    e.commonEventObject.formInputs;

  if (
    inputs &&
    inputs[fieldName] &&
    inputs[fieldName].stringInputs &&
    inputs[fieldName].stringInputs.value
  ) {
    return inputs[fieldName].stringInputs.value[0] || '';
  }

  return '';
}

function notify_(message) {
  return CardService.newActionResponseBuilder()
    .setNotification(CardService.newNotification().setText(message))
    .build();
}

function pushCard_(card) {
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(card))
    .build();
}

function updateCard_(card) {
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(card))
    .build();
}

function formatDateTime_(date) {
  return Utilities.formatDate(
    date,
    Session.getScriptTimeZone(),
    'MMM d, yyyy h:mm a'
  );
}