





qa.ext.call = function(instance, method, opt_sources) {
  return async.context.isolate(async.wrap(method, opt_sources),
      qa.ext.instance(instance));
};
