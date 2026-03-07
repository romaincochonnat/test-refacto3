import { Module } from '@nestjs/common';

import { ShoppingController } from './controller/shopping.controller';

@Module({
  imports: [],
  controllers: [ShoppingController],
  providers: [],
})
export class AppModule {}
