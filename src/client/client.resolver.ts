import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Resolver(() => Client)
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Query(() => [Client], { name: 'clientFindAll' })
  findAll() {
    return this.clientService.findAll();
  }

  @Query(() => Client, { name: 'clientFindById' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.clientService.findOne(id);
  }

  @Mutation(() => Client, {name: 'clientCreate'})
  createClient(@Args('createClientInput') createClientInput: CreateClientInput) {
    return this.clientService.create(createClientInput);
  }

  @Mutation(() => Client, {name: 'clientUpdate'})
  updateClient(@Args('updateClientInput') updateClientInput: UpdateClientInput) {
    return this.clientService.update(updateClientInput.id, updateClientInput);
  }

  @Mutation(() => Client, {name: 'clientRemove'})
  removeClient(@Args('id', { type: () => ID }) id: string) {
    return this.clientService.remove(id);
  }
}
