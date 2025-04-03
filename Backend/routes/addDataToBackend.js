const expres=require("express");
const addRouter=expres.Router();
const {AddDataModel}=require("../models/addDataToBackend.model")

addRouter.get("/getdata/:email",async(req,res)=>{
    let par = req.params.email
    console.log(par);
    let data=await AddDataModel.find({email: par});
    res.send(data);
    console.log("All Booking Data")
})

addRouter.post("/add",async(req,res)=>{
    try {
        const payload=req.body;
        console.log("Received payload:", payload);

        // Validate required fields
        if (!payload.email || !payload.services || !payload.date || !payload.time) {
            return res.status(400).json({ 
                error: "Missing required fields",
                required: ["email", "services", "date", "time"]
            });
        }

        // Parse total to number if it's a string
        if (typeof payload.total === 'string') {
            payload.total = parseFloat(payload.total);
        }

        let data=new AddDataModel(payload);
        await data.save();
        res.send(data);
        console.log("Shopdata and Booking Details added to backend");
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ 
            error: "Failed to save data",
            details: error.message 
        });
    }
})

module.exports={addRouter}

///FD
// kasndakmamasddofeof
// adfmasmakmdmd
//aksmdfksmkmfkmd
