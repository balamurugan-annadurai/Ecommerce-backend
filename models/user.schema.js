import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    activationStatus: {
        type: Boolean,
        default: false
    },
    verificationString: {
        type: String,
        default: null
    },
    expiryTime: {
        type: Date,
        default: null
    }
}, {
    timestamps: true, // add createdAt and updatedAt fields automatically
})

const Users = mongoose.model("Users", userSchema)

export default Users