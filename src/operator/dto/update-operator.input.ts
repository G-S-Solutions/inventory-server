import { CreateOperatorInput } from './create-operator.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOperatorInput extends PartialType(CreateOperatorInput) {
  @Field(() => Int)
  id: number;
}
