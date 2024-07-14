import Joi from "joi";
import { generalRules } from "../../Utils/general-rules.util.js";

export const signupSchema = {
    body: Joi.object({
        name: generalRules.userName.required(),

        email: generalRules.email.required(),

        password: generalRules.password.required(),
        
        status: Joi.string().valid('online', 'offline').optional()
    }
    
   )
    
}



export const loginSchema = {
    body: Joi.object({
        email: generalRules.email.required(),

        password: generalRules.password.required(),

    }
   )
    
}







