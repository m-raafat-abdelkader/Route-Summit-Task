import { errorHandler } from "../../Middlewares/error-handling.middleware.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import { createTaskSchema, updateTaskSchema, deleteTaskSchema, filterByCategoryNameSchema, filterBySharedOptionSchema } from "./task.schemas.js";
import authentication from "../../Middlewares/authentication.middleware.js";

import { Router } from "express"; 
import * as taskController from "./task.controller.js";


const router = Router()

router.post('/create', errorHandler(authentication()), validationMiddleware(createTaskSchema), errorHandler(taskController.createTask))

router.get('/getAll', errorHandler(authentication()), errorHandler(taskController.getAllTasks))

router.put('/update/:taskId', errorHandler(authentication()), validationMiddleware(updateTaskSchema), errorHandler(taskController.updateTask))

router.delete('/delete/:taskId', errorHandler(authentication()), validationMiddleware(deleteTaskSchema), errorHandler(taskController.deleteTask))

router.get('/filterByCategoryName/:categoryName', errorHandler(authentication()), validationMiddleware(filterByCategoryNameSchema), errorHandler(taskController.filterByCategoryName))

router.get('/filterBySharedOption/:sharedOption', errorHandler(authentication()), validationMiddleware(filterBySharedOptionSchema), errorHandler(taskController.filterBySharedOption))

router.get('/getAllTasksSortedByCategoryName', errorHandler(authentication()), errorHandler(taskController.getAllTasksSortedByCategoryName))

router.get('/getAllTasksSortedBySharedOption', errorHandler(authentication()), errorHandler(taskController.getAllTasksSortedBySharedOption))



export default router