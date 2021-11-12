const request = require('supertest');
const app = require('../app/app');
const { User, Community, sequelize } = require('../app/shared/db/models');

describe('CommunityController (e2e)', () => {
  let jwt;

  beforeAll(async () => {
    // delete all db content
    await User.destroy({ force: true, where: {} });

    await Community.destroy({ force: true, where: {} });

    const res = await request(app).post('/api/users/auth/signup').send({
      google_id: '12nd93osns9uu',
      email: 'test@gmail.com',
      verified_email: true,
      name: 'test',
      given_name: 'test saja',
      family_name: 'testing',
      profile_pict: 'fsfje.jpg',
      locale: 'en',
      hd: true,
    });

    expect(res.statusCode).toBe(201);

    // eslint-disable-next-line prefer-destructuring
    jwt = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('/communities (POST)', () => {
    it('should return communities', async () => {
      const res = await request(app)
        .post('/api/communities')
        .send({
          name: 'Nodejs community',
          type: 'programming',
          description: 'Ini group communitas nodejs',
          privacy: 'public',
        })
        .set('cookie', `jwt=${jwt}`);

      expect(res.statusCode).toBe(201);

      expect(res.body.data).toMatchObject({
        name: 'Nodejs community',
        type: 'programming',
        description: 'Ini group communitas nodejs',
        privacy: 'public',
        community_banner:
          'https://storage.cloud.google.com/sagara-project-staging/com_banner.jpg',
        community_pict:
          'https://storage.cloud.google.com/sagara-project-staging/com_pict.jpg',
      });
    });

    it('should unathorized if theres no jwt token in cookie', async () => {
      const res = await request(app).post('/api/communities').send({
        name: 'Nodejs community',
        type: 'programming',
        description: 'Ini group communitas nodejs',
        privacy: 'public',
      });

      expect(res.statusCode).toBe(401);
    });

    it('should bad request if wrong field and required field empty', async () => {
      const res = await request(app)
        .post('/api/communities')
        .send({
          names: 'Nodejs community',
          type: 'programming',
          description: 'Ini group communitas nodejs',
          privacy: 'public',
        })
        .set('Cookie', `jwt=${jwt}`);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('/communities (GET)', () => {
    it('should return array of communities', async () => {
      await request(app)
        .post('/api/communities')
        .send({
          name: 'Nodejs community',
          type: 'programming',
          description: 'Ini group communitas nodejs',
          privacy: 'public',
        })
        .set('Cookie', `jwt=${jwt}`);

      const res = await request(app)
        .get('/api/communities')
        .set('Cookie', `jwt=${jwt}`);

      expect(res.statusCode).toBe(200);

      res.body.data.forEach((data) => {
        expect(data).toMatchObject({
          name: 'Nodejs community',
          type: 'programming',
          description: 'Ini group communitas nodejs',
          privacy: 'public',
        });
      });
    });

    it('should unauthorized when not have jwt token', async () => {
      const res = await request(app).get('/api/communities');

      expect(res.statusCode).toBe(401);
    });

    it('should return return array of community based on type filtering', async () => {
      await request(app)
        .post('/api/communities')
        .send({
          name: 'Badminton community',
          type: 'olahraga',
          description: 'Ini group communitas badminton',
          privacy: 'public',
        })
        .set('Cookie', `jwt=${jwt}`);

      const res = await request(app)
        .get('/api/communities')
        .query({ filter: 'type', value: 'olahraga' })
        .set('Cookie', `jwt=${jwt}`);

      expect(res.statusCode).toBe(200);

      res.body.data.forEach((data) => {
        expect(data).toMatchObject({ type: 'olahraga' });
      });
    });
  });
});
