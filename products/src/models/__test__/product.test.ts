import { Product } from "../products";

it('implements optimistic concurrency control', async (done) => {

  const product = Product.build({
    title: 'prueba',
    price: 5,
    userId: '123'
  });

  await product.save();

  const firstInstance = await Product.findById(product.id);
  const secondInstance = await Product.findById(product.id);

  firstInstance!.set({price: 10});
  secondInstance!.set({price: 15});

  await firstInstance!.save();


  try{
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error('Shold not reach this point');
});

it('increments the version number on multiples saves', async() => {
  const product = Product.build({
    title: 'prueba',
    price: 5,
    userId: '123'
  });

  await product.save();
  expect(product.version).toEqual(0);
  await product.save();
  expect(product.version).toEqual(1);

});