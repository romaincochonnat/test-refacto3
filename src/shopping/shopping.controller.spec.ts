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
    expect(() =>
      controller.getPrice({ items: [], type: 'STANDARD_CUSTOMER' }),
    ).not.toThrow();
  });

  it('should return 180 for standard customer with 1 TSHIRT, 1 DRESS, 1 JACKET ', () => {
    expect(
      controller.getPrice({
        items: [
          { type: 'TSHIRT', nb: 1 },
          { type: 'DRESS', nb: 1 },
          { type: 'JACKET', nb: 1 },
        ],
        type: 'STANDARD_CUSTOMER',
      }),
    ).toBe('180');
  });

  it('should return 90 for platinum customer with 1 TSHIRT, 1 DRESS, 1 JACKET ', () => {
    expect(
      controller.getPrice({
        items: [
          { type: 'TSHIRT', nb: 1 },
          { type: 'DRESS', nb: 1 },
          { type: 'JACKET', nb: 1 },
        ],
        type: 'PLATINUM_CUSTOMER',
      }),
    ).toBe('90');
  });

  it('should throw if customer type unknown', () => {
    expect(() =>
      controller.getPrice({
        items: [
          { type: 'TSHIRT', nb: 1 },
          { type: 'DRESS', nb: 1 },
          { type: 'JACKET', nb: 1 },
        ],
        type: 'XXXX_CUSTOMER',
      }),
    ).toThrow();
  });

  it('should throw if basket price > 800 for PREMIUM CUSTOMER', () => {
    expect(() =>
      controller.getPrice({
        items: [
          { type: 'TSHIRT', nb: 0 },
          { type: 'DRESS', nb: 0 },
          { type: 'JACKET', nb: 9 },
        ],
        type: 'PREMIUM_CUSTOMER',
      }),
    ).toThrow();
  });
});
