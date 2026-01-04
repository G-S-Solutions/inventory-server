import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { LogisticService } from './logistic.service';
import { Logistic } from './entities/logistic.entity';
import { CreateLogisticInput } from './dto/create-logistic.input';
import { UpdateLogisticInput } from './dto/update-logistic.input';
import { InventoryArea } from './entities/inventory-area.entity';
import { CreateAreaInput } from './dto/create-area.input';
import { GenerateTagsInput } from './dto/generate-tags.input';

@Resolver(() => Logistic)
export class LogisticResolver {
  constructor(private readonly logisticService: LogisticService) {}

  // Mutation: Crear Área
  @Mutation(() => InventoryArea)
  async createArea(@Args('input') input: CreateAreaInput) {
    return this.logisticService.createArea(input);
  }

  // Mutation: Generar Tags Masivamente
  // @Mutation(() => GenericResponse)
  // async generateTags(@Args('input') input: GenerateTagsInput) {
  //   return this.logisticService.generateTags(input);
  // }

  // Query: Obtener Áreas y sus Tags de un evento
  @Query(() => [InventoryArea], { name: 'inventoryAreas' })
  async getInventoryAreas(
    @Args('eventId', { type: () => ID }) eventId: string
  ) {
    return this.logisticService.getEventAreas(eventId);
  }
}
