import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {GenerateUserModule} from '../src/module/user/gen/GenerateUser.module';
import {GenerateUserService} from '../src/module/user/gen/GenerateUser.service';
import {INestApplication} from '@nestjs/common';

describe('GenerateUser', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [GenerateUserModule]
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`/POST api/auth/generate/user`, async () => {
        return request(app.getHttpServer())
            .post('/')
            .send({
                phone:'09030207892'
            })
            .expect(201);
    });

    afterAll(async () => {
        await app.close();
    });
});
