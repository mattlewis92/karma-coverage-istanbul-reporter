const webpack = require('webpack');

const webpackConfig = {
  module: {
    loaders: [{
      test: /\.ts$/,
      loader: 'ts-loader?silent=true',
      exclude: /node_modules/
    }],
    postLoaders: [{
      test: /src\/.+\.ts$/,
      exclude: /(node_modules|\.spec\.ts$)/,
      loader: 'istanbul-instrumenter-loader'
    }]
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: null,
      test: /\.(ts|js)($|\?)/i
    })
  ],
  resolve: {
    extensions: ['', '.ts', '.js']
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
