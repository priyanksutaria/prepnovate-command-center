
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, CreditCard, BookOpen, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FlashcardCreationForm } from './FlashcardCreationForm';
import { FlashcardDetailsView } from './FlashcardDetailsView';
import { FlashcardEditDialog } from './FlashcardEditDialog';

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
  cards?: FlashCard[];
}

const mockFlashcards: FlashcardSet[] = [
  { 
    id: '1', 
    title: 'Financial Ratios Fundamentals', 
    level: 'Level I', 
    subject: 'Financial Analysis', 
    cardCount: 45, 
    status: 'active', 
    lastUpdated: '2024-01-15',
    cards: [
      { id: '1', front: 'What is the Current Ratio?', back: 'Current Assets / Current Liabilities - measures short-term liquidity' },
      { id: '2', front: 'What is ROE?', back: 'Return on Equity = Net Income / Shareholders Equity' },
      { id: '3', front: 'What is the Debt-to-Equity Ratio?', back: 'Total Debt / Total Equity - measures financial leverage' }
    ]
  },
  { 
    id: '2', 
    title: 'Ethics Code & Standards', 
    level: 'Level I', 
    subject: 'Ethics', 
    cardCount: 32, 
    status: 'active', 
    lastUpdated: '2024-01-14',
    cards: [
      { id: '4', front: 'What are the 7 Standards of Professional Conduct?', back: 'Professionalism, Integrity, Duties to Clients, Duties to Employers, Investment Analysis, Conflicts of Interest, Responsibilities as CFA Member' },
      { id: '5', front: 'What is Standard I(A)?', back: 'Knowledge of the Law - Members must understand and comply with laws and regulations' }
    ]
  },
  { 
    id: '3', 
    title: 'Derivatives Basics', 
    level: 'Level II', 
    subject: 'Derivatives', 
    cardCount: 28, 
    status: 'draft', 
    lastUpdated: '2024-01-13',
    cards: [
      { id: '6', front: 'What is a Forward Contract?', back: 'Agreement to buy/sell an asset at a specified price on a future date' },
      { id: '7', front: 'What is an Option?', back: 'Right (but not obligation) to buy/sell an asset at a specified price' }
    ]
  },
  { 
    id: '4', 
    title: 'Portfolio Management', 
    level: 'Level III', 
    subject: 'Portfolio', 
    cardCount: 55, 
    status: 'active', 
    lastUpdated: '2024-01-12',
    cards: [
      { id: '8', front: 'What is Modern Portfolio Theory?', back: 'Theory that investors can construct portfolios to optimize expected return for a given level of risk' },
      { id: '9', front: 'What is the Capital Asset Pricing Model (CAPM)?', back: 'Model that describes the relationship between systematic risk and expected return' }
    ]
  },
];

type ViewMode = 'list' | 'create' | 'details' | 'edit';

export const FlashcardManagement: React.FC = () => {
  const [flashcards, setFlashcards] = useState<FlashcardSet[]>(mockFlashcards);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedFlashcardSet, setSelectedFlashcardSet] = useState<FlashcardSet | null>(null);
  const [editingCard, setEditingCard] = useState<FlashCard | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredFlashcards = flashcards.filter(set =>
    set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    set.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateFlashcardSet = () => {
    setViewMode('create');
  };

  const handleSaveFlashcardSet = (newSet: FlashcardSet) => {
    setFlashcards([...flashcards, newSet]);
    setViewMode('list');
  };

  const handleViewDetails = (flashcardSet: FlashcardSet) => {
    setSelectedFlashcardSet(flashcardSet);
    setViewMode('details');
  };

  const handleEditFlashcardSet = (flashcardSet: FlashcardSet) => {
    setSelectedFlashcardSet(flashcardSet);
    setViewMode('edit');
  };

  const handleDeleteFlashcardSet = (setId: string) => {
    setFlashcards(flashcards.filter(set => set.id !== setId));
    if (selectedFlashcardSet?.id === setId) {
      setViewMode('list');
      setSelectedFlashcardSet(null);
    }
  };

  const handleEditCard = (card: FlashCard) => {
    setEditingCard(card);
    setIsEditDialogOpen(true);
  };

  const handleSaveCard = (updatedCard: FlashCard) => {
    if (selectedFlashcardSet) {
      const updatedSet = {
        ...selectedFlashcardSet,
        cards: selectedFlashcardSet.cards?.map(card => 
          card.id === updatedCard.id ? updatedCard : card
        ) || []
      };
      setSelectedFlashcardSet(updatedSet);
      setFlashcards(flashcards.map(set => 
        set.id === updatedSet.id ? updatedSet : set
      ));
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedFlashcardSet(null);
  };

  if (viewMode === 'create') {
    return (
      <FlashcardCreationForm
        onBack={handleBackToList}
        onSave={handleSaveFlashcardSet}
      />
    );
  }

  if (viewMode === 'details' && selectedFlashcardSet) {
    return (
      <>
        <FlashcardDetailsView
          flashcardSet={selectedFlashcardSet}
          onBack={handleBackToList}
          onEdit={() => setViewMode('edit')}
          onDelete={() => handleDeleteFlashcardSet(selectedFlashcardSet.id)}
        />
        <FlashcardEditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          card={editingCard}
          onSave={handleSaveCard}
        />
      </>
    );
  }

  if (viewMode === 'edit' && selectedFlashcardSet) {
    return (
      <FlashcardCreationForm
        onBack={handleBackToList}
        onSave={(updatedSet) => {
          setFlashcards(flashcards.map(set => 
            set.id === selectedFlashcardSet.id ? { ...updatedSet, id: selectedFlashcardSet.id } : set
          ));
          setViewMode('list');
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Flashcard Management</h1>
          <p className="text-slate-400">Create and manage flashcard sets</p>
        </div>
        <Button onClick={handleCreateFlashcardSet} className="bg-cyan-600 hover:bg-cyan-700 text-white">
          <Plus size={20} className="mr-2" />
          Create Flashcard Set
        </Button>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Search flashcard sets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFlashcards.map((set) => (
            <div key={set.id} className="bg-slate-700 p-6 rounded-lg border border-slate-600">
              <div className="flex items-start justify-between mb-4">
                <CreditCard className="text-cyan-400" size={24} />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  set.status === 'active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                }`}>
                  {set.status}
                </span>
              </div>
              
              <h3 className="text-white font-semibold mb-2">{set.title}</h3>
              <p className="text-slate-300 text-sm mb-1">{set.level} • {set.subject}</p>
              <p className="text-slate-400 text-sm mb-4">{set.cardCount} cards</p>
              
              <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                <span>Updated: {set.lastUpdated}</span>
                <BookOpen size={14} />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleViewDetails(set)}
                  className="flex-1 border-slate-500 text-slate-300 hover:text-white"
                >
                  <Eye size={14} className="mr-1" />
                  View
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleEditFlashcardSet(set)}
                  className="border-slate-500 text-slate-300 hover:text-white"
                >
                  <Edit size={14} />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDeleteFlashcardSet(set.id)}
                  className="border-slate-500 text-red-400 hover:text-red-300"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
