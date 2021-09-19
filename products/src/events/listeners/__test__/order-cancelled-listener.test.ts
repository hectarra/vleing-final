import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCancelledListener } from "../order-cancelled-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Product } from "../../../models/products";
import { OrderCancelledEvent, OrderStatus } from "@vleing/common";
import { OrderCreatedListener } from '../order-created-listener';

const setup = async () => {

  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString();
  const product = Product.build({
    title: 'prueba',
    price: 100,
    userId:'asddf',
  });

  product.set({ orderId });
  await product.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    product: {
      id: product.id,
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, product, data, msg, orderId };

}

it('updates the product', async () => {
  const { listener, product, data, msg } = await setup()
  await listener.onMessage(data, msg);

  const updatedProduct = await Product.findById(product.id);

  expect(updatedProduct!.orderId).not.toBeDefined();
});

it('acks the message', async() => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();

});

it('publishes a product updated event', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});