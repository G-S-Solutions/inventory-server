import { Injectable } from '@nestjs/common';
import { CreateAreaInput } from './dto/create-area.input';
import { GenerateTagsInput } from './dto/generate-tags.input';
import { PrismaService } from 'src/common/services/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LogisticService {
  private appMode: string;
  private deviceId: string;
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.appMode = this.configService.get<string>('APP_MODE');
    this.deviceId = this.configService.get<string>('DEVICE_ID');
  }

  // 1. Crear un Área
  async createArea(input: CreateAreaInput) {
    return this.prisma.inventoryArea.create({
      data: {
        name: input.name,
        eventId: input.eventId,
        isSynced: false, // Nace en local/nube como no sincronizado o true según tu lógica
      },
    });
  }

  // 2. Listar Áreas de un Evento (Dashboard)
  async getEventAreas(eventId: string) {
    return this.prisma.inventoryArea.findMany({
      where: { eventId },
      include: { 
        tags: {
            orderBy: { code: 'asc' } // Ordenar tags por código 001, 002...
        } 
      },
      orderBy: { name: 'asc' }
    });
  }

  // 3. Generación Masiva de Tags (1..100)
  async generateTags(input: GenerateTagsInput) {
    const { eventId, areaId, rangeStart, rangeEnd, zeroPadding } = input;
    
    // Validar que el área exista
    const area = await this.prisma.inventoryArea.findUnique({ where: { id: areaId } });
    if (!area) throw new Error("Area no encontrada");

    const tagsToInsert = [];

    for (let i = rangeStart; i <= rangeEnd; i++) {
      // Formateo: 1 -> "00001"
      const code = i.toString().padStart(zeroPadding, '0');
      
      tagsToInsert.push({
        eventId,
        areaId,
        code,
        status: 'OPEN', // Enum TagStatus.OPEN
        isSynced: false,
      });
    }

    // Insertar masivamente (Batch Insert)
    const result = await this.prisma.inventoryTag.createMany({
      data: tagsToInsert,
      skipDuplicates: true, // Si el tag 00001 ya existe, lo salta sin error
    });

    return {
      success: true,
      message: `Se generaron ${result.count} tags correctamente.`,
    };
  }
}