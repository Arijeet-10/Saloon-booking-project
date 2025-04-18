const {ProjectModel} = require("./projects.model")
const mongoose=require("mongoose");

const appointmentSchema=mongoose.Schema({
    services: [{
        serviceName: { type: String, required: true },
        price: { type: String, required: true }
    }],
    total: { type: Number, required: true },
    time: { type: String, required: true },
    date: { type: String, required: true },
    email: { type: String, required: true },
    salon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "projects",
        required: true
    },
    status: { type: String, default: "pending" },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, { timestamps: true });

const AppointmentModel=mongoose.model("appointment",appointmentSchema);

module.exports={AppointmentModel}