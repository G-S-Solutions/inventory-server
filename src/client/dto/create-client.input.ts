import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateClientInput {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  ruc?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  address?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  logo?: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
