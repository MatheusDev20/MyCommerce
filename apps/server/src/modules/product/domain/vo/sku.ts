export class Sku {
  private readonly value: string;

  private constructor(value: string) {
    if (!this.validate(value)) {
      throw new Error('Invalid SKU format');
    }
    this.value = value.toUpperCase();
  }

  static create(value: string): Sku {
    return new Sku(value);
  }

  getValue(): string {
    return this.value;
  }

  private validate(value: string): boolean {
    // SKU must be:
    // - Between 3 and 50 characters
    // - Contain only alphanumeric characters and hyphens
    // - Not empty or just whitespace
    if (!value || value.trim().length === 0) {
      return false;
    }

    const trimmed = value.trim();
    const length = trimmed.length;

    if (length < 3 || length > 50) {
      return false;
    }

    // Only alphanumeric and hyphens allowed
    const skuPattern = /^[A-Z0-9-]+$/i;
    return skuPattern.test(trimmed);
  }

  equals(other: Sku): boolean {
    return this.value === other.value;
  }
}
