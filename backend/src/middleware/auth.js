import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ success: false, message: "Missing authorization token." });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.userId;
        next();
    } catch {
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
}
