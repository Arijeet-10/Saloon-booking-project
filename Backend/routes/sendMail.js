const nodemailer = require("nodemailer");
require('dotenv').config();

const { UserModel } = require("../models/user.model");
const { AppointmentModel } = require("../models/appointment.model");

const appointmentRouter = require("express").Router();

appointmentRouter.post("/appo", async (req, res) => {
    try {
        const payload = req.body;
        
        // Validate required fields
        if (!payload.email || !payload.services || !payload.date || !payload.time || !payload.salon || !payload.userId) {
            return res.status(400).json({ 
                error: "Missing required fields",
                required: ["email", "services", "date", "time", "salon", "userId"]
            });
        }

        // Save appointment to MongoDB first
        const appointment = new AppointmentModel({
            ...payload,
            // Parse total to number if it's a string
            total: typeof payload.total === 'string' ? parseFloat(payload.total) : payload.total,
            date: new Date(payload.date)
        });

        const savedAppointment = await appointment.save();
        
        // Then send email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'arijeetdas0523@gmail.com',
                pass: 'zjmtbbpqbfmeywzg'
            },
        });

        const message = {
            from: '<arijeetdas0523@gmail.com>',
            to: payload.email,
            subject: `Your appointment is confirmed , ${payload.date} at ${payload.time}`,
            text: "appointment Booked",
            html: `
                <div style="width: 70%; margin: auto; box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                    <h1 style="text-align: center;color: green;">Dear Customer, your appointment is confirmed!</h1>
                    <h2 style="text-align: center; color: #195aaf;">${payload.date} at ${payload.time} with ${payload.salon.name}</h2>
                    <div style="width: 40%; margin: auto;">
                        <img style="width: 100%;" src=${payload.salon.image} alt="salon">
                    </div>
                    <h3 style="text-align: center;">Location: ${payload.salon.location}</h3>
                    <h1 style="text-align: center;">Your Total amount with taxes Rs. ${payload.total}</h1>
                    <p style="text-align: center; font-size: large; color: grey;">We sent you this email because you have booked with ${payload.salon.name}, which partners with Beautygem for appointments and payments.</p>
                </div>
            `
        };

        await transporter.sendMail(message);

        res.status(201).json({
            message: "Appointment has been created and confirmed via email",
            status: true,
            appointment: savedAppointment
        });

    } catch (error) {
        console.error("Error saving appointment:", error);
        res.status(500).json({
            error: "Failed to create appointment",
            details: error.message
        });
    }
});

module.exports = { appointmentRouter };
