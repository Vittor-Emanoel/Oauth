import { IUser } from '@/entities/User';
import { api } from '../../lib/api';

export const me = async () => {
  const { data } = await api.get<IUser>('/me', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('oauthestudos:token')}`,
    },
  });

  return data;
};
