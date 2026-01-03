import { Type } from 'class-transformer';
import { 
  IsArray, 
  IsBoolean, 
  IsDateString, 
  IsEnum, 
  IsInt, 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsString, 
  IsUUID, 
  ValidateNested 
} from 'class-validator';

// Enums (Deben coincidir con tu schema.prisma)
export enum EventStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

export enum TagStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  AUDITED = 'AUDITED',
}

// --- SUB-DTOs (Las piezas del rompecabezas) ---

export class SyncEventDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  storeName?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(EventStatus)
  status: EventStatus;

  @IsUUID()
  clientId: string;

  @IsUUID()
  supervisorId: string;

  @IsString()
  @IsOptional()
  originDevice?: string;

  @IsBoolean()
  @IsOptional()
  isSynced?: boolean;
}

export class SyncProductDto {
  @IsUUID()
  id: string;

  @IsUUID()
  eventId: string;

  @IsString()
  productCode: string;

  @IsString()
  barcode: string;

  @IsString()
  description: string;

  @IsInt()
  fractionValue: number;

  @IsNumber()
  systemStock: number; // Puede ser Int, pero IsNumber es mas seguro por si acaso

  @IsNumber()
  unitPrice: number;
}

export class SyncAreaDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsUUID()
  eventId: string;
}

export class SyncTagDto {
  @IsUUID()
  id: string;

  @IsString()
  code: string;

  @IsUUID()
  eventId: string;

  @IsUUID()
  areaId: string;

  @IsEnum(TagStatus)
  status: TagStatus;
}

export class SyncOperatorDto {
  @IsUUID()
  id: string;

  @IsString()
  dni: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}

export class SyncEventOperatorDto {
    @IsUUID()
    id: string;

    @IsUUID()
    eventId: string;

    @IsUUID()
    operatorId: string;
}

export class SyncCountDto {
  @IsUUID()
  id: string;

  @IsUUID()
  productId: string;

  @IsUUID()
  tagId: string;

  @IsUUID()
  operatorId: string;

  @IsInt()
  quantity: number;

  @IsInt()
  fraction: number;

  @IsDateString()
  scannedAt: string;
}

// --- DTO PRINCIPAL (El Payload completo) ---

export class SyncUploadDto {
  @ValidateNested()
  @Type(() => SyncEventDto)
  event: SyncEventDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncProductDto)
  products: SyncProductDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncAreaDto)
  areas: SyncAreaDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncTagDto)
  tags: SyncTagDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncOperatorDto)
  operators: SyncOperatorDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncEventOperatorDto)
  eventOperators: SyncEventOperatorDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncCountDto)
  counts: SyncCountDto[];
}