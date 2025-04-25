
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, Database, Sliders, FileSearch } from 'lucide-react';

interface SimulatorLayoutProps {
  children: React.ReactNode;
  currentStage: number;
}

const SimulatorLayout: React.FC<SimulatorLayoutProps> = ({ children, currentStage }) => {
  const progress = (currentStage / 4) * 100;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Membership Inference Attack Simulator</h1>
              <p className="text-muted-foreground mt-2">Learn about privacy attacks and defenses through interactive simulation</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={`px-2 py-1 rounded ${currentStage === 1 ? 'bg-primary text-primary-foreground' : ''}`}>
                Basic Attack
              </span>
              <span className={`px-2 py-1 rounded ${currentStage === 2 ? 'bg-primary text-primary-foreground' : ''}`}>
                Auxiliary Data
              </span>
              <span className={`px-2 py-1 rounded ${currentStage === 3 ? 'bg-primary text-primary-foreground' : ''}`}>
                K-Anonymity
              </span>
              <span className={`px-2 py-1 rounded ${currentStage === 4 ? 'bg-primary text-primary-foreground' : ''}`}>
                Differential Privacy
              </span>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default SimulatorLayout;
