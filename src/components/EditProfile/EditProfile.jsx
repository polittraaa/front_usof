import { useState, useEffect } from "react";
import "./EditProfile.css";

function EditProfile({ currentUserId, onRouteChange }) {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [login, setLogin] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${currentUserId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error loading user data");
        const data = await res.json();
        setUser(data);

        setFirstname(data.full_name.split(" ")[0]);
        setLastname(data.full_name.split(" ")[1]);
        setLogin(data.login);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [currentUserId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${currentUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login,
          full_name: `${firstname} ${lastname}`,
        }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update profile");

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        window.history.pushState({}, "", `/profile/${currentUserId}`);
        onRouteChange(`profile:${currentUserId}`);
      }, 1500);
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleAvatarChange(e) {
        const file = e.target.files[0];        
        if (!file) return;

        setPreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/avatar`, {
                method: "PATCH",
                body: formData,
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to upload avatar");

            const updated = await res.json();
            setUser(prev => ({ ...prev, profile_picture: updated.profile_picture }));
        } catch (err) {
            setError(err.message);
        }
    }

    if (loading) {
        return (
            <div className="tc mt5 f4 messages">
                <div 
                    className="flex"
                    style={{ 
                        gap: '1rem',
                        marginRight: '2rem'
                    }}
                >
                    {/* back */}
                    <div 
                        className="pointer flex items-center justify-center"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#f0f0f0',
                            transition: 'background 0.2s',
                            marginRight: '1.5rem',
                            marginLeft: '1rem',
                        }}
                        onClick={() => { 
                            window.history.pushState({}, '', '/'); 
                            onRouteChange('home'); 
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </div>
                </div>
                
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="tc mt5 f4 messages">
                <div 
                    className="flex"
                    style={{ 
                        gap: '1rem',
                        marginRight: '2rem'
                    }}
                >
                    {/* Кнопка "назад" */}
                    <div 
                        className="pointer flex items-center justify-center"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#f0f0f0',
                            transition: 'background 0.2s',
                            marginRight: '1.5rem',
                            marginLeft: '1rem',
                        }}
                        onClick={() => { 
                            window.history.pushState({}, '', '/'); 
                            onRouteChange('home'); 
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </div>
                </div>
                
                User not found
            </div>
        );
    }

    const avatarUrl = preview
        ? preview
        : user.picture
        ? `http://localhost:3001${user.picture}`
        : "http://localhost:3001/public/uploads/base_default.png";      
        
    console.log(user.picture);

  return (
    <div className="edit-profile">
      <div className="edit-profile-card">
        <h2>Edit Profile</h2>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="avatar-section">
            <div className="avatar-wrapper">
              <img src={avatarUrl} alt="Avatar" className="avatar-preview" />
              <label htmlFor="avatar-upload" className="edit-icon">
                <i className="fa-solid fa-pen mt2"></i>
              </label>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
                hidden
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="first-name">First name</label>
            <input
              type="text"
              name="first-name"
              id="first-name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="last-name">Last name</label>
            <input
              type="text"
              name="last-name"
              id="last-name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="login">Login</label>
            <input
              type="text"
              name="login"
              id="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => {
                window.history.pushState({}, "", `/profile/${currentUserId}`);
                onRouteChange(`profile:${currentUserId}`);
              }}
              >
                Cancel
            </button>
          </div>
        </form> 
      </div>
    </div>
  );
}

export default EditProfile;
