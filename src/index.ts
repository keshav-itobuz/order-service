import env from '../env.js';
import { initNats } from './nats.js';
import app from './server.js';

const PORT = env.PORT;

await initNats();

app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});
