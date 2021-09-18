import { Publisher, Subjects, ProductUpdatedEvent } from '@vleing/common';

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
}