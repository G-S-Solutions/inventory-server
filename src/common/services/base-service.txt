import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { PrismaService } from 'src/common/services/prisma.service';
import { CommonService } from 'src/common/services/common.service';
import { ContextUser } from 'src/common/entities/ContextUser';
import { PrismaSelect } from 'src/common/types';

@Injectable()
export class ClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly common: CommonService,
  ) {}

  async findAll(select: PrismaSelect, contextUser: ContextUser) {
    try {
      const clients = await this.prisma.client.findMany({
        select,
      });
      return clients;
    } catch (error) {
      this.common.handleErrors(error);
    }
  }

  async findOne(id: string, select: PrismaSelect, contextUser: ContextUser) {
    try {
      const client = await this.prisma.client.findUnique({
        where: { id },
        select,
      });
      if (!client) throw new NotFoundException('Registro no encontrado');
      return client;
      
    } catch (error) {
      this.common.handleErrors(error);
    }
  }

  async create(createClientInput: CreateClientInput, contextUser: ContextUser) {
    try {
      const existsClient = await this.prisma.client.findFirst({
        where: { ruc: createClientInput.name.trim() },
      });
      if (existsClient) throw new NotFoundException(`Ese cliente ya se encuentra registrado`);

      const newClient = await this.prisma.client.create({
        data: {
          ...createClientInput,
          name: createClientInput.name.trim(),
          createdBy: contextUser.id,
        },
      });

      return newClient;
    } catch (error) {
      this.common.handleErrors(error);
    }
  }

  async update(id: string, updateClientInput: UpdateClientInput, contextUser: ContextUser) {
    try {

      const existsClient = await this.prisma.client.findUnique({
        where: { id },
      });
      if (!existsClient) throw new NotFoundException(`Cliente con id: ${id} no encontrado`);

      const updatedClient = await this.prisma.client.update({
        where: { id },
        data: {
          ...updateClientInput,
          updatedBy: contextUser.id
        },
      });

      return updatedClient;
    } catch (error) {
      this.common.handleErrors(error);
    }
  }

  async remove(id: string) {
    try {
      const client = await this.prisma.client.delete({
        where: { id },
      });
      return client;
    } catch (error) {
      this.common.handleErrors(error);
    }
  }
}
