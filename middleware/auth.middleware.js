export const checkAuthMiddleware = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ message: "No autorizado" });
};
