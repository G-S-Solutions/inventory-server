import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Sync {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
