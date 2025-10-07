function Home() {
 const posts = [
    {
      author: "Author name",
      content: "I have a problem with js. the code i wright dont work. pls help",
    },
    {
      author: "Author name",
      content: "I have a problem with js. the code i wright dont work. pls help",
    },
    {
      author: "Author name",
      content: "I have a problem with js. the code i wright dont work. pls help",
    },
    {
      author: "Author name",
      content: "I have a problem with js. the code i wright dont work. pls help",
    },
  ];

  const categories = ["java", "java", "java", "java"];

  return (
    <div className="min-h-screen bg-uweb-bg font-inter">
      {/* Header */}
      <header className="bg-uweb-header min-h-[119px] flex items-center px-4 md:px-8 lg:px-14 gap-4 md:gap-6 py-4">
        <div className="w-full flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-12 h-12 md:w-20 md:h-20 lg:w-28 lg:h-28 flex-shrink-0">
              <svg
                viewBox="0 0 112 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <circle cx="56" cy="50.5" r="35" fill="#FFF1E8" opacity="0.3" />
                <path
                  d="M56 15.5L71 35.5L86 55.5L71 75.5L56 95.5L41 75.5L26 55.5L41 35.5L56 15.5Z"
                  fill="#FFF1E8"
                />
                <circle cx="56" cy="50.5" r="15" fill="#394686" />
              </svg>
            </div>
            <h1 className="font-khand text-3xl md:text-5xl lg:text-7xl text-uweb-cream">
              UWEB
            </h1>
          </div>

          {/* Search Bar - Hidden on small screens, centered on desktop */}
          <div className="hidden md:flex md:flex-1 md:max-w-2xl order-3 md:order-2">
            <input
              type="text"
              placeholder="Search for..."
              className="w-full h-12 md:h-16 lg:h-20 px-5 md:px-7 rounded-2xl bg-uweb-cream text-black text-lg md:text-2xl lg:text-4xl placeholder:text-black focus:outline-none focus:ring-2 focus:ring-uweb-text-accent"
            />
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3 md:gap-4 ml-auto md:ml-0 order-2 md:order-3">
            {/* Login Button */}
            <button className="h-12 md:h-16 lg:h-20 px-6 md:px-12 lg:px-14 rounded-2xl bg-uweb-cream text-black text-lg md:text-2xl lg:text-4xl hover:opacity-90 transition-opacity flex-shrink-0">
              Login
            </button>

            {/* Profile Icon */}
            <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full border-4 border-uweb-text-accent bg-gray-300 flex items-center justify-center flex-shrink-0">
             <i className="fa-slab fa-regular fa-circle-user"></i>
            </div>
          </div>

          {/* Search Bar - Full width on mobile only */}
          <div className="w-full md:hidden order-4">
            <input
              type="text"
              placeholder="Search for..."
              className="w-full h-12 px-5 rounded-2xl bg-uweb-cream text-black text-lg placeholder:text-black focus:outline-none focus:ring-2 focus:ring-uweb-text-accent"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar - Categories */}
        <aside className="lg:w-80 border-r border-uweb-border-gray lg:border-b-0 border-b">
          <div className="p-8 md:p-10 flex flex-wrap lg:flex-col gap-4 md:gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="px-8 py-2 rounded-full bg-uweb-category text-black text-2xl md:text-3xl lg:text-4xl text-center cursor-pointer hover:opacity-80 transition-opacity"
              >
                {cat}
              </div>
            ))}
          </div>

          <div className="border-t border-uweb-border-light p-8 md:p-10 flex flex-row lg:flex-col gap-4 md:gap-6 justify-center lg:justify-start">
            <div className="text-black text-2xl md:text-3xl lg:text-4xl text-center cursor-pointer hover:opacity-70 transition-opacity">
              About
            </div>
            <div className="text-black text-2xl md:text-3xl lg:text-4xl text-center cursor-pointer hover:opacity-70 transition-opacity">
              Help
            </div>
            <div className="text-black text-2xl md:text-3xl lg:text-4xl text-center cursor-pointer hover:opacity-70 transition-opacity">
              Home
            </div>
          </div>
        </aside>

        {/* Center - Posts */}
        <main className="flex-1 flex flex-col">
          {/* Sort Tabs */}
          <div className="flex gap-6 md:gap-8 px-6 md:px-8 py-6 md:py-8 border-b border-uweb-border-post">
            <button className="text-uweb-text-accent text-2xl md:text-3xl lg:text-4xl hover:opacity-70 transition-opacity">
              New
            </button>
            <button className="text-black text-2xl md:text-3xl lg:text-4xl hover:opacity-70 transition-opacity">
              Popular
            </button>
          </div>

          {/* Posts List */}
          <div className="flex-1 border-b border-uweb-border-post">
            {posts.map((post, idx) => (
              <article
                key={idx}
                className="bg-uweb-post p-6 md:p-8 lg:p-10 mb-4 md:mb-6 mx-4 md:mx-6 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <h3 className="text-uweb-author text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6">
                  {post.author}
                </h3>
                <p className="text-black text-2xl md:text-3xl lg:text-4xl leading-relaxed">
                  {post.content}
                </p>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 py-6 md:py-8">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
     
                <i className="fa-slab fa-regular fa-angle-left"></i>
              <span className="text-base">Previous</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              <span className="text-base">Next</span>
                <i className="fa-slab fa-regular fa-angle-right"></i>
            </button>
          </div>
        </main>

        {/* Right Sidebar - Hot Topics */}
        <aside className="lg:w-80 border-l border-uweb-border-gray lg:border-t-0 border-t">
          <div className="bg-uweb-hot-topics p-6 md:p-10 min-h-[300px] lg:min-h-[553px]">
            <h2 className="text-black text-2xl md:text-3xl lg:text-4xl text-center">
              Hot Topics
            </h2>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="bg-uweb-footer py-8 md:py-12 px-6 md:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-white text-2xl md:text-3xl lg:text-4xl">
            <div>contact us</div>
            <div>ptdev@gmail.com</div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            {/* GitHub */}
            <button
              type="button"
              title="GitHub"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-white"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.464-1.11-1.464-.908-.62.069-.607.069-.607 1.004.071 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.026 2.748-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.337 4.695-4.566 4.944.359.31.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .268.18.58.688.481C19.14 20.194 22 16.44 22 12.017 22 6.484 17.523 2 12 2Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {/* Telegram */}
            <button
              type="button"
              title="Telegram"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-white"
                aria-hidden
              >
                <path d="M9.036 15.67 8.88 19.1c.507 0 .727-.218.99-.48l2.377-2.282 4.926 3.61c.903.497 1.546.236 1.792-.836l3.247-15.23.001-.001c.288-1.338-.483-1.862-1.36-1.534L1.8 9.92c-1.31.51-1.29 1.24-.222 1.57l4.876 1.523L19.5 6.17c.6-.395 1.147-.176.697.219"/>
              </svg>
            </button>
            {/* LinkedIn */}
            <button
              type="button"
              title="LinkedIn"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-white"
                aria-hidden
              >
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.1c0-1.7-.03-3.9-2.38-3.9-2.38 0-2.75 1.86-2.75 3.78V24h-4V8z"/>
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;