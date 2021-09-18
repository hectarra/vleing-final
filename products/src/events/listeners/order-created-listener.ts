import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@vleing/common";
import { queueGroupName } from "./queue-groupname";
import { Product } from "../../models/products";
import { ProductUpdatedPublisher } from "../publishers/product-updated-publisher"; 

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const product = await Product.findById(data.product.id);
    if(!product){
      throw new Error('Product not found');
    }    

    product.set({ orderId: data.id });

    await product.save();
    new ProductUpdatedPublisher(this.client).publish({
      id: product.id,
      price: product.price,
      title: product.title,
      userId: product.userId,
      orderId: product.orderId,
      version: product.version,
    });

    msg.ack();
  };
}