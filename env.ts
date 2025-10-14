import { cleanEnv, str, port } from 'envalid';

const env = cleanEnv(process.env, {
  POSTGRES_USER: str({ default: 'user' }),
  POSTGRES_PASSWORD: str({ default: 'password' }),
  POSTGRES_DB: str({ default: 'orderdb' }),
  POSTGRES_PORT: port({ default: 5434 }),

  ORDER_SERVICE_PORT: port({ default: 5700 }),

  NATS_PORT: port({ default: 4222 }),

  DATABASE_URL: str({
    default: 'postgresql://user:password@postgres:5432/orderdb',
    desc: 'PostgreSQL connection string for Docker',
  }),
  NATS_URL: str({
    default: 'nats://nats:4222',
    desc: 'NATS server connection string for Docker',
  }),

  PORT: port({ default: 5700 }),
});

export default env;
