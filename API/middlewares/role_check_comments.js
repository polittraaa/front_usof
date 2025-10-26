export function roleCheckComment(db, Comment) {
  return async function (req, res, next) {
    try {
      if (req.session && req.session.userId) {
        const moduleComment = new Comment(db); 
        const role = await moduleComment.get_role(req.session.userId);
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