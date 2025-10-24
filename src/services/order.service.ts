import { PrismaClient, OrderStatus } from '@prisma/client';
import * as grpc from '@grpc/grpc-js';

const prisma = new PrismaClient();

const handleGrpcError = (error: any, callback: grpc.sendUnaryData<any>) => {
  console.error('gRPC Error:', error);
  if (error?.code === 'P2025') {
    callback({ code: grpc.status.NOT_FOUND, message: 'Order not found' });
    return;
  }
  callback({ code: grpc.status.INTERNAL, message: 'Internal server error' });
};

export const serviceImplementation = {
  async CreateOrder(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    try {
      const { customerId, customerEmail, items, shippingAddress } = call.request;

      const totalAmount = items.reduce(
        (sum: number, item: any) => sum + item.quantity * item.unitPrice,
        0
      );

      const order = await prisma.order.create({
        data: {
          customerId,
          customerEmail,
          status: OrderStatus.PENDING,
          totalAmount,
          shippingAddress,
          orderItems: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
            })),
          },
        },
        include: {
          orderItems: true,
        },
      });

      callback(null, {
        id: order.id,
        customerId: order.customerId,
        customerEmail: order.customerEmail,
        status: order.status,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        items: order.orderItems,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      });
    } catch (error) {
      handleGrpcError(error, callback);
    }
  },

  async GetOrder(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    try {
      const { orderId } = call.request;
      const order = await prisma.order.findUniqueOrThrow({
        where: { id: orderId },
        include: { orderItems: true },
      });

      callback(null, {
        id: order.id,
        customerId: order.customerId,
        customerEmail: order.customerEmail,
        status: order.status,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        items: order.orderItems,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      });
    } catch (error) {
      handleGrpcError(error, callback);
    }
  },

  async UpdateOrderStatus(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    try {
      const { orderId, status } = call.request;
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status },
        include: { orderItems: true },
      });

      callback(null, {
        id: order.id,
        customerId: order.customerId,
        customerEmail: order.customerEmail,
        status: order.status,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        items: order.orderItems,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      });
    } catch (error) {
      handleGrpcError(error, callback);
    }
  },

  async ListOrders(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    try {
      const { customerId, page = 1, limit = 10 } = call.request;
      const skip = (page - 1) * limit;

      const [orders, totalCount] = await Promise.all([
        prisma.order.findMany({
          where: { customerId },
          include: { orderItems: true },
          skip,
          take: limit,
        }),
        prisma.order.count({ where: { customerId } }),
      ]);

      callback(null, {
        orders: orders.map((order) => ({
          id: order.id,
          customerId: order.customerId,
          customerEmail: order.customerEmail,
          status: order.status,
          totalAmount: order.totalAmount,
          shippingAddress: order.shippingAddress,
          items: order.orderItems,
          createdAt: order.createdAt.toISOString(),
          updatedAt: order.updatedAt.toISOString(),
        })),
        totalCount,
      });
    } catch (error) {
      handleGrpcError(error, callback);
    }
  },
};
