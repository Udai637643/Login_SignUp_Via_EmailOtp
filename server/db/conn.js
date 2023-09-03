const mongoose=require("mongoose");
const DB=process.env.URL;

mongoose.connect(DB,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>console.log("Database is connected"))
.catch((error)=>{
    console.log("error",error) 
})