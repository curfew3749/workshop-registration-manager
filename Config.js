function getDefaultConfig_() {
  return {
    version: WRM.VERSION,
    formId: getFormId_(),

    registrationQuestion: {
      id: '',
      title: '',
      type: ''
    },

    emailQuestion: {
      id: '',
      title: 'Google Forms collected email',
      type: 'COLLECTED_EMAIL'
    },

    calendarId: '',
    calendarName: '',

    sessions: [],

    options: {
      removeFullChoices: true,
      closeFormWhenFull: true,
      sendCalendarInvites: true
    }
  };
}

function getConfig_() {
  const raw = PropertiesService
    .getDocumentProperties()
    .getProperty(WRM.CONFIG_KEY);

  if (!raw) {
    return getDefaultConfig_();
  }

  try {
    return Object.assign(getDefaultConfig_(), JSON.parse(raw));
  } catch (err) {
    logError_('Failed to parse saved config.', err);
    return getDefaultConfig_();
  }
}

function saveConfig_(config) {
  config.version = WRM.VERSION;
  config.formId = getFormId_();

  PropertiesService
    .getDocumentProperties()
    .setProperty(WRM.CONFIG_KEY, JSON.stringify(config));

  return config;
}

function clearConfig_() {
  PropertiesService
    .getDocumentProperties()
    .deleteProperty(WRM.CONFIG_KEY);
}

function isConfigured_() {
  const config = getConfig_();

  return Boolean(
    config.registrationQuestion &&
    config.registrationQuestion.id &&
    config.sessions &&
    config.sessions.length > 0
  );
}