import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ProductsAttrs {
  title: string;
  price: number;
  userId: string;
}

interface ProductsModel extends mongoose.Model<ProductsDoc> {
  build(attrs: ProductsAttrs) : ProductsDoc;
}

interface ProductsDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}


const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

productsSchema.set('versionKey', 'version');
productsSchema.plugin(updateIfCurrentPlugin);

productsSchema.statics.build = (attrs: ProductsAttrs) => {
  return new Product(attrs);
};

const Product =  mongoose.model<ProductsDoc, ProductsModel>('Product', productsSchema);

export { Product };