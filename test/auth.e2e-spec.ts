import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

  it('handles a signup request', () => {
    const email = 'asdlkq4321@akl.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'alskdfjl' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

	it('should sign up user and update the logged in user', async () => {
		const email = 'test@test.com';

		const res = await request(app.getHttpServer())
			.post('/auth/signup')
			.send({ email, password: 'test' })
			.expect(201);

		const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/current')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
	});
});