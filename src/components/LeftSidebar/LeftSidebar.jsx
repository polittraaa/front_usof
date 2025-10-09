import { useEffect, useState } from 'react'
import Category from '../Category/Category';
import './LeftSidebar.css'

function LeftSidebar({ onRouteChange }) {
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
        <div 
            className="left-sidebar-container w-20 vh-100 fixed left-0 top-0 overflow-auto" 
        >
            <div className='categories-list'>
                {categories.map(category => (
                    <Category
                        key={category.category_id}
                        name={category.title}
                        description={category.category_description}
                        onClick={() => onRouteChange(`category-${category.category_id}`)}
                    />
                ))}
            </div>

            <div className='left-sidebar-links-container'>
                <span 
                    className='left-sidebar-link'
                    onClick={() => onRouteChange('about')}
                >About</span>
                <span 
                    className='left-sidebar-link'
                    onClick={() => onRouteChange('help')}
                >Help</span>
                <span 
                    className='left-sidebar-link'
                    onClick={() => onRouteChange('home')}
                >Home</span>
            </div>
        </div>
    );
}

export default LeftSidebar;