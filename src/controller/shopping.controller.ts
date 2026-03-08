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

const CUSTOMER_TYPE_NAME: Record<string, string> = {
  STANDARD_CUSTOMER: 'standard',
  PREMIUM_CUSTOMER: 'premium',
  PLATINUM_CUSTOMER: 'platinum',
};

const CUSTOMER_DISCOUNT: Record<string, number> = {
  STANDARD_CUSTOMER: 1,
  PREMIUM_CUSTOMER: 0.9,
  PLATINUM_CUSTOMER: 0.5,
};

const CUSTOMER_MAX_PRICE: Record<string, number> = {
  STANDARD_CUSTOMER: 200,
  PREMIUM_CUSTOMER: 800,
  PLATINUM_CUSTOMER: 2000,
};

const PERIOD_DISCOUNT: Record<string, number> = {
  TSHIRT: 1,
  DRESS: 0.8,
  JACKET: 0.9,
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

  public getPeriodDiscount(date: Date, itemType: string): number {
    const periodDiscount = PERIOD_DISCOUNT[itemType];
    const noPeriodDiscount = 1;
    if (periodDiscount === undefined) return noPeriodDiscount;
    if (
      date.getDate() < 15 &&
      date.getDate() > 5 &&
      (date.getMonth() === 5 || date.getMonth() === 0)
    ) {
      return periodDiscount;
    } else {
      return noPeriodDiscount;
    }
  }

  public getCustomerMaxPrice(basket: Basket) {
    const customerType = basket.type;
    const customerMaxPrice = CUSTOMER_MAX_PRICE[customerType];
    return customerMaxPrice;
  }

  public validateBasketMaxPrice(basket: Basket, basketPrice: number) {
    try {
      if (basketPrice > this.getCustomerMaxPrice(basket)) {
        throw new Error(
          `Price (${basketPrice}) is too high for ${CUSTOMER_TYPE_NAME[basket.type]}  customer`,
        );
      }
    } catch (error) {
      throw new HttpException((error as Error).message, HttpStatus.BAD_REQUEST);
    }
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

    if (basket.items === null) {
      return '0';
    }

    for (let i = 0; i < basket.items.length; i++) {
      const item = basket.items[i];

      if (item.type === 'TSHIRT') {
        // eslint-disable-next-line prettier/prettier
          basketPrice += 30 * item.nb * this.getPeriodDiscount(cal,item.type) * customerDiscount;
      } else if (item.type === 'DRESS') {
        // eslint-disable-next-line prettier/prettier
          basketPrice += 50 * item.nb * this.getPeriodDiscount(cal,item.type) *  customerDiscount;
      } else if (item.type === 'JACKET') {
        // eslint-disable-next-line prettier/prettier
          basketPrice += 100 * item.nb * this.getPeriodDiscount(cal,item.type) *  customerDiscount;
      }
    }

    this.validateBasketMaxPrice(basket, basketPrice);

    return String(basketPrice);
  }
}
