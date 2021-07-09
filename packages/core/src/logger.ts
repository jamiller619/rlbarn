import winston, { LoggerOptions } from 'winston'

const { format, transports } = winston

type LogOptions = {
  filename: string
  label?: string
}

export const createLogger = ({
  filename,
  label,
}: LogOptions): winston.Logger => {
  const timestamp = format.timestamp({
    format: 'MMM-DD-YYYY HH:mm:ss',
  })

  const printf = format.printf(
    ({ timestamp, label, level, message }) =>
      `${timestamp}: ${level}: ${label ? `${label}: ` : ''}${message}`
  )

  const commonFormats = [timestamp, format.align(), printf]

  if (label != null) {
    commonFormats.push(format.label({ label }))
  }

  const options = {
    console: {
      format: format.combine(format.colorize(), ...commonFormats),
    },
    file: {
      filename,
      format: format.combine(...commonFormats),
    },
  }

  const config: LoggerOptions = {
    transports: [
      new transports.Console(options.console),
      new transports.File(options.file),
    ],
  }

  return winston.createLogger(config)
}
