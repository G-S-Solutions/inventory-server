import { IsString } from 'class-validator';
import { CreateClientInput } from './create-client.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateClientInput extends PartialType(CreateClientInput) {
  @Field(() => String)
  @IsString()
  id: string;
}
