import { Application, NextFunction, Request, Response } from "express";
import userAuth from "./middleware/userAuth";
import ProductService from "../services/product-service";
import CustomerService from "../services/customer-service";
import { Product } from "../database/models/Product";
import { payloadType } from "../utils/index";
import { AppError } from "../utils/app-errors";

export default (app:Application)=>{
      const service = new ProductService()
      const customerService = new CustomerService()

            //DESC     Create a product
            // POST     /product/create
            // Access   Public
            app.post('/product/create', async(req,res,next) => {
        
                  try {
                      const { name, desc, type, unit,price, available, supplier, banner } = req.body; 

                      if (!name || !desc || !type || !unit || !price || !available || !supplier || !banner) {
                         res.status(400).json({ message: 'Missing required fields' });
                         return
                    }

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
                    console.error('Error in product creation:', err);
                     next(new AppError('Error creating product', 500, 'Unable to create the product', true));   
                  }
                  
              });

            //DESC     Get product by type
            // GET     /category/:type
            // Access   Public
        app.get('/category/:type', async(req,res,next) => {
        
            const type = req.params.type;
            
            if (!type || typeof type !== 'string') {
                 res.status(400).json({ message: 'Invalid category type' });
                 return
            }
            try {
            //     console.log('type at /api/product/category/:type:',type)
                const response = await service.GetProductsByCategory(type)
                if(response && response.data){
                  res.status(200).json({product_details:response.data})
              }else {
                  res.status(400).json({ message: 'details unavailable' });
              }
                  
            } catch (err) {
                console.error('Error fetching products by category:', err);
                next(new AppError('Error fetching products', 500, 'Unable to fetch products by category', true));
            }
    
        });

            //DESC     Get details of product
            // GET     /:id
            // Access   Public
            app.get('/:id', async(req,res,next) => {
        
                  const productId = req.params.id;

                  if (!productId || typeof productId !== 'string') {
                     res.status(400).json({ message: 'Invalid product ID' });
                     return;
                }
          
                  try {
                      const response = await service.GetProductDescription(productId);
                      if(response && response.data){
                        res.status(200).json({product_details:response.data})
                    }else {
                        res.status(400).json({ message: 'details unavailable' });
                    }
                       return;
          
                  } catch (err) {
                    console.error('Error fetching product description:', err);
                    next(new AppError('Error fetching product description', 500, 'Unable to fetch product details', true));
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
                    //   console.log('product going to add to wishlist at /wishlist:',product)
                    if (!product) {
                         res.status(404).json({ message: "Product not found" });
                         return;
                    }
        
                            const wishList = await customerService.AddToWishlist(_id, product as Product)
                             res.status(200).json(wishList);
                             return
                  } catch (err) {
                    console.error('Error adding product to wishlist:', err);
                     next(new AppError('Error adding product to wishlist', 500, 'Something went wrong', true));
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

                if (!product) {
                     res.status(404).json({ message: 'Product not found' });
                     return;
                }

                const wishlist = await customerService.AddToWishlist(_id, product as Product)
                 res.status(200).json(wishlist);
                 return;
            } catch (err) {
                console.error('Error removing product from wishlist:', err);
                next(new AppError('Error removing product from wishlist', 500, 'Something went wrong', true));
            }
        });

            //DESC      Add items to cart 
            // PUT     /cart
            // Access   Private
            app.put('/cart',userAuth, async (req,res,next) => {
        
                  const { _id, qty } = req.body;
                  if (!qty || qty <= 0) {
                     res.status(400).json({ message: 'Invalid quantity' });
                     return;
                }
                  
                  try {     
                        // console.log(typeof qty)
                      const product:Product|null = await service.GetProductById(_id);
                      
                      if (!product) {
                         res.status(404).json({ message: 'Product not found' });
                        return
                    }
              
                      const result =  await customerService.ManageCart(req.user._id, product, qty, false);
              
                       res.status(200).json(result);
                       return;
                      
                  } catch (err) {
                    console.error('Error adding product to cart:', err);
                    next(new AppError('Error processing cart update', 500, 'Unable to update cart at this time', true));
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