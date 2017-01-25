const webpack = require('webpack');

const webpackConfig = {
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'tslint-loader',
      exclude: /node_modules/,
      enforce: 'pre'
    }, {
      test: /\.ts$/,
      loader: 'ts-loader?silent=true',
      exclude: /node_modules/
    }, {
      test: /src\/.+\.ts$/,
      exclude: /(node_modules|\.spec\.ts$)/,
      loader: 'istanbul-instrumenter-loader',
      enforce: 'post'
    }]
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

module.exports = function (config) {
  config.set({

    basePath: './',

    browsers: ['PhantomJS'],

    frameworks: ['mocha'],

    singleRun: true,

    reporters: ['coverage-istanbul'],

    files: [
      'fixtures/inputs/test/test.spec.ts'
    ],

    preprocessors: {
      'fixtures/inputs/test/test.spec.ts': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only',
      noInfo: true
    },

    coverageIstanbulReporter: {
      reports: ['json-summary'],
      dir: './test/fixtures/outputs'
    },

    logLevel: config.LOG_DISABLE

  });
};
