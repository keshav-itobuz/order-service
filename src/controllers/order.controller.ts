import { Request, Response } from 'express';
import { orderGrpcClient } from '../clients/order.grpc-client';

export const createOrder = (req: Request, res: Response) => {
  orderGrpcClient.CreateOrder(req.body, (err: any, response: any) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(response);
  });
};

export const getOrder = (req: Request, res: Response) => {
  orderGrpcClient.GetOrder({ orderId: req.params.id }, (err: any, response: any) => {
    if (err) {
      return res.status(404).json({ error: err.message });
    }
    res.json(response);
  });
};

export const updateOrderStatus = (req: Request, res: Response) => {
  const { status } = req.body;
  orderGrpcClient.UpdateOrderStatus(
    { orderId: req.params.id, status },
    (err: any, response: any) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(response);
    }
  );
};

export const listOrders = (req: Request, res: Response) => {
  const { customerId, page = 1, limit = 10 } = req.query;
  orderGrpcClient.ListOrders(
    {
      customerId,
      page: Number(page),
      limit: Number(limit),
    },
    (err: any, response: any) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(response);
    }
  );
};
