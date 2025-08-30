import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { adminAPI, queryKeys, authAPI } from '@/lib/api';
import { useSession } from '@/lib/better-auth';
import { toast } from 'sonner';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  MessageSquare,
  Target,
  Shield,
  Search,
  CheckCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// No difficulty or duration options needed anymore

export default function AdminModeScenariosPage() {
  const { modeId } = useParams<{ modeId: string }>();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Get current user with role information
  const {
    data: currentUser,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: authAPI.getCurrentUser,
    enabled: !!session,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch the specific mode details
  const { data: currentMode, isLoading: modeLoading } = useQuery({
    queryKey: queryKeys.admin.mode(modeId!),
    queryFn: () => adminAPI.getModeById(modeId!),
    enabled: !!modeId && currentUser?.role === 'ADMIN',
  });

  // Fetch scenarios for this specific mode
  const { data: scenarios = [], isLoading: scenariosLoading } = useQuery({
    queryKey: queryKeys.admin.scenarios(modeId),
    queryFn: () => adminAPI.getScenarios(modeId),
    enabled: !!modeId && currentUser?.role === 'ADMIN',
  });

  // Create scenario mutation
  const createScenarioMutation = useMutation({
    mutationFn: adminAPI.createScenario,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.scenarios(modeId),
      });
      setIsCreateDialogOpen(false);
      toast.success('Scenario created successfully!', {
        description: `${data.data.title} has been added to this mode.`,
      });
    },
    onError: (error: any) => {
      toast.error('Failed to create scenario', {
        description: error.message || 'Please try again.',
      });
    },
  });

  // Update scenario mutation
  const updateScenarioMutation = useMutation({
    mutationFn: ({
      scenarioId,
      formData,
    }: {
      scenarioId: string;
      formData: FormData;
    }) => adminAPI.updateScenario(scenarioId, formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.scenarios(modeId),
      });
      setIsEditDialogOpen(false);
      setEditingScenario(null);
      toast.success('Scenario updated successfully!', {
        description: `${data.data.title} has been updated.`,
      });
    },
    onError: (error: any) => {
      toast.error('Failed to update scenario', {
        description: error.message || 'Please try again.',
      });
    },
  });

  // Delete scenario mutation
  const deleteScenarioMutation = useMutation({
    mutationFn: adminAPI.deleteScenario,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.scenarios(modeId),
      });
      toast.success('Scenario deleted successfully!', {
        description: 'The scenario has been removed from this mode.',
      });
    },
    onError: (error: any) => {
      toast.error('Failed to delete scenario', {
        description: error.message || 'Please try again.',
      });
    },
  });

  const isLoading = userLoading || modeLoading || scenariosLoading;
  const isAdmin = currentUser?.role === 'ADMIN' && !userError;

  // Show access denied if not admin
  if (!userLoading && (userError || !isAdmin)) {
    return (
      <div className='p-6 space-y-6'>
        <div className='text-center'>
          <Shield className='w-16 h-16 text-destructive mx-auto mb-4' />
          <h1 className='text-2xl font-bold text-destructive'>Access Denied</h1>
          <p className='text-muted-foreground'>
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  const handleCreateScenario = (formData: FormData) => {
    // Add modeId to formData
    formData.append('modeId', modeId!);
    createScenarioMutation.mutate(formData);
  };

  const handleEditScenario = (formData: FormData) => {
    if (!editingScenario) return;
    // Add isActive to formData
    formData.append('isActive', formData.get('isActive') || 'true');
    updateScenarioMutation.mutate({ scenarioId: editingScenario.id, formData });
  };

  const handleDeleteScenario = (scenarioId: string) => {
    if (confirm('Are you sure you want to delete this scenario?')) {
      deleteScenarioMutation.mutate(scenarioId);
    }
  };

  const openEditDialog = (scenario: any) => {
    setEditingScenario(scenario);
    setIsEditDialogOpen(true);
  };

  // Filter scenarios based on search term
  const filteredScenarios = scenarios.filter(
    (scenario: any) =>
      (scenario.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (scenario.description || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className='p-6 space-y-6'>
        <div className='flex items-center justify-center h-64'>
          <div className='text-muted-foreground'>Loading scenarios...</div>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate('/dashboard/admin/modes')}
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Modes
          </Button>
          <div>
            <h1 className='text-3xl font-bold'>
              Scenarios for {currentMode?.name || 'Mode'}
            </h1>
            <p className='text-muted-foreground'>
              Manage scenarios for this practice mode
            </p>
          </div>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className='bg-primary hover:bg-primary/90'>
              <Plus className='w-4 h-4 mr-2' />
              Create Scenario
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[600px]'>
            <DialogHeader>
              <DialogTitle>Create New Scenario</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateScenario(new FormData(e.currentTarget));
              }}
              className='space-y-4'
            >
              <div className='space-y-2'>
                <Label htmlFor='title'>Title</Label>
                <Input id='title' name='title' required />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea id='description' name='description' required />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='image'>Image (Optional)</Label>
                <Input
                  id='image'
                  name='image'
                  type='file'
                  accept='image/*'
                  className='cursor-pointer'
                />
                <p className='text-xs text-muted-foreground'>
                  Upload an image for this scenario (max 10MB)
                </p>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='prompt'>AI Prompt (Optional)</Label>
                <Textarea
                  id='prompt'
                  name='prompt'
                  placeholder='Enter the AI prompt for this scenario...'
                />
              </div>
              <div className='flex gap-2 pt-4'>
                <Button
                  type='submit'
                  className='flex-1'
                  disabled={createScenarioMutation.isPending}
                >
                  {createScenarioMutation.isPending
                    ? 'Creating...'
                    : 'Create Scenario'}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className='flex items-center gap-4'>
        <div className='flex-1'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
            <Input
              placeholder='Search scenarios...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Scenarios
            </CardTitle>
            <Layers className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{scenarios.length}</div>
            <p className='text-xs text-muted-foreground'>All scenarios</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Active Scenarios
            </CardTitle>
            <CheckCircle className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {scenarios.filter((s: any) => s.isActive).length}
            </div>
            <p className='text-xs text-muted-foreground'>Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>With Images</CardTitle>
            <Target className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>
              {scenarios.filter((s: any) => s.image).length}
            </div>
            <p className='text-xs text-muted-foreground'>
              Have images uploaded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Scenarios List */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Layers className='h-5 w-5 text-primary' />
            Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {filteredScenarios.map((scenario: any) => (
              <div
                key={scenario.id}
                className='flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors'
              >
                <div className='flex items-center gap-4'>
                  <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center'>
                    <MessageSquare className='w-5 h-5 text-primary' />
                  </div>
                  <div>
                    <div className='font-medium'>
                      {scenario.title || 'Untitled Scenario'}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {scenario.description || 'No description available'}
                    </div>
                    <div className='text-xs text-muted-foreground mt-1'>
                      {scenario.isActive ? 'Active' : 'Inactive'}
                      {scenario.image && ' • Has image'}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant={scenario.isActive ? 'default' : 'secondary'}>
                    {scenario.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <div className='flex gap-1'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => openEditDialog(scenario)}
                    >
                      <Edit className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDeleteScenario(scenario.id)}
                      className='text-destructive hover:text-destructive'
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Edit Scenario</DialogTitle>
          </DialogHeader>
          {editingScenario && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditScenario(new FormData(e.currentTarget));
              }}
              className='space-y-4'
            >
              <div className='space-y-2'>
                <Label htmlFor='edit-title'>Title</Label>
                <Input
                  id='edit-name'
                  name='name'
                  defaultValue={editingScenario.title || ''}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-description'>Description</Label>
                <Textarea
                  id='edit-description'
                  name='description'
                  defaultValue={editingScenario.description || ''}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-image'>Image (Optional)</Label>
                <Input
                  id='edit-image'
                  name='image'
                  type='file'
                  accept='image/*'
                  className='cursor-pointer'
                />
                <p className='text-xs text-muted-foreground'>
                  Upload a new image to replace the current one (max 10MB)
                  {editingScenario.image && ' • Current image exists'}
                </p>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-isActive'>Status</Label>
                <Select
                  name='isActive'
                  defaultValue={(editingScenario.isActive ?? true).toString()}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='true'>Active</SelectItem>
                    <SelectItem value='false'>Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-prompt'>AI Prompt (Optional)</Label>
                <Textarea
                  id='edit-prompt'
                  name='prompt'
                  defaultValue={editingScenario.prompt || ''}
                  placeholder='Enter the AI prompt for this scenario...'
                />
              </div>
              <div className='flex gap-2 pt-4'>
                <Button
                  type='submit'
                  className='flex-1'
                  disabled={updateScenarioMutation.isPending}
                >
                  {updateScenarioMutation.isPending
                    ? 'Updating...'
                    : 'Update Scenario'}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
