const User = require('../models/user');
const { generateSecretKey, client } = require("../helper");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

class UserController {
    // [POST] /register
    async register(req, res) {
        try {
            const { name, password, phone } = req.body;
            const existingUser = await User.findOne({ phone });
            if (existingUser) {
                console.log("Phone already registered");
                return res.status(400).json({ message: "Phone already registered" });
            }

            const newUser = new User({
                name,
                password,
                phone,
            });

            //generate the verification token
            newUser.verificationToken = crypto.randomBytes(20).toString("hex");
            console.log("newUser: ", newUser);
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

            if (user.password !== password) {
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
            // console.log('hs: ', crypto.hash(cry))
            const exitUser = await User.findOne({_id: userId, password: currentPassword});
            console.log('exitUser: ', exitUser);
            if(!exitUser) {
                res.status(404).json({message: 'Mật khẩu hiện tại không chính xác'});
            }
            const user = await User.updateOne({_id: userId}, {password: newPassword});
            console.log('user: ', user);
            res.status(200).json({message: 'Update password successfully'});
        } catch (err) {
            console.log('err: ', err);
        }
    }
}

module.exports = new UserController();