import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { InventoryEventService } from './inventory-event.service';
import { InventoryEvent } from './entities/inventory-event.entity';
import { CreateInventoryEventInput } from './dto/create-inventory-event.input';
import { UpdateInventoryEventInput } from './dto/update-inventory-event.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser, SelectFields } from 'src/common/decorators';
import { PrismaSelect } from 'src/common/types';
import { ValidRoles } from 'src/common/enum/valid-roles.enum';
import { ContextUser } from 'src/common/entities/ContextUser';

@UseGuards(JwtAuthGuard)
@Resolver(() => InventoryEvent)
export class InventoryEventResolver {
  constructor(private readonly inventoryEventService: InventoryEventService) {}

  @Query(() => [InventoryEvent], { name: 'invEventFindAll' })
  findAll(
    @SelectFields() select: PrismaSelect,
    @CurrentUser() user: ContextUser,
  ) {
    return this.inventoryEventService.findAll(select, user);
  }

  @Query(() => InventoryEvent, { name: 'invEventFindById' })
  findOne(
    @Args('id', { type: () => ID }) id: string,
    @SelectFields() select: PrismaSelect,
    @CurrentUser() user: ContextUser,
  ) {
    return this.inventoryEventService.findOne(id, select, user);
  }

  @Mutation(() => InventoryEvent, {name: 'invEventCreate'})
  createInventoryEvent(
    @Args('createInvEvntInput') createInvEvntInput: CreateInventoryEventInput,
    @CurrentUser([
      ValidRoles.ROOT,
      ValidRoles.ADMIN,
      ValidRoles.SUPERVISOR
    ]) user: ContextUser,
  ) {
    return this.inventoryEventService.create(createInvEvntInput, user);
  }

  @Mutation(() => InventoryEvent, {name: 'invEventUpdate'})
  updateInventoryEvent(
    @Args('updateInvEvntInput')
    updateInvEvntInput: UpdateInventoryEventInput,
    @CurrentUser([
      ValidRoles.ROOT,
      ValidRoles.ADMIN,
      ValidRoles.SUPERVISOR
    ]) user: ContextUser,
  ) {
    console.log('updating ...')
    return this.inventoryEventService.update(
      updateInvEvntInput.id,
      updateInvEvntInput,
      user
    );
  }

  @Mutation(() => InventoryEvent, {name: 'invEventRemove'})
  removeInventoryEvent(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([
      ValidRoles.ROOT,
      ValidRoles.ADMIN,
      ValidRoles.SUPERVISOR
    ]) user: ContextUser,
  ) {
    return this.inventoryEventService.remove(id, user);
  }
}
