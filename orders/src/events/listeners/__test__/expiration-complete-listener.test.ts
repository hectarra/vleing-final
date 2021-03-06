import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderStatus, ExpirationCompleteEvent } from "@vleing/common";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Product } from "../../../models/product";
import { Order } from "../../../models/order";


const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  
  const product = Product.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'prueba',
    price: 50,
  });

  await product.save();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'sjdnsjd',
    expiresAt: new Date(),
    product,
  });

  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };


  return { listener, order, product, data, msg };
};

it('updates the order status to cancelled', async () => {
  const {listener, order, product, data, msg} = await setup();
  await listener.onMessage(data,msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

});

it('emit an OrderCancelled event', async () => {
 const {listener, order, product, data, msg} = await setup();
  await listener.onMessage(data,msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});