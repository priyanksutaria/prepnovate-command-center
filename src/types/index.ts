
export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  level: string;
  subject: string;
  chapter: string;
  cards: Flashcard[];
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Test {
  id: string;
  title: string;
  description: string;
  level: string;
  subject: string;
  chapter: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  chapter: string;
  weightage?: number;
}

export interface MockTest {
  id: string;
  title: string;
  description: string;
  level: string;
  subject: string;
  totalQuestions: number;
  duration: number;
  passingScore: number;
  chapters: ChapterWeightage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChapterWeightage {
  chapter: string;
  weightage: number;
  questionCount: number;
}

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
  success: boolean;
  message?: string;
}
