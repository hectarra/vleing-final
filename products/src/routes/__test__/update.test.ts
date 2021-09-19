import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Product } from '../../models/products';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404m if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/products/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'aslkdff',
      price: 20
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/products/${id}`)
    .send({
      title: 'aslkdff',
      price: 20
    })
    .expect(401);
});

it('returns a 401 if the user does not own the product', async () => {
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', global.signin())
    .send({
      title: 'asadskns',
      price: 20
    });

    await request(app)
      .put(`/api/products/${response.body.id}`)
      .set('Cookie', global.signin())
      .send({
        title: 'sjndjsdn',
        price: 200
      })
      .expect(401);


});

it('returns a 400 if the provided id does not exist', async () => {
  const cookie = global.signin();
  
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'asadskns',
      price: 20
    });

    await request(app)
      .put(`/api/products/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: '',
        price: 20
      })
      .expect(400);

      await request(app)
      .put(`/api/products/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'sjdksmd',
        price: -10
      })
      .expect(400);
});

it('updates the product provided valid inputs', async () => {
  const cookie = global.signin();
  
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'asadskns',
      price: 20
    });

  await request(app)
    .put (`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(200);

    const ticketResponse = await request(app)
      .get(`/api/products/${response.body.id}`)
      .send();

    expect(ticketResponse.body.title).toEqual('new title');
    expect(ticketResponse.body.price).toEqual(100);


});

it('publishes an event', async() => {

  const cookie = global.signin();
  
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'asadskns',
      price: 20
    });

  await request(app)
    .put (`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(200);


  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects upsates if the product is reserved', async () => {
  const cookie = global.signin();
  
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'asadskns',
      price: 20
    });

  const product = await Product.findById(response.body.id);
  product!.set({ orderId: mongoose.Types.ObjectId().toHexString()});
  await product!.save();

  await request(app)
    .put (`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(400);


})