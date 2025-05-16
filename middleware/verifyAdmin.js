const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid token" });
    }
    console.log("auth header");
    console.log(authHeader);
    console.log("token");
    const token = authHeader.split(" ")[1];
    console.log(token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded");
        console.log(decoded);
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        req.user = decoded; // pass user info to next middleware
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = verifyAdmin;
