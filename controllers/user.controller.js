import Users from './../models/user.schema.js';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { customMail, mail, sendVerificationMail } from '../services/nodemailer.services.js';
import randomString from "randomstring"

export const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const user = await Users.findOne({ email });
        if (user) {
            return res.status(200).json({ message: "user already found" })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await Users.create({ email, password: hashPassword, firstName, lastName });
        const accountVerificationToken = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);

        sendVerificationMail(email, accountVerificationToken)
        return res.status(201).json({
            message: "user registered"
        })
    } catch (error) {
        console.log(error);

    }
}

export const accountActivation = async (req, res) => {

    const userId = req.user._id;

    try {
        const user = await Users.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.activationStatus) {
            return res.status(200).json({ message: "Already activated" });
        }

        user.activationStatus = true;
        await user.save();

        res.status(200).json({ message: "activated" });

    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.json({ message: "User not registered" })
        }
        if (!user.activationStatus) {
            return res.json({ message: "User account not activated" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        if (isMatch) {
            return res.status(200).json({
                message: "User successfully logged",
                token
            })
        }
        else {
            return res.status(200).json({
                message: "Incorrect password",
            })
        }
    } catch (error) {
        console.log(error);

    }
}

export const verifyUserToken = async (req, res) => {
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded) {
            const _id = decoded._id
            const user = await Users.findOne({ _id });
            const userDetails = {
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
            }
            return res.status(200).json({ isVaild: true, userDetails })
        }
        return res.status(401).json({ isVaild: false })

    } catch (error) {
        console.log(error);

    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            res.status(200).json({ message: "User not found" });
        }

        res.json({ message: "User found" });
        const randomStr = randomString.generate({
            length: 20,
            charset: "alphanumeric"
        })

        const expiryTime = new Date().getTime() + 600000;

        user.verificationString = randomStr;
        user.expiryTime = expiryTime;
        await user.save();
        mail(email, randomStr);

    } catch (error) {
        console.log(error);
    }
}

// Controller function to handle verification of password reset links
export const verifyString = async (req, res) => {
    const { verificationString } = req.body;
    const user = await Users.findOne({ verificationString });
    const currentTime = new Date().getTime();
    if (!user) {
        return res.json({ message: "not match" })
    }

    if (user.expiryTime < currentTime) {
        user.verificationString = null;
        user.expiryTime = null;
        await user.save();
        return res.json({ message: "link expired" });
    }

    res.status(200).json({ message: "matched" });
}

// Controller function to handle password changes
export const changePassword = async (req, res) => {
    const { verificationString, newPassword } = req.body;
    const user = await Users.findOne({ verificationString });

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    user.verificationString = null;
    user.expiryTime = null;
    await user.save();

    res.status(200).json({ message: "Password changed" });
}

export const contactUs = (req, res) => {
    try {
        const { userName, emailId, message } = req.body;
        customMail(userName, emailId, message);
        res.status(200).json({ message: "mail send" })
    } catch (error) {
        console.log(error);
    }
}