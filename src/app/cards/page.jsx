import Link from 'next/link';
import { getFlashcards, getSets } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, CreditCard, ArrowLeft } from 'lucide-react';
import { AnimatedSection, ActionButton } from '@/components/client-wrapper';

function CardsTable({ cards }) {
  const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forside</th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bagside</th>
              <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Set</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Handlinger</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cards.map((card) => (
              <tr key={card.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {truncateText(card.front, 40)}
                    </div>
                    <div className="md:hidden mt-1">
                      {card.back && (
                        <p className="text-sm text-gray-500">
                          <strong>Bagside:</strong> {truncateText(card.back, 30)}
                        </p>
                      )}
                      {card.set && <Badge variant="outline" className="mt-1">{card.set}</Badge>}
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-500">
                  {truncateText(card.back)}
                </td>
                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                  {card.set ? (
                    <Badge variant="outline">{card.set}</Badge>
                  ) : (
                    <span className="text-gray-400 text-sm">Intet set</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <ActionButton item={card} action="Edit" />
                  <ActionButton item={card} action="Delete" variant="destructive" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function CardsPage() {
  let cards = [];
  let sets = [];
  let error = null;

  try {
    [cards, sets] = await Promise.all([
      getFlashcards(),
      getSets()
    ]);
  } catch (err) {
    error = 'Kunne ikke hente flashcards';
    console.error('Error fetching data:', err);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tilbage til dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Administrer Flashcards</h1>
                <p className="text-gray-600 mt-1">Se og rediger alle dine flashcards</p>
              </div>
            </div>
            <Link href="/cards/new">
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Opret nyt kort
              </Button>
            </Link>
          </div>
        </AnimatedSection>

        {/* Stats */}
        <AnimatedSection delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="flex items-center p-6">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{cards.length}</div>
                  <p className="text-gray-600">Flashcards i alt</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <CreditCard className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{sets.length}</div>
                  <p className="text-gray-600">Forskellige sets</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <CreditCard className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">
                    {sets.length > 0 ? Math.round(cards.length / sets.length) : 0}
                  </div>
                  <p className="text-gray-600">Kort per set</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>

        {/* Content */}
        <AnimatedSection delay={0.2}>
          {error ? (
            <Card>
              <CardContent className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-red-600 font-medium mb-2">{error}</div>
                  <p className="text-gray-500 text-sm">Prøv at genindlæse siden</p>
                </div>
              </CardContent>
            </Card>
          ) : cards.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <h3 className="font-semibold text-lg">Ingen flashcards fundet</h3>
                    <p className="text-gray-500">Start med at oprette dit første flashcard</p>
                  </div>
                  <Link href="/cards/new">
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Opret dit første kort
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <CardsTable cards={cards} />
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}