import request from 'supertest';
import { app } from '../../app';
import { Product } from '../../models/product';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper'; 
import mongoose from 'mongoose';

it('marks an order as cancelled', async () => {
  const product = Product.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Product',
    price: 20
  });
  await product.save();

  const user = global.signin();

  const { body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ productId: product.id})
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async() => {
  const product = Product.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Product',
    price: 20
  });
  await product.save();

  const user = global.signin();

  const { body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ productId: product.id})
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});