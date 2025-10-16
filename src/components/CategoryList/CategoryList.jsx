import "./CategoryList.css";
import Category from '../Category/Category';
import { useState, useEffect, useRef } from 'react';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {        
        fetch(`${import.meta.env.VITE_API_URL}/categories`)
            .then(res => res.json())
            .then(data => {
                if (data.cat) setCategories(data.cat);
                else console.error('Incorrect data format:', data);
            })
            .catch(err => console.error('Error loading categories:', err));
    }, []);

  return (
    <div className="tags-page">
      <h1 className="page-title">All Categories</h1>
      <p className="page-subtitle">
        A collection of all categories available on the platform.
      </p>
      <div className="cat-grid">
        {categories.map(category => (
            <Category
                key={category.category_id}
                name={category.title}
                description={category.category_description}
                onClick={() => onRouteChange(`category-${category.category_id}`)}
            />
        ))}
      </div>
    </div>
  );
}
