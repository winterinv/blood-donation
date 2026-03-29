const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const splitToken = token.split(" ")[1]; // Bearer <token>
    const decoded = jwt.verify(splitToken || token, process.env.JWT_SECRET || "devsecret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
