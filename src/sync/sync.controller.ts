import { Controller, Post, Body } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('upload')
  create(@Body() payload: any) {
    return this.syncService.processSyncData(payload);
  }

}
