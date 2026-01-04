import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { LogisticService } from './logistic.service';
import { Logistic } from './entities/logistic.entity';
import { InventoryArea } from './entities/inventory-area.entity';
import { CreateAreaInput } from './dto/create-area.input';
import { GenerateTagsInput } from './dto/generate-tags.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Resolver(() => Logistic)
export class LogisticResolver {
  constructor(private readonly logisticService: LogisticService) {}

  // Mutation: Crear Área
  @Mutation(() => InventoryArea, { name: 'logisticCreateArea' })
  async createArea(@Args('input') input: CreateAreaInput) {
    return this.logisticService.createArea(input);
  }

  // Mutation: Generar Tags Masivamente
  @Mutation(() => InventoryArea, { name: 'logisticGenerateTags' })
  async generateTags(@Args('input') input: GenerateTagsInput) {
    return this.logisticService.generateTags(input);
  }

  // Query: Obtener Áreas y sus Tags de un evento
  @Query(() => [InventoryArea], { name: 'logisticGetAreas' })
  async getInventoryAreas(
    @Args('eventId', { type: () => ID }) eventId: string
  ) {
    return this.logisticService.getEventAreas(eventId);
  }
}
