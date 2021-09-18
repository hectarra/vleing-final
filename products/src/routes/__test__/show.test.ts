import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('return a 404 if the product is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/products/${id}`)
    .send()
    .expect(404);
});

it('returns the product if the product is found', async () => {

  const title = 'concerts';
  const price = 20;

  const response = await request(app)
    .post('/api/products')
    .set('Cookie', global.signin())
    .send({
      title, price 
    })
    .expect(201);

  const productResponse = await request(app)
    .get(`/api/products/${response.body.id}`)
    .send()
    .expect(200);

  expect(productResponse.body.title).toEqual(title);
  expect(productResponse.body.price).toEqual(price);


});