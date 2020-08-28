# karma-coverage-istanbul-reporter

[![Sponsorship](https://img.shields.io/badge/funding-github-%23EA4AAA)](https://github.com/users/mattlewis92/sponsorship)
[![Build Status](https://travis-ci.org/mattlewis92/karma-coverage-istanbul-reporter.svg?branch=master)](https://travis-ci.org/mattlewis92/karma-coverage-istanbul-reporter)
[![codecov](https://codecov.io/gh/mattlewis92/karma-coverage-istanbul-reporter/branch/master/graph/badge.svg)](https://codecov.io/gh/mattlewis92/karma-coverage-istanbul-reporter)
[![npm version](https://badge.fury.io/js/karma-coverage-istanbul-reporter.svg)](http://badge.fury.io/js/karma-coverage-istanbul-reporter)
[![npm](https://img.shields.io/npm/dm/karma-coverage-istanbul-reporter.svg)](http://badge.fury.io/js/karma-coverage-istanbul-reporter)
[![Twitter Follow](https://img.shields.io/twitter/follow/mattlewis92_.svg)](https://twitter.com/mattlewis92_)

> A karma reporter that uses the latest istanbul 1.x APIs (with full sourcemap support) to report coverage.

## About

This is a reporter only and does not perform the actual instrumentation of your code. Babel users should use the [istanbul babel plugin](https://github.com/istanbuljs/babel-plugin-istanbul) to instrument your code and webpack + typescript users should use the [coverage-istanbul-loader](https://github.com/JS-DevTools/coverage-istanbul-loader) and then use this karma reporter to do the actual reporting. See the [test config](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/blob/master/test/karma.conf.js) for an e2e example of how to combine them.

## Installation

```bash
npm install karma-coverage-istanbul-reporter --save-dev
```

## Configuration

```js
// karma.conf.js
const path = require('path');

module.exports = function(config) {
  config.set({
    // ... rest of karma config

    // anything named karma-* is normally auto included so you probably dont need this
    plugins: ['karma-coverage-istanbul-reporter'],

    reporters: ['coverage-istanbul'],

    coverageIstanbulReporter: {
      // reports can be any that are listed here: https://github.com/istanbuljs/istanbuljs/tree/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib
      reports: ['html', 'lcovonly', 'text-summary'],

      // base output directory. If you include %browser% in the path it will be replaced with the karma browser name
      dir: path.join(__dirname, 'coverage'),

      // Combines coverage information from multiple browsers into one report rather than outputting a report
      // for each browser.
      combineBrowserReports: true,

      // if using webpack and pre-loaders, work around webpack breaking the source path
      fixWebpackSourcePaths: true,

      // Omit files with no statements, no functions and no branches covered from the report
      skipFilesWithNoCoverage: true,

      // Most reporters accept additional config options. You can pass these through the `report-config` option
      'report-config': {
        // all options available at: https://github.com/istanbuljs/istanbuljs/blob/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib/html/index.js#L257-L261
        html: {
          // outputs the report in ./coverage/html
          subdir: 'html'
        }
      },

      // enforce percentage thresholds
      // anything under these percentages will cause karma to fail with an exit code of 1 if not running in watch mode
      thresholds: {
        emitWarning: false, // set to `true` to not fail the test command when thresholds are not met
        // thresholds for all files
        global: {
          statements: 100,
          lines: 100,
          branches: 100,
          functions: 100
        },
        // thresholds per file
        each: {
          statements: 100,
          lines: 100,
          branches: 100,
          functions: 100,
          overrides: {
            'baz/component/**/*.js': {
              statements: 98
            }
          }
        }
      },

      verbose: true, // output config used by istanbul for debugging

      // Glob patterns to exclude from coverage reporting
      exclude: [
        '**/test/**',
      ],
    }
  });
};
```

### List of reporters and options

- [clover](https://github.com/istanbuljs/istanbuljs/blob/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib/clover/index.js#L14-L15)
- [cobertura](https://github.com/istanbuljs/istanbuljs/blob/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib/cobertura/index.js#L16-L17)
- [html-spa](https://github.com/istanbuljs/istanbuljs/blob/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib/html-spa/index.js#L47-L61)
- [html](https://github.com/istanbuljs/istanbuljs/blob/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib/html/index.js#L257-L261)
- [json-summary](https://github.com/istanbuljs/istanbuljs/blob/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib/json-summary/index.js#L12)
- [json](https://github.com/istanbuljs/istanbuljs/blob/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib/json/index.js#L12)
- [lcov](https://github.com/istanbuljs/istanbuljs/blob/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib/lcov/index.js#L13)
- [lcovonly](https://github.com/istanbuljs/istanbuljs/blob/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib/lcovonly/index.js#L11-L12)
- none
- [teamcity](https://github.com/istanbuljs/istanbuljs/blob/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib/teamcity/index.js#L13-L14)
- [text-lcov](https://github.com/istanbuljs/istanbuljs/blob/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib/text-lcov/index.js#L11)
- [text-summary](https://github.com/istanbuljs/istanbuljs/blob/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib/text-summary/index.js#L13)
- [text](https://github.com/istanbuljs/istanbuljs/blob/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib/text/index.js#L231-L237)

## Credits

- [Original karma-coverage source](https://github.com/karma-runner/karma-coverage/blob/master/lib/reporter.js)
- [Example of using the new reporter API](https://github.com/facebook/jest/blob/master/scripts/mapCoverage.js)
- [Karma remap istanbul](https://github.com/marcules/karma-remap-istanbul)

## License

MIT
