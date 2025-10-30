import express from 'express';
import bodyParser from 'body-parser';
import orderRoutes from './routes/order.routes';

const app = express();

app.use(bodyParser.json());

app.use('/', orderRoutes);

export default app;
