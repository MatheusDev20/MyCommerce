import { Injectable } from '@nestjs/common';
import { Sku } from '../domain/vo/sku';

@Injectable()
export class SkuGeneratorService {
  /**
   * Generates a SKU based on product name
   * Format: {SLUG}-{RANDOM}
   * Example: "Gaming Laptop Pro" -> "GAM-LAP-PRO-X7K4M9"
   */
  generate(productName: string): Sku {
    const slug = this.createSlug(productName);
    const randomSuffix = this.generateRandomSuffix(6);
    const skuValue = `${slug}-${randomSuffix}`;

    return Sku.create(skuValue);
  }

  /**
   * Creates a slug from product name:
   * - Converts to uppercase
   * - Removes special characters
   * - Takes first letters of each word (up to 3 words)
   * - If single word, takes first 3-6 characters
   */
  private createSlug(name: string): string {
    // Remove special characters and extra spaces
    const cleaned = name
      .trim()
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, ' ');

    const words = cleaned.split(' ').filter((w) => w.length > 0);

    if (words.length === 0) {
      // Fallback if name is invalid
      return 'PRD';
    }

    if (words.length === 1) {
      // Single word: take first 3-6 characters
      const word = words[0]!.toUpperCase();
      return word.substring(0, Math.min(6, word.length));
    }

    // Multiple words: take first 3 letters of each word (up to 3 words)
    return words
      .slice(0, 3)
      .map((word) => word.substring(0, 3).toUpperCase())
      .join('-');
  }

  /**
   * Generates a random alphanumeric suffix
   */
  private generateRandomSuffix(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }

    return result;
  }
}
