import { Body, Controller, Post, Logger } from '@nestjs/common';
import { ShoppingService } from './shopping.service';

export class Item {
  type: string;
  nb: number;

  constructor(type?: string, nb?: number) {
    this.type = type ?? '';
    this.nb = nb ?? 0;
  }
}

export class Basket {
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

  constructor(public shoppingService: ShoppingService) {}

  @Post()
  getPrice(@Body() basket: Basket): string {
    return this.shoppingService.calculateBasketPrice(basket);
  }
}
