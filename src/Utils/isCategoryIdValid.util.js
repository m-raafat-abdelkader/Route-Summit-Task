import Category from "../../DB/Models/category.model.js"
import { ErrorHandlerClass } from "./error-class.util.js"


const isCategoryIdValid = async(categoryId, userId, api)=>{
    const isIdValid = await Category.findOne({
        $and:[
            {_id: categoryId},
            {addedBy: userId}
        ]
    })

    if(!isIdValid){
        return new ErrorHandlerClass("Category not found", 400, `${api} Category API error`)
    }
}

export default isCategoryIdValid