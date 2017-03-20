'use strict';

const istanbul = require('istanbul-api');
const fixWebpackSourcePaths = require('./util').fixWebpackSourcePaths;

const BROWSER_PLACEHOLDER = '%browser%';

function CoverageIstanbulReporter(baseReporterDecorator, logger, config) {
  baseReporterDecorator(this);

  const log = logger.create('reporter.coverage-istanbul');

  const browserCoverage = new WeakMap();

  this.onBrowserComplete = function (browser, result) {
    if (result && result.coverage) {
      browserCoverage.set(browser, result.coverage);
    }
  };

  const baseReporterOnRunComplete = this.onRunComplete;
  this.onRunComplete = function (browsers) {
    baseReporterOnRunComplete.apply(this, arguments);

    browsers.forEach(browser => {
      const coverageIstanbulReporter = Object.assign({}, config.coverageIstanbulReporter);
      if (coverageIstanbulReporter.dir) {
        coverageIstanbulReporter.dir = coverageIstanbulReporter.dir.replace(BROWSER_PLACEHOLDER, browser.name);
      }
      const reportConfig = istanbul.config.loadObject({
        reporting: coverageIstanbulReporter
      });
      const reportTypes = reportConfig.reporting.config.reports;

      const coverage = browserCoverage.get(browser);
      browserCoverage.delete(browser);

      if (!coverage) {
        return;
      }

      const reporter = istanbul.createReporter(reportConfig);
      reporter.addAll(reportTypes);

      const coverageMap = istanbul.libCoverage.createCoverageMap();
      const sourceMapStore = istanbul.libSourceMaps.createSourceMapStore();

      Object.keys(coverage).forEach(filename => {
        const fileCoverage = coverage[filename];
        if (fileCoverage.inputSourceMap && coverageIstanbulReporter.fixWebpackSourcePaths) {
          fileCoverage.inputSourceMap = fixWebpackSourcePaths(fileCoverage.inputSourceMap);
        }
        coverageMap.addFileCoverage(fileCoverage);
      });

      const remappedCoverageMap = sourceMapStore.transformCoverage(coverageMap).map;

      log.debug('Writing coverage reports:', reportTypes);

      reporter.write(remappedCoverageMap);

      const thresholds = coverageIstanbulReporter.thresholds;
      if (thresholds) {
        // Adapted from https://github.com/istanbuljs/nyc/blob/98ebdff573be91e1098bb7259776a9082a5c1ce1/index.js#L463-L478
        let thresholdCheckFailed = false;
        const summary = remappedCoverageMap.getCoverageSummary();
        Object.keys(thresholds).forEach(key => {
          const coverage = summary[key].pct;
          if (coverage < thresholds[key]) {
            thresholdCheckFailed = true;
            log.error(`Coverage for ${key} (${coverage}%) does not meet global threshold (${thresholds[key]}%)`);
          }
        });
        /* istanbul ignore if */
        if (thresholdCheckFailed && config.singleRun) {
          process.on('exit', () => {
            process.exit(1);
          });
        }
      }
    });
  };
}

CoverageIstanbulReporter.$inject = ['baseReporterDecorator', 'logger', 'config'];

module.exports = {
  'reporter:coverage-istanbul': ['type', CoverageIstanbulReporter]
};
