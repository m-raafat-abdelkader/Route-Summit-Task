import Joi from "joi";
import { generalRules } from "../../Utils/general-rules.util.js";

export const createTaskSchema = {
    body: Joi.object({
        name: generalRules.taskName.required(),

        description: Joi.alternatives().try(
            Joi.string().required(),
            Joi.array().required()
        ),

        categoryId: generalRules.objectId.required(),

        shared: Joi.string().valid("Public", "Private").optional()
    })
    
}




export const updateTaskSchema = {
    body: Joi.object({
        name: generalRules.taskName.optional(),

        description: Joi.alternatives().try(
            Joi.string().optional(),
            Joi.array().optional()
        ),

        shared: Joi.string().valid('Public', 'Private').optional()

    }).or('name', 'description', 'shared'),

    params: Joi.object({
        taskId: generalRules.objectId.required()
    })
    
}




export const deleteTaskSchema = {
    params: Joi.object({
        taskId: generalRules.objectId.required()
    })
    
}



export const filterByCategoryNameSchema = {
    params: Joi.object({
        categoryName: generalRules.categoryName.required()
})
    
}




export const filterBySharedOptionSchema = {
    params: Joi.object({
        sharedOption: Joi.string().valid('Public', 'Private').required()
})
    
}