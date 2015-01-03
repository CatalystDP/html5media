var log4js=require('log4js');
log4js.configure('./config/log_config.json');
var logger=log4js.getLogger('cheese');
logger.debug('12222');

