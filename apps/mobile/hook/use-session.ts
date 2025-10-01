import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { User } from '@/contexts/auth-context';

type SessionResponse = {
  user: User | null;
  isAuthenticated: boolean;
};

export function useSessionQuery() {
  return useQuery<SessionResponse>({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await axios.get<SessionResponse>('/api/auth/session');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}
