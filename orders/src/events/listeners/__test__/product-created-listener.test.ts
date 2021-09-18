import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { ProductCreatedEvent } from "@vleing/common";
import { ProductCreatedListener } from "../product-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Product } from "../../../models/product";

const setup = async () => {
  const listener = new ProductCreatedListener(natsWrapper.client);
  
  const data: ProductCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'prueba',
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }
  
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg };
}

it('creates and saves a product', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const product = await Product.findById(data.id);

  expect(product).toBeDefined();
  expect(product!.title).toEqual(data.title);
  expect(product!.price).toEqual(data.price)

});

it('acks the message', async() => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();

})