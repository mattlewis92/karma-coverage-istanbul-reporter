function fixWebpackFilePath(filePath) {
  const isWin = process.platform.startsWith('win');

  if (filePath.indexOf('!') !== -1) {
    filePath = filePath.split('!').pop();
  }

  if (filePath.indexOf('?') !== -1) {
    filePath = filePath.split('?')[0];
  }

  // Workaround for https://github.com/mattlewis92/karma-coverage-istanbul-reporter/issues/9
  if (isWin) {
    filePath = filePath.replace(/\\/g, '/');
  }

  return filePath;
}

function fixWebpackSourcePaths(sourceMap) {
  return Object.assign({}, sourceMap, {
    sources: (sourceMap.sources || []).map(source => {
      source = fixWebpackFilePath(source);
      if (sourceMap.sourceRoot && source.startsWith(sourceMap.sourceRoot)) {
        source = source.replace(sourceMap.sourceRoot, '');
      }
      return source;
    })
  });
}

module.exports.fixWebpackSourcePaths = fixWebpackSourcePaths;
module.exports.fixWebpackFilePath = fixWebpackFilePath;
