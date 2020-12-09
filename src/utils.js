import jwt from "jsonwebtoken";
const signToken = (user) => {
  return jwt.sign({ data: user }, process.env.SECRET, {
    expiresIn: 604800,
  });
};
export { signToken };
