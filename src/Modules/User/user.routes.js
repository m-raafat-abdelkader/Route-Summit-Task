import { errorHandler } from "../../Middlewares/error-handling.middleware.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";

import { Router } from "express"; 
import * as userController from "./user.controller.js";

import { signupSchema, loginSchema} from "./user.schemas.js";



const router = Router()


router.post('/signup', validationMiddleware(signupSchema), errorHandler(userController.signup))

router.get('/verify-email/:token', errorHandler(userController.verifyEmail))

router.post('/login', validationMiddleware(loginSchema), errorHandler(userController.login))


export default router