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

 /**
   * @swagger
   * /product/create:
   *   post:
   *     summary: Create a new product
   *     description: Creates a new product.
   *     tags:
   *       - Product
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               desc:
   *                 type: string
   *               type:
   *                 type: string
   *               unit:
   *                 type: string
   *               price:
   *                 type: string
   *               available:
   *                 type: string
   *               supplier:
   *                 type: string
   *               banner:
   *                 type: string
   *     responses:
   *       201:
   *         description: Product created successfully
   *       400:
   *         description: Unable to create product
   */
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

/**
 * @swagger
 * /category/{type}:
 *   get:
 *     summary: Get category by type
 *     description: Fetches the product by category
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: The product category type
 *     responses:
 *       200:
 *         description: products retrieved successfully
 *       400:
 *         description: details unavailable
 */
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

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get product by id
 *     description: Fetches the product by id
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to retrieve
 *     responses:
 *       200:
 *         description: product retrieved successfully
 *       400:
 *         description: details unavailable
 */
            app.get('/product/:id', async(req,res,next) => {
        
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


/**
   * @swagger
   * /wishlist:
   *   put:
   *     summary: Add product to wishlist
   *     description: Adds a product to the user's wishlist.
   *     tags:
   *       - Product
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               _id:
   *                 type: string
   *                 description: ID of the product to add to wishlist
   *     responses:
   *       200:
   *         description: Product added to wishlist successfully
   *       404:
   *         description: Product not found
   */
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

/**
   * @swagger
   * /wishlist/{id}:
   *   delete:
   *     summary: Remove product from wishlist
   *     description: Removes a product from the user's wishlist.
   *     tags:
   *       - Product
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the product to remove from wishlist
   *     responses:
   *       200:
   *         description: Product removed from wishlist successfully
   *       404:
   *         description: Product not found
   */
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


/**
   * @swagger
   * /cart:
   *   put:
   *     summary: Add product to cart
   *     description: Adds a specified quantity of a product to the user's cart.
   *     tags:
   *       - Product
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               _id:
   *                 type: string
   *                 description: ID of the product
   *               qty:
   *                 type: integer
   *                 description: Quantity to add to cart
   *     responses:
   *       200:
   *         description: Product added to cart successfully
   *       404:
   *         description: Product not found
   */
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

 /**
   * @swagger
   * /cart/{id}:
   *   delete:
   *     summary: Remove product from cart
   *     description: Deletes a product from the user's cart.
   *     tags:
   *       - Product
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the product to remove from cart
   *     responses:
   *       200:
   *         description: Product removed from cart successfully
   *       404:
   *         description: Product not found
   */            
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

 /**
   * @swagger
   * /product:
   *   get:
   *     summary: Get all products
   *     description: Retrieves the top products and categories.
   *     tags:
   *       - Product
   *     responses:
   *       200:
   *         description: Products retrieved successfully
   *       404:
   *         description: Products not found
   */
            app.get('/product', async (_req: Request, res: Response, next: NextFunction) => {
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