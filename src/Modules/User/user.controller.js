import User from "../../../DB/Models/user.model.js"
import { hashSync, compareSync } from "bcrypt"
import sendEmailService from "../../Services/send-email.service.js"
import jwt from "jsonwebtoken"
import { ErrorHandlerClass } from "../../Utils/error-class.util.js"



/**
 * Handles user signup process, including validation, hashing password, sending confirmation email, and creating user in database.
 * 
 * @param {import('express').Request} req - The request object containing firstName, lastName, email, password, recoveryEmail, DOB, mobileNumber, role, and status in the body.
 * @param {import('express').Response} res - The response object used to send a JSON response.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves with a JSON response confirming the user creation, or rejects with an error.
*/
export const signup = async(req,res, next)=>{
    const {name, email, password} = req.body

    // Step 1: Check if email  already exists
    const isEmailExist = await User.findOne({email})
    if(isEmailExist){
        return next(new ErrorHandlerClass("Email already exists", 409,  "Signup API error " +
            req.protocol +
            "://" +
            req.headers.host +
            req.originalUrl))
    }
    

    // Step 2: Hash password
    const hash = hashSync(password, +process.env.SALT_ROUNDS)


    // Step 3: Create a new User instance
    const user = new User(
        {
            name,
            email,
            password: hash
        }
    )



    // Step 4: Generate confirmation link
    const token = jwt.sign({userId: user._id}, process.env.EMAIL_VERIFICATION_SECRET, {expiresIn: process.env.EMAIL_VERIFICATION_EXPIRE})
    const confirmationLink = `${req.protocol}://${req.headers.host}/user/verify-email/${token}`
    const isEmailSent = await sendEmailService({
        to: email,
        subject: "Verify your email address",
        text: "Please verify your email",
        html: `<a href = ${confirmationLink}>Please verify your email</a>`
    })



    // Step 5: Handle case where email sending failed
    if(isEmailSent.rejected.length){
        return next(new ErrorHandlerClass("Email not sent", 500, "Signup API error " +
            req.protocol +
            "://" +
            req.headers.host +
            req.originalUrl))
    }



    // Step 6: Save the new User to the database
    const newUser = await user.save()
    

    return res.status(201).json({message: "User created successfully", userId: newUser._id})
        
} 








/**
 * Handles user email verification process.
 * 
 * @param {import('express').Request} req - The request object containing the verification token in the params.
 * @param {import('express').Response} res - The response object used to send a JSON response.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves with a JSON response confirming the user verification, or rejects with an error.
*/
export const verifyEmail = async(req,res, next)=>{
    const {token} = req.params

    // Step 1: Verify the token using the secret key
    const data = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET)


    //Step 2: Update user's isConfirmed status if token is valid and user is not already confirmed
    const confirmedUser = await User.findOneAndUpdate(
        {_id: data?.userId, isConfirmed: false},
        {isConfirmed: true},
        {new: true}
    )


    // Step 3: Handle case where user is not found or already confirmed
    if(!confirmedUser){
        return next(new ErrorHandlerClass("User not found", 404, "Verify Email API error " +
            req.protocol +
            "://" +
            req.headers.host +
            req.originalUrl))
    }


    return res.status(200).json({message: 'User verified successfully', confirmedUser})
}








/**
 * Handles user login process and generates a token upon successful authentication.
 * 
 * @param {import('express').Request} req - The request object containing user credentials in the body.
 * @param {import('express').Response} res - The response object used to send a JSON response with the access token.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves with a JSON response containing the access token, or rejects with an error.
*/
export const login = async(req,res, next)=>{
    const {email, password} = req.body

    // Step 1: Find user by email
    const user = await User.findOne({email})

   
    // Step 2: Handle case where user is not found
    if(!user){
        return next(new ErrorHandlerClass("Invalid credentials", 401, "Sign in API error " +
            req.protocol +
            "://" +
            req.headers.host +
            req.originalUrl))
    }

    // Step 3: Compare password with user's stored password
    const isPasswordMatched = compareSync(password, user.password)
    if(!isPasswordMatched){
        return next(new ErrorHandlerClass("Invalid credentials", 401, "Signin API error " +
            req.protocol +
            "://" +
            req.headers.host +
            req.originalUrl))
    }


    // Step 4: Handle case where user is already logged in
    if(user.status === "online"){
        return next(new ErrorHandlerClass("User already logged in", 400, "Sign in API error " +
            req.protocol +
            "://" +
            req.headers.host +
            req.originalUrl))
    }


    // Step 5: Generate token with user information
    const token = jwt.sign({userId: user._id, email: user.email, recoveryEmail: user.recoveryEmail, mobileNumber: user.mobileNumber, role: user.role}, process.env.LOGIN_SECRET, {expiresIn: process.env.LOGIN_SECRET_EXPIRE})


    // Step 6: Update user's status to "online"
    await User.findByIdAndUpdate(
        user._id,
        {status: "online"},
        {new: true}
    )



    // Step 7: Send the token in response
    return res.status(200).json({message: "User logged in successfully", token})
}



