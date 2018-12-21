const path = require('path');
const webpack = require('webpack');

const OUTPUT_LOG_FILE = path.join(
  __dirname,
  'fixtures',
  'outputs',
  'karma-output.log'
);

const webpackConfig = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: /node_modules/,
        enforce: 'pre'
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader?silent=true',
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules|\.spec\.ts$)/,
        loader: 'istanbul-instrumenter-loader',
        enforce: 'post',
        options: {
          esModules: true
        }
      }
    ]
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: null,
      test: /\.(ts|js)($|\?)/i
    })
  ],
  resolve: {
    extensions: ['.ts', '.js']
  }
};

module.exports = function(config) {
  config.set({
    basePath: './',

    browsers: ['PhantomJS'],

    frameworks: ['mocha'],

    singleRun: true,

    reporters: ['coverage-istanbul'],

    files: ['fixtures/typescript/test/test.spec.ts'],

    preprocessors: {
      'fixtures/typescript/test/test.spec.ts': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only',
      logLevel: 'silent'
    },

    coverageIstanbulReporter: {
      reports: ['json-summary'],
      dir: path.join(__dirname, 'fixtures', 'outputs')
    },

    loggers: [
      {
        type: 'file',
        filename: OUTPUT_LOG_FILE
      }
    ]
  });
};

module.exports.OUTPUT_LOG_FILE = OUTPUT_LOG_FILE;
