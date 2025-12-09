import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { ContextUser } from 'src/common/entities/ContextUser';
import { PrismaSelect } from 'src/common/types';
import { ValidRoles } from 'src/common/enum/valid-roles.enum';
import { CurrentUser, SelectFields } from 'src/common/decorators';

@UseGuards(JwtAuthGuard)
@Resolver(() => Client)
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Query(() => [Client], { name: 'clientFindAll' })
  findAll(
    @SelectFields() select: PrismaSelect,
    @CurrentUser(
      [ValidRoles.ROOT, ValidRoles.ADMIN, ValidRoles.SUPERVISOR]
    ) user: ContextUser,
  ) {
    return this.clientService.findAll(select, user);
  }

  @Query(() => Client, { name: 'clientFindById' })
  findOne(
    @Args('id', { type: () => ID }) id: string,
    @SelectFields() select: PrismaSelect,
    @CurrentUser(
      [ValidRoles.ROOT, ValidRoles.ADMIN, ValidRoles.SUPERVISOR]
    ) user: ContextUser,
  ) {
    return this.clientService.findOne(id, select, user);
  }

  @Mutation(() => Client, {name: 'clientCreate'})
  createClient(
    @Args('createClientInput') createClientInput: CreateClientInput,
    @CurrentUser(
      [ValidRoles.ROOT, ValidRoles.ADMIN, ValidRoles.SUPERVISOR]
    ) user: ContextUser,
  ) {
    return this.clientService.create(createClientInput, user);
  }

  @Mutation(() => Client, {name: 'clientUpdate'})
  updateClient(
    @Args('updateClientInput') updateClientInput: UpdateClientInput,
    @CurrentUser(
      [ValidRoles.ROOT, ValidRoles.ADMIN, ValidRoles.SUPERVISOR]
    ) user: ContextUser,
  ) {
    return this.clientService.update(updateClientInput.id, updateClientInput, user);
  }

  @Mutation(() => Client, {name: 'clientRemove'})
  removeClient(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser(
      [ValidRoles.ROOT, ValidRoles.ADMIN]
    ) user: ContextUser,
  ) {
    return this.clientService.remove(id);
  }
}
