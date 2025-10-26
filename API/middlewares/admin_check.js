export function adminCheck(db, User) {
  return async function (req, res, next) { 
    try {
      if (req.session && req.session.userId) {
        const moduleUser = new User(db); 
        const user = await moduleUser.find_by_id(req.session.userId);
        
        if (user.role === 'admin') return next();

        return res.status(400).json({error: "Access denied" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({error: "Server error" });
    }
  }
}