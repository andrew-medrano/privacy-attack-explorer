
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SimulatorLayoutProps {
  children: React.ReactNode;
  currentStage: number;
  onStageSelect?: (stage: number) => void;
}

const SimulatorLayout: React.FC<SimulatorLayoutProps> = ({ 
  children, 
  currentStage,
  onStageSelect 
}) => {
  const progress = (currentStage / 4) * 100;

  const handleStageClick = (stage: number) => {
    if (onStageSelect) {
      onStageSelect(stage);
    }
  };

  return (
    <div className="min-h-screen bg-[#D3E4FD]">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Membership Inference Attack Simulator</h1>
              <p className="text-muted-foreground mt-2">Learn about privacy attacks and defenses through interactive simulation</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Button
                variant={currentStage === 1 ? "default" : "ghost"}
                onClick={() => handleStageClick(1)}
                className="px-2 py-1"
              >
                Basic Attack
              </Button>
              <Button
                variant={currentStage === 2 ? "default" : "ghost"}
                onClick={() => handleStageClick(2)}
                className="px-2 py-1"
              >
                Auxiliary Data
              </Button>
              <Button
                variant={currentStage === 3 ? "default" : "ghost"}
                onClick={() => handleStageClick(3)}
                className="px-2 py-1"
              >
                Differential Privacy
              </Button>
              <Button
                variant={currentStage === 4 ? "default" : "ghost"}
                onClick={() => handleStageClick(4)}
                className="px-2 py-1"
              >
                Summary
              </Button>
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
