process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
const server = require('../bin/www')
let should = chai.should();


chai.use(chaiHttp);

describe('User Services testing', () => {
  describe('/GET User', () => {
    it('it should GET all the User', (done) => {
      chai.request(server)
        .get('/user/all')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });

  // post User data
  describe('/POST User', () => {
    it('it should not POST a User', (done) => {
      let User = {
        "email": "test@gmail.com",
        "role": "customer"
      }
      chai.request(server)
        .post('/user')
        .send(User)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          done();
        });
    });
    it('it should POST a User ', (done) => {
      let User = {
        "name": "postman testing 2",
        "email": "test@gmail.com",
        "role": "customer"
      }
      chai.request(server)
        .post('/user')
        .send(User)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('email');
          res.body.should.have.property('createdAt');
          res.body.should.have.property('updatedAt');
          res.body.should.have.property('roles');
          createdID.push(res.body._id)
          done();
        });
    });
  });
  /*
   * Test the /PUT/:id route
   */
  const createdID = []

  describe('/PATCH/:id User', () => {
    it('it should UPDATE a User given the id', (done) => {
      const id = createdID.slice(-1).pop()
      console.log("+++++++++ User id", id)
      chai
        .request(server)
        .patch(`/User/${id}`)
        .send({
          name: "update testing"
        })
        .end((error, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('_id').eql(id)
          res.body.should.have.property('name').eql("update testing")
          done()
        })
    })
  })
});
