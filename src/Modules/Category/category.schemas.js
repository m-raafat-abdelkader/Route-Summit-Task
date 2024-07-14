import Joi from "joi";
import { generalRules } from "../../Utils/general-rules.util.js";

export const createCategorySchema = {
    body: Joi.object({
        name: generalRules.categoryName.required(),

        addedBy: generalRules.objectId.required()
    })
    
}




export const updateCategorySchema = {
    params: Joi.object({
        id: generalRules.objectId.required()
    }),

    query: Joi.object({
        name: generalRules.categoryName.required()
    })
    
}




export const deleteCategorySchema = {
    params: Joi.object({
        id: generalRules.objectId.required()
    })
    
}



export const filterCategoriesByTaskSharedOptionSchema = {
    params: Joi.object({
        sharedOption: Joi.string().valid("Public", "Private").required()
    })
    
}
