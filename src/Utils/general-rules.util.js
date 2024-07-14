import Joi from "joi";
import { Types } from "mongoose";


/**
 * Custom validation rule to check if a value is a valid MongoDB ObjectId.
 *
 * @param {string} value - The value to validate.
 * @param {Object} helper - Joi's validation helper.
 * @returns {string} Returns the value if it is valid.
 * @throws {Error} Throws an error if the value is not a valid ObjectId.
*/
const ObjectIdRule = (value, helper)=>{
    const isValidObjectId = Types.ObjectId.isValid(value)
    if(!isValidObjectId){
        return helper.message("Invalid ObjectId")
    }
    return value
}





/**
 * General Joi validation rules for various fields.
*/
export const generalRules = {
    objectId: Joi.string().custom(ObjectIdRule),

    headers: {
        "content-type": Joi.string().valid("application/json").optional(),
        "user-agent": Joi.string().optional(),
        host: Joi.string().optional(),
        "accept-encoding": Joi.string().optional(),
        "content-length": Joi.number().optional(),
        accept: Joi.string().optional(),
        connection: Joi.string().optional(),
        "postman-token": Joi.string().optional(),
        "cache-control": Joi.string().optional()
    }, 

    email: Joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 3
    }),

    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/).messages({
        "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    }),

   
    userName: Joi.string().trim().pattern(/^[a-zA-Z]{3,15}( [a-zA-Z]{3,15})?$/).messages({
        "string.pattern.base": "Name must contain only alphabets 3 to 15 characters"
    }),

    taskName: Joi.string().trim().pattern(/^[a-zA-Z0-9][a-zA-Z0-9 _.-]{1,48}[a-zA-Z0-9]$/).messages({
        'string.pattern.base': 'Task name must start and end with a letter or number and can include letters, numbers, spaces, underscores (_), hyphens (-), and periods (.) in between. The length should be between 3 and 50 characters.',
        'string.empty': 'Task name cannot be empty.',
        'string.min': 'Task name must be at least 3 characters long.',
        'string.max': 'Task name must be at most 50 characters long.'
    }),

    categoryName: Joi.string().trim().pattern(/^[a-zA-Z]{2,20}( [a-zA-Z]{2,20})?$/).messages({
        "string.pattern.base": "Category name must contain only alphabets 2 to 20 characters"
    })

}

