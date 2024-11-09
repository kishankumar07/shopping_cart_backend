// // Creating a new ObjectId using mongoose
// const mongoose = require('mongoose');
// const newObjectId = new mongoose.Types.ObjectId();
// console.log(newObjectId);  // This will print a new ObjectId

// const mongoose = require('mongoose')

// const newObjectId = new mongoose.Types.ObjectId();
// console.log(newObjectId);  // Prints the string representation of the ObjectId

let categories = {};
const products = [
      { type: "Electronics", name: "Phone" },
      { type: "Clothing", name: "Shirt" }
  ];
  
  products.map(({ type }) => {
     return categories[type] = type;
  });

  console.log(categories)
  



