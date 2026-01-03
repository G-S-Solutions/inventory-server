import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SyncService } from './sync.service';
import { Sync } from './entities/sync.entity';
import { CreateSyncInput } from './dto/create-sync.input';
import { UpdateSyncInput } from './dto/update-sync.input';

@Resolver(() => Sync)
export class SyncResolver {
  constructor(private readonly syncService: SyncService) {}

  @Mutation(() => Sync)
  createSync(@Args('createSyncInput') createSyncInput: CreateSyncInput) {
    return this.syncService.create(createSyncInput);
  }

  @Query(() => [Sync], { name: 'sync' })
  findAll() {
    return this.syncService.findAll();
  }

  @Query(() => Sync, { name: 'sync' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.syncService.findOne(id);
  }

  @Mutation(() => Sync)
  updateSync(@Args('updateSyncInput') updateSyncInput: UpdateSyncInput) {
    return this.syncService.update(updateSyncInput.id, updateSyncInput);
  }

  @Mutation(() => Sync)
  removeSync(@Args('id', { type: () => Int }) id: number) {
    return this.syncService.remove(id);
  }
}
