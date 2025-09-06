'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus } from 'lucide-react';
import { createFlashcard, getSets } from '@/lib/api';
import { AnimatedSection } from '@/components/client-wrapper';

export default function NewCardPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    front: '',
    back: '',
    set: ''
  });
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingSets, setLoadingSets] = useState(true);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const fetchedSets = await getSets();
        setSets(fetchedSets);
      } catch (err) {
        console.error('Error fetching sets:', err);
      } finally {
        setLoadingSets(false);
      }
    };

    fetchSets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.front.trim() || !formData.back.trim()) {
      setError('Både forside og bagside er påkrævet');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createFlashcard(formData);
      router.push('/cards');
    } catch (err) {
      console.error('Error creating flashcard:', err);
      setError(err.message || 'Kunne ikke oprette flashcard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSetChange = (value) => {
    setFormData(prev => ({
      ...prev,
      set: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <AnimatedSection>
          <div className="flex items-center space-x-4">
            <Link href="/cards">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tilbage til kort
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Opret Nyt Flashcard</h1>
              <p className="text-gray-600 mt-1">Tilføj et nyt flashcard til dit sæt</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Form */}
        <AnimatedSection delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle>Flashcard Detaljer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="front" className="text-sm font-medium text-gray-700">
                    Forside *
                  </label>
                  <Textarea
                    id="front"
                    name="front"
                    value={formData.front}
                    onChange={handleChange}
                    placeholder="Hvad skal stå på forsiden af kortet?"
                    rows={3}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="back" className="text-sm font-medium text-gray-700">
                    Bagside *
                  </label>
                  <Textarea
                    id="back"
                    name="back"
                    value={formData.back}
                    onChange={handleChange}
                    placeholder="Hvad skal stå på bagsiden af kortet?"
                    rows={3}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="set" className="text-sm font-medium text-gray-700">
                    Set
                  </label>
                  {loadingSets ? (
                    <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
                  ) : (
                    <Select onValueChange={handleSetChange} value={formData.set}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vælg et set eller lad være blank for General" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        {sets.map((set) => (
                          <SelectItem key={set.id} value={set.name}>
                            {set.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <p className="text-xs text-gray-500">
                    Hvis intet set er valgt, vil kortet blive tilføjet til "General"
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Opretter...' : 'Opret Flashcard'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/cards')}
                    className="flex-1"
                  >
                    Annuller
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Quick Action */}
        <AnimatedSection delay={0.2}>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Mangler du et set til dit kort?
                </p>
                <Link href="/sets/new">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Opret nyt set
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}