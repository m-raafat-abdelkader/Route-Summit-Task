import Category from "../../../DB/Models/category.model.js"
import { ErrorHandlerClass } from "../../Utils/error-class.util.js"
import compareObjectIDs from "../../Utils/compare-objectIDs.util.js"
import isCategoryExist from "../../Utils/isCategoryExist.util.js"
import isCategoryIdValid from "../../Utils/isCategoryIdValid.util.js"





export const createCategory = async(req, res, next)=>{
    const userId = req.userData._id
    const {name, addedBy} = req.body

    const areIdsEqual = compareObjectIDs(userId, addedBy)

    if(!areIdsEqual){
        return next(new ErrorHandlerClass("The provided addedBy ID is not authorized", 403, "Create Category API error " +
            req.protocol +
            "://" +
            req.headers.host +
            req.originalUrl))
    }

     const error = await isCategoryExist(name, "Create")
     if(error){
        return next(error)
     }


    const category = new Category({
        name,
        addedBy
    })

    await category.save()

    return res.status(201).json({message: "Category created successfully", category})

}






export const getAllCategories = async(req, res, next)=>{
    const userId = req.userData._id
    
    const categories = await Category.find({addedBy: userId}).select("-__v -updatedAt -createdAt")

    if(categories.length === 0){
        return next(new ErrorHandlerClass("Categories not found", 404, "Get All Categories API error " +
            req.protocol +
            "://" +
            req.headers.host +
            req.originalUrl))
    }

  
    return res.status(200).json({message: "Categories found successfully", categories})

}






export const updateCategory = async(req, res, next)=>{
    const {id} = req.params

    let error = await isCategoryIdValid(id, req.userData._id, "Update")
    if(error){
        return next(error)
    }

    const {name} = req.query

    error = await isCategoryExist(name, "Update")
    if(error){
        return next(error)
    }


    const newCategory = await Category.findByIdAndUpdate(
        {_id: id},
        {name},
        {new: true}
    ).select("-__v -updatedAt -createdAt")


  
    return res.status(200).json({message: "Category updated successfully", newCategory})

}





export const deleteCategory = async(req, res, next)=>{
    const {id} = req.params

    const error = await isCategoryIdValid(id, req.userData._id, "Delete")
    if(error){
        return next(error)
    }

    await Category.findByIdAndDelete({_id: id})

    return res.status(200).json({message: "Category deleted successfully"})

}







