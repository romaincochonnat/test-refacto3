import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Basket, Item } from './shopping.controller';

const CUSTOMER_DISCOUNT: Record<string, number> = {
  STANDARD_CUSTOMER: 1,
  PREMIUM_CUSTOMER: 0.9,
  PLATINUM_CUSTOMER: 0.5,
};

const SEASON_DISCOUNT: Record<string, number> = {
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
    if (!(customerType in CUSTOMER_DISCOUNT)) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    return CUSTOMER_DISCOUNT[customerType];
  }

  public getSeasonDiscount(item: Item) {
    const date = new Date();
    const cal = new Date(
      date.toLocaleString('en-US', { timeZone: 'Europe/Paris' }),
    );

    if (
      !(cal.getDate() < 15 && cal.getDate() > 5 && cal.getMonth() === 5) &&
      !(cal.getDate() < 15 && cal.getDate() > 5 && cal.getMonth() === 0)
    ) {
      return 1;
    } else {
      return SEASON_DISCOUNT[item.type];
    }
  }

  public calculateBasketPrice(basket: Basket) {
    if (basket.items === null) {
      return '0';
    }
    const customerDiscount = this.getCustomerDiscount(basket);
    const basketPrice = basket.items?.reduce(
      (total, item) =>
        (total +=
          ITEM_PRICE[item.type] *
          item.nb *
          this.getSeasonDiscount(item) *
          customerDiscount),
      0,
    );

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
