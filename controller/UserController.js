const User = require('../models/user');
const { generateSecretKey, client } = require("../helper");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const { userInfo } = require('os');

class UserController {
    async getUserInfo(req, res) {
        try {
            const userInfo = await User.findById(req.params.userId).select("-password");
            console.log('userInfo: ', userInfo);
            res.status(200).json({ userInfo });
        } catch(err) {
            console.log('err: ', err);
        }
    }
    // [POST] /register
    async register(req, res) {
        try {
            const { name, password, phone } = req.body;
            const existingUser = await User.findOne({ phone });
            if (existingUser) {
                console.log("Phone already registered");
                return res.status(400).json({ message: "Phone already registered" });
            }
            const hashPassword = CryptoJS.SHA1(password);
            const newUser = new User({
                name,
                password: hashPassword,
                phone,
            });

            newUser.verificationToken = crypto.randomBytes(20).toString("hex");

            await newUser.save();
            res.status(202).json({
                message:
                    "Registration successful!",
            });
        } catch (error) {
            console.log("Error registering user", error);
            res.status(500).json({ message: "Registration failed" });
        }
    }

    // [GET] /verify/:token
    async verify(req, res) {
        try {
            const token = req.params.token;

            const user = await User.findOne({ verificationToken: token });
            if (!user) {
                return res.status(404).json({ message: "Invalid verification token" });
            }

            //mark the user as verified
            user.verified = true;
            user.verificationToken = undefined;

            await user.save();

            res.status(200).json({ message: "Email verified successfully" });
        } catch (error) {
            res.status(500).json({ message: "Email verification failed" });
        }
    }

    // [POST] /login
    async login(req, res) {
        try {
            const { phone, password } = req.body;

            const user = await User.findOne({ phone });
            if (!user) {
                return res.status(401).json({ message: "Invalid phone" });
            }
            const hashPassword = CryptoJS.SHA1(password).toString();
            console.log('USER PASSWROD: ', user.password);
            console.log('hasPassword: ', hashPassword);
            if (user.password !== hashPassword) {
                return res.status(401).json({ message: "Invalid password" });
            }
            const secretKey = generateSecretKey();
            const token = jwt.sign({ userId: user._id }, secretKey);
            console.log("token: ", token);
            res.status(200).json({ token, role: user.role, userId: user._id });
        } catch (error) {
            console.log("error: ", error);
            res.status(500).json({ message: "Login failed" });
        }
    }
    async changePassword(req, res) {
        try {
            const {currentPassword, newPassword, userId} = req.body;
            const hashCurrentPW = CryptoJS.SHA1(currentPassword);
            const exitUser = await User.findOne({_id: userId, password: hashCurrentPW.toString()});
            console.log('exitUser: ', exitUser);
            if(!exitUser) {
                res.status(404).json({message: 'Mật khẩu hiện tại không chính xác'});
            }
            const hashPassword = CryptoJS.SHA1(newPassword);
            const user = await User.updateOne({_id: userId}, {password: hashPassword});
            console.log('user: ', user);
            res.status(200).json({message: 'Update password successfully'});
        } catch (err) {
            console.log('err: ', err);
        }
    }
}

module.exports = new UserController();
