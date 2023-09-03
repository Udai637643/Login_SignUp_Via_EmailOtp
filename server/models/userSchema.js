const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken")
const SECRECT_KEY="abcdefghijklmnop"
const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true, // Change 'require' to 'required'
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Not Valid Email");
      }
    }
  },
  password: {
    type: String,
    required: true, // Change 'require' to 'required'
    minlength: 6
  },
  tokens:[{
    token:{
        type:String,
        require:true,
    }
  }]
});

// Hash password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

//token generate
userSchema.methods.generateAuthtoken=async function(){
try {
  let newtoken=jwt.sign({_id:this._id},SECRECT_KEY,{
    expiresIn:"1d"
  });
  this.tokens=this.tokens.concat({token:newtoken})
  await this.save();
  return newtoken;
} catch (error) {
  res.status(400).json(error)
}
}



const User = mongoose.model("User", userSchema); // Change 'users' to 'User'
module.exports = User; // Change 'module.export' to 'module.exports'
