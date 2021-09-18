import request from 'supertest';
import { app } from '../../app';
import { Product } from '../../models/product';
import mongoose from 'mongoose';

it('fetches the order', async () => {

  const product = Product.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Product',
    price: 20
  });
  await product.save();

  const user = global.signin();

  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({  productId: product.id })
    .expect(201);

  const {body: fetchedOrder} = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('return an error if one user tries to fetch another user order', async () => {

  const product = Product.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Product',
    price: 20
  });
  await product.save();

  const user = global.signin();
  const userTwo = global.signin();

  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({  productId: product.id })
    .expect(201);

  const {body: fetchedOrder} = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userTwo)
    .send()
    .expect(401);
})