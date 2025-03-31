export class ZipCode {
  private readonly value: string;

  constructor(value: string) {
    if (!this.validate(value)) throw new Error('Invalid Zip Code');
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  validate(value: string): boolean {
    return /^\d{8}$/.test(value.replace(/[^\d]+/g, ''));
  }
}
