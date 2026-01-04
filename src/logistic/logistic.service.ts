import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateAreaInput } from './dto/create-area.input';
import { GenerateTagsInput } from './dto/generate-tags.input';
import { PrismaService } from 'src/common/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CommonService } from 'src/common/services/common.service';

@Injectable()
export class LogisticService {
  private appMode: string;
  private deviceId: string;
  constructor(
    private readonly prisma: PrismaService,
    private readonly common: CommonService,
    private readonly configService: ConfigService,
  ) {
    this.appMode = this.configService.get<string>('APP_MODE');
    this.deviceId = this.configService.get<string>('DEVICE_ID');
  }

  // 1. Crear un Área
  async createArea(input: CreateAreaInput) {
    try {
      const existingArea = await this.prisma.inventoryArea.findFirst({
        where: {
          eventId: input.eventId,
          name: input.name,
        },
      });

      if (existingArea) {
        throw new ConflictException(`El área ${input.name} ya existe para este inventario.`);
      }

      return this.prisma.inventoryArea.create({
        data: {
          name: input.name,
          eventId: input.eventId,
          isSynced: false, // Nace en local/nube como no sincronizado o true según tu lógica
        },
      });
    } catch (error) {
      this.common.handleErrors(error);
    }
  }

  // 2. Listar Áreas de un Evento (Dashboard)
  async getEventAreas(eventId: string) {
    return this.prisma.inventoryArea.findMany({
      where: { eventId },
      include: {
        tags: {
          orderBy: { code: 'asc' }, // Ordenar tags por código 001, 002...
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  // 3. Generación Masiva de Tags (1..100)
  async generateTags(input: GenerateTagsInput) {
    const { eventId, areaId, rangeStart, rangeEnd, zeroPadding } = input;
    // console.log({ eventId, areaId, rangeStart, rangeEnd, zeroPadding })
    // Validar que el área exista
    if(rangeEnd < rangeStart) {
      throw new BadRequestException('El rango final no puede ser menor al inicial');
    }
    const area = await this.prisma.inventoryArea.findUnique({
      where: { id: areaId },
    });
    if (!area) throw new Error('Area no encontrada');

    const tagsToInsert = [];

    for (let i = rangeStart; i <= rangeEnd; i++) {
      // Formateo: 1 -> "00001"
      const code = i.toString().padStart(zeroPadding, '0');
      // console.log({i, code})
      tagsToInsert.push({
        eventId,
        areaId,
        code,
        status: 'OPEN', // Enum TagStatus.OPEN
        isSynced: false,
      });
    }
    // console.log(tagsToInsert)
    // Insertar masivamente (Batch Insert)
    const result = await this.prisma.inventoryTag.createMany({
      data: tagsToInsert,
      skipDuplicates: true, // Si el tag 00001 ya existe, lo salta sin error
    });

    const areaTags = await this.prisma.inventoryArea.findUnique({
      where: { id: areaId },
      include: { tags : {
        orderBy: { code: 'asc' },
      }},
    });
    // console.log(areaTags)

    return areaTags;
  }
}
