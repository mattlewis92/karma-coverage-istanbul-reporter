const istanbul = require('istanbul-api');

function CoverageIstanbulReporter(baseReporterDecorator, logger, config) {
  baseReporterDecorator(this);

  const log = logger.create('reporter.coverage-istanbul');

  const browserCoverage = new WeakMap();

  this.onBrowserComplete = function (browser, result) {
    if (!result || !result.coverage) {
      return;
    }

    browserCoverage.set(browser, result.coverage);
  };

  const baseReporterOnRunComplete = this.onRunComplete;
  this.onRunComplete = function (browsers) {
    baseReporterOnRunComplete.apply(this, arguments);

    const reportConfig = istanbul.config.loadObject({reporting: config.coverageIstanbulReporter});
    const reportTypes = reportConfig.reporting.config.reports;

    browsers.forEach(browser => {
      const coverage = browserCoverage.get(browser);
      browserCoverage.delete(browser);

      if (!coverage) {
        return;
      }

      const reporter = istanbul.createReporter(reportConfig);
      reporter.addAll(reportTypes);

      const coverageMap = istanbul.libCoverage.createCoverageMap();
      const sourceMapStore = istanbul.libSourceMaps.createSourceMapStore();

      Object.keys(coverage).forEach(filename => coverageMap.addFileCoverage(coverage[filename]));

      const remappedCoverageMap = sourceMapStore.transformCoverage(coverageMap).map;

      log.debug('Writing coverage reports:', reportTypes);

      reporter.write(remappedCoverageMap);
    });
  };
}

CoverageIstanbulReporter.$inject = ['baseReporterDecorator', 'logger', 'config'];

module.exports = {
  'reporter:coverage-istanbul': ['type', CoverageIstanbulReporter]
};
