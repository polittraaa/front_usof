import { useState, useEffect } from "react";
import './CreatePost.css';

function CreatePost({ onRouteChange, userId }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched categories:", data.cat);
          setAllCategories(data.cat);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    }

    fetchCategories();
  }, []);

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          content,
          categories: categories.map(c => c.id),
          user_id: userId,
          status: isActive ? 'active' : 'inactive'
        })
      });

      if (res.ok) {
        onRouteChange('home');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create post');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    }
  };

  const handleCategoryInputChange = (e) => {
    const value = e.target.value;
    setCategoryInput(value);

    if (value.length > 0) {
      const filtered = allCategories.filter(cat =>
        cat.title.toLowerCase().includes(value.toLowerCase()) &&
        !categories.includes(cat)
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleAddTag = (cat) => {
    if (categories.length >= 5) return;
    setCategories([...categories, cat]);
    setCategoryInput('');
    setSuggestions([]);
  };

  const handleRemoveTag = (catToRemove) => {
    setCategories(categories.filter(cat => cat.id !== catToRemove.id));
  };

  return (
    <div className="create-post-page">
      <div className="create-post-header">
        <div
          className="back-button"
          onClick={() => {
            window.history.pushState({}, '', '/');
            onRouteChange('home');
          }}
        >
        <i className="fa-solid fa-arrow-left"></i>
        </div>
        <h2>Create New Post</h2>
      </div>

      {error && <p className="error-text">{error}</p>}

      <form className="create-post-form" onSubmit={handleSubmitPost}>
        <label>
          Title <span className="required">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
        />

        <label>
          Content <span className="required">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="6"
          className="textarea-field"
        ></textarea>

        <label>
          Categories <span className="required">*</span>
        </label>
        <p className="hint-text">
          Add up to 5 categories. Start typing to see suggestions.
        </p>

        <div className="tag-input-container">
          <div className="selected-categories">
            {categories.map(cat => (
              <div key={cat.id} className="category-tag">
                <span>{cat.title}</span>
                <i
                  className="fa-solid fa-xmark"
                  onClick={() => handleRemoveTag(cat)}
                ></i>
              </div>
            ))}
          </div>

          <input
            type="text"
            value={categoryInput}
            onChange={handleCategoryInputChange}
            placeholder="Start typing to add categories..."
            className="input-field"
          />

          {suggestions.length > 0 && (
            <div className="suggestions-list">
              {suggestions.map(cat => (
                <div
                  key={cat.id}
                  className="category-suggestion"
                  onClick={() => handleAddTag(cat)}
                >
                  {cat.title}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="active-status">
          <label>Active status:</label>
          <div
            className={`toggle-switch ${isActive ? 'active' : ''}`}
            onClick={() => setIsActive(!isActive)}
          >
            <div className="toggle-thumb"></div>
          </div>
          <span className={`status-label ${isActive ? 'active' : 'inactive'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <button type="submit" className="submit-button">
          Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
