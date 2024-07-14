import Category from "../../DB/Models/category.model.js"
import { ErrorHandlerClass } from "../Utils/error-class.util.js"


const isCategoryExist = async(name, api)=>{
    const category = await Category.findOne({name})

    if(category){
        return new ErrorHandlerClass("Category already exists", 409, `${api} Category API error`)
    }
   
}


export default isCategoryExist