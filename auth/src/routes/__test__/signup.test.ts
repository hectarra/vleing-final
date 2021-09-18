import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test',
      password: 'password'
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.coms',
      password: 'p'
    })
    .expect(400);
})

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({ email: 'prueba@prueba.com' })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({ password: 'pruebass' })
    .expect(400);
});

it('sets a cookie after successful signup request', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
})