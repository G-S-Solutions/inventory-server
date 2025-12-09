import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class InventoryEvent {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
