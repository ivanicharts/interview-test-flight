import useSWR from 'swr';

import { getUserDocuments } from '@/lib/queries/document';
import type { DocumentType } from '@/lib/types';

export const useUserDocuments = (type?: DocumentType) => {
  return useSWR(`documents-${type || 'all'}`, () => getUserDocuments(type), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
};
