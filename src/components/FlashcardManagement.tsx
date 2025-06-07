import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, CreditCard, BookOpen, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TEST_ID_MAPPING, TestLevel } from './testMapping';

// Backend interfaces
interface FlashCard {
  _id: string;
  cardNo: number;
  card: string;
}

interface FlashcardSet {
  _id: string;
  lscLevel: string; // e.g. "1-2-1"
  Cards: FlashCard[];
  __v: number;
}

// Generic API Response interface
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Specific API Response for flashcard fetch
interface FlashcardFetchResponse extends ApiResponse<FlashcardSet[]> {
  data: FlashcardSet[];
}

// Frontend interfaces for editing
interface EditableFlashCard {
  id: string;
  front: string;
  back: string;
}

interface EditableFlashcardSet {
  id: string;
  title: string;
  level: string;
  subject: string;
  cardCount: number;
  status: 'active' | 'draft';
  lastUpdated: string;
  cards?: EditableFlashCard[];
}

// Helper functions
const levelNumToRoman = (num: string) => {
  switch (num) {
    case '1': return 'I';
    case '2': return 'II';
    case '3': return 'III';
    default: return num;
  }
};

const getTitleFromCode = (code: string) => {
  const [lvl, subjIdx] = code.split('-');
  const levelKey = `Level ${levelNumToRoman(lvl)}` as TestLevel;
  const subjects = TEST_ID_MAPPING[levelKey];
  if (!subjects) return code;

  for (const subjectName in subjects) {
    const chapters = subjects[subjectName];
    for (const chapterName in chapters) {
      const fullCode = chapters[chapterName];
      if (fullCode === code) {
        return `${levelKey} - ${subjectName}`;
      }
    }
  }
  return code;
};

const parseCardContent = (cardContent: string) => {
  const parts = cardContent.split(' :.: ');
  return { front: parts[0] || cardContent, back: parts[1] || '' };
};

// Convert backend data to frontend format
const convertToEditableFormat = (backendSet: FlashcardSet): EditableFlashcardSet => {
  const title = getTitleFromCode(backendSet.lscLevel);
  const [levelPart, subjectPart] = title.split(' - ');
  
  return {
    id: backendSet._id,
    title: title,
    level: levelPart || backendSet.lscLevel,
    subject: subjectPart || 'Unknown Subject',
    cardCount: backendSet.Cards.length,
    status: 'active',
    lastUpdated: new Date().toISOString().split('T')[0],
    cards: backendSet.Cards.map(card => {
      const parsed = parseCardContent(card.card);
      return {
        id: card._id,
        front: parsed.front,
        back: parsed.back
      };
    })
  };
};

// Convert frontend format to backend format
const convertToBackendFormat = (editableSet: EditableFlashcardSet): FlashcardSet => {
  return {
    _id: editableSet.id,
    lscLevel: editableSet.level.split(' ')[1] || editableSet.level, // Extract level from title
    Cards: (editableSet.cards || []).map((card, index) => ({
      _id: card.id,
      cardNo: index + 1,
      card: `${card.front} :.: ${card.back}`
    })),
    __v: 0
  };
};

type ViewMode = 'list' | 'create' | 'details' | 'edit';

// Mock components for now - these would be imported from separate files
const FlashcardCreationForm: React.FC<{
  onBack: () => void;
  onSave: (set: EditableFlashcardSet) => void;
  initialData?: EditableFlashcardSet;
}> = ({ onBack, onSave, initialData }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-4">
      <Button onClick={onBack} variant="outline" className="border-slate-500 text-slate-300">
        ← Back to List
      </Button>
      <h1 className="text-3xl font-bold text-white">
        {initialData ? 'Edit Flashcard Set' : 'Create New Flashcard Set'}
      </h1>
    </div>
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
      <p className="text-slate-400 mb-4">Flashcard creation form would go here</p>
      <Button 
        onClick={() => onSave({
          id: initialData?.id || Date.now().toString(),
          title: 'New Flashcard Set',
          level: 'Level I',
          subject: 'Sample Subject',
          cardCount: 0,
          status: 'draft',
          lastUpdated: new Date().toISOString().split('T')[0],
          cards: []
        })}
        className="bg-cyan-600 hover:bg-cyan-700 text-white"
      >
        Save Flashcard Set
      </Button>
    </div>
  </div>
);

const FlashcardDetailsView: React.FC<{
  flashcardSet: EditableFlashcardSet;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ flashcardSet, onBack, onEdit, onDelete }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button onClick={onBack} variant="outline" className="border-slate-500 text-slate-300">
          ← Back to List
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">{flashcardSet.title}</h1>
          <p className="text-slate-400">{flashcardSet.level} • {flashcardSet.subject}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Edit size={16} className="mr-2" />
          Edit
        </Button>
        <Button onClick={onDelete} variant="outline" className="border-red-500 text-red-400 hover:text-red-300">
          <Trash2 size={16} className="mr-2" />
          Delete
        </Button>
      </div>
    </div>
    
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
      <h3 className="text-white font-semibold mb-4">Flashcards ({flashcardSet.cardCount})</h3>
      {flashcardSet.cards && flashcardSet.cards.length > 0 ? (
        <div className="space-y-4">
          {flashcardSet.cards.slice(0, 5).map((card, index) => (
            <div key={card.id} className="bg-slate-700 p-4 rounded-lg border border-slate-600">
              <div className="flex justify-between items-start mb-2">
                <span className="text-cyan-400 text-sm font-medium">Card {index + 1}</span>
                <Button size="sm" variant="outline" className="border-slate-500 text-slate-300">
                  <Edit size={12} />
                </Button>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-slate-300 text-xs">Front:</p>
                  <p className="text-white">{card.front}</p>
                </div>
                {card.back && (
                  <div>
                    <p className="text-slate-300 text-xs">Back:</p>
                    <p className="text-slate-400">{card.back}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {flashcardSet.cards.length > 5 && (
            <p className="text-slate-400 text-center">... and {flashcardSet.cards.length - 5} more cards</p>
          )}
        </div>
      ) : (
        <p className="text-slate-400">No cards found in this set.</p>
      )}
    </div>
  </div>
);

export const FlashcardManagement: React.FC = () => {
  // Backend state
  const [backendFlashcards, setBackendFlashcards] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Frontend state
  const [editableFlashcards, setEditableFlashcards] = useState<EditableFlashcardSet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedFlashcardSet, setSelectedFlashcardSet] = useState<EditableFlashcardSet | null>(null);

  // API call functions
  const createFlashcardSet = async (setData: Omit<FlashcardSet, '_id' | '__v'>): Promise<ApiResponse<FlashcardSet>> => {
    try {
      const response = await fetch('https://prepnovate-backend.onrender.com/api/flashCard/addFlashCard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setData)
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create flashcard set'
      };
    }
  };

  const updateFlashcardSet = async (setData: FlashcardSet): Promise<ApiResponse<FlashcardSet>> => {
    try {
      const response = await fetch('https://prepnovate-backend.onrender.com/api/flashCard/updateFlashCard', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setData)
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update flashcard set'
      };
    }
  };

  const deleteFlashcardSet = async (setId: string): Promise<ApiResponse<null>> => {
    try {
      const response = await fetch('https://prepnovate-backend.onrender.com/api/flashCard/deleteFlashCard', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: setId })
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete flashcard set'
      };
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('https://prepnovate-backend.onrender.com/api/flashCard/getFlashCard');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result: FlashcardFetchResponse = await response.json();
      
      if (result.success) {
        setBackendFlashcards(result.data);
        const converted = result.data.map(convertToEditableFormat);
        setEditableFlashcards(converted);
      } else {
        throw new Error(result.message || 'Failed to fetch flashcards');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch flashcards');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredFlashcards = editableFlashcards.filter(set =>
    set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    set.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (set.cards && set.cards.some(card => 
      card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.back.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  // Event handlers
  const handleCreateFlashcardSet = () => {
    setViewMode('create');
  };

  const handleViewDetails = (flashcardSet: EditableFlashcardSet) => {
    setSelectedFlashcardSet(flashcardSet);
    setViewMode('details');
  };

  const handleEditFlashcardSet = (flashcardSet: EditableFlashcardSet) => {
    setSelectedFlashcardSet(flashcardSet);
    setViewMode('edit');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedFlashcardSet(null);
  };

  // Event handlers with API integration
  const handleSaveFlashcardSet = async (newSet: EditableFlashcardSet) => {
    setLoading(true);
    try {
      let response: ApiResponse<FlashcardSet>;
      
      if (viewMode === 'edit' && selectedFlashcardSet) {
        const backendData = convertToBackendFormat(newSet);
        response = await updateFlashcardSet(backendData);
      } else {
        // For new sets, exclude _id
        const backendData = convertToBackendFormat(newSet);
        const { _id, ...newSetData } = backendData;
        response = await createFlashcardSet(newSetData);
      }

      if (response.success) {
        // Refresh data after successful operation
        await fetchData();
        setViewMode('list');
        setSelectedFlashcardSet(null);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save flashcard set');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlashcardSet = async (setId: string) => {
    setLoading(true);
    try {
      const response = await deleteFlashcardSet(setId);
      
      if (response.success) {
        // Refresh data after successful deletion
        await fetchData();
        setViewMode('list');
        setSelectedFlashcardSet(null);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete flashcard set');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-slate-400">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading flashcards...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Flashcard Management</h1>
            <p className="text-slate-400">Create and manage flashcard sets</p>
          </div>
          <Button onClick={handleCreateFlashcardSet} className="bg-cyan-600 hover:bg-cyan-700 text-white">
            <Plus size={20} className="mr-2"/>Create Flashcard Set
          </Button>
        </div>
        <div className="bg-red-900/20 border border-red-600 p-6 rounded-xl">
          <h3 className="text-red-400 font-semibold mb-2">Error Loading Flashcards</h3>
          <p className="text-red-300">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4 bg-red-600 hover:bg-red-700 text-white">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // View modes
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
      <FlashcardDetailsView
        flashcardSet={selectedFlashcardSet}
        onBack={handleBackToList}
        onEdit={() => setViewMode('edit')}
        onDelete={() => handleDeleteFlashcardSet(selectedFlashcardSet.id)}
      />
    );
  }

  if (viewMode === 'edit' && selectedFlashcardSet) {
    return (
      <FlashcardCreationForm
        onBack={handleBackToList}
        onSave={handleSaveFlashcardSet}
        initialData={selectedFlashcardSet}
      />
    );
  }

  // Main list view
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Flashcard Management</h1>
          <p className="text-slate-400">Create and manage flashcard sets</p>
        </div>
        <Button onClick={handleCreateFlashcardSet} className="bg-cyan-600 hover:bg-cyan-700 text-white">
          <Plus size={20} className="mr-2"/>Create Flashcard Set
        </Button>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20}/>
          <Input
            placeholder="Search flashcard sets..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-white"
          />
        </div>

        {filteredFlashcards.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="mx-auto text-slate-500 mb-4" size={48}/>
            <h3 className="text-slate-400 text-lg mb-2">No flashcard sets found</h3>
            <p className="text-slate-500">
              {searchTerm ? 'No sets match your search criteria.' : 'Start by creating your first flashcard set.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlashcards.map(set => {
              const firstCard = set.cards?.[0];
              return (
                <div key={set.id} className="bg-slate-700 p-6 rounded-lg border border-slate-600">
                  <div className="flex items-start justify-between mb-4">
                    <CreditCard className="text-cyan-400" size={24}/>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      set.status === 'active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                    }`}>
                      {set.status}
                    </span>
                  </div>
                  
                  <h3 className="text-white font-semibold mb-2">{set.title}</h3>
                  <p className="text-slate-300 text-sm mb-1">{set.level} • {set.subject}</p>
                  <p className="text-slate-400 text-sm mb-4">{set.cardCount} cards</p>
                  
                  {firstCard && (
                    <div className="mb-4 p-3 bg-slate-800 rounded border border-slate-600">
                      <p className="text-slate-300 text-xs mb-1">Sample card:</p>
                      <p className="text-white text-sm font-medium">{firstCard.front}</p>
                      {firstCard.back && <p className="text-slate-400 text-xs mt-1">{firstCard.back}</p>}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                    <span>Updated: {set.lastUpdated}</span>
                    <BookOpen size={14}/>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewDetails(set)}
                      className="flex-1 border-slate-500 text-slate-300 hover:text-white"
                    >
                      <Eye size={14} className="mr-1"/>View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEditFlashcardSet(set)}
                      className="border-slate-500 text-slate-300 hover:text-white"
                    >
                      <Edit size={14}/>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteFlashcardSet(set.id)}
                      className="border-slate-500 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={14}/>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardManagement;