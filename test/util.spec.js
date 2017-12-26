const expect = require('chai').expect;
const fixWebpackSourcePaths = require('../src/util').fixWebpackSourcePaths;

const originalPlatform = process.platform;

describe('util', () => {
  describe('fixWebpackSourcePaths', () => {
    beforeEach(() => {
      Object.defineProperty(process, 'platform', {
        value: originalPlatform
      });
    });

    it('should work around webpack pre-loaders', () => {
      const input = {
        file: '/Users/mattlewis/Code/open-source/karma-coverage-istanbul-reporter/test/fixtures/typescript/src/example.ts',
        sourceRoot: '',
        sources: ['/Users/mattlewis/Code/open-source/karma-coverage-istanbul-reporter/node_modules/tslint-loader/index.js!/Users/mattlewis/Code/open-source/karma-coverage-istanbul-reporter/test/fixtures/typescript/src/example.ts']
      };

      const output = {
        file: '/Users/mattlewis/Code/open-source/karma-coverage-istanbul-reporter/test/fixtures/typescript/src/example.ts',
        sourceRoot: '',
        sources: ['/Users/mattlewis/Code/open-source/karma-coverage-istanbul-reporter/test/fixtures/typescript/src/example.ts']
      };

      expect(fixWebpackSourcePaths(input)).to.deep.equal(output);
    });

    it('should work around webpack query strings', () => {
      const input = {
        file: '/Users/juzaun/Development/sagely-sign-web/src/components/background.vue',
        sourceRoot: '',
        sources: ['/Users/juzaun/Development/sagely-sign-web/src/components/background.vue?1e26b24c']
      };

      const output = {
        file: '/Users/juzaun/Development/sagely-sign-web/src/components/background.vue',
        sourceRoot: '',
        sources: ['/Users/juzaun/Development/sagely-sign-web/src/components/background.vue']
      };

      expect(fixWebpackSourcePaths(input)).to.deep.equal(output);
    });

    it('should use the correct path separators on windows', () => {
      Object.defineProperty(process, 'platform', {
        value: 'win32'
      });
      const input = {
        file: 'C:/development/git/coverage-istanbul-reporter-path/client/modules/app/app.component.ts',
        sourceRoot: '',
        sources: ['C:\\development\\git\\coverage-istanbul-reporter-path\\client\\modules\\app\\app.component.ts'] // eslint-disable-line unicorn/escape-case
      };

      const output = {
        file: 'C:/development/git/coverage-istanbul-reporter-path/client/modules/app/app.component.ts',
        sourceRoot: '',
        sources: ['C:/development/git/coverage-istanbul-reporter-path/client/modules/app/app.component.ts']
      };

      expect(fixWebpackSourcePaths(input)).to.deep.equal(output);
    });

    it('should not correct path separators on non windows systems', () => {
      const input = {
        file: '\\foo\\bar',
        sourceRoot: '',
        sources: ['\\foo\\bar']
      };

      const output = {
        file: '\\foo\\bar',
        sourceRoot: '',
        sources: ['\\foo\\bar']
      };

      expect(fixWebpackSourcePaths(input)).to.deep.equal(output);
    });

    it('should remove the sourceRoot from the source path if present', () => {
      const input = {
        file: 'C:/development/git/coverage-istanbul-reporter-path/client/modules/app/app.component.ts',
        sourceRoot: 'C:/development/git/coverage-istanbul-reporter-path/',
        sources: ['C:/development/git/coverage-istanbul-reporter-path/client/modules/app/app.component.ts']
      };

      const output = {
        file: 'C:/development/git/coverage-istanbul-reporter-path/client/modules/app/app.component.ts',
        sourceRoot: 'C:/development/git/coverage-istanbul-reporter-path/',
        sources: ['client/modules/app/app.component.ts']
      };

      expect(fixWebpackSourcePaths(input)).to.deep.equal(output);
    });

    it('should not throw when where are no sources', () => {
      const input = {
        file: '/Users/mattlewis/Code/open-source/karma-coverage-istanbul-reporter/test/fixtures/typescript/src/example.ts',
        sourceRoot: ''
      };

      const output = {
        file: '/Users/mattlewis/Code/open-source/karma-coverage-istanbul-reporter/test/fixtures/typescript/src/example.ts',
        sourceRoot: '',
        sources: []
      };

      expect(fixWebpackSourcePaths(input)).to.deep.equal(output);
    });

    it('should add the webpack context to the source root if not set', () => {
      const input = {
        file: 'example.ts',
        sourceRoot: 'src',
        sources: ['example.ts']
      };

      const output = {
        file: 'example.ts',
        sourceRoot: '/Users/mattlewis/Code/open-source/karma-coverage-istanbul-reporter/test/fixtures/typescript/src',
        sources: ['example.ts']
      };
      expect(fixWebpackSourcePaths(input, {
        context: '/Users/mattlewis/Code/open-source/karma-coverage-istanbul-reporter/test/fixtures/typescript'
      })).to.deep.equal(output);
    });

    it('should only add the webpack context to the source root if not already set', () => {
      const input = {
        file: 'example.ts',
        sourceRoot: '/Users/mattlewis/Code/open-source/karma-coverage-istanbul-reporter/test/fixtures/typescript/src',
        sources: ['example.ts']
      };

      const output = {
        file: 'example.ts',
        sourceRoot: '/Users/mattlewis/Code/open-source/karma-coverage-istanbul-reporter/test/fixtures/typescript/src',
        sources: ['example.ts']
      };
      expect(fixWebpackSourcePaths(input, {
        context: '/Users/mattlewis/Code/open-source/karma-coverage-istanbul-reporter/test/fixtures/typescript'
      })).to.deep.equal(output);
    });

    it('should not the webpack context to the source root if the source root is absolute', () => {
      const input = {
        file: 'example.ts',
        sourceRoot: '/Users/mattlewis/Code/open-source/karma-coverage-istanbul-reporter/test/fixtures/typescript',
        sources: ['example.ts']
      };

      const output = {
        file: 'example.ts',
        sourceRoot: '/Users/mattlewis/Code/open-source/karma-coverage-istanbul-reporter/test/fixtures/typescript',
        sources: ['example.ts']
      };
      expect(fixWebpackSourcePaths(input, {
        context: '/Users/mattlewis/Code/open-source/karma-coverage-istanbul-reporter/test/fixtures/typescript/src'
      })).to.deep.equal(output);
    });
  });
});
