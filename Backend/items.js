const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
const { Item, Category } = require('./itemModel');
const cors = require('cors');
app.use(cors());
const port = 4000;

//connect to DB

async function connect() {
    try {
      await mongoose.connect("mongodb+srv://karim:karim@cluster0.wwtbgbm.mongodb.net/?retryWrites=true&w=majority");
      console.log("Connected to Database!");
    } catch (error) {
      console.error(error);
    }
  }
  
connect();


//numeber validation
const validatePhoneNumber = async (phoneNumber) => {
    const config = {
      headers: {
        'apikey': '2MllYD5yB3chBIntmoFILkNg5YP4NZly'
      }
    };
  
    try {
      const response = await axios.get(`https://api.apilayer.com/number_verification/validate?number=${phoneNumber}`, config);
      return response.data;
    } catch (error) {
      console.error('error', error);
      throw new Error('An error occurred while validating phone number');
    }
  };


//Category routes


app.post('/categories', async (req, res) => {
    const category = {
        name: req.body.name
    };
    try {

        const newCategory = new Category(category); 
        const test = await newCategory.save();
        res.json(newCategory);
    } catch (error) {
        console.error('error', error);  
        res.status(500).json({ message: 'An error occurred' });
    }
});

app.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});



//Item routes

app.post('/items', async (req, res) => {
    const item = {
        name: req.body.name,
        category: req.body.category,   
        description: req.body.description,
        phone_number: req.body.phone_number
    };
    try {
        // Find the category by the name
        const category = await Category.findOne({ _id: req.body.category });

        // Check if the category exists, if it doesn't, you can't add the item
        if (!category) {
            return res.status(400).json({ message: 'Invalid Category' });
        }
        // Set the item's category to the ObjectId of the found category
        item.category = category._id;

        const response = await validatePhoneNumber(item.phone_number);
        if (response.valid) {
            const newItem = new Item(item);
            await newItem.save();
            res.json(newItem);
        } else {
            res.json({ message: 'Invalid Number' });
        }
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});


app.get('/items', async (req, res) => {
    try {
        const items = await Item.find().populate('category');
        res.json(items);
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});



app.delete('/items/:id', async (req, res) => {
    try {
        const items = await Item.findByIdAndDelete(req.params.id);
        res.json("Item deleted");
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

app.put('/items/:id', async (req, res) => {
    const item = {
        name: req.body.name,
        description: req.body.description,
        phone_number: req.body.phone_number,
        category: req.body.category
    };
    try {
        const response = await validatePhoneNumber(item.phone_number);
        if(response.valid){
            // find the category by the name
            const category = await Category.findOne({ _id: item.category });
            // check if the category exists, if it doesn't, respond with an error message
            if (!category) {
                return res.status(400).json({ message: 'Category does not exist' });
            }
            const itemSchema = await Item.findByIdAndUpdate(req.params.id, item, {new: true});
            res.json("Item updated");
        } else {
            res.status(500).json({ message: 'Invalid Number' });
        }
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});



function listen(port, callback) {
    app.listen(port, callback);
  }
  
module.exports = { app, listen };
  
if (require.main === module) {
    listen(port, () => {
      console.log(`Items service listening at http://localhost:${port}`);
    });
  }
  