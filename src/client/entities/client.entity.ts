import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Client {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  ruc?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  logo?: string;

  @Field()
  isActive: boolean;
}