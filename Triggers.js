function installSubmitTrigger_() {
  removeSubmitTrigger_();

  ScriptApp.newTrigger(WRM.SUBMIT_HANDLER)
    .forForm(getForm_())
    .onFormSubmit()
    .create();
}

function removeSubmitTrigger_() {
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === WRM.SUBMIT_HANDLER) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function isSubmitTriggerInstalled_() {
  return ScriptApp.getProjectTriggers().some(function(trigger) {
    return trigger.getHandlerFunction() === WRM.SUBMIT_HANDLER;
  });
}

function installAutomation(e) {
  if (!isConfigured_()) {
    return notify_('Please finish setup first.');
  }

  installSubmitTrigger_();

  return CardService.newActionResponseBuilder()
    .setNotification(CardService.newNotification().setText('Automation installed.'))
    .setNavigation(CardService.newNavigation().updateCard(buildHomeCard_()))
    .build();
}

function removeAutomation(e) {
  removeSubmitTrigger_();

  return CardService.newActionResponseBuilder()
    .setNotification(CardService.newNotification().setText('Automation removed.'))
    .setNavigation(CardService.newNavigation().updateCard(buildHomeCard_()))
    .build();
}