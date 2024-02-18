import jwt from "jsonwebtoken";

const cookieJwtAuth = (req, res, next) => {
  const token = req.cookies.token;
  try {
    const token_user = jwt.verify(token, process.env.MY_SECRET_KEY);
    req.token_user = token_user;

    next();
  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/login");
  }
};

export default cookieJwtAuth;
