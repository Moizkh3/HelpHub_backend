import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/User.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE, WELCOME_TEMPLATE } from '../config/emailTemplates.js';

export const register = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing details' })
    }

    try {

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); //hashing the password

        const user = new userModel({ name, email, password: hashedPassword });

        await user.save();

        //generating token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        //sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome by Moiz Khatri',
            html: WELCOME_TEMPLATE.replace("{{name}}", name).replace("{{email}}", email)
        }

        await transporter.sendMail(mailOptions)

        return res.json({ success: true })

    } catch (error) {

        return res.json({ success: false, message: error.message })

    }

}

export const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {

        return res.json({ success: false, message: 'Email and password are required' })

    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {

            return res.json({ success: false, message: 'Invalid email' })

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.json({ success: false, message: 'Invalid password' })

        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true })

    } catch (error) {

        return res.json({ success: false, message: error.message })

    }

}


export const logout = async (req, res) => {

    try {

        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true, message: 'Logged Out' })

    } catch (error) {

        return res.json({ success: false, message: error.message })

    }

}

export const sendVerifyOtp = async (req, res) => {

    try {

        const user = await userModel.findById(req.userId);

        if (user.isAccountVerified) {

            return res.json({ success: false, message: "Account Already Verified" })

        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp;

        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOption = {

            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp)

        }

        await transporter.sendMail(mailOption);

        res.json({ success: true, message: 'Verification OTP Send on your Email' })

    } catch (error) {

        return res.json({ success: false, message: error.message })

    }

}

export const isAuthenticated = async (req, res) => {

    try {

        return res.json({ success: true })

    } catch (error) {

        return res.json({ success: false, message: error.message })

    }
}

export const sendResetOtp = async (req, res) => {

    const { email } = req.body;

    if (!email) {

        return res.json({ success: false, message: 'Email is required' })
    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {

            return res.json({ success: false, message: 'User not found' })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp;

        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOption = {

            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp)

        }

        await transporter.sendMail(mailOption);

        res.json({ success: true, message: 'Verification Send to your Email' })

    } catch (error) {

        return res.json({ success: false, message: error.message })

    }

}

export const resetPassword = async (req, res) => {

    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {

        return res.json({ success: false, message: 'Email, OTP, and new password are required' })

    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {

            return res.json({ success: false, message: 'User not found' });
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {

            return res.json({ success: false, message: 'Invalid OTP' })
        }

        if (user.resetOtpExpireAt < Date.now()) {

            return res.json({ success: false, message: 'OTP Expired' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword;

        user.resetOtp = ''

        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Password has been reset successfully' })

    } catch (error) {

        return res.json({ success: false, message: error.message })
    }

}

export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userId;

    if (!oldPassword || !newPassword) {
        return res.json({ success: false, message: 'Old and new passwords are required' });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid old password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.json({ success: true, message: 'Password changed successfully' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}