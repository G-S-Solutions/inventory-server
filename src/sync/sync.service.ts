import { Injectable } from '@nestjs/common';

@Injectable()
export class SyncService {
  processSyncData(payload: any) {
    const { event, counts, products } = payload;
    
    // Tu lógica de base de datos (Prisma transaction) va aquí
    
    return { success: true, processed: counts.length };
  }
}
