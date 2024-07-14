import Task from "../../../DB/Models/task.model.js"
import Category from "../../../DB/Models/category.model.js"

import { ErrorHandlerClass } from "../../Utils/error-class.util.js"
import $Set from "../../Utils/set-operator.util.js"
import findCategories from "../../Utils/find-categories.util.js"
import findTask from "../../Utils/find-task.util.js"


export const createTask = async(req, res, next)=>{
    const userId = req.userData._id
    const {name, description, categoryId, shared} = req.body
    const category = Category.findOne(
        {
            $and:[
                {_id: categoryId},
                {addedBy: userId}
            ]
        }
    )

    if(!category){
        return next(new ErrorHandlerClass("No Category Found", 404, "Create Task API error " +
            req.protocol +
            "://" +
            req.headers.host +
            req.originalUrl)
        )
    }

    const task = new Task({
        name,
        description,
        category: categoryId,
        shared
    })

    await task.save()
    
    return res.status(201).json({message: "Task Created", task_id: task._id})
}
    



export const getAllTasks = async(req, res, next)=>{
    const userId = req.userData._id
    
    const categories = await findCategories(userId, "Get All Tasks")
    if(!Array.isArray(categories)){
        return next(categories)
    }

    for(let i = 0; i < categories.length; i++){
        var tasks = await Task.find({
            category: categories[i]._id
        })
        if(tasks.length > 0){
            break
        }
    }

    if(tasks.length === 0){
        return next(new ErrorHandlerClass("Tasks Not Found", 404, "Get All Tasks API error " +
            req.protocol +
            "://" +
            req.headers.host +
            req.originalUrl)
        )
    }

    return res.status(200).json({message: "Tasks Found", tasks})
}
    



export const updateTask = async(req, res, next)=>{
    const userId = req.userData._id
    const categories = await findCategories(userId, "Update")
    if(!Array.isArray(categories)){
        return next(categories)
    }

    const {taskId} = req.params

    const error = await findTask(categories, taskId, "Update")
    if(error){
        return next(error)
    }

    const {name, description, shared} = req.body

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
            $set: $Set({name, description, shared})
        },
        {new: true}
    ).select("-__v -updatedAt -createdAt")
     
    
    return res.status(200).json({message: "Task updated successfully", updatedTask})
}
    


export const deleteTask = async(req, res, next)=>{
    const userId = req.userData._id
    const categories = await findCategories(userId, "Update")
    if(!Array.isArray(categories)){
        return next(categories)
    }

    const {taskId} = req.params

    const error = await findTask(categories, taskId, "Update")
    if(error){
        return next(error)
    }

    await Task.findByIdAndDelete(taskId)
    
    return res.status(200).json({message: "Task deleted successfully"})
}
    


export const filterByCategoryName = async(req, res, next)=>{
    const {categoryName} = req.params
    const userId = req.userData._id
    const category = await Category.findOne({addedBy: userId, name: categoryName})
    if(!category){
        return next(new ErrorHandlerClass("Category Not Found", 404, "Filter Tasks By Category Name API error " +
            req.protocol +
            "://" +
            req.headers.host +
            req.originalUrl)
        )
    }
    const tasks = await Task.find({category: category._id}).select("-__v -updatedAt -createdAt")

    return res.status(200).json({message: "Tasks Found", tasks})

}



export const filterBySharedOption = async(req, res, next)=>{
    const {sharedOption} = req.params
    
    const tasks = await Task.find({shared: sharedOption}).select("-__v -updatedAt -createdAt")

    return res.status(200).json({message: "Tasks Found", tasks})

}



export const getAllTasksSortedByCategoryName = async(req, res, next)=>{
    const userId = req.userData._id
    
    const categories = await findCategories(userId, "Get All Tasks")
    if(!Array.isArray(categories)){
        return next(categories)
    }

    let categoriesIDs = []
    for(let i = 0; i < categories.length; i++){
       categoriesIDs.push(categories[i]._id)
    }

    const tasks = await Task.aggregate([
        {
            $match: {
                category: {$in: categoriesIDs}
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
            }
        },

        {
            $unwind: "$category"
        },

        {
            $sort: {
                "category.name": 1
            }
        },
        {
            $group: {
              _id: "$_id",
              name: { $first: "$name" },
              description: { $first: "$description" },
              shared: { $first: "$shared" },
              category: { $push: "$category" }
            }
        },
        
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                shared: 1,
                category: 1,
                category:{
                    _id: 1,
                    name: 1,
                    addedBy: 1
                }
               
            }
        }
    ])


    if(tasks.length === 0){
        return next(new ErrorHandlerClass("Tasks Not Found", 404, "Get All Tasks Sorted By Category API error " +
            req.protocol +
            "://" +
            req.headers.host +
            req.originalUrl)
        )
    }

    return res.status(200).json({message: "Tasks Found", tasks})
}




export const getAllTasksSortedBySharedOption = async(req, res, next)=>{
    const userId = req.userData._id
    
    const categories = await findCategories(userId, "Get All Tasks")
    if(!Array.isArray(categories)){
        return next(categories)
    }

    let categoriesIDs = []
    for(let i = 0; i < categories.length; i++){
       categoriesIDs.push(categories[i]._id)
    }

    const tasks = await Task.aggregate([
        {
            $match: {
                category: {$in: categoriesIDs}
            }
        },
        {
            $sort: {
                "shared": 1
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                shared: 1,
                category: 1
               
            }
        }
    ])


    if(tasks.length === 0){
        return next(new ErrorHandlerClass("Tasks Not Found", 404, "Get All Tasks Sorted By Category API error " +
            req.protocol +
            "://" +
            req.headers.host +
            req.originalUrl)
        )
    }

    return res.status(200).json({message: "Tasks Found", tasks})
}




    