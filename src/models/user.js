const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
        
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true,
        validate: function validate(value){ 
            if(!validator.isEmail(value) ) { throw new Error('Please, Enter a valid E-mail') } 
        }
    },
    password: {
        type: String,
        required:true,
        // validate: function validate(value) {
        //     if (!validator.isLength(value, {min:8, max:20})) { throw new Error('Min Length Is 8, Max Is 20') }
        // }
       

    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    dateOfBirth:{
        type:Date,
        require:true,
        min: '1950-01-01',
        max: Date.now 
    },
    avatar: {
        type: Buffer
    },
    isVerified: {
         type: Boolean,
         default: false 
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]


}, 
{timestamps: true}
)


userSchema.methods.toJSON = function () {
    const user = this
    const objectUser = user.toObject()
    delete objectUser.password
    delete objectUser.tokens
    
    return objectUser 
}

userSchema.methods.generateToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token

}

userSchema.statics.findByCredentials = async function (email, password) {
     const user = await User.findOne({email})
     if(!user)
     {
        throw new Error('Can’t find user with this email')
     }

     const match = await bcrypt.compare(password, user.password)
     if(!match)
     {
        throw new Error('this password doesn’t belong to this user')
     }
     return user
}

const User =  mongoose.model('User', userSchema)
module.exports = User
