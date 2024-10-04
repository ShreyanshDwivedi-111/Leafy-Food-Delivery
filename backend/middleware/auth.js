import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized! Token is missing. Please log in again.",
    });
  }
  try {
    const token_decode = jwt.verify(token,process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.error('Error Auth Middleware:', error.message);
    return res.status(401).json({
        success: false,
        message: "Unauthorized! Invalid token. Please log in again.",
    });
  }
};

export default authMiddleware;
