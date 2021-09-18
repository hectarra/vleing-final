import express, { Request, Response } from 'express';
import  { Product } from '../models/products';

const router = express.Router();

router.get('/api/products', async (req: Request, res: Response) => {
  const products = await Product.find({orderId: undefined});

  res.send(products);
});

export { router as indexProductRouter }