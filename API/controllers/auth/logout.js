async function handleLogout(req, res) {
    req.session.destroy(err => {
        if (err) {
            console.error('Session destruction error:', err);
            return res.status(500).json({ error: 'Failed to log out' });
        }
        res.clearCookie('connect.sid'); // default session cookie name
        res.status(200).json({ message: 'Logout successful' });
    });
};

export default handleLogout;