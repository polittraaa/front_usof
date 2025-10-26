export default async function handleEmailConfirm(req, res, db, jwt, User) {
  const { token } = req.params;
  const SECRET = process.env.TOKEN_SECRET;
  const moduleUser = new User(db);
  try {
    const decoded = jwt.verify(token, SECRET);

    // Update user in DB
    await moduleUser.update_conf(decoded);

    res.json({ message: "Email confirmed successfully" });
  } catch (err) {
    console.error("Email confirmation error:", err);
    res.status(400).json({ error: "Invalid or expired token" });
  }
}