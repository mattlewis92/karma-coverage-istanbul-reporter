/* tslint:disable */

import {expect} from 'chai';
import {Foo} from './../src/example';

describe('Foo', () => {

  it('should return true', () => {
    const foo: Foo = new Foo();
    expect(foo.bar()).to.be.true;
  });

});