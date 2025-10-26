export function roleCheck(db, Post) {
  return async function (req, res, next) {
    try {
      if (req.session && req.session.userId) {
        const modulePost = new Post(db); 
        const role = await modulePost.get_role(req.session.userId);
        req.userRole = role.role; // save role
        // console.log('in role check',req.userRole)
      }
      else {
        req.userRole = 'guest';
      }
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({error: "Server error" });
    }
  }
}