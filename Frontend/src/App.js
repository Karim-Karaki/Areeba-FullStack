import React, { useState, useEffect } from 'react';
import './App.css';
import { getAllItems, addNewItem,getAllCategories, addCategory} from './api';
import Item from './Item_Component';

function App() {
  const [items, setItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showCatPopup, setShowCatPopup] = useState(false);
  const [name, setName] = useState('');
  const [CategoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [categories, setCategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState(null);


  const Item_form = () => {
    const item = {
      name: name,
      category: selectedCategory,
      description: description,
      phone_number: phoneNumber
    };
    setShowPopup(true);
  };

  const Category_form = () => {
    const category = {
      name: CategoryName
    };
    setShowCatPopup(true);
  };


  const showMessage = (text, duration = 3000) => {
    setMessage(text);
    setTimeout(() => {
      setMessage(null);
    }, duration);
  };

  // Replace these functions with actual API calls
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const item = {
      name: name,
      category: selectedCategory,
      description: description,
      phone_number: phoneNumber
      
    };
    
    try {
      const newItem = await addNewItem(item);
      if (newItem.message) {
        return alert(newItem.message);
      }
      setItems((prevItems) => [...prevItems, newItem]);
      setShowPopup(false);
    } catch (error) {
      console.error('Error adding item:', error);
      showMessage('Error adding item');
    }
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();

    const category = {
      name: CategoryName
    };

    try {
      const newCategory = await addCategory(category);
      if (newCategory.message) {
        return alert(newCategory.message);
      }
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setShowCatPopup(false);
    } catch (error) {
      console.error('Error adding category:', error);
      showMessage('Error adding category');
    }
  }



  const fetchItems = async () => {
    // Fetch items logic
    const response = await getAllItems();
    return setItems(response);
  };

  const fetchCategories = async () => {
    // Fetch categories logic
    const response = await getAllCategories();
    return setCategories(response);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  }

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  return (
    <div className="App">
      <h1>Areeba Item API</h1>
      <button className='button' onClick={Item_form}>Add item</button>
      <button className='cat-button' onClick={Category_form}>Add category</button>
      <div className="items-container">
        {items.map((item) => (
          <Item
            key={item._id}
            item={item}
            onDelete={() => showMessage('Item Deleted Please Refresh')}
            onUpdate={() => showMessage('Item Updated Please Refresh')}
            categories={categories}
          />
        ))}
      </div>
      {showPopup && (
        <div className="popup">
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <br />
            <label htmlFor="phone_number">Phone Number:</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <br />
            <label htmlFor="category">Category:</label>
            <select 
                id="category" 
                name="category" 
                value={selectedCategory} 
                onChange={handleCategoryChange}>
                {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                ))}
            </select>
            <br />
            <button type="submit" onClick={handleSubmit}>Add Item</button>
            <button type="button" onClick={() => setShowPopup(false)}>
              Close 
            </button>
          </form>
        </div>
      )}
      {showCatPopup && ( 
        <div className="popup">
          <form onSubmit={handleCatSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={CategoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <br />
            <button type="submit" onClick={handleCatSubmit}>Add Category</button>
            <button type="button" onClick={() => setShowCatPopup(false)}>
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
