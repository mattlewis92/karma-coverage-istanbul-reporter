# karma-coverage-istanbul-reporter
[![Build Status](https://travis-ci.org/mattlewis92/karma-coverage-istanbul-reporter.svg?branch=master)](https://travis-ci.org/mattlewis92/karma-coverage-istanbul-reporter)
[![codecov](https://codecov.io/gh/mattlewis92/karma-coverage-istanbul-reporter/branch/master/graph/badge.svg)](https://codecov.io/gh/mattlewis92/karma-coverage-istanbul-reporter)
> A karma reporter that uses the latest istanbul 1.x APIs (with full sourcemap support) to report coverage.

## About
This is a reporter only and does not perform the actual instrumentation of your code. Webpack users should use the [istanbul-instrumenter-loader](https://github.com/deepsweet/istanbul-instrumenter-loader) and then use this karma reporter to do the actual reporting. See the [test config](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/blob/master/test/karma.conf.js) for an e2e example of how to combine them.

## Installation

```bash
npm install karma-coverage-istanbul-reporter --save-dev
```

## Configuration

Add the configuration in your `karma.conf.js`.

```js
module.exports = function (config) {
  
  config.set({
    plugins: ['karma-coverage-istanbul-reporter'],
    reporters: ['coverage-istanbul'],
    coverageIstanbulReporter: {
      reports: ['json-summary'], // reports can be any that are listed here: https://github.com/istanbuljs/istanbul-reports/tree/master/lib
      dir: './coverage', // output directory
      fixWebpackSourcePaths: true // if using webpack and pre-loaders, work around webpack breaking the source path
    }
  });
  
}
```

## Credits
* Original karma-coverage source: https://github.com/karma-runner/karma-coverage/blob/master/lib/reporter.js
* Example of using the new reporter API: https://github.com/facebook/jest/blob/master/scripts/mapCoverage.js
* Karma remap istanbul: https://github.com/marcules/karma-remap-istanbul

## License
MIT