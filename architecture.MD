# Arquitectura Offline-First & Sincronización - Sistema de Contraloría de Inventarios

Este documento detalla la arquitectura híbrida **Nube/Local** implementada para soportar operaciones de inventario en almacenes sin conexión a internet fiable.

## 1. Concepto General

El backend (NestJS) está diseñado para desplegarse en dos modos mediante variables de entorno, manteniendo el mismo código fuente:

1.  **MODO CLOUD (Master):**
    * Servidor centralizado (VPS/AWS).
    * Recibe datos de múltiples inventarios simultáneos.
    * Es la "Fuente de la Verdad" administrativa (Clientes, Usuarios, Roles).

2.  **MODO LOCAL (Nodo):**
    * Servidor ejecutándose en la Laptop del Supervisor en la tienda.
    * Opera 100% Offline (Red Local LAN con PDAs).
    * Recolecta datos masivos (conteos) y los sincroniza ("Push") hacia la Nube cuando se conecta a internet.

---

## 2. Configuración de Entorno (.env)

Es crítico configurar estas variables correctamente según el entorno de despliegue.

### A. Para Servidor Nube (AWS/DigitalOcean/VPS)
El servidor maestro que recibe la data.

APP_MODE="CLOUD"
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/inventory_cloud_db"
# Identificador (Opcional en nube)
DEVICE_ID="SERVER-MASTER-01"

### B. Para Instancia Local (Laptop del Supervisor)
La instancia que va al campo.

APP_MODE="LOCAL"
PORT=3000
DATABASE_URL="postgresql://postgres:admin@localhost:5432/inventory_local_db"
# ¡IMPORTANTE! Identificador único de la laptop para trazabilidad de errores
DEVICE_ID="LAPTOP-SUPERVISOR-JUAN-01" 
# URL del Servidor Nube para realizar la sincronización (Push)
CLOUD_API_URL="https://api.tu-dominio-inventario.com"

---

## 3. Estrategia de Base de Datos (Prisma)

Para evitar conflictos de IDs al fusionar bases de datos (Local -> Nube), se siguen estas reglas estrictas en el `schema.prisma`:

### A. Identificadores Globales (UUID)
Todas las tablas utilizan UUIDs generados automáticamente.
* Regla: id String @id @default(uuid())
* Razón: Un ID generado offline (ej: 550e84...) es matemáticamente único. Al subirlo a la nube, no choca con otros registros y mantiene su identidad.

### B. Campos de Control de Sincronización
Se han añadido campos específicos a las tablas transaccionales (InventoryEvent, ImportedProduct, CountRecord, etc.):

* isSynced (Boolean): 
    - En Local: Se crea en `false`. Cambia a `true` tras recibir confirmación del servidor.
    - En Nube: Siempre llega como `true`.
* originDevice (String): Registra qué `DEVICE_ID` creó el dato originalmente.
* syncedAt (DateTime): Fecha y hora de la subida exitosa.

---

## 4. Flujo de Sincronización (PUSH)

La sincronización masiva se realiza vía **REST API** para optimizar el rendimiento (JSON crudo), conviviendo con la API GraphQL del sistema.

### Endpoint de Recepción (Nube)
* Método: POST
* Ruta: /sync/upload
* Controlador: SyncController
* Acción: Recibe un JSON con Eventos, Productos y Conteos. Ejecuta un `prisma.$transaction` con `upsert` para guardar todo o nada.

### Servicio de Envío (Local)
* Servicio: LocalSyncService
* Disparador: Botón manual "Sincronizar" o CronJob.
* Lógica:
    1. Busca registros donde `isSynced: false`.
    2. Genera un payload JSON.
    3. Envía a `CLOUD_API_URL/sync/upload`.
    4. Si recibe `200 OK`, marca los registros locales como `isSynced: true`.

---

## 5. Comandos Útiles

### Despliegue de Base de Datos
Aplicar cambios del esquema (funciona igual en Local y Nube):
npx prisma migrate deploy

### Verificación de Sincronización (SQL)
Para ver cuántos registros de conteo faltan por subir en la laptop local:
SELECT count(*) FROM "CountRecord" WHERE "isSynced" = false;

### Reiniciar Base de Datos Local (Limpieza post-inventario)
Solo en local, si se desea limpiar para un nuevo cliente:
npx prisma migrate reset