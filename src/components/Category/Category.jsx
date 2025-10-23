import './Category.css'

function Category({ name, description, onClick }) {
    function excerpt(n = 100) {
    const short = description || '';
    if (short.length <= n) return short;
    let cut = short.slice(0, n);
    const lastSpace = cut.lastIndexOf(' ');
    if (lastSpace > 0) cut = cut.slice(0, lastSpace);
    return cut.trim() + '...';
  }
    return (
        <div
            className="cat-card pointer"
            // onClick={posts}
        >
            <h3 className='cat-name'>{name}</h3>
            <p className='cat-name'>{excerpt()}</p>
        </div>
    );
}

export default Category;
