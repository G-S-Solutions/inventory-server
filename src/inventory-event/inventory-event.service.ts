import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryEventInput } from './dto/create-inventory-event.input';
import { UpdateInventoryEventInput } from './dto/update-inventory-event.input';
import { PrismaSelect } from 'src/common/types';
import { ContextUser } from 'src/common/entities/ContextUser';
import { CommonService } from 'src/common/services/common.service';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class InventoryEventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly common: CommonService,
  ) {}

  async findAll(select: PrismaSelect, contextUser: ContextUser) {
    try {
      const inventoryEvents = await this.prisma.inventoryEvent.findMany({
        select,
      });
      return inventoryEvents;
    } catch (error) {
      this.common.handleErrors(error);
    }
  }

  async findOne(id: string, select: PrismaSelect, contextUser: ContextUser) {
    try {
      const inventoryEvent = await this.prisma.inventoryEvent.findUnique({
        where: { id },
        select,
      });

      if(!inventoryEvent) throw new NotFoundException(`Registro no encontrado`);

      return inventoryEvent;
      
    } catch (error) {
      this.common.handleErrors(error);
    }
  }

  async create(
    createInventoryEventInput: CreateInventoryEventInput,
    contextUser: ContextUser,
  ) {
    try {

      const {code, clientId, supervisorId, ...restDto} = createInventoryEventInput;

      const existsCode = await this.prisma.inventoryEvent.findUnique({
        where: { code: code.trim() },
      });

      if(existsCode) throw new ConflictException(`Ya existe un evento con ese código`);

      const existsClient = await this.prisma.client.findUnique({
        where: { id: clientId },
      });

      if(!existsClient) throw new BadRequestException(`Cliente no encontrado`);

      const existsSupervisor = await this.prisma.user.findUnique({
        where: { id: supervisorId },
      });

      if(!existsSupervisor) throw new BadRequestException(`Supervisor no encontrado`);

      const newInventoryEvent = await this.prisma.inventoryEvent.create({
        data: {
          ...restDto,
          code: code.trim(),
          clientId,
          supervisorId,
          createdBy: contextUser.id,
        },
      });

      return newInventoryEvent;
      
    } catch (error) {
      this.common.handleErrors(error);
    }
  }

  async update(
    id: string,
    updateInput: UpdateInventoryEventInput,
    contextUser: ContextUser,
  ) {
    try {

      const existsEvent = await this.prisma.inventoryEvent.findUnique({
        where: { id },
      });

      if(!existsEvent) throw new NotFoundException(`Registro no encontrado`);

      if(updateInput.clientId) {
        const existsClient = await this.prisma.client.findUnique({
          where: { id: updateInput.clientId },
        });

        if(!existsClient) throw new BadRequestException(`Cliente no encontrado`);
      };

      if(updateInput.supervisorId) {
        const existsSupervisor = await this.prisma.user.findUnique({
          where: { id: updateInput.supervisorId },
        });

        if(!existsSupervisor) throw new BadRequestException(`Supervisor no encontrado`);
      }

      const updatedInventoryEvent = await this.prisma.inventoryEvent.update({
        where: { id },
        data: {
          ...updateInput,
          updatedBy: contextUser.id,
        },
      });

      return updatedInventoryEvent;
      
    } catch (error) {
      console.log(error)
      this.common.handleErrors(error);
    }
  }

  async remove(id: string, contextUser: ContextUser) {
    try {

      const existsEvent = await this.prisma.inventoryEvent.findUnique({
        where: { id },
      });

      if(!existsEvent) throw new NotFoundException(`Registro no encontrado`);

      const deletedInventoryEvent = await this.prisma.inventoryEvent.delete({
        where: { id },
      });

      return deletedInventoryEvent;
      
    } catch (error) {
      this.common.handleErrors(error);
    }
  }
}
