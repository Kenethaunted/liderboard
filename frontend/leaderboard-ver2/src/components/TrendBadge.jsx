import React from 'react'

export default function TrendBadge({ prevPlace, place }) {
  const diff = (prevPlace ?? place) - place; // positive -> moved up

  if (diff > 0) {
    // зелёная стрелка вверх
    return (
      <div className="flex items-center gap-1 text-green-600 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-green-600" viewBox="0 0 24 24">
          <path d="M12 4l-8 8h6v8h4v-8h6z" />
        </svg>
        <span>+{diff}</span>
      </div>
    );
  }

  if (diff < 0) {
    // красная стрелка вниз
    return (
      <div className="flex items-center gap-1 text-red-600 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-red-600" viewBox="0 0 24 24">
          <path d="M12 20l8-8h-6v-8h-4v8h-6z" />
        </svg>
        <span>{Math.abs(diff)}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-gray-400" viewBox="0 0 24 24">
        <path d="M4 12h16v2H4z" />
      </svg>
      <span>0</span>
    </div>
  );
}