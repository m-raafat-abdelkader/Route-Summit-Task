import Category from "../../DB/Models/category.model.js"
import { ErrorHandlerClass } from "./error-class.util.js"

const findCategories = async(userId, api)=>{
    const categories = await Category.find({addedBy: userId}).select("-__v -updatedAt -createdAt")
    if(categories.length === 0){
        return new ErrorHandlerClass("No Category Found for this User", 404, `${api} Task API error`)
        
    }
    return categories
}

export default findCategories