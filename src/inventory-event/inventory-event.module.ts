import { Module } from '@nestjs/common';
import { InventoryEventService } from './inventory-event.service';
import { InventoryEventResolver } from './inventory-event.resolver';

@Module({
  providers: [InventoryEventResolver, InventoryEventService],
})
export class InventoryEventModule {}
