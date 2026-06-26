function onFormSubmit(e) {
  const lock = LockService.getDocumentLock();

  try {
    lock.waitLock(30000);

    const config = getConfig_();

    const selectedSession = getAnswerFromSubmitEvent_(
      e,
      config.registrationQuestion.id
    );

    const registrantEmail = getRegistrantEmailFromSubmitEvent_(e, config);

    refreshCapacity_();

    if (config.options.sendCalendarInvites && registrantEmail) {
      addGuestForSession_(selectedSession, registrantEmail);
    }
  } catch (err) {
    logError_('Submit handler failed.', err);
    throw err;
  } finally {
    lock.releaseLock();
  }
}