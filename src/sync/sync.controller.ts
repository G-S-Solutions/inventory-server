import { Controller, Post, Body } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncUploadDto } from './dto/sync-upload.dto';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('upload')
  create(@Body() payload: SyncUploadDto) {
    return this.syncService.processSyncData(payload);
  }

}
