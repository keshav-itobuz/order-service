import { connect, StringCodec } from 'nats';
import type { NatsConnection } from 'nats';
import env from '../env.js';

let natConnectionInstance: NatsConnection;

export async function initNats() {
  natConnectionInstance = await connect({
    servers: env.NATS_URL,
  });
  console.log('Connected to NATS');
  return natConnectionInstance;
}

export function getNats() {
  if (!natConnectionInstance) throw new Error('NATS not initialized');
  return natConnectionInstance;
}

export const sc = StringCodec();
