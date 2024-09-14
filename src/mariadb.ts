import { createPool, Pool } from 'mariadb';

const pool: Pool = createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'information_schema',
  connectionLimit: 5,
});

export default pool;