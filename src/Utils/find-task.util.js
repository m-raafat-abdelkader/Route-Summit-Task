import Task from "../../DB/Models/task.model.js"
import { ErrorHandlerClass } from "./error-class.util.js"

const findTask = async(categories, taskId, api)=>{
    for(let i = 0; i < categories.length; i++){
        var isTaskExist = await Task.findOne({
            _id: taskId,
            category: categories[i]._id
        })
        if(isTaskExist){
            break
        }
    }

    if(!isTaskExist){
        return new ErrorHandlerClass("No Task Found", 404, `${api} Task API error`)
        
    }

}

export default findTask