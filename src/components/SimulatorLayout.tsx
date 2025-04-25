
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SimulatorLayoutProps {
  children: React.ReactNode;
  currentStage: number;
}

const SimulatorLayout: React.FC<SimulatorLayoutProps> = ({ children, currentStage }) => {
  const progress = (currentStage / 3) * 100;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold">Membership Inference Attack Simulator</h1>
          <Progress value={progress} className="mt-4" />
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <Card className="p-4">
              <nav className="space-y-2">
                <Button 
                  variant={currentStage === 1 ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  Stage 1: Basic Attack
                </Button>
                <Button 
                  variant={currentStage === 2 ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  Stage 2: Advanced Data
                </Button>
                <Button 
                  variant={currentStage === 3 ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  Stage 3: Privacy Defenses
                </Button>
              </nav>
            </Card>
          </div>
          
          <div className="col-span-12 md:col-span-9">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SimulatorLayout;
