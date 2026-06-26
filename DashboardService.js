/**
 * DashboardService.gs
 * Returns the current state of the Workshop Registration Manager.
 */

function getDashboardData_() {
  const config = getConfig_();

  return {
    appName: WRM.APP_NAME,
    version: WRM.VERSION,
    configured: isConfigured_(),
    triggerInstalled: isSubmitTriggerInstalled_(),
    collectsEmail: isCollectingEmail_(),
    calendarConnected: !!config.calendarId,
    formAcceptingResponses: getForm_().isAcceptingResponses(),
    sessions: getSessionCounts_(),
    health: getSystemHealth_()
  };
}

function getSystemHealth_() {
  const config = getConfig_();

  const checks = [
    {
      label: 'Configuration saved',
      ok: isConfigured_()
    },
    {
      label: 'Automation trigger installed',
      ok: isSubmitTriggerInstalled_()
    },
    {
      label: 'Google Forms collecting email',
      ok: isCollectingEmail_()
    },
    {
      label: 'Calendar selected',
      ok: !!config.calendarId
    },
    {
      label: 'At least one session configured',
      ok: config.sessions && config.sessions.length > 0
    },
    {
      label: 'All sessions have capacities',
      ok: config.sessions &&
        config.sessions.length > 0 &&
        config.sessions.every(function(session) {
          return Number(session.capacity) > 0;
        })
    }
  ];

  return {
    healthy: checks.every(function(check) {
      return check.ok;
    }),
    checks: checks
  };
}