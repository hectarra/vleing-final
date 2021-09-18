import { Message } from "node-nats-streaming";
import { Listener, OrderCancelledEvent, Subjects } from "@vleing/common";
import { queueGroupName } from "./queue-groupname";
import { Product } from "../../models/products";
import { ProductUpdatedPublisher } from "../publishers/product-updated-publisher"; 

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const product = await Product.findById(data.product.id);
    if(!product){
      throw new Error('Product not found');
    }    

    product.set({ orderId: undefined });

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
  }
}