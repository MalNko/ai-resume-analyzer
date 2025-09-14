export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-blue-600">
            AI Resume Analyzer
          </div>
          <div className="space-x-4">
            <a href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}