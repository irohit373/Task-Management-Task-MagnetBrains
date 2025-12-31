import request from 'supertest';
import { createApp } from '../../src/app';
import { connectDB } from '../../src/config/database';
import mongoose from 'mongoose';

let app: any;

beforeAll(async () => {
  await connectDB();
  app = createApp();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
  };

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(testUser.email);
    expect(response.body.data.accessToken).toBeDefined();
  });

  it('should login a user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
  });

  it('should fail with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});