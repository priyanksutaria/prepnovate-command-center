
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';

interface FlashCard {
  id: string;
  front: string;
  back: string;
}

interface FlashcardCreationFormProps {
  onBack: () => void;
  onSave: (flashcardSet: any) => void;
}

export const FlashcardCreationForm: React.FC<FlashcardCreationFormProps> = ({ onBack, onSave }) => {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState<FlashCard[]>([
    { id: '1', front: '', back: '' }
  ]);

  const addCard = () => {
    const newCard: FlashCard = {
      id: Date.now().toString(),
      front: '',
      back: ''
    };
    setCards([...cards, newCard]);
  };

  const updateCard = (id: string, field: 'front' | 'back', value: string) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    ));
  };

  const deleteCard = (id: string) => {
    if (cards.length > 1) {
      setCards(cards.filter(card => card.id !== id));
    }
  };

  const handleSave = () => {
    const flashcardSet = {
      id: Date.now().toString(),
      title,
      level,
      subject,
      description,
      cardCount: cards.filter(card => card.front && card.back).length,
      status: 'draft' as const,
      lastUpdated: new Date().toISOString().split('T')[0],
      cards: cards.filter(card => card.front && card.back)
    };
    onSave(flashcardSet);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="border-slate-600 text-slate-300">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">Create Flashcard Set</h1>
        </div>
        <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white">
          <Save size={16} className="mr-2" />
          Save Flashcard Set
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Set Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter flashcard set title"
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>

              <div>
                <Label className="text-slate-300">CFA Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="Level I">Level I</SelectItem>
                    <SelectItem value="Level II">Level II</SelectItem>
                    <SelectItem value="Level III">Level III</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="Ethics">Ethics</SelectItem>
                    <SelectItem value="Financial Analysis">Financial Analysis</SelectItem>
                    <SelectItem value="Economics">Economics</SelectItem>
                    <SelectItem value="Portfolio Management">Portfolio Management</SelectItem>
                    <SelectItem value="Derivatives">Derivatives</SelectItem>
                    <SelectItem value="Fixed Income">Fixed Income</SelectItem>
                    <SelectItem value="Equity">Equity</SelectItem>
                    <SelectItem value="Alternative Investments">Alternative Investments</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300">Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  className="bg-slate-600 border-slate-500 text-white"
                  rows={3}
                />
              </div>

              <div className="pt-4">
                <Button onClick={addCard} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                  <Plus size={16} className="mr-2" />
                  Add New Card
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Flashcards ({cards.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cards.map((card, index) => (
                  <div key={card.id} className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-300 font-medium">Card {index + 1}</span>
                      {cards.length > 1 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteCard(card.id)}
                          className="border-slate-500 text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Front (Question)</Label>
                        <Textarea
                          value={card.front}
                          onChange={(e) => updateCard(card.id, 'front', e.target.value)}
                          placeholder="Enter question or term"
                          className="bg-slate-600 border-slate-500 text-white"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Back (Answer)</Label>
                        <Textarea
                          value={card.back}
                          onChange={(e) => updateCard(card.id, 'back', e.target.value)}
                          placeholder="Enter answer or definition"
                          className="bg-slate-600 border-slate-500 text-white"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
