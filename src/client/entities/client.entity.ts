import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Client {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  ruc?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  logo?: string;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => Date)
  createdAt: Date;
  
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
  
  @Field(() => String, { nullable: true })
  createdBy?: string;

  @Field(() => String, { nullable: true })
  updatedBy?: string;
}