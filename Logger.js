function logInfo_(message, data) {
  console.log('[WRM INFO] ' + message, data || '');
}

function logWarn_(message, data) {
  console.warn('[WRM WARN] ' + message, data || '');
}

function logError_(message, error) {
  console.error('[WRM ERROR] ' + message, error || '');
}