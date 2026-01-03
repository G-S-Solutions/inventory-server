import { Injectable, Logger } from '@nestjs/common';
import { SyncUploadDto } from './dto/sync-upload.dto';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(private prisma: PrismaService) {}

  async processSyncData(payload: SyncUploadDto) {
    const { event, products, areas, tags, operators, eventOperators, counts } =
      payload;

    this.logger.log(
      `Recibiendo sync para Evento: ${event.code} desde ${event.originDevice}`,
    );

    try {
      // Usamos transaction para asegurar integridad
      await this.prisma.$transaction(
        async (tx) => {
          // 1. CLIENTE: Asegurar que el Cliente existe (en caso raro de que no)
          // Nota: Asumimos que el cliente ya existe en nube, pero si quieres ser defensivo:
          /* await tx.client.upsert({ ... }) */

          // 2. EVENTO
          await tx.inventoryEvent.upsert({
            where: { id: event.id },
            update: {
              ...event,
              status: event.status, // Asegurar tipos enum
              isSynced: true,
            },
            create: {
              ...event,
              status: event.status,
              isSynced: true,
            },
          });

          // 3. PRODUCTOS (Batch Upsert no existe en Prisma nativo, usamos loop o createMany con skipDuplicates)
          // Para sync masiva, createMany con skipDuplicates es lo más rápido si no esperas cambios en productos
          if (products.length > 0) {
            // Nota: createMany no actualiza si existe. Si necesitas actualizar, debes usar loop + upsert
            await tx.importedProduct.createMany({
              data: products.map((p) => ({ ...p, isSynced: true })),
              skipDuplicates: true,
            });
          }

          // 4. AREAS & TAGS
          if (areas.length > 0) {
            await tx.inventoryArea.createMany({
              data: areas.map((a) => ({ ...a, isSynced: true })),
              skipDuplicates: true,
            });
          }
          if (tags.length > 0) {
            // Aquí usamos upsert en loop porque el estado del TAG (CLOSED) cambia y es vital actualizarlo
            for (const tag of tags) {
              await tx.inventoryTag.upsert({
                where: { id: tag.id },
                update: { status: tag.status, isSynced: true },
                create: { ...tag, status: tag.status, isSynced: true },
              });
            }
          }

          // 5. OPERADORES
          if (operators.length > 0) {
            for (const op of operators) {
              await tx.operator.upsert({
                where: { id: op.id },
                update: { ...op, isSynced: true },
                create: { ...op, isSynced: true },
              });
            }
          }
          // Vincular Operador con Evento
          if (eventOperators && eventOperators.length > 0) {
            await tx.eventOperator.createMany({
              data: eventOperators.map((eo) => ({ ...eo, isSynced: true })),
              skipDuplicates: true,
            });
          }

          // 6. CONTEOS (Lo más pesado)
          if (counts.length > 0) {
            const BATCH_SIZE = 1000; // Nuestro valor "X"

            // Iteramos el array avanzando de 1000 en 1000
            for (let i = 0; i < counts.length; i += BATCH_SIZE) {
              // Cortamos el pedazo actual (ej: del 0 al 1000, del 1000 al 2000...)
              const batch = counts.slice(i, i + BATCH_SIZE);

              this.logger.debug(
                `Insertando lote de conteos: ${i} a ${i + batch.length}`,
              );

              await tx.countRecord.createMany({
                data: batch.map((c) => ({
                  ...c,
                  isSynced: true, // Aseguramos que entren marcados como synced
                })),
                skipDuplicates: true,
              });
            }
          }
        },
        {
          maxWait: 10000, // Aumentar tiempo de espera si la carga es grande
          timeout: 20000,
        },
      );

      return {
        success: true,
        message: 'Datos sincronizados correctamente',
        processedCounts: counts.length,
      };
    } catch (error) {
      this.logger.error(`Error en Sync: ${error.message}`, error.stack);
      throw error; // Deja que NestJS devuelva 500
    }
  }
}
