var log4js=require('log4js');
log4js.configure('./config/log_config.json');
exports.logger=function(name){
  return log4js.getLogger(name);
};
