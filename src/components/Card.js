export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
        {title}
      </h3>
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
}