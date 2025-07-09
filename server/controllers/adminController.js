import jwt from 'jsonwebtoken';

export const adminLogin = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        const { email, password } = req.body;

        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ success: true, token });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};