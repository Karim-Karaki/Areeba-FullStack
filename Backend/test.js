const app = require('./items'); // Assuming your app code is in app.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
chai.use(chaiHttp);

describe('Items API', () => {

    // Test POST /items
    it('should create an item', (done) => {
      const item = {
        name: 'Test Item',
        description: 'Test Description',
        phone_number: '555-123-4567'
      };
      chai
        .request(app)
        .post('/items')
        .send(item)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.name).to.equal(item.name);
          expect(res.body.description).to.equal(item.description);
          expect(res.body.phone_number).to.equal(item.phone_number);
          done();
        });
    });
  
    // Test GET /items
    it('should get all items', (done) => {
      chai
        .request(app)
        .get('/items')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  
    // Test DELETE /items/:id
    it('should delete an item by id', (done) => {
      const itemId = '6445b44806c1367fdfc28540'; // Replace with a valid item ID
      chai
        .request(app)
        .delete(`/items/${itemId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.equal('Item deleted');
          done();
        });
    });
  
    // Test PUT /items/:id
    it('should update an item by id', (done) => {
      const itemId = '6445b4b2b84b7f3201757bbd'; // Replace with a valid item ID
      const updatedItem = {
        name: 'Updated Item',
        description: 'Updated Description',
        phone_number: '555-987-6543'
      };
      chai
        .request(app)
        .put(`/items/${itemId}`)
        .send(updatedItem)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.equal('Item updated');
          done();
        });
    });
  
  });
  