import Link from 'next/link';
import { getSets } from '@/modules/services/api';

export default async function Dashboard() {
  let sets = [];
  let error = null;

  try {
    sets = await getSets();
  } catch (err) {
    error = 'Kunne ikke hente sets';
    console.error('Error fetching sets:', err);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Flashcard Sets
          </h1>
          <p className="text-gray-600 text-lg">
            Vælg et set for at begynde at studere
          </p>
        </div>

        {error ? (
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg inline-block">
              {error}
            </div>
          </div>
        ) : sets.length === 0 ? (
          <div className="text-center">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg inline-block">
              Ingen sets fundet
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sets.map((set) => (
              <Link 
                key={set.id} 
                href={`/study/${encodeURIComponent(set.name)}`}
                className="block group"
              >
                <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-200 group-hover:border-blue-300">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {set.name}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded">
                        Set
                      </span>
                    </div>
                  </div>
                  
                  {set.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {set.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Oprettet: {new Date(set.createdAt).toLocaleDateString('da-DK')}
                    </span>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Start studier</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}