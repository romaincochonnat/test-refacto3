import { ShoppingService } from './shopping.service';

describe('ShoppingService', () => {
  describe('getCustomerDiscount', () => {
    const shoppingService = new ShoppingService();
    it('should return 0.9 if basket type = PREMIUM_CUSTOMER', () => {
      const basket = {
        items: [
          { type: 'TSHIRT', nb: 1 },
          { type: 'DRESS', nb: 1 },
          { type: 'JACKET', nb: 2 },
        ],
        type: 'PREMIUM_CUSTOMER',
      };
      const discount = shoppingService.getCustomerDiscount(basket);
      expect(discount).toBe(0.9);
    });
  });
});
