export function requireLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next(); // user is logged in
  }
  res.status(401).json({ error: "You must be logged in to access this resource" });
}