import { Injectable } from '@nestjs/common';
import { CreateInventoryEventInput } from './dto/create-inventory-event.input';
import { UpdateInventoryEventInput } from './dto/update-inventory-event.input';
import { PrismaSelect } from 'src/common/types';
import { ContextUser } from 'src/common/entities/ContextUser';
import { CommonService } from 'src/common/services/common.service';

@Injectable()
export class InventoryEventService {
  constructor(
    private readonly prisma: PrismaSelect,
    private readonly common: CommonService,
  ) {}

  async findAll(select: PrismaSelect, contextUser: ContextUser) {
    try {
      
    } catch (error) {
      this.common.handleErrors(error);
    }
  }

  async findOne(id: string, select: PrismaSelect, contextUser: ContextUser) {
    try {
      
    } catch (error) {
      this.common.handleErrors(error);
    }
  }

  async create(
    createInventoryEventInput: CreateInventoryEventInput,
    contextUser: ContextUser,
  ) {
    try {
      
    } catch (error) {
      this.common.handleErrors(error);
    }
  }

  async update(
    id: string,
    updateInventoryEventInput: UpdateInventoryEventInput,
    contextUser: ContextUser,
  ) {
    try {
      
    } catch (error) {
      this.common.handleErrors(error);
    }
  }

  async remove(id: string, contextUser: ContextUser) {
    try {
      
    } catch (error) {
      this.common.handleErrors(error);
    }
  }
}
