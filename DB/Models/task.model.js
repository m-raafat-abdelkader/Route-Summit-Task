import mongoose from 'mongoose'
import { Schema, model } from 'mongoose'

const taskSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 20,
    },

    description: {
        type: mongoose.Schema.Types.Mixed, 
        required: true,
        trim: true,
        validate: {
            validator: (value) => {
                // Allow either a string or an array of objects
                if (typeof value === 'string') {
                  // Check for at least 5 consecutive alphabetic characters anywhere in the string
                  return /^(?=(?:[^A-Za-z]*[A-Za-z]){5}).*$/.test(value);
                } else if (Array.isArray(value)) {
                  // Validate each item in the array
                  return value.every((item) => {
                    if (typeof item !== 'object' || !item.text || Object.keys(item).length !== 1) {
                      return false; // Early return for invalid item structure
                    }
              
                    // Check if the "text" property is a string with at least 5 consecutive alphabetic characters
                    return typeof item.text === 'string' && /^(?=(?:[^A-Za-z]*[A-Za-z]){5}).*$/.test(item.text);
                  });
                } else {
                  // Reject any other data type
                  return false;
                }
            },

            message: 'Description must be a non-empty string or an array with non-empty text properties. String length: 10-200 chars, with at least 5 alphabetic',
        },
       
    },
    
    shared:{
      type: String,
      enum: ["Public", "Private"],
      default: "Private",

    },

    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true
    }

},{timestamps:true})




export default mongoose.models.Task || model('Task', taskSchema)