import { IsString } from 'class-validator';
import { CreateInventoryEventInput } from './create-inventory-event.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateInventoryEventInput extends PartialType(CreateInventoryEventInput) {
  @Field(() => ID)
  @IsString()
  id: string;
}
