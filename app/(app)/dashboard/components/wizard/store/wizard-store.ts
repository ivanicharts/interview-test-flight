import { create } from 'zustand';

export type WizardStep = 'cv' | 'jd' | 'analysis' | 'interview' | 'complete';

export interface WizardState {
  // Current step
  currentStep: number;

  // Document IDs and metadata
  cvId: string | null;
  cvTitle: string | null;
  jdId: string | null;
  jdTitle: string | null;

  // Analysis and interview IDs
  analysisId: string | null;
  interviewId: string | null;
  questionCount: number | null;

  // UI state
  error: string | null;
  isLoading: boolean;
}

interface WizardActions {
  // Step navigation
  goToStep: (step: number) => void;
  goBack: () => void;
  nextStep: () => void;

  // Data updates
  setCVData: (id: string, title: string) => void;
  setJDData: (id: string, title: string) => void;
  setAnalysisData: (id: string) => void;
  setInterviewData: (id: string, questionCount?: number) => void;

  // UI state
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;

  // Batch updates
  updateState: (updates: Partial<WizardState>) => void;

  // Reset
  reset: () => void;
}

export type WizardStore = WizardState & WizardActions;

const initialState: WizardState = {
  currentStep: 0,
  cvId: null,
  cvTitle: null,
  jdId: null,
  jdTitle: null,
  analysisId: null,
  interviewId: null,
  questionCount: null,
  error: null,
  isLoading: false,
};

const stepOrder: WizardStep[] = ['cv', 'jd', 'analysis', 'interview', 'complete'];

export const useWizardStore = create<WizardStore>((set, get) => ({
  ...initialState,

  // Step navigation
  goToStep: (step) => set({ currentStep: step, error: null }),

  goBack: () => {
    const currentStep = get().currentStep;
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1, error: null });
    }
  },

  nextStep: () => {
    const currentStep = get().currentStep;
    if (currentStep < stepOrder.length - 1) {
      set({ currentStep: currentStep + 1, error: null });
    }
  },

  // Data updates
  setCVData: (id, title) =>
    set({
      cvId: id,
      cvTitle: title,
      currentStep: 1,
      error: null,
    }),

  setJDData: (jdId, jdTitle) => set({ jdId, jdTitle, currentStep: 2, error: null }),
  setAnalysisData: (analysisId) => set({ analysisId, currentStep: 3, error: null }),

  setInterviewData: (interviewId, questionCount) =>
    set({
      interviewId,
      questionCount: questionCount ?? null,
      currentStep: 4,
      error: null,
    }),

  // UI state
  setError: (error) => set({ error, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  // Batch updates
  updateState: (updates) => set({ ...updates, error: null }),

  // Reset
  reset: () => set(initialState),
}));
