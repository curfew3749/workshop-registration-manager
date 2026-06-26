function getAnswerFromSubmitEvent_(e, itemId) {
  if (!e || !e.response || !itemId) return '';

  const targetId = String(itemId);
  const responses = e.response.getItemResponses();

  for (let i = 0; i < responses.length; i++) {
    const itemResponse = responses[i];

    if (String(itemResponse.getItem().getId()) === targetId) {
      return str_(itemResponse.getResponse());
    }
  }

  return '';
}

function getRegistrantEmailFromSubmitEvent_(e, config) {
  if (e && e.response && typeof e.response.getRespondentEmail === 'function') {
    const collectedEmail = str_(e.response.getRespondentEmail());

    if (collectedEmail) {
      return collectedEmail;
    }
  }

  if (config && config.emailQuestion && config.emailQuestion.id) {
    return getAnswerFromSubmitEvent_(e, config.emailQuestion.id);
  }

  return '';
}

function countRegistrationsBySession_(config) {
  const counts = {};
  const targetId = String(config.registrationQuestion.id);

  getForm_().getResponses().forEach(function(formResponse) {
    formResponse.getItemResponses().forEach(function(itemResponse) {
      if (String(itemResponse.getItem().getId()) === targetId) {
        const answer = str_(itemResponse.getResponse());
        if (answer) {
          counts[answer] = (counts[answer] || 0) + 1;
        }
      }
    });
  });

  return counts;
}