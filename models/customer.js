const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const customerSchema = new mongoose.Schema(
    {
    
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true
    },
    password:{
        type:String,
        minlength:7
    },
    role:{
        type:String,
        default:'guest',
        enum:['guest','admin']
    },
    phone:{
        type:String,
        unique:true
    }


})

customerSchema.statics.findByCredentials=async(email,password)=>{
    const user=await User.findOne({email})
    if(!user) throw new Error("unable to login")

    const match = await bcrypt.compare(password,user.password)
    if(!match) throw new Error("unable to login")

}
customerSchema.pre('save',async function(next){
const user=this;
if(user.isModified('password')){
    user.password=await bcrypt.hash(user.password,8);
}


next();
}
)

 const User= mongoose.model('Customer',customerSchema)
 module.exports=User