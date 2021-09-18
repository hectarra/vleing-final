import { Publisher, Subjects, ProductCreatedEvent } from '@vleing/common';

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
}