import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingController } from './shopping.controller';

describe('ShoppingController', () => {
  let controller: ShoppingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingController],
    }).compile();

    controller = module.get<ShoppingController>(ShoppingController);
  });

  it('should not throw for standard customer with no items', () => {
    expect(() =>
      controller.getPrice({ items: [], type: 'STANDARD_CUSTOMER' }),
    ).not.toThrow();
  });
});
