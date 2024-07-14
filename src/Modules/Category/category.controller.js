import Category from "../../../DB/Models/category.model.js"
import { ErrorHandlerClass } from "../../Utils/error-class.util.js"
import compareObjectIDs from "../../Utils/compare-objectIDs.util.js"
import isCategoryExist from "../../Utils/isCategoryExist.util.js"
import isCategoryIdValid from "../../Utils/isCategoryIdValid.util.js"
import findCategories from "../../Utils/find-categories.util.js"






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
    
    const categories = await findCategories(userId, "Get All Categories")
    if(!Array.isArray(categories)){
        return next(categories)
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




export const getCategoriesSortedByName = async(req, res, next)=>{
    const userId = req.userData._id
    
    const categories = await Category.aggregate([
        {
            $match: {
                addedBy: userId
            }
        },
        {
            $sort: {
                name: 1
            }
        },
     
        {
            $project: {
                _id: 1,
                name: 1,
                addedBy: 1
            }
        }
    ])
  
    return res.status(200).json({message: "Categories found successfully", categories})

}




export const getCategoriesSortedByTaskSharedOption = async(req, res, next)=>{
    const userId = req.userData._id
    
    const categories = await Category.aggregate([
        {
            $match: {
                addedBy: userId
            }
        },
        {
            $lookup: {
                from: "tasks",
                localField: "_id",
                foreignField: "category",
                as: "tasks"
            }
        },
        {
            $unwind: "$tasks" 
        },
        {
            $sort: {
              "tasks.shared": 1 
            }
        },
        {
            $group: {
              _id: "$_id",
              name: { $first: "$name" },
              addedBy: { $first: "$addedBy" },
              tasks: { $push: "$tasks" } 
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                addedBy: 1,
                tasks: 1,
                tasks:{
                    _id: 1,
                    name: 1,
                    description: 1,
                    shared: 1,
                    category: 1
                }
                
            }
        }
    ])
  
    return res.status(200).json({message: "Categories found successfully", categories})

}
