import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncResolver } from './sync.resolver';

@Module({
  providers: [SyncResolver, SyncService],
})
export class SyncModule {}
