import { Request, Response } from 'express';
import { OrderStatus } from '@prisma/client';
import prisma from '../utils/db';

class OrderController {
  createOrder = async (req: Request, res: Response) => {
    try {
      const { customerId, customerEmail, items, shippingAddress } = req.body;

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

      return res.json(order);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      return res.status(500).json({ error: message });
    }
  };

  getOrder = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const order = await prisma.order.findUniqueOrThrow({
        where: { id: orderId },
        include: { orderItems: true },
      });

      return res.json(order);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      return res.status(500).json({ error: message });
    }
  };

  updateOrderStatus = async (req: Request, res: Response) => {
    try {
      const { orderId, status } = req.body;
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status },
        include: { orderItems: true },
      });

      return res.json(order);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      return res.status(500).json({ error: message });
    }
  };

  listOrders = async (req: Request, res: Response) => {
    try {
      const { customerId, page = 1, limit = 10 } = req.body;
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
      return res.json({ orders, totalCount });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      return res.status(500).json({ error: message });
    }
  };
}
export default new OrderController();
