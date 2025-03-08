const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs'); // Correct import for bcryptjs
const jwt = require('jsonwebtoken');
const secret=process.env.JWT_SECRET;
const Task = require('./task');

console.log("------>",secret)

const userSchema =new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer,
    },
},{
    timestamps:true,
})

userSchema.virtual('tasks',{
    ref:"Task",
    localField:'_id',
    foreignField:"owner"
})

userSchema.methods.generateToken = async function() {
    const user = this;
    const token = jwt.sign({
        _id: user._id.toString(),
        email: user.email,
    }, secret, {expiresIn: '1d'});

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token;
}


userSchema.methods.toJSON= function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens
    return userObject
}


userSchema.statics.findByCredentials=async (email,password)=>{

    const user = await User.findOne({
        email:email
    })
    console.log("found",user)
    if(!user){
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error("Unable to login")
    }

    return user

}



userSchema.pre('save', async  function (next) {
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// delete user task when user is removed

userSchema.pre('remove', async  function (next) {
    const user = this;
    await Task.deleteMany({owner:user._id})
    next()

})


const User = mongoose.model('User', userSchema)


module.exports = User