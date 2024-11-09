import { Application, NextFunction, Request, Response } from "express";
import userAuth from "./middleware/userAuth";
import ProductService from "../services/product-service";
import CustomerService from "../services/customer-service";
import { Product } from "../database/models/Product";
import { payloadType } from "../utils/index";

export default (app:Application)=>{
      const service = new ProductService()
      const customerService = new CustomerService()

            //DESC     Create a product
            // POST     /product/create
            // Access   Public
            app.post('/product/create', async(req,res,next) => {
        
                  try {
                      const { name, desc, type, unit,price, available, supplier, banner } = req.body; 

                      const product: Partial<Product> = {
                        name,
                        desc,
                        type,
                        unit,
                        price,
                        available,
                        supplier,
                        banner
                      };

                      // validation
                      const response =  await service.CreateProduct(product) ;

                      if(response && response.data){
                        res.status(200).json({product_details:response.data})
                    }else {
                        res.status(400).json({ message: 'details unavailable' });
                    }
                   return;
                  } catch (err) {
                      next(err)    
                  }
                  
              });

            //DESC     Get product by type
            // GET     /category/:type
            // Access   Public
        app.get('/category/:type', async(req,res,next) => {
        
            const type = req.params.type;
            
            try {
            //     console.log('type at /api/product/category/:type:',type)
                const response = await service.GetProductsByCategory(type)
                if(response && response.data){
                  res.status(200).json({product_details:response.data})
              }else {
                  res.status(400).json({ message: 'details unavailable' });
              }
                  return;
            } catch (err) {
                next(err)
            }
    
        });

            //DESC     Get details of product
            // GET     /:id
            // Access   Public
            app.get('/:id', async(req,res,next) => {
        
                  const productId = req.params.id;
          
                  try {
                      const response = await service.GetProductDescription(productId);
                      if(response && response.data){
                        res.status(200).json({product_details:response.data})
                    }else {
                        res.status(400).json({ message: 'details unavailable' });
                    }
                       return;
          
                  } catch (err) {
                      next(err)
                  }
          
              });

            //DESC     Get details of productssss
            // POST     /:ids
            // Access   Public
      //   app.post('/ids', async(req,res,next) => {

      //       try {
      //           const { ids } = req.body;
      //           const products = await service.GetSelectedProducts(ids);
      //            res.status(200).json(products);
      //            return
                
      //       } catch (err) {
      //           next(err)
      //       }
           
      //   });


            //DESC     Add product to wishlist
            // PUT     /wishlist
            // Access   Private
            app.put('/wishlist',userAuth, async (req,res,next) => {

                  const { _id } = req.user as payloadType;
                  
                  try {
                      const product:Product | null = await service.GetProductById(req.body._id);
                      console.log('product going to add to wishlist at /wishlist:',product)

                      if(product){             
                            const wishList = await customerService.AddToWishlist(_id, product as Product)
                             res.status(200).json(wishList);
                                 return
                     }
                    res.status(404).json({ message: "Product not found" });
                  } catch (err) {
                      
                  }
              });

             //DESC        Removing from wishlist   
            // DELETE     /wishlist/:id
            // Access     Private
        app.delete('/wishlist/:id',userAuth, async (req,res,next) => {

            const { _id } = req.user as payloadType;
            const productId = req.params.id;
    
            try {
                const product = await service.GetProductById(productId);
                const wishlist = await customerService.AddToWishlist(_id, product as Product)
                 res.status(200).json(wishlist);
                 return;
            } catch (err) {
                next(err)
            }
        });

            //DESC      Add items to cart 
            // PUT     /cart
            // Access   Private
            app.put('/cart',userAuth, async (req,res,next) => {
        
                  const { _id, qty } = req.body;
                  
                  try {     
                        // console.log(typeof qty)
                      const product:Product|null = await service.GetProductById(_id);
                      
                      if(!product){// added a null check here by myself !
                        throw new Error('No product retrieved')
                      }
              
                      const result =  await customerService.ManageCart(req.user._id, product, qty, false);
              
                       res.status(200).json(result);
                       return;
                      
                  } catch (err) {
                      next(err)
                  }
              });

            //DESC        delete item from cart
            // DELETE     /cart/:id
            // Access   Private
        app.delete('/cart/:id',userAuth, async (req,res,next) => {

            const { _id } = req.user;
    
            try {
                const product:Product|null = await service.GetProductById(req.params.id);
                if(!product)throw new Error("no product found")
                const result = await customerService.ManageCart(_id, product, 0 , true);             
                 res.status(200).json(result);return;
            } catch (err) {
                next(err)
            }
        });

            //DESC        get Top products and category
            // GET     /
            // Access   Public
            app.get('/', async (_req: Request, res: Response, next: NextFunction) => {
                try {
                    const result = await service.GetProducts();
            
                    if (result && result.data) {
                        res.status(200).json(result.data);
                    } else {
                        res.status(404).json({ error: "Products not found" });
                    }
                } catch (error) {
                    next(error);
                }
            });
            
  

}