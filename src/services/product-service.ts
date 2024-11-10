import {ProductRepository} from '../database/index'
import { Product } from '../database/models/Product';
import { AppError } from '../utils/app-errors';
import { FormatData } from '../utils/index'

// Here goes all the business logic

export default class ProductService{

    private repository : ProductRepository

      constructor(){
            this.repository = new ProductRepository();
      }

      async CreateProduct(productInputs:Partial<Product>){
            try{
                const productResult = await this.repository.CreateProduct(productInputs)
                return FormatData(productResult);
            }catch(err){
                console.error('Error in service layer:', err);
                throw new AppError('Error creating product in database', 500, 'Unable to save product', true);
            }
        }
//------------------------------------------------------------------------------
        async GetProductsByCategory(category:string){
            try {
                const products = await this.repository.FindByCategory(category);
                if (!products || products.length === 0) {
                    throw new AppError('No products found', 404, 'No products found for the given category', true);
                }
                return FormatData(products);
            }catch (err) {
                console.error('Error in GetProductsByCategory service:', err);
                throw new AppError('Error processing category request', 500, 'Unable to retrieve products by category', true);
            }
    
        }
//-----------------------------------------------------------------------------      

async GetProductDescription(productId: string) {
    try {
        const product = await this.repository.FindById(productId);

        if (!product) {
            throw new AppError('Product not found', 404, 'Product with the given ID does not exist', true);
        }

        return FormatData(product);
    } catch (err) {
        console.error('Error in GetProductDescription service:', err);
        throw new AppError('Error processing request', 500, 'Unable to retrieve product description', true);
    }
}


//-----------------------------------------------------------------------------

// async GetSelectedProducts(selectedIds:string){
//     try {
//         const products = await this.repository.FindSelectedProducts(selectedIds);
//         return FormatData(products);
//     } catch (err) {
//         // throw new APIError('Data Not found')
//     }
// }
//---------------------------------------------------------------------

async GetProductById(productId:string):Promise<Product | null>{
    try {
        const product = await this.repository.FindById(productId);
        if (!product) {
            throw new AppError('Product not found', 404, 'Product with the given ID does not exist', true);
        }
        return product as Product | null;
    } catch (err) {
        console.error('Error fetching product:', err);
        throw new AppError('Error fetching product', 500, 'Unable to fetch product by ID', true);
    }
}

//------------------------------------------------------------------------
async GetProducts(){
    try{
        const products = await this.repository.Products();
        if(!products)throw new Error('not found')

            let categories: { [key: string]: string } = {};

        products.map(({ type }) => {
            categories[type] = type;
        });
        
        return FormatData({
            products,
            categories:  Object.keys(categories) ,
        })

    }catch(err){
        console.error('Error at GetProducts:', err);
        throw new AppError('Error fetching products', 500, 'Unable to fetch product', true);
    }
}

//-------------------------------------------------------------------------

}