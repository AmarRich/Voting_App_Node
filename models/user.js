const mongoose = require('mongoose')

const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    age:{
        type: Number
    },
    email:{
        type: String,
    },
    mobile:{
        type: String,
    },
    
    address :{
        type: String,
        required : true
    },
   
    aadharCardNumber: {
        required : true,
        type: Number,
        unique: true
    },
    password: {
        required : true,
        type: String
    },
    role:{
        type: String,
        Enum : ['voter','admin'],
        default : 'voter'
    },
    isVoted : {
        type: Boolean,
        default: false
    }
})


userSchema.pre('save',async function(next) {
    const person = this
    if(!person.isModified('password')) return next()

    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(person.password,salt)
        person.password = hashedPassword
        next()
    } catch (err) {
        return next(err)
    }
})

userSchema.methods.comparePassword = async function (candidatePassword){
try {
    const isMatch = await bcrypt.compare(candidatePassword,this.password)
    return isMatch
} catch (err) {
    throw err
}
}


const User = mongoose.model('User',userSchema)
module.exports = User