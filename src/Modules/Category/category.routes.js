import { errorHandler } from "../../Middlewares/error-handling.middleware.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import { createCategorySchema, updateCategorySchema, deleteCategorySchema, filterCategoriesByTaskSharedOptionSchema} from "./category.schemas.js";
import authentication from "../../Middlewares/authentication.middleware.js";

import { Router } from "express"; 
import * as categoryController from "./category.controller.js";


const router = Router()


router.post('/create', errorHandler(authentication()), validationMiddleware(createCategorySchema), errorHandler(categoryController.createCategory))

router.get('/get', errorHandler(authentication()), errorHandler(categoryController.getAllCategories))

router.get('/getCategoriesSortedByName', errorHandler(authentication()), errorHandler(categoryController.getCategoriesSortedByName))

router.get('/getCategoriesSortedByTaskSharedOption', errorHandler(authentication()), errorHandler(categoryController.getCategoriesSortedByTaskSharedOption))

router.get('/filterCategoriesByTaskSharedOption/:sharedOption', errorHandler(authentication()), validationMiddleware(filterCategoriesByTaskSharedOptionSchema),  errorHandler(categoryController.filterCategoriesByTaskSharedOption))

router.patch('/update/:id', errorHandler(authentication()),validationMiddleware(updateCategorySchema), errorHandler(categoryController.updateCategory))

router.delete('/delete/:id', errorHandler(authentication()), validationMiddleware(deleteCategorySchema), errorHandler(categoryController.deleteCategory))





export default router