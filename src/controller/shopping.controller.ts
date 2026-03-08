import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

class Item {
  type: string;
  nb: number;

  constructor(type?: string, nb?: number) {
    this.type = type ?? '';
    this.nb = nb ?? 0;
  }
}

class Basket {
  items: Item[] | null;
  type: string;

  constructor(items?: Item[], type?: string) {
    this.items = items ?? null;
    this.type = type ?? '';
  }
}

const CUSTOMER_DISCOUNT: Record<string, number> = {
  STANDARD_CUSTOMER: 1,
  PREMIUM_CUSTOMER: 0.9,
  PLATINUM_CUSTOMER: 0.5,
};

@Controller('shopping')
export class ShoppingController {
  private logger = new Logger(ShoppingController.name);

  constructor() {}

  public getCustomerDiscount(basket: Basket): number {
    const customerType = basket.type;
    const customerDiscount = CUSTOMER_DISCOUNT[customerType];
    if (customerDiscount === undefined)
      throw new Error('400: Bad request - unknown customer type');
    return customerDiscount;
  }

  @Post()
  getPrice(@Body() basket: Basket): string {
    let basketPrice = 0;
    let customerDiscount: number;

    const date = new Date();
    const cal = new Date(
      date.toLocaleString('en-US', { timeZone: 'Europe/Paris' }),
    );

    customerDiscount = this.getCustomerDiscount(basket);

    // Compute total amount depending on the types and quantity of product and
    // if we are in winter or summer discounts periods
    if (
      !(cal.getDate() < 15 && cal.getDate() > 5 && cal.getMonth() === 5) &&
      !(cal.getDate() < 15 && cal.getDate() > 5 && cal.getMonth() === 0)
    ) {
      if (basket.items === null) {
        return '0';
      }

      for (let i = 0; i < basket.items.length; i++) {
        const it = basket.items[i];

        if (it.type === 'TSHIRT') {
          basketPrice += 30 * it.nb * customerDiscount;
        } else if (it.type === 'DRESS') {
          basketPrice += 50 * it.nb * customerDiscount;
        } else if (it.type === 'JACKET') {
          basketPrice += 100 * it.nb * customerDiscount;
        }
        // else if (it.type === "SWEATSHIRT") {
        //   p += 80 * it.nb;
        // }
      }
    } else {
      if (basket.items === null) {
        return '0';
      }

      for (let i = 0; i < basket.items.length; i++) {
        const it = basket.items[i];

        if (it.type === 'TSHIRT') {
          basketPrice += 30 * it.nb * customerDiscount;
        } else if (it.type === 'DRESS') {
          basketPrice += 50 * it.nb * 0.8 * customerDiscount;
        } else if (it.type === 'JACKET') {
          basketPrice += 100 * it.nb * 0.9 * customerDiscount;
        }
        // else if (it.type === "SWEATSHIRT") {
        //   p += 80 * it.nb;
        // }
      }
    }

    try {
      if (basket.type === 'STANDARD_CUSTOMER') {
        if (basketPrice > 200) {
          throw new Error(
            `Price (${basketPrice}) is too high for standard customer`,
          );
        }
      } else if (basket.type === 'PREMIUM_CUSTOMER') {
        if (basketPrice > 800) {
          throw new Error(
            `Price (${basketPrice}) is too high for premium customer`,
          );
        }
      } else if (basket.type === 'PLATINUM_CUSTOMER') {
        if (basketPrice > 2000) {
          throw new Error(
            `Price (${basketPrice}) is too high for platinum customer`,
          );
        }
      } else {
        if (basketPrice > 200) {
          throw new Error(
            `Price (${basketPrice}) is too high for standard customer`,
          );
        }
      }
    } catch (e) {
      throw new HttpException((e as Error).message, HttpStatus.BAD_REQUEST);
    }

    return String(basketPrice);
  }
}
