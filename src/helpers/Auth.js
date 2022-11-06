const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
  jwt: { secretKey, exp },
  cookie: { expiry, Name },
} = require("../config");

class Auth {
  static async GenerateSalt() {
    return await bcrypt.genSalt();
  }

  static async GeneratePassword(password, salt) {
    return await bcrypt.hash(password, salt);
  }

  static async ValidatePassword(enteredPass, pass, salt) {
    const generatedPass = await bcrypt.hash(enteredPass, salt);
    return generatedPass === pass;
  }

  static async GenerateSignature(payload) {
    return await jwt.sign(payload, secretKey, { expiresIn: exp });
  }
  static async ValidateSignature(token) {
    return await jwt.verify(token.split(" ")[1], secretKey);
  }

  static async SendAuthCookie(res, payload) {
    const data = `Bearer ${payload}`;
    res.cookie(Name, data, {
      httpOnly: true,
      signed: true,
      maxAge: expiry,
    });
  }
}

module.exports = Auth;
