const fs = require('fs');
const path = require('path');
const chai = require('chai');
const karma = require('karma');

const expect = chai.expect;
const karmaCoverage = require('../src/reporter');

function createServer(config) {
  config = config || {};
  return new karma.Server(Object.assign({
    configFile: path.join(__dirname, '/karma.conf.js'),
    plugins: [
      'karma-mocha',
      'karma-phantomjs-launcher',
      'karma-webpack',
      'karma-sourcemap-loader',
      karmaCoverage
    ]
  }, config), () => {});
}

describe('karma-coverage-istanbul-reporter', () => {
  it('should generate a remapped coverage report', done => {
    const server = createServer();
    server.start();
    server.on('run_complete', () => {
      setTimeout(() => { // hacky workaround to make sure the file has been written
        const summary = JSON.parse(fs.readFileSync(path.join(__dirname, '/fixtures/outputs/coverage-summary.json')));
        expect(summary.total).to.deep.equal({
          lines: {
            total: 6,
            covered: 5,
            skipped: 0,
            pct: 83.33
          },
          statements: {
            total: 7,
            covered: 6,
            skipped: 0,
            pct: 85.71
          },
          functions: {
            total: 3,
            covered: 2,
            skipped: 0,
            pct: 66.67
          },
          branches: {
            total: 0,
            covered: 0,
            skipped: 0,
            pct: 100
          }
        });
        done();
      }, 300);
    });
  });

  it('should fix webpack loader source paths', done => {
    const server = createServer({
      coverageIstanbulReporter: {
        reports: ['json-summary'],
        dir: './test/fixtures/outputs',
        fixWebpackSourcePaths: true
      }
    });
    server.start();
    server.on('run_complete', () => {
      setTimeout(() => { // hacky workaround to make sure the file has been written
        const summary = JSON.parse(fs.readFileSync(path.join(__dirname, '/fixtures/outputs/coverage-summary.json')));
        const files = Object.keys(summary);
        files.forEach(file => {
          expect(file).not.to.contain('tslint-loader');
        });
        done();
      }, 300);
    });
  });
});
