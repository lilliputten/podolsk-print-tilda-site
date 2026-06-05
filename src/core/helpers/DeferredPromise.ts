export class DeferredPromise<T> {
  promise: Promise<T>;
  private resolvePromise!: (value: T | PromiseLike<T>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private rejectPromise!: (reason?: any) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolvePromise = resolve;
      this.rejectPromise = reject;
    });
  }

  resolve(value: T | PromiseLike<T>): void {
    this.resolvePromise(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject(reason?: any): void {
    this.rejectPromise(reason);
  }
}
