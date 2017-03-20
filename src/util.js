function fixWebpackSourcePaths(sourceMap) {
  const isWin = process.platform.startsWith('win');

  return Object.assign({}, sourceMap, {
    sources: sourceMap.sources.map(source => {
      if (source.indexOf('!') !== -1) {
        source = source.split('!').pop();
      }
      if (source.indexOf('?') !== -1) {
        source = source.split('?')[0];
      }
      // Workaround for https://github.com/mattlewis92/karma-coverage-istanbul-reporter/issues/9
      if (isWin) {
        source = source.replace(/\\/g, '/');
      }
      if (sourceMap.sourceRoot && source.startsWith(sourceMap.sourceRoot)) {
        source = source.replace(sourceMap.sourceRoot, '');
      }
      return source;
    })
  });
}

module.exports.fixWebpackSourcePaths = fixWebpackSourcePaths;
