import './Category.css'

function Category({ name, description, onClick }) {
    return (
        <div
            className="cat pointer"
            onClick={onClick}
            title={description}
        >
            <p className='cat-name'>{name}</p>
        </div>
    );
}

export default Category;
