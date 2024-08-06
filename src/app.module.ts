import { Module } from '@nestjs/common';
import { OrderModule } from './order_legacy_case/order.module';

@Module({
  imports: [OrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
