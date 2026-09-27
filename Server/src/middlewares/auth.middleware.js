import { verifyAccessToken } from "../utils/auth.util.js";

const authenticate = (req, res, next) => {
  const accessToken = req.headers.authorization.split(" ")[1];

  if (!accessToken) {
    return res.status(400).json({
      message: "Access token not found",
    });
  }
  try {
    const decode = verifyAccessToken(accessToken);

    res.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized, access token Invalid",
    });
  }
};

export default authenticate;
