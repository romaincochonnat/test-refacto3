import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingController } from './shopping.controller';
import { ShoppingService } from './shopping.service';

describe('ShoppingController', () => {
  let controller: ShoppingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingController],
      providers: [ShoppingService],
    }).compile();

    controller = module.get<ShoppingController>(ShoppingController);
  });

  it('should not throw for standard customer with no items', () => {
    const basket = { items: [], type: 'STANDARD_CUSTOMER' };
    expect(() => controller.getPrice(basket)).not.toThrow();
  });

  it('should throw for basket with unknown type customer', () => {
    const basket = { items: [], type: 'XXXX_CUSTOMER' };
    expect(() => controller.getPrice(basket)).toThrow();
  });

  it('should return 180 for standard customer with 1 TSHIRT + 1 DRESS + 1 JACKET', () => {
    const basket = {
      items: [
        { type: 'TSHIRT', nb: 1 },
        { type: 'DRESS', nb: 1 },
        { type: 'JACKET', nb: 1 },
      ],
      type: 'STANDARD_CUSTOMER',
    };

    const basketPrice = controller.getPrice(basket);
    expect(basketPrice).toBe('180');
  });

  it('should return 90 for platinum customer with 1 TSHIRT + 1 DRESS + 1 JACKET', () => {
    const basket = {
      items: [
        { type: 'TSHIRT', nb: 1 },
        { type: 'DRESS', nb: 1 },
        { type: 'JACKET', nb: 1 },
      ],
      type: 'PLATINUM_CUSTOMER',
    };

    const basketPrice = controller.getPrice(basket);
    expect(basketPrice).toBe('90');
  });

  it('should throw if basketPrice > 200 for standard customer', () => {
    const basket = {
      items: [
        { type: 'TSHIRT', nb: 1 },
        { type: 'DRESS', nb: 1 },
        { type: 'JACKET', nb: 2 },
      ],
      type: 'STANDARD_CUSTOMER',
    };
    expect(() => controller.getPrice(basket)).toThrow();
  });
});
