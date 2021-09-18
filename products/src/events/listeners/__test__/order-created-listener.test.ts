import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Product } from "../../../models/products";
import { OrderCreatedEvent, OrderStatus } from "@vleing/common";

const setup = async () => {

  const listener = new OrderCreatedListener(natsWrapper.client);

  const product = Product.build({
    title: 'prueba',
    price: 100,
    userId:'asddf'
  });

  await product.save();

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'bjdnb',
    expiresAt: 'bjsdnsd',
    product: {
      id: product.id,
      price: product.price,
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, product, data, msg };

}

it('sets the userId of the product', async () => {
  const { listener, product, data, msg } = await setup()
  await listener.onMessage(data, msg);

  const updatedProduct = await Product.findById(product.id);

  expect(updatedProduct!.orderId).toEqual(data.id);
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

  const productUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(data.id).toEqual(productUpdatedData.orderId);
});