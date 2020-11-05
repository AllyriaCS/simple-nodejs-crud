const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const accessToken = req.headers["x-access-token"];
  if (accessToken) {
    const decoded = jwt.verify(accessToken, "caominhduc123", function (
      err,
      decoded
    ) {
      if (err) {
        console.log(err);
        res.status(401).json({
          message: "Invalid access token",
        });
      }
    });
    next();
  } else {
    return res.status(400).json({
      message: "Access token not found",
    });
  }
};
