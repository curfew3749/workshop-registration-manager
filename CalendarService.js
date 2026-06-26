function listCalendars_() {
  return CalendarApp.getAllCalendars().map(function(calendar) {
    return {
      id: calendar.getId(),
      name: calendar.getName()
    };
  });
}

function listUpcomingEvents_(calendarId) {
  if (!calendarId) return [];

  const calendar = CalendarApp.getCalendarById(calendarId);
  if (!calendar) return [];

  const start = new Date();
  const end = new Date();
  end.setDate(start.getDate() + 90);

  return calendar.getEvents(start, end).slice(0, 50).map(function(event) {
    return {
      id: event.getId(),
      title: event.getTitle(),
      label: event.getTitle() + ' - ' + formatDateTime_(event.getStartTime())
    };
  });
}

function addGuestForSession_(sessionKey, email) {
  if (!sessionKey || !email) return false;

  const config = getConfig_();

  const session = config.sessions.find(function(item) {
    return item.key === sessionKey;
  });

  if (!session || !session.eventId || !config.calendarId) return false;

  try {
    return addGuestToEventWithInvite_(
      config.calendarId,
      session.eventId,
      email
    );
  } catch (err) {
    logError_('Advanced Calendar invite failed. Falling back to CalendarApp.', err);

    const calendar = CalendarApp.getCalendarById(config.calendarId);
    const event = calendar ? calendar.getEventById(session.eventId) : null;

    if (!event) throw err;

    event.addGuest(email);
    return true;
  }
}

function addGuestToEventWithInvite_(calendarId, savedEventId, email) {
  const normalizedEmail = String(email).trim().toLowerCase();
  if (!normalizedEmail) return false;

  const apiEvent = findCalendarApiEvent_(calendarId, savedEventId);

  if (!apiEvent) {
    throw new Error('Could not find Calendar API event for saved ID: ' + savedEventId);
  }

  const attendees = apiEvent.attendees || [];

  const alreadyAdded = attendees.some(function(attendee) {
    return String(attendee.email || '').trim().toLowerCase() === normalizedEmail;
  });

  if (!alreadyAdded) {
    attendees.push({
      email: normalizedEmail,
      responseStatus: 'needsAction'
    });
  }

  Calendar.Events.patch(
    {
      attendees: attendees
    },
    calendarId,
    apiEvent.id,
    {
      sendUpdates: 'all'
    }
  );

  logInfo_('Guest added with invite update.', {
    calendarId: calendarId,
    apiEventId: apiEvent.id,
    savedEventId: savedEventId,
    email: normalizedEmail
  });

  return true;
}

function findCalendarApiEvent_(calendarId, savedEventId) {
  try {
    return Calendar.Events.get(calendarId, savedEventId);
  } catch (err1) {
    // Continue.
  }

  const strippedId = String(savedEventId).replace(/@google\.com$/, '');

  if (strippedId !== savedEventId) {
    try {
      return Calendar.Events.get(calendarId, strippedId);
    } catch (err2) {
      // Continue.
    }
  }

  try {
    const result = Calendar.Events.list(calendarId, {
      iCalUID: savedEventId,
      maxResults: 1,
      singleEvents: true
    });

    if (result.items && result.items.length > 0) {
      return result.items[0];
    }
  } catch (err3) {
    // Continue.
  }

  return null;
}