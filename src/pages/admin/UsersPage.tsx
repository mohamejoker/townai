
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import UsersHeader from '@/components/Admin/Users/UsersHeader';
import UsersStats from '@/components/Admin/Users/UsersStats';
import UsersFilters from '@/components/Admin/Users/UsersFilters';
import UsersList from '@/components/Admin/Users/UsersList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UserForm from '@/components/Admin/Users/UserForm';
import { Plus } from 'lucide-react';

// Define User type consistent with UserForm and UsersList
interface User {
  id: string;
  full_name?: string;
  email: string;
  created_at: string;
  user_status?: 'active' | 'inactive' | 'suspended' | string;
}

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserFormModalOpen, setIsUserFormModalOpen] = useState(false);
  const [currentUserForForm, setCurrentUserForForm] = useState<User | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: userStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: newUsersToday } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      return {
        totalUsers: totalUsers || 0,
        newUsersToday: newUsersToday || 0,
        activeUsers: Math.floor((totalUsers || 0) * 0.7),
        inactiveUsers: Math.floor((totalUsers || 0) * 0.3)
      };
    }
  });

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  const handleEditUser = (userToEdit: User) => {
    setCurrentUserForForm(userToEdit);
    setIsUserFormModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {/* Using UsersHeader for title is also an option if it exists and is suitable */}
        {/* <UsersHeader /> */}
        <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
        <Button onClick={() => {
          setCurrentUserForForm(null);
          setIsUserFormModalOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> إضافة مستخدم جديد
        </Button>
      </div>
      <UsersStats stats={userStats} />
      <UsersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <UsersList users={filteredUsers} onEditUser={handleEditUser} />

      {/* Dialog for Create/Edit User */}
      <Dialog open={isUserFormModalOpen} onOpenChange={(isOpen) => {
        setIsUserFormModalOpen(isOpen);
        if (!isOpen) setCurrentUserForForm(null);
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{currentUserForForm ? 'تحرير المستخدم' : 'إضافة مستخدم جديد'}</DialogTitle>
          </DialogHeader>
          <UserForm
            user={currentUserForForm}
            onClose={() => {
              setIsUserFormModalOpen(false);
              setCurrentUserForForm(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
