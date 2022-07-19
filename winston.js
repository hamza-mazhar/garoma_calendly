const { createLogger, format, transports } = require('winston');
/**
 * @param label
 * @return {winston.Logger}
 */
module.exports = (label) => {
  return createLogger({
    level: 'debug',
    format: format.combine(
      format.label({ label, }),
      format.splat(),
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(
        info => `${ info.timestamp } ${ info.level } [${ info.label }]: ${ info.message }`
      )
    ),
    transports: [
      new transports.Console()
    ]
  });
};
