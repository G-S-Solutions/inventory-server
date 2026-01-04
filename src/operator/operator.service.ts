import { Injectable } from '@nestjs/common';
import { CreateOperatorInput } from './dto/create-operator.input';
import { UpdateOperatorInput } from './dto/update-operator.input';

@Injectable()
export class OperatorService {
  create(createOperatorInput: CreateOperatorInput) {
    return 'This action adds a new operator';
  }

  findAll() {
    return `This action returns all operator`;
  }

  findOne(id: number) {
    return `This action returns a #${id} operator`;
  }

  update(id: number, updateOperatorInput: UpdateOperatorInput) {
    return `This action updates a #${id} operator`;
  }

  remove(id: number) {
    return `This action removes a #${id} operator`;
  }
}
