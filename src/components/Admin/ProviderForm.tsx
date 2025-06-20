import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import type { Provider } from '@/services/providers/providerService'; // Assuming Provider type is exported

// Define the props for the ProviderForm
interface ProviderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void; // Replace 'any' with a more specific type for form data
  initialData?: Partial<Provider | null>;
  isLoading?: boolean;
}

const ProviderForm: React.FC<ProviderFormProps> = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
  const [formData, setFormData] = useState<Partial<Provider>>({
    name: '',
    description: '',
    api_url: '',
    api_key: '',
    is_active: true,
    logo_url: '',
    settings: '{}', // Default to empty JSON object string
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: '',
        description: '',
        api_url: '',
        api_key: '', // API key should generally not be re-displayed for security.
        is_active: true,
        logo_url: '',
        settings: '{}',
        ...initialData,
        // If settings is an object, stringify it for the textarea
        settings: typeof initialData.settings === 'object' ? JSON.stringify(initialData.settings, null, 2) : initialData.settings || '{}',
      });
    } else {
      // Reset form for new provider, ensuring api_key is empty
      setFormData({
        name: '',
        description: '',
        api_url: '',
        api_key: '',
        is_active: true,
        logo_url: '',
        settings: '{}',
      });
    }
  }, [initialData, isOpen]); // Rely on isOpen to reset when dialog reopens for new provider

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        // Assuming Checkbox component might pass checked status differently or use onCheckedChange
        // For a standard HTML input type="checkbox", it would be (e.target as HTMLInputElement).checked
        // This part needs to be adapted based on the actual Checkbox component's API if it's custom
        setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Special handler for shadcn/ui Checkbox as it uses onCheckedChange
  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    setFormData(prev => ({ ...prev, is_active: !!checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Attempt to parse settings JSON
    let parsedSettings = {};
    try {
      if (formData.settings) {
        parsedSettings = JSON.parse(formData.settings);
      }
    } catch (error) {
      alert('Settings JSON is invalid. Please correct it.');
      return;
    }
    onSubmit({ ...formData, settings: parsedSettings });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{initialData?.id ? 'Edit Provider' : 'Add New Provider'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="api_url" className="text-right">API URL</Label>
              <Input id="api_url" name="api_url" value={formData.api_url || ''} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="api_key" className="text-right">API Key</Label>
              <Input id="api_key" name="api_key" type="password" value={formData.api_key || ''} onChange={handleChange} className="col-span-3" placeholder={initialData?.id ? "Leave blank to keep unchanged" : ""} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="logo_url" className="text-right">Logo URL</Label>
              <Input id="logo_url" name="logo_url" value={formData.logo_url || ''} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="settings" className="text-right">Settings (JSON)</Label>
              <Textarea id="settings" name="settings" value={formData.settings || ''} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_active" className="text-right">Active</Label>
              <Checkbox id="is_active" name="is_active" checked={formData.is_active} onCheckedChange={handleCheckboxChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Provider'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderForm;
