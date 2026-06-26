function refreshCapacity_() {
  const config = getConfig_();

  if (!isConfigured_()) {
    throw new Error('Workshop Registration Manager is not configured.');
  }

  const counts = countRegistrationsBySession_(config);
  const availableChoices = getAvailableSessionKeys_(config, counts);
  const hasAvailableChoices = availableChoices.length > 0;
  const form = getForm_();

  if (!hasAvailableChoices) {
    try {
      form.setCustomClosedFormMessage(WRM_DEFAULTS.CLOSED_MESSAGE);
    } catch (err) {
      logError_('Could not set closed form message.', err);
    }

    form.setAcceptingResponses(false);
    return counts;
  }

  if (config.options.removeFullChoices) {
    setRegistrationChoices_(config, availableChoices);
  }

  if (config.options.closeFormWhenFull) {
    form.setAcceptingResponses(true);
  }

  return counts;
}

function getAvailableSessionKeys_(config, counts) {
  return config.sessions
    .filter(function(session) {
      if (!session.enabled) return false;

      const used = counts[session.key] || 0;
      return used < Number(session.capacity);
    })
    .map(function(session) {
      return session.key;
    });
}

function getSessionCounts_() {
  const config = getConfig_();
  const counts = countRegistrationsBySession_(config);

  return config.sessions.map(function(session) {
    const used = counts[session.key] || 0;
    const capacity = Number(session.capacity);

    return {
      key: session.key,
      used: used,
      capacity: capacity,
      remaining: Math.max(capacity - used, 0),
      full: used >= capacity
    };
  });
}

function refreshCapacityFromMenu() {
  try {
    refreshCapacity_();
    FormApp.getUi().alert('Capacity refreshed.');
  } catch (err) {
    logError_('Refresh Capacity failed.', err);
    FormApp.getUi().alert('Refresh Capacity failed:\n\n' + err.message);
  }
}