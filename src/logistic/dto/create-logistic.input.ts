import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateLogisticInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
