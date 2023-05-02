import React, { useState } from 'react';
import './App.css';
import { deleteItem, updateItem } from './api';

const Item = ({ item, onDelete, onUpdate, categories }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(item.category._id);

  const handleUpdate = async (updatedItem) => {
    const item = {
      name: updatedItem.name,
      description: updatedItem.description,
      phone_number: updatedItem.phone_number,
      category: updatedItem.category,
    };

    try {
      const update = await updateItem(updatedItem.id, item);
      setShowPopup(false);
      window.location.reload(true);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        window.alert('The new category does not exist!');
      } else {
        window.alert('An error occurred while updating the item.');
      }
    }
  };

  const handleDelete = async (id) => {
    const response = await deleteItem(id);
    window.location.reload(true);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  }

  return (
    <div className='item-box'>
      <h4>Name:{item.name}</h4>
      <h5>Category:{item.category.name}</h5>
      <p>{item.description}</p>
      <p>{item.phone_number}</p>
      <div className='button-wrapper'>
        <button className='update-button' onClick={() => setShowPopup(true)}>
          Update
        </button>
        <button className='delete-button' onClick={() => handleDelete(item._id)}>
          Delete
        </button>
      </div>
      {showPopup && (
        <div className='popup'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate({
                id: item._id,
                name: e.target.name.value,
                description: e.target.description.value,
                phone_number: e.target.phone_number.value,
                category: selectedCategory,
              });
            }}
          >
            <label htmlFor='name'>Name:</label>
            <input type='text' id='name' name='name' defaultValue={item.name} />
            <br />
            <label htmlFor='description'>Description:</label>
            <input
              type='text'
              id='description'
              name='description'
              defaultValue={item.description}
            />
            <br />
            <label htmlFor='phone_number'>Phone Number:</label>
            <input
              type='text'
              id='phone_number'
              name='phone_number'
              defaultValue={item.phone_number}
            />
            <br />
            <label htmlFor='category'>Category:</label>
            <select
              id='category'
              name='category'
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categories && categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <br />
            <button type='submit'>Update Item</button>
            <button type='button' onClick={() => setShowPopup(false)}>
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Item;
