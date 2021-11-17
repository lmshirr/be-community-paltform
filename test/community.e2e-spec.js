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
        community_banner: expect.any(String),
        community_pict: expect.any(String),
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
        console.log(data.Community_Members, 'communities');
        expect(data).toMatchObject({
          name: 'Nodejs community',
          type: 'programming',
          description: 'Ini group communitas nodejs',
          privacy: 'public',
          community_pict: expect.any(String),
          community_banner: expect.any(String),
        });
      });
    });

    it('should unauthorized when not have jwt token', async () => {
      const res = await request(app).get('/api/communities');

      expect(res.statusCode).toBe(401);
    });

    it('should return return array of community based on type filtering and privacy public', async () => {
      await request(app)
        .post('/api/communities')
        .send({
          name: 'Badminton community',
          type: 'olahraga',
          description: 'Ini group communitas badminton',
          privacy: 'private',
        })
        .set('Cookie', `jwt=${jwt}`);

      const res = await request(app)
        .get('/api/communities')
        .query({ filter: 'type', value: 'olahraga' })
        .set('Cookie', `jwt=${jwt}`);

      expect(res.statusCode).toBe(200);

      res.body.data.forEach((data) => {
        expect(data).toMatchObject({
          type: 'olahraga',
          privacy: 'public',
          community_pict: expect.any(String),
          community_banner: expect.any(String),
        });
      });
    });
  });

  describe('/communities/{communityId}', () => {
    it('should return community detail and total member', async () => {
      // insert data
      const { body } = await request(app)
        .post('/api/communities')
        .send({
          name: 'Nodejs community',
          type: 'programming',
          description: 'Ini group communitas nodejs',
          privacy: 'private',
        })
        .set('cookie', `jwt=${jwt}`);

      const communityId = body.data.id;

      const res = await request(app)
        .get(`/api/communities/${communityId}`)
        .set('cookie', `jwt=${jwt}`);

      expect(res.statusCode).toBe(200);

      expect(res.body.data).toMatchObject({
        community: {
          privacy: 'private',
          name: 'Nodejs community',
          community_pict: expect.any(String),
        },
        total_member: expect.any(Number),
      });
    });
  });
});
