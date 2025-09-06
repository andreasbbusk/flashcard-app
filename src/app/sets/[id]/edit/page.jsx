'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { getSets, updateSet } from '@/lib/api';
import { AnimatedSection } from '@/components/client-wrapper';

export default function EditSetPage() {
  const router = useRouter();
  const params = useParams();
  const setId = parseInt(params.id);
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingSet, setLoadingSet] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSet = async () => {
      try {
        const sets = await getSets();
        const set = sets.find(s => s.id === setId);
        
        if (!set) {
          setError('Set ikke fundet');
          return;
        }

        setFormData({
          name: set.name || '',
          description: set.description || ''
        });
      } catch (err) {
        console.error('Error fetching set:', err);
        setError('Kunne ikke hente set');
      } finally {
        setLoadingSet(false);
      }
    };

    if (setId) {
      fetchSet();
    }
  }, [setId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Set navn er påkrævet');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateSet(setId, formData);
      router.push('/sets');
    } catch (err) {
      console.error('Error updating set:', err);
      setError(err.message || 'Kunne ikke opdatere set');
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

  if (loadingSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Henter set...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <AnimatedSection>
          <div className="flex items-center space-x-4">
            <Link href="/sets">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tilbage til sets
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Rediger Set</h1>
              <p className="text-gray-600 mt-1">Opdater dit flashcard set</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Form */}
        <AnimatedSection delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle>Set Detaljer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Set Navn *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="F.eks. Matematik, Geografi, Sprog..."
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Beskrivelse
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Beskriv hvad dette set indeholder..."
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Opdaterer...' : 'Opdater Set'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/sets')}
                    className="flex-1"
                  >
                    Annuller
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}