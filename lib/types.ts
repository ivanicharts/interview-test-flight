export type DocumentType = 'jd' | 'cv';

export type Document = {
  id: string;
  kind: DocumentType;
  title: string | null;
  content: string;
  updated_at: string;
};
