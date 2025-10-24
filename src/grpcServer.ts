import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import { serviceImplementation } from './services/order.service';

// ES module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Proto loading configuration
const PROTO_PATH = path.join(__dirname, '../protos/order.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

interface OrderService extends grpc.ServiceClientConstructor {
  service: {
    CreateOrder: grpc.MethodDefinition<any, any>;
    GetOrder: grpc.MethodDefinition<any, any>;
    UpdateOrderStatus: grpc.MethodDefinition<any, any>;
    ListOrders: grpc.MethodDefinition<any, any>;
  };
}

interface OrderServicePackage {
  OrderService: OrderService;
}

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const orderService = protoDescriptor.order as unknown as OrderServicePackage;

const server = new grpc.Server();
server.addService(
  orderService.OrderService.service,
  serviceImplementation as unknown as grpc.UntypedServiceImplementation
);

const startGrpcServer = () => {
  return new Promise<void>((resolve, reject) => {
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
      if (error) {
        reject(error);
        return;
      }
      console.log(`gRPC server running on port ${port}`);
      resolve();
    });
  });
};

export { startGrpcServer };
