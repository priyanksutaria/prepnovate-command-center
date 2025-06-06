
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save } from 'lucide-react';

interface FlashCard {
  id: string;
  front: string;
  back: string;
}

interface FlashcardEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  card: FlashCard | null;
  onSave: (card: FlashCard) => void;
}

export const FlashcardEditDialog: React.FC<FlashcardEditDialogProps> = ({ 
  isOpen, 
  onClose, 
  card, 
  onSave 
}) => {
  const [editedCard, setEditedCard] = useState<FlashCard | null>(null);

  useEffect(() => {
    if (card) {
      setEditedCard({ ...card });
    }
  }, [card]);

  const handleSave = () => {
    if (editedCard) {
      onSave(editedCard);
      onClose();
    }
  };

  if (!editedCard) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Edit Flashcard</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="text-slate-300">Front (Question)</Label>
            <Textarea
              value={editedCard.front}
              onChange={(e) => setEditedCard({...editedCard, front: e.target.value})}
              className="bg-slate-600 border-slate-500 text-white"
              rows={4}
              placeholder="Enter question or term"
            />
          </div>

          <div>
            <Label className="text-slate-300">Back (Answer)</Label>
            <Textarea
              value={editedCard.back}
              onChange={(e) => setEditedCard({...editedCard, back: e.target.value})}
              className="bg-slate-600 border-slate-500 text-white"
              rows={4}
              placeholder="Enter answer or definition"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
