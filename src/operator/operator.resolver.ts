import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OperatorService } from './operator.service';
import { Operator } from './entities/operator.entity';
import { CreateOperatorInput } from './dto/create-operator.input';
import { UpdateOperatorInput } from './dto/update-operator.input';

@Resolver(() => Operator)
export class OperatorResolver {
  constructor(private readonly operatorService: OperatorService) {}

  @Mutation(() => Operator)
  createOperator(@Args('createOperatorInput') createOperatorInput: CreateOperatorInput) {
    return this.operatorService.create(createOperatorInput);
  }

  @Query(() => [Operator], { name: 'operator' })
  findAll() {
    return this.operatorService.findAll();
  }

  @Query(() => Operator, { name: 'operator' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.operatorService.findOne(id);
  }

  @Mutation(() => Operator)
  updateOperator(@Args('updateOperatorInput') updateOperatorInput: UpdateOperatorInput) {
    return this.operatorService.update(updateOperatorInput.id, updateOperatorInput);
  }

  @Mutation(() => Operator)
  removeOperator(@Args('id', { type: () => Int }) id: number) {
    return this.operatorService.remove(id);
  }
}
