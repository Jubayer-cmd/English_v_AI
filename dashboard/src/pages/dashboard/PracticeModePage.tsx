import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dashboardAPI, queryKeys } from '@/lib/api';
import { Play, ArrowLeft } from 'lucide-react';

export default function PracticeModePage() {
  const { modeId } = useParams<{ modeId: string }>();
  const navigate = useNavigate();

  // Fetch specific mode details
  const { data: currentMode, isLoading: modeLoading } = useQuery({
    queryKey: queryKeys.dashboard.mode(modeId!),
    queryFn: () => dashboardAPI.getModeById(modeId!),
    enabled: !!modeId,
  });

  // Fetch scenarios for this mode
  const { data: scenarios = [], isLoading: scenariosLoading } = useQuery({
    queryKey: queryKeys.dashboard.scenarios(modeId!),
    queryFn: () => dashboardAPI.getScenariosByMode(modeId!),
    enabled: !!modeId,
  });

  const handleStartPractice = (scenarioId: string) => {
    // Navigate to the specific scenario practice
    navigate(`/dashboard/modes/${modeId}/scenarios/${scenarioId}`);
  };

  if (modeLoading || scenariosLoading) {
    return (
      <div className='p-6 space-y-6'>
        <div className='flex items-center justify-center h-64'>
          <div className='text-muted-foreground'>Loading practice mode...</div>
        </div>
      </div>
    );
  }

  if (!currentMode) {
    return (
      <div className='p-6 space-y-6'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-destructive'>
            Practice Mode Not Found
          </h1>
          <p className='text-muted-foreground'>
            The requested practice mode could not be found.
          </p>
          <Button onClick={() => navigate('/dashboard')} className='mt-4'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Minimal Header */}
      <div className='sticky top-0 bg-background border-b border-border p-4 flex items-center gap-4 z-10'>
        <Button
          variant='ghost'
          onClick={() => navigate('/dashboard')}
          className='p-2'
        >
          <ArrowLeft className='w-4 h-4' />
        </Button>
        <div>
          <h1 className='text-xl font-bold'>{currentMode.name}</h1>
          <p className='text-sm text-muted-foreground'>
            {currentMode.description}
          </p>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className='p-6'>
        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 max-w-7xl mx-auto'>
          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className='hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/50 overflow-hidden'
            >
              {/* Scenario Image */}
              {scenario.image && (
                <div className='relative h-48 w-full overflow-hidden'>
                  <img
                    src={import.meta.env.VITE_CLOUD_URL + scenario.image}
                    alt={scenario.title}
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      // Fallback to a placeholder if image fails to load
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='%236b7280' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  {/* Basics Badge */}
                  <div className='absolute bottom-3 left-3'>
                    <Badge
                      variant='secondary'
                      className='bg-white text-gray-800'
                    >
                      Basics
                    </Badge>
                  </div>
                </div>
              )}

              <CardHeader className='pb-3'>
                <CardTitle className='text-lg leading-tight'>
                  {scenario.title}
                </CardTitle>
              </CardHeader>

              <CardContent className='pt-0'>
                <p className='text-sm text-muted-foreground mb-4 line-clamp-2'>
                  {scenario.description}
                </p>
                <Button
                  onClick={() => handleStartPractice(scenario.id)}
                  className='w-full bg-primary hover:bg-primary/90 transition-colors'
                >
                  <Play className='w-4 h-4 mr-2' />
                  Start Practice
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
