export class Trace {
  static log(message: string): void {
    console.log(message);
  }

  static error(message: string): void {
    console.error(message);
  }

  static warn(message: string): void {
    console.warn(message);
  }

  static info(message: string): void {
    console.info(message);
  }
}

export default Trace;
