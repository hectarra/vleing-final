import { natsWrapper } from "../../../nats-wrapper";
import { ProductUpdatedListener } from "../product-updated-listener";
import { ProductUpdatedEvent } from "@vleing/common";
import { Product } from "../../../models/product";
import mongoose from "mongoose";

const setup = async() => {
  const listener = new ProductUpdatedListener(natsWrapper.client);
  
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'prueba',
    price: 50,
  })

  await product.save();

  const data: ProductUpdatedEvent['data'] = {
    version: product.version + 1,
    id: product.id,
    title: 'new',
    price: 60,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }
  
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg, product };

};

it('finds, updates, and saves a product', async () => {
  const { listener, data, msg, product } = await setup();
  await listener.onMessage(data,msg);
  const updatedProduct = await Product.findById(product.id);
  expect(updatedProduct!.title).toEqual(data.title);
  expect(updatedProduct!.price).toEqual(data.price);
  expect(updatedProduct!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event is in the future', async () => {
  const { listener, data, msg, product } = await setup();
  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});