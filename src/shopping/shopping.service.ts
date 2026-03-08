import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Basket } from './shopping.controller';

const CUSTOMER_TYPE = [
  'STANDARD_CUSTOMER',
  'PREMIUM_CUSTOMER',
  'PLATINUM_CUSTOMER',
];

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

const ITEM_PRICE: Record<string, number> = {
  TSHIRT: 30,
  DRESS: 50,
  JACKET: 100,
};

@Injectable()
export class ShoppingService {
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

  public calculateTotalBasketPrice(basket: Basket, date: Date) {
    if (basket.items === null) {
      return 0;
    } else if (!CUSTOMER_TYPE.includes(basket.type)) {
      throw new Error('400: Bad request - unknown customer type');
    }
    let basketPrice = 0;
    for (const item of basket.items) {
      // eslint-disable-next-line prettier/prettier
      basketPrice += ITEM_PRICE[item.type] * item.nb * this.getPeriodDiscount(date, item.type) * this.getCustomerDiscount(basket)
    }
    return basketPrice;
  }
}
