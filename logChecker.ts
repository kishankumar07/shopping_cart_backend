// // Creating a new ObjectId using mongoose
// const mongoose = require('mongoose');
// const newObjectId = new mongoose.Types.ObjectId();
// console.log(newObjectId);  // This will print a new ObjectId

// const mongoose = require('mongoose')

// const newObjectId = new mongoose.Types.ObjectId();
// console.log(newObjectId);  // Prints the string representation of the ObjectId

// let categories = {};
// const products = [
//       { type: "Electronics", name: "Phone" },
//       { type: "Clothing", name: "Shirt" }
//   ];
  
//   products.map(({ type }) => {
//      return categories[type] = type;
//   });

//   console.log(categories)
  
// class Person {
//    #age;
 
//    constructor(name, age) {
//      this.name = name;
//      this.#age = age;
//    }
 
//    getAge() {
//      return this.#age;
//    }
//  }
//  const per = new Person('Kishan',27)
//  console.log(per.#age)


// class CoffeeMachine {
//    #waterLimit = 200;
 
//    #checkWater(value) {
//      if (value < 0) throw new Error("Negative water");
//      if (value > this.#waterLimit) throw new Error("Too much water");
//    }
//  }
 
//  const coffeeMachine = new CoffeeMachine;
 
//  coffeeMachine.#checkWater();