/* tslint:disable */
import { Bam } from './another-file';

export class Foo {
  bam: Bam = new Bam();

  bar(): boolean {
    return true; //covered
  }

  baz(): boolean {
    return false; // not covered
  }
}
