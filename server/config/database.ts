import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
  server: process.env.SQL_SERVER || 'localhost', // IP de tu laptop servidor
  database: process.env.SQL_DATABASE || 'SIGEA_DB_LOCAL',
  user: process.env.SQL_USER || 'sa',
  password: process.env.SQL_PASSWORD || 'Pollito92.',
  port: parseInt(process.env.SQL_PORT || '1433'),
  options: {
    encrypt: false, // Para desarrollo local
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('✅ Conectado a SQL Server');
  }
  return pool;
}

export async function closeConnection(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('❌ Conexión a SQL Server cerrada');
  }
}

export { sql };
