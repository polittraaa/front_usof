import React from "react";

export default function About() {
  return (
    <div className="min-h-screen text-gray-700 mt6 w-70%">
      <div className="max-w-4xl mx-auto rounded-2xl shadow-md p-10">
        {/* Project Title */}
        <h1 className="text-3xl font-bold text-center mb-6 text-600">
          Usof — Question & Answer Platform for Developers
        </h1>

        {/* Short Description */}
        <p className="text-lg mb-6">
          <strong>Usof</strong> is a full-stack question-and-answer service for professional and
          enthusiast programmers. Users can create posts, share problems or solutions, comment on
          each other’s posts, and build their reputation through likes and ratings. Admins have
          extended control over users, posts, comments, and categories.
        </p>

        {/* Features Overview */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700">Key Features</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li> User authentication with roles (User / Admin)</li>
            <li> User profiles with editable data and profile pictures</li>
            <li> Posts with categories, likes/dislikes, and comments</li>
            <li> Nested comments with like/dislike functionality</li>
            <li> Sorting and filtering (by date, likes, category, etc.)</li>
            <li> Pagination or infinite scroll for better performance</li>
            <li> Admin panel for CRUD operations on all entities</li>
            <li> Backend: Express.js + MySQL with structured API endpoints</li>
          </ul>
        </div>

        {/* Technical Stack */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Tech Stack</h2>
          <p>
            <strong>Frontend:</strong> React, JSX, TailwindCSS  
            <br />
            <strong>Backend:</strong> Node.js (Express), MySQL  
            <br />
            <strong>Additional Tools:</strong> JWT Auth, REST API, Admin CRUD Management
          </p>
        </div>

        {/* Personal Info Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Insperation</h2>
          <p className="italic text-gray-600">
            {/*  Add your name, background, and motivation here */}
            This projekt is a possibility learn and apply my skils in area of website dewelopment.  
          </p>
        </div>

        {/* GitHub Link Section */}
        <div className="mb-8 text-center">
          <a
            href="[Your GitHub Repo Link]"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-700 transition"
          >
            🔗 View Project on GitHub
          </a>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-10">
          © {new Date().getFullYear()} Usof Project — Full Stack Developer Track
        </p>
      </div>
    </div>
  );
}
