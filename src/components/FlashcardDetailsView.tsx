
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Plus, Search, RotateCcw } from 'lucide-react';

interface FlashCard {
  id: string;
  front: string;
  back: string;
}

interface FlashcardSet {
  id: string;
  title: string;
  level: string;
  subject: string;
  cardCount: number;
  status: 'active' | 'draft';
  lastUpdated: string;
  cards: FlashCard[];
}

interface FlashcardDetailsViewProps {
  flashcardSet: FlashcardSet;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const FlashcardDetailsView: React.FC<FlashcardDetailsViewProps> = ({ 
  flashcardSet, 
  onBack, 
  onEdit, 
  onDelete 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const filteredCards = flashcardSet.cards.filter(card =>
    card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.back.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCard = (cardId: string) => {
    const newFlippedCards = new Set(flippedCards);
    if (newFlippedCards.has(cardId)) {
      newFlippedCards.delete(cardId);
    } else {
      newFlippedCards.add(cardId);
    }
    setFlippedCards(newFlippedCards);
  };

  const resetAllCards = () => {
    setFlippedCards(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="border-slate-600 text-slate-300">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{flashcardSet.title}</h1>
            <p className="text-slate-400">{flashcardSet.level} • {flashcardSet.subject}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button onClick={resetAllCards} variant="outline" className="border-slate-600 text-slate-300">
            <RotateCcw size={16} className="mr-2" />
            Reset Cards
          </Button>
          <Button onClick={onEdit} variant="outline" className="border-slate-600 text-slate-300">
            <Edit size={16} className="mr-2" />
            Edit Set
          </Button>
          <Button onClick={onDelete} variant="outline" className="border-slate-600 text-red-400 hover:text-red-300">
            <Trash2 size={16} className="mr-2" />
            Delete Set
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Total Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">{flashcardSet.cardCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={flashcardSet.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}>
              {flashcardSet.status}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-slate-300">{flashcardSet.lastUpdated}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Flipped Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">{flippedCards.size}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Flashcards</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <Input
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map((card) => (
              <div key={card.id} className="relative">
                <div 
                  className={`bg-slate-700 border border-slate-600 rounded-lg cursor-pointer transition-all duration-300 transform ${
                    flippedCards.has(card.id) ? 'scale-105' : 'hover:scale-102'
                  }`}
                  onClick={() => toggleCard(card.id)}
                  style={{ minHeight: '150px' }}
                >
                  <div className="p-4 h-full flex items-center justify-center">
                    {flippedCards.has(card.id) ? (
                      <div className="text-center">
                        <div className="text-xs text-cyan-400 mb-2">ANSWER</div>
                        <div className="text-white text-sm">{card.back}</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-xs text-slate-400 mb-2">QUESTION</div>
                        <div className="text-white text-sm">{card.front}</div>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <div className={`w-3 h-3 rounded-full ${
                      flippedCards.has(card.id) ? 'bg-cyan-400' : 'bg-slate-500'
                    }`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
