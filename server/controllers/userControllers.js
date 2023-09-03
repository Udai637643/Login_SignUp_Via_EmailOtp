
const users=require("../models/userSchema");
const userotp=require("../models/userOtp")
const nodemailer=require("nodemailer"); 

//email config
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})


exports.userregister=async (req,res)=>{
     const {fname,email,password}=req.body;

     if(!fname || !email || !password){
        res.status(400).json({error:"Please Enter All Input Data"})

     }
     try{
        const preuser=await users.findOne({email:email});
        if(preuser){
            res.status(400).json({error:"This User already exist in our db"})

        }
        else{
            const userregister=new users({
                fname,email,password
            });
            //here password hase 
            const storeData=await userregister.save();
            res.status(200).json(storeData);

        }
     }catch(error){
        res.status(400).json({error:"Invalid Details",error})
     }
}

//user send opt

exports.userOtpSend=async (req,res)=>{
    const {email}=req.body;

    if(!email){
        res.status(400).json({error:"Please Enter Your Email"})
    }
    try{
        const preuser=await users.findOne({email:email});
        if(preuser){
             const OTP=Math.floor(100000+Math.random()*900000)

             const existEmail=await userotp.findOne({email:email});

             if(existEmail){
                const updateData=await userotp.findByIdAndUpdate({_id:existEmail._id},{
                    otp:OTP
                },{new:true});

                await updateData.save();
                const mailOptions={
                    from:process.env.EMAIL,
                    to:email,
                    subject:"Sending Email for Otp Validation",
                    text:`OTP:-${OTP}`
                }
                transporter.sendMail(mailOptions,(error,info)=>{
                    if(error){
                        console.log("error",error);
                        res.status(400).json({error:"email not send"})
                    }
                    else{
                        console.log("Email sent",info.response);
                        res.status(200).json({message:"Email sent successfully"})
                    }
                })

             }else{
                const saveOtpData=new userotp({
                    email,otp:OTP
                });
                await saveOtpData.save();
             }
        }

        else{
            res.status(400).json({error:"This user Not exist in our db"})
        }
    }catch(error){
            res.status(400).json({error:"Invalid Detail",error})
    }
}

exports.userLogin=async (req,res)=>{
    const {email,otp}=req.body;

    if(!otp || !email){
        res.status(400).json({error:"please Enter Your OTP and email"})
    }
    try {
        const otpverification=await userotp.findOne({email:email});
        if(otpverification.otp===otp){
            const preuser=await users.findOne({email:email});
            //token generate
            const token=await preuser.generateAuthtoken();
            res.status(200).json({message:"User Login Successfully Done",userToken:token})
        } 
        else{
            res.status(400).json({error:"Invalid Otp"})
        }
    } catch (error) {
        res.status(400).json({error:"Invalid Detail",error})
    }
}