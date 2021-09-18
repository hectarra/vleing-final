import { NotFoundError, validateRequest, requireAuth, NotAuthorizedError, BadRequestError } from '@vleing/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Product } from '../models/products';
import { ProductUpdatedPublisher } from '../events/publishers/product-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/products/:id', 
  requireAuth, 
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be providede and must be great')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if(!product) {
    throw new NotFoundError();
  }

  if(product.orderId) {
    throw new BadRequestError('Cannot edit a reserved product');
  }

  if(product.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  product.set({
    title: req.body.title,
    price: req.body.price
  })
  await product.save();
  new ProductUpdatedPublisher(natsWrapper.client).publish({
    id: product.id,
    title: product.title,
    price: product.price,
    userId: product.userId,
    version: product.version,
  });

  res.send(product);

})

export { router as updateProductRouter }