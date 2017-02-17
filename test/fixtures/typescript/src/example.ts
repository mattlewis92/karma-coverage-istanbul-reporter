/* tslint:disable */

export class Foo {

  bar(): boolean {
    return true; //covered
  }

  baz(): boolean {
    return false; // not covered
  }

}