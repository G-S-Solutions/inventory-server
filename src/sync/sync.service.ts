import { Injectable } from '@nestjs/common';
import { CreateSyncInput } from './dto/create-sync.input';
import { UpdateSyncInput } from './dto/update-sync.input';

@Injectable()
export class SyncService {
  create(createSyncInput: CreateSyncInput) {
    return 'This action adds a new sync';
  }

  findAll() {
    return `This action returns all sync`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sync`;
  }

  update(id: number, updateSyncInput: UpdateSyncInput) {
    return `This action updates a #${id} sync`;
  }

  remove(id: number) {
    return `This action removes a #${id} sync`;
  }
}
