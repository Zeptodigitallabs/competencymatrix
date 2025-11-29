/**
 * Logger utility for consistent logging across the application
 * Can be extended to integrate with logging services in the future
 */

const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
  TRACE: 'trace'
};

// Default log level (can be overridden by environment variables)
const LOG_LEVEL = process.env.REACT_APP_LOG_LEVEL || LOG_LEVELS.INFO;

/**
 * Checks if the current log level is enabled
 * @param {string} level - The log level to check
 * @returns {boolean} True if the level is enabled
 */
const isLevelEnabled = (level) => {
  const levels = Object.values(LOG_LEVELS);
  const currentLevelIndex = levels.indexOf(LOG_LEVEL);
  const targetLevelIndex = levels.indexOf(level);
  return targetLevelIndex <= currentLevelIndex;
};

/**
 * Logs an error message
 * @param {string} message - The message to log
 * @param {Error} [error] - Optional error object
 * @param {Object} [context] - Additional context data
 */
export const error = (message, error = null, context = {}) => {
  if (!isLevelEnabled(LOG_LEVELS.ERROR)) return;
  
  const logData = {
    level: LOG_LEVELS.ERROR,
    timestamp: new Date().toISOString(),
    message,
    ...context
  };
  
  if (error) {
    logData.error = {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }
  
  console.error(JSON.stringify(logData, null, 2));
};

/**
 * Logs a warning message
 * @param {string} message - The message to log
 * @param {Object} [context] - Additional context data
 */
export const warn = (message, context = {}) => {
  if (!isLevelEnabled(LOG_LEVELS.WARN)) return;
  
  const logData = {
    level: LOG_LEVELS.WARN,
    timestamp: new Date().toISOString(),
    message,
    ...context
  };
  
  console.warn(JSON.stringify(logData, null, 2));
};

/**
 * Logs an info message
 * @param {string} message - The message to log
 * @param {Object} [context] - Additional context data
 */
export const info = (message, context = {}) => {
  if (!isLevelEnabled(LOG_LEVELS.INFO)) return;
  
  const logData = {
    level: LOG_LEVELS.INFO,
    timestamp: new Date().toISOString(),
    message,
    ...context
  };
  
  console.log(JSON.stringify(logData, null, 2));
};

/**
 * Logs a debug message
 * @param {string} message - The message to log
 * @param {Object} [context] - Additional context data
 */
export const debug = (message, context = {}) => {
  if (!isLevelEnabled(LOG_LEVELS.DEBUG)) return;
  
  const logData = {
    level: LOG_LEVELS.DEBUG,
    timestamp: new Date().toISOString(),
    message,
    ...context
  };
  
  console.debug(JSON.stringify(logData, null, 2));
};

/**
 * Logs a trace message
 * @param {string} message - The message to log
 * @param {Object} [context] - Additional context data
 */
export const trace = (message, context = {}) => {
  if (!isLevelEnabled(LOG_LEVELS.TRACE)) return;
  
  const logData = {
    level: LOG_LEVELS.TRACE,
    timestamp: new Date().toISOString(),
    message,
    ...context
  };
  
  console.trace(JSON.stringify(logData, null, 2));
};

/**
 * Creates a scoped logger with a specific context
 * @param {string} scope - The scope/component name
 * @returns {Object} A logger instance with the specified scope
 */
export const createScopedLogger = (scope) => ({
  error: (message, error, context = {}) => 
    error(message, error, { ...context, scope }),
  warn: (message, context = {}) => 
    warn(message, { ...context, scope }),
  info: (message, context = {}) => 
    info(message, { ...context, scope }),
  debug: (message, context = {}) => 
    debug(message, { ...context, scope }),
  trace: (message, context = {}) => 
    trace(message, { ...context, scope })
});

export default {
  error,
  warn,
  info,
  debug,
  trace,
  createScopedLogger,
  LOG_LEVELS,
  currentLevel: LOG_LEVEL
};
