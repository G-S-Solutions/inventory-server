import { CreateSyncInput } from './create-sync.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSyncInput extends PartialType(CreateSyncInput) {
  @Field(() => Int)
  id: number;
}
