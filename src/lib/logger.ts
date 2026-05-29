type LogLevel = 'info' | 'warn' | 'error'

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const payload = meta ? { message, ...meta } : { message }
  if (level === 'error') {
    console.error(JSON.stringify({ level, ...payload }))
  } else if (level === 'warn') {
    console.warn(JSON.stringify({ level, ...payload }))
  } else {
    console.info(JSON.stringify({ level, ...payload }))
  }
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) =>
    log('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) =>
    log('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) =>
    log('error', message, meta),
}
