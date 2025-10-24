import app from './server';
import { startGrpcServer } from './grpcServer';

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    // Start gRPC server
    await startGrpcServer();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`REST API Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting servers:', error);
    process.exit(1);
  }
};

start();
