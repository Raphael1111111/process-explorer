import { GUIDING_QUESTIONS } from '@/types/process';
import { useState, useEffect } from 'react';
import { Lightbulb, X } from 'lucide-react';

const GuidingTip = () => {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % GUIDING_QUESTIONS.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-background/95 backdrop-blur border border-border rounded-xl px-5 py-3 shadow-sm flex items-center gap-3 max-w-lg animate-fade-in">
      <Lightbulb className="w-5 h-5 text-node-ai shrink-0" />
      <p className="text-sm text-muted-foreground italic">
        {GUIDING_QUESTIONS[idx]}
      </p>
      <button onClick={() => setVisible(false)} className="shrink-0 p-1 hover:bg-muted rounded">
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
};

export default GuidingTip;
