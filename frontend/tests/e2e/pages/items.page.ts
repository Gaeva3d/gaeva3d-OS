/**
 * ItemsPage - Page Object for Items/Inventory page
 *
 * Provides helpers for interacting with the items list page,
 * including ItemCard components and demand visibility features.
 */
import { Page, Locator, expect } from '@playwright/test';
import { E2E_CONFIG } from '../config';

export class ItemsPage {
  readonly page: Page;
  readonly url = '/admin/items';

  // Main page elements
  readonly heading: Locator;
  readonly itemCards: Locator;
  readonly searchInput: Locator;
  readonly filterDropdown: Locator;

  constructor(page: Page) {
    this.page = page;

    // Page heading
    this.heading = page.getByRole('heading', { name: /items|inventory/i });

    // ItemCard components
    this.itemCards = page.locator('[data-testid="item-card"]');

    // Search and filter
    this.searchInput = page.getByPlaceholder(/search/i);
    this.filterDropdown = page.getByRole('combobox', { name: /filter|status/i });
  }

  /**
   * Navigate to the items page
   */
  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForLoad(): Promise<void> {
    await expect(this.heading).toBeVisible({ timeout: E2E_CONFIG.defaultTimeout });
  }

  /**
   * Get count of visible ItemCards
   */
  async getItemCardCount(): Promise<number> {
    return this.itemCards.count();
  }

  /**
   * Find an ItemCard by SKU
   */
  getItemCardBySku(sku: string): Locator {
    return this.itemCards.filter({ hasText: sku });
  }

  /**
   * Find ItemCards with shortage indicators
   */
  getShortageCards(): Locator {
    return this.itemCards.filter({
      has: this.page.locator('.bg-red-900, .border-red-700, [class*="red"]')
    });
  }

  /**
   * Find ItemCards by status color
   */
  getCardsByStatus(status: 'healthy' | 'tight' | 'short' | 'critical'): Locator {
    const colorPatterns: Record<string, string> = {
      healthy: 'green',
      tight: 'yellow',
      short: 'amber',
      critical: 'red',
    };

    return this.itemCards.filter({
      has: this.page.locator(`[class*="${colorPatterns[status]}"]`)
    });
  }

  /**
   * Search for items
   */
  async search(query: string): Promise<void> {
    if (await this.searchInput.isVisible().catch(() => false)) {
      await this.searchInput.fill(query);
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Click Details link on an ItemCard
   */
  async clickItemDetails(sku: string): Promise<void> {
    const card = this.getItemCardBySku(sku);
    const detailsLink = card.getByText('Details');
    await detailsLink.click();
    await this.page.waitForURL(/\/admin\/items\/\d+/);
  }

  /**
   * Get quantity values from an ItemCard
   */
  async getItemQuantities(sku: string): Promise<{
    onHand: string;
    allocated: string;
    available: string;
    incoming: string;
  }> {
    const card = this.getItemCardBySku(sku);

    const getValue = async (label: string): Promise<string> => {
      const container = card.getByText(label).locator('..');
      const value = container.locator('p').last();
      return (await value.textContent()) ?? '0';
    };

    return {
      onHand: await getValue('On Hand'),
      allocated: await getValue('Allocated'),
      available: await getValue('Available'),
      incoming: await getValue('Incoming'),
    };
  }

  /**
   * Check if an ItemCard shows shortage warning
   */
  async hasShortageWarning(sku: string): Promise<boolean> {
    const card = this.getItemCardBySku(sku);
    const shortageSection = card.locator('.bg-red-900');
    return shortageSection.isVisible().catch(() => false);
  }

  /**
   * Get shortage details from an ItemCard
   */
  async getShortageDetails(sku: string): Promise<{
    quantity: string;
    blockingOrders: string[];
  } | null> {
    const card = this.getItemCardBySku(sku);
    const shortageSection = card.locator('.bg-red-900');

    if (!(await shortageSection.isVisible().catch(() => false))) {
      return null;
    }

    // Extract shortage quantity
    const quantityText = await shortageSection.locator('.text-red-400').textContent();
    const quantityMatch = quantityText?.match(/(\d+(?:,\d+)?)/);
    const quantity = quantityMatch ? quantityMatch[1] : '0';

    // Extract blocking orders
    const blockingText = await shortageSection.locator('.text-red-300').textContent();
    const blockingOrders = blockingText
      ? blockingText.replace('Blocking:', '').trim().split(',').map(s => s.trim())
      : [];

    return { quantity, blockingOrders };
  }

  /**
   * Get allocations from an ItemCard (when showDetails is true)
   */
  async getAllocations(sku: string): Promise<Array<{
    referenceCode: string;
    customer?: string;
    quantity: string;
  }>> {
    const card = this.getItemCardBySku(sku);
    const allocationList = card.locator('ul');

    if (!(await allocationList.isVisible().catch(() => false))) {
      return [];
    }

    const items = allocationList.locator('li');
    const count = await items.count();
    const allocations: Array<{
      referenceCode: string;
      customer?: string;
      quantity: string;
    }> = [];

    for (let i = 0; i < Math.min(count, 5); i++) {
      const item = items.nth(i);
      const linkText = await item.locator('a').textContent();
      const customerSpan = item.locator('.text-gray-500');
      const quantitySpan = item.locator('.text-gray-400');

      allocations.push({
        referenceCode: linkText?.trim() ?? '',
        customer: await customerSpan.textContent().catch(() => undefined) ?? undefined,
        quantity: (await quantitySpan.textContent()) ?? '0',
      });
    }

    return allocations;
  }

  /**
   * Click on an allocation link to navigate to work order
   */
  async clickAllocation(sku: string, referenceCode: string): Promise<void> {
    const card = this.getItemCardBySku(sku);
    const link = card.getByRole('link', { name: referenceCode });
    await link.click();
    await this.page.waitForURL(/\/admin\/production\/\d+/);
  }

  /**
   * Verify page has ItemCard components integrated
   */
  async hasItemCardIntegration(): Promise<boolean> {
    await this.waitForLoad();
    return (await this.itemCards.count()) > 0;
  }
}

export default ItemsPage;
