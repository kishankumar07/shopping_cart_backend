import {ProductRepository} from '../database/index'
import { Product } from '../database/models/Product';
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
               
            }
        }
//------------------------------------------------------------------------------
        async GetProductsByCategory(category:string){
            try {
                const products = await this.repository.FindByCategory(category);
                return FormatData(products)
            } catch (err) {
                // throw new APIError('Data Not found')
            }
    
        }
//-----------------------------------------------------------------------------      

async GetProductDescription(productId:string){
    try {
        const product = await this.repository.FindById(productId);
        return FormatData(product)
    } catch (err) {
        // throw new APIError('Data Not found')
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
        return product as Product | null;
    } catch (err) {
        console.error('Error fetching product:', err);
        return null;
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
        // throw new APIError('Data Not found')
    }
}

//-------------------------------------------------------------------------

}