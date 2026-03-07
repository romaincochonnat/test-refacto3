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

class ShoppingBody {
  items: Item[] | null;
  type: string;

  constructor(items?: Item[], type?: string) {
    this.items = items ?? null;
    this.type = type ?? '';
  }
}

@Controller('shopping')
export class ShoppingController {
  private logger = new Logger(ShoppingController.name);

  @Post()
  getPrice(@Body() b: ShoppingBody): string {
    let p = 0;
    let d: number;

    const date = new Date();
    const cal = new Date(
      date.toLocaleString('en-US', { timeZone: 'Europe/Paris' }),
    );

    // Compute discount for customer
    if (b.type === 'STANDARD_CUSTOMER') {
      d = 1;
    } else if (b.type === 'PREMIUM_CUSTOMER') {
      d = 0.9;
    } else if (b.type === 'PLATINUM_CUSTOMER') {
      d = 0.5;
    } else {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    // Compute total amount depending on the types and quantity of product and
    // if we are in winter or summer discounts periods
    if (
      !(cal.getDate() < 15 && cal.getDate() > 5 && cal.getMonth() === 5) &&
      !(cal.getDate() < 15 && cal.getDate() > 5 && cal.getMonth() === 0)
    ) {
      if (b.items === null) {
        return '0';
      }

      for (let i = 0; i < b.items.length; i++) {
        const it = b.items[i];

        if (it.type === 'TSHIRT') {
          p += 30 * it.nb * d;
        } else if (it.type === 'DRESS') {
          p += 50 * it.nb * d;
        } else if (it.type === 'JACKET') {
          p += 100 * it.nb * d;
        }
        // else if (it.type === "SWEATSHIRT") {
        //   p += 80 * it.nb;
        // }
      }
    } else {
      if (b.items === null) {
        return '0';
      }

      for (let i = 0; i < b.items.length; i++) {
        const it = b.items[i];

        if (it.type === 'TSHIRT') {
          p += 30 * it.nb * d;
        } else if (it.type === 'DRESS') {
          p += 50 * it.nb * 0.8 * d;
        } else if (it.type === 'JACKET') {
          p += 100 * it.nb * 0.9 * d;
        }
        // else if (it.type === "SWEATSHIRT") {
        //   p += 80 * it.nb;
        // }
      }
    }

    try {
      if (b.type === 'STANDARD_CUSTOMER') {
        if (p > 200) {
          throw new Error(`Price (${p}) is too high for standard customer`);
        }
      } else if (b.type === 'PREMIUM_CUSTOMER') {
        if (p > 800) {
          throw new Error(`Price (${p}) is too high for premium customer`);
        }
      } else if (b.type === 'PLATINUM_CUSTOMER') {
        if (p > 2000) {
          throw new Error(`Price (${p}) is too high for platinum customer`);
        }
      } else {
        if (p > 200) {
          throw new Error(`Price (${p}) is too high for standard customer`);
        }
      }
    } catch (e) {
      throw new HttpException((e as Error).message, HttpStatus.BAD_REQUEST);
    }

    return String(p);
  }
}
