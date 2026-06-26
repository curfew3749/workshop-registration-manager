function onOpen(e) {
  FormApp.getUi()
    .createMenu('Workshop Registration')
    .addItem('Configure', 'showConfigSidebar')
    .addSeparator()
    .addItem('Refresh Capacity', 'refreshCapacityFromMenu')
    .addItem('Install Trigger', 'installTriggerFromMenu')
    .addItem('Remove Trigger', 'removeTriggerFromMenu')
    .addSeparator()
    .addItem('Help', 'showHelpDialog')
    .addToUi();
}

function showHome(e) {
  showConfigSidebar();
}