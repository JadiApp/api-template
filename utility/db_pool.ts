import { Pool } from "pg";

class SinglePool {
  pool: Pool;
  private static i: SinglePool | null = null;

  static getInstance(): SinglePool {
    if (!SinglePool.i) {
      SinglePool.i = new SinglePool();
    }
    return SinglePool.i;
  }

  private constructor() {
    this.pool = new Pool({
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST ?? '',
      port: +(process.env.DB_PORT ?? '80'),
      database: process.env.DB_NAME,
    });    
  }
}

export const db_pool = SinglePool.getInstance().pool;
