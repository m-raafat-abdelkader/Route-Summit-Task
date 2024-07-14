import mongoose from 'mongoose'
import { Schema, model } from 'mongoose'

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 2,
        maxlength: 20,
    },
    addedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }

},{timestamps:true})


export default mongoose.models.Category || model('Category', categorySchema)