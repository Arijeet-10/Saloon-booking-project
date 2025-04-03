const mongoose=require("mongoose");

const addDataSchema=mongoose.Schema({
    name:String,
    email:String,
    location:String,
    image:String,
    date:String,
    time:String,
    services:[{
        serviceName:String,
        price:String
    }],
    total:Number,
    salon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "projects"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
})

const AddDataModel=mongoose.model("localData",addDataSchema);

module.exports={AddDataModel}