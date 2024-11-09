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
                  
            }
      }

      async FindByCategory(category:string) {
            try {
              const products = await ProductModel.find({ type: category });
              return products;
            } catch (err) {
            //   throw new APIError(
            //     "API Error",
            //     STATUS_CODES.INTERNAL_ERROR,
            //     "Unable to Find Category"
            //   );
            }
          }

          async FindById(id: string): Promise<Product | null> {
            try {
                return await ProductModel.findById(id).lean().exec() as Product | null;
            } catch (err) {
                console.error("Error in FindById:", err);
                return null;
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