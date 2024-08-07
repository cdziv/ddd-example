import { Module } from '@nestjs/common';
import { BnbModule } from './modules';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot(), BnbModule],
})
export class AppModule {}
