import { AppError } from '../../utils/app-errors';
import { ProductModel } from '../models/index'
import { Product } from '../models/Product';



//Dealing with database operations

export default class ProductRepository{
      async CreateProduct({ name,
            desc,
            type,
            unit,
            price,
            available,
            supplier,
            banner,}:Partial<Product>){
            try {
                  const product = new ProductModel({ name,
                        desc,
                        type,
                        unit,
                        price,
                        available,
                        supplier,
                        banner,});
                  const productResult = await product.save();
                  return productResult;
            } catch (error) {
                  console.error('Error in product repository:', error);
                  throw new AppError('Error saving product to database', 500, 'Unable to save product to database', true);
              }
      }

      async FindByCategory(category:string) {
            try {
              const products = await ProductModel.find({ type: category });
              return products;
            } catch (err) {
                  console.error('Error in FindByCategory repository:', err);
                  throw new AppError('Error finding products by category', 500, 'Unable to find products by category', true);
              }
          }

          async FindById(id: string): Promise<Product | null> {
            try {
                return await ProductModel.findById(id).lean().exec() as Product | null;
            } catch (err) {
                  console.error('Error in FindById repository:', err);
                  throw new AppError('Error finding product', 500, 'Unable to find product by ID', true);
              }
        }
        

      //     async FindSelectedProducts(selectedIds:string) {
      //       try {
      //         const products = await ProductModel.find()
      //           .where("_id")
      //           .in(selectedIds.map((_id) => _id))
      //           .exec();
      //         return products;
      //       } catch (err) {
      //         throw new APIError(
      //           "API Error",
      //           STATUS_CODES.INTERNAL_ERROR,
      //           "Unable to Find Product"
      //         );
      //       }
      //     }

      async Products():Promise<Product[]|null> {
            try {
                  const products = await ProductModel.find().lean<Product[]>(); 
                  console.log('these are the prodcuts:',products)
                  return products;
            } catch (err) {
                  console.error("Error in Products of product-repository:", err);
                  return null;
            }
          }
}