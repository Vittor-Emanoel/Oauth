import { Button } from '@/components/Button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { IUser } from '@/entities/User';
import { DoorOpenIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { me } from '../hooks/users/me';

export function Home() {
  const { signOut } = useAuth();
  const [userData, setUserData] = useState<IUser>();

  useEffect(() => {
    async function getUserData() {
      const user = await me();

      setUserData(user);
    }

    getUserData();
  }, []);

  return (
    <div className="flex items-center flex-col">
      <Avatar>
        <AvatarImage src={userData?.avatarUrl} />
      </Avatar>
      <h1 className="text-2xl font-medium tracking-tight">
        {userData?.firstName}
      </h1>
      <p className="text-muted-foreground">{userData?.email}</p>

      <Button
        className="mt-6 gap-1"
        size="sm"
        variant="outline"
        onClick={signOut}
      >
        Sair <DoorOpenIcon className="size-4" />
      </Button>
    </div>
  );
}
