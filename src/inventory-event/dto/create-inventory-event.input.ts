import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateInventoryEventInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
