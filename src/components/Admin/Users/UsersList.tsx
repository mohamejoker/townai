
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Mail, Edit, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UserForm from './UserForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  full_name?: string;
  email: string;
  created_at: string;
  user_status?: 'active' | 'inactive' | 'suspended' | string; // Make it flexible or use specific enum/type
}

interface UsersListProps {
  users: User[];
  onEditUser: (user: User) => void; // Added prop for edit handling
}

const UsersList: React.FC<UsersListProps> = ({ users, onEditUser }) => {
  // Removed: const [editingUser, setEditingUser] = useState<User | null>(null);
  // Removed: const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      if (error) {
        console.error("Error deleting user:", error);
        if (error.code === '23503') {
           throw new Error('لا يمكن حذف هذا المستخدم لأنه مرتبط ببيانات أخرى (مثل الطلبات).');
        }
        throw new Error(error.message || 'فشل حذف المستخدم.');
      }
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      toast.success('تم حذف المستخدم بنجاح!');
      setDeletingUser(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'حدث خطأ أثناء حذف المستخدم.');
      setDeletingUser(null);
    },
  });

  const getUserStatusText = (status?: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'suspended': return 'معلق';
      default: return 'غير معروف';
    }
  };

  const getUserStatusBadgeVariant = (status?: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'active': return 'default'; // Usually greenish or bluish
      case 'inactive': return 'secondary'; // Greyish
      case 'suspended': return 'destructive'; // Reddish
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>قائمة المستخدمين</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.full_name?.charAt(0) || user.email?.charAt(0) || 'ج'}
                </div>
                <div>
                  <h3 className="font-semibold">{user.full_name || 'غير محدد'}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    انضم في {new Date(user.created_at).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getUserStatusBadgeVariant(user.user_status)}>
                  {getUserStatusText(user.user_status)}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onEditUser(user)}>
                      <Edit className="h-4 w-4 mr-2" />
                      تحرير
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        setDeletingUser(user);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Edit User Dialog REMOVED from here, will be managed by UsersPage.tsx */}

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={deletingUser !== null} onOpenChange={(isOpen) => {
          if (!isOpen) setDeletingUser(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد?</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف المستخدم "{deletingUser?.full_name || deletingUser?.email}" بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingUser(null)} disabled={deleteUserMutation.isPending}>
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingUser?.id) {
                  deleteUserMutation.mutate(deletingUser.id);
                }
              }}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? 'جار الحذف...' : 'تأكيد الحذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default UsersList;
