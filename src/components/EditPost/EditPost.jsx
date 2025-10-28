import { useState, useEffect } from "react";
import './EditPost.css';

function EditPost({ postId, onRouteChange }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState('');
    
    const [categories, setCategories] = useState([]);
    const [categoryInput, setCategoryInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [allCategories, setAllCategories] = useState([]);

    useEffect(() => {
        async function loadData() {
            try {
                const [postRes, catsRes, postCatsRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}`, { credentials: 'include' }),
                    fetch(`${import.meta.env.VITE_API_URL}/categories`, { credentials: 'include' }),
                    fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/categories`, { credentials: 'include' })
                ]);

                const postData = await postRes.json();
                const allCats = await catsRes.json();                
                const postCats = await postCatsRes.json();  

                setTitle(postData.post.title);
                setContent(postData.post.content);
                setIsActive(postData.post.post_status);
                setAllCategories(allCats.cat);
                
                if (Array.isArray(postCats.categories)) {
                    setCategories(postCats.categories);
                } else {
                    setCategories([]);
                }
            } catch (err) {
                console.error(err);
            }
        }
        loadData();
    }, [postId]);

    async function handleUpdate(e) {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title,
                    content,
                    post_status: isActive ? 'active' : 'inactive',
                    category: categories.map(c => c.category_id)
                })
            });

            if (res.ok) {
                onRouteChange('home');
            } else {
                const data = await res.json();
                setError(data.error || 'Error updating post');
            }
        } catch (err) {
            console.error(err);
            setError('Server error');
        }
    }

    function handleCategoryInputChange(e) {
        const value = e.target.value;
        setCategoryInput(value);

        if (value.length > 0) {
            const filtered = allCategories.filter(cat =>
                cat.title.toLowerCase().includes(value.toLowerCase()) &&
                !categories.find(c => c.category_id === cat.category_id)
            );
            setSuggestions(filtered.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    }

    function handleAddTag(cat) {
        if (categories.length >= 5) return;
        setCategories([...categories, cat]);
        setCategoryInput('');
        setSuggestions([]);
    }

    function handleRemoveTag(catToRemove) {
        setCategories(categories.filter(cat => cat.category_id !== catToRemove.id));
    }

    return (
        <div className="edit-post">
            <div className="edit-post-card">
                <div className="edit-post-header">
                    <button
                        className="back-btn"
                        onClick={() => {
                            window.history.pushState({}, '', '/');
                            onRouteChange('home');
                        }}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <h2>Edit Post</h2>
                </div>

                {error && <div className="alert error">{error}</div>}

                <form className="edit-post-form" onSubmit={handleUpdate}>
                    <label>Title <span className="required">*</span></label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <label>Content <span className="required">*</span></label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="6"
                    ></textarea>

                    <label>Categories <span className="required">*</span></label>
                    <p className="category-hint">
                        Add up to 5 categories to describe what your question is about. Start typing to see suggestions.
                    </p>

                    <div className="category-container">
                        <div className="selected-categories">
                            {categories.map(cat => (
                                <div key={cat.category_id} className="category-tag">
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
                        />

                        {suggestions.length > 0 && (
                            <div className="suggestions">
                                {suggestions.map(cat => (
                                    <div
                                        key={cat.category_id}
                                        className="suggestion"
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
                            className={`toggle-switch ${isActive ? "active" : ""}`}
                            onClick={() => setIsActive(!isActive)}
                        >
                            <div className="toggle-thumb"></div>
                        </div>
                        <span className={`status-label ${isActive ? "active" : "inactive"}`}>
                            {isActive ? "Active" : "Inactive"}
                        </span>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="save-btn">Update Post</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditPost;
