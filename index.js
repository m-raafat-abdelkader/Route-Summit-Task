import {config} from 'dotenv'
import express from 'express'
import connectDB from './DB/connection.js'

import userRouter from './src/Modules/User/user.routes.js'
import categoryRouter from './src/Modules/Category/category.routes.js'
import taskRouter from './src/Modules/Task/task.routes.js'
import { globalResponse } from './src/Middlewares/error-handling.middleware.js'


const app = express()

config()

const PORT = process.env.PORT 


app.get('/', ()=>{
    console.log("Hello World")
})



app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})


connectDB()


app.use(express.json()) 

app.use('/user', userRouter)

app.use('/category', categoryRouter)

app.use('/task', taskRouter)


app.use(globalResponse)




