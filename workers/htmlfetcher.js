var workerHelpers = require('../server/helpers/utility');

exports.runWorkers = function(){
  workerHelpers.getUrlQueue(workerHelpers.completeQueueJobs);
};