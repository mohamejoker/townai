// src/components/Admin/Users/UserForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from '@/components/ui/dialog'; // For form actions
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define User type similar to UsersList, ensure consistency
interface User {
  id: string;
  full_name?: string;
  email?: string; // Assuming email can be edited here. If it's Supabase Auth email, this is more complex.
  user_status?: 'active' | 'inactive' | 'suspended' | string;
  // Add other editable fields if any
}

interface UserFormProps {
  user?: User | null;
  onClose: () => void;
}

// Define status options, can be shared/imported if used elsewhere
const USER_STATUS_OPTIONS = [
  { value: 'active', label: 'نشط' },
  { value: 'inactive', label: 'غير نشط' },
  { value: 'suspended', label: 'معلق' },
];

const UserForm: React.FC<UserFormProps> = ({ user, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    user_status: 'inactive', // Default status
  });

  useEffect(() => {
    if (user) { // Edit mode
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        user_status: user.user_status || 'inactive', // Default if not set
      });
    } else { // Create mode
      setFormData({
        full_name: '',
        email: '',
        user_status: 'active', // Sensible default for new users
      });
    }
  }, [user]);

  const createUserMutation = useMutation({
    mutationFn: async (newUserData: Omit<User, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('profiles')
        .insert([newUserData])
        .select();
      if (error) {
        console.error("Error creating user:", error);
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('هذا البريد الإلكتروني مستخدم بالفعل.');
        }
        throw new Error(error.message || 'فشل إنشاء مستخدم جديد.');
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      toast.success('تم إضافة المستخدم بنجاح!');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'حدث خطأ أثناء إضافة المستخدم.');
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (updatedUserData: Partial<Omit<User, 'id' | 'created_at'>>) => {
      if (!user?.id) throw new Error("User ID is missing for update.");
      const { error } = await supabase
        .from('profiles')
        .update(updatedUserData)
        .eq('id', user.id);
      if (error) {
        console.error("Error updating user:", error);
        throw new Error(error.message || 'فشل تحديث بيانات المستخدم.');
      }
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      toast.success('تم تحديث بيانات المستخدم بنجاح!');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'حدث خطأ أثناء تحديث المستخدم.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email) {
      toast.error("الرجاء ملء الاسم الكامل والبريد الإلكتروني.");
      return;
    }

    if (user) { // Edit mode
      if (user.email !== formData.email) {
          toast.info("ملاحظة: تغيير البريد الإلكتروني هنا قد لا يغير بريد تسجيل الدخول الأساسي بدون خطوات إضافية.", { duration: 6000});
      }
      updateUserMutation.mutate(formData);
    } else { // Create mode
      createUserMutation.mutate(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="full_name">الاسم الكامل</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          // Consider adding: disabled={!!user} if email shouldn't be changed after creation via this form
        />
      </div>
      <div>
        <Label htmlFor="user_status">حالة المستخدم</Label>
        <Select
          value={formData.user_status}
          onValueChange={(value) => setFormData({ ...formData, user_status: value })}
        >
          <SelectTrigger id="user_status">
            <SelectValue placeholder="اختر حالة..." />
          </SelectTrigger>
          <SelectContent>
            {USER_STATUS_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={updateUserMutation.isPending || createUserMutation.isPending}>
          إلغاء
        </Button>
        <Button type="submit" disabled={updateUserMutation.isPending || createUserMutation.isPending}>
          {updateUserMutation.isPending || createUserMutation.isPending ? 'جار الحفظ...' : (user ? 'حفظ التغييرات' : 'إضافة مستخدم')}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default UserForm;
