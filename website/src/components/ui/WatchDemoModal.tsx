'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function WatchDemoModal() {
  const [isOpen, setOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='lg'
          className='text-lg px-8 py-6 hover:scale-105 transition-transform btn-hover-effect'
        >
          <ArrowRight className='w-5 h-5 mr-2' />
          Watch Demo
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[700px] w-full h-auto sm:h-auto sm:max-h-[500px] flex flex-col p-4'>
        <div className='aspect-video p-2'>
          <iframe
            width='640'
            height='360'
            src='https://www.youtube.com/embed/dQw4w9WgXcQ'
            title='YouTube video player'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
}
