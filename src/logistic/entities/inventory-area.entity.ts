import { ObjectType, Field, ID } from '@nestjs/graphql';
import { InventoryTag } from './inventory-tag.entity';

@ObjectType()
export class InventoryArea {
  @Field(() => ID)
  id: string;

  @Field()
  name: string; // Ej: "BODEGA"

  @Field(() => ID)
  eventId: string;

  // Relación: Un área tiene muchos tags
  @Field(() => [InventoryTag], { nullable: 'items' })
  tags?: InventoryTag[];
}