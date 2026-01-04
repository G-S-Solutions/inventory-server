import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Operator {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
