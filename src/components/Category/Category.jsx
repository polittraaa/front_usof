import './Category.css'

function Category({ name, description, onClick }) {
    return (
        <div
            className="cat-card pointer"
            onClick={onClick}
        >
            <h className='cat-name'>{name}</h>
            <p className='cat-name'>{description}</p>
        </div>
    );
}

export default Category;
