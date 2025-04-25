
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
          <h1 className="text-3xl font-bold">Membership Inference Attack Simulator</h1>
          <p className="text-muted-foreground mt-2">Learn about privacy attacks and defenses through interactive simulation</p>
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
                  <Database className="mr-2" />
                  Stage 1: Basic Attack
                </Button>
                <Button 
                  variant={currentStage === 2 ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <FileSearch className="mr-2" />
                  Stage 2: Auxiliary Data
                </Button>
                <Button 
                  variant={currentStage === 3 ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Shield className="mr-2" />
                  Stage 3: K-Anonymity
                </Button>
                <Button 
                  variant={currentStage === 4 ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Sliders className="mr-2" />
                  Stage 4: Differential Privacy
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
