
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const SimulatorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold">Membership Inference Attack Simulator</h1>
          <Progress value={33} className="mt-4" />
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3">
            <Card className="p-4">
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  Stage 1: Basic Attack
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Stage 2: Advanced Data
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Stage 3: Privacy Defenses
                </Button>
              </nav>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="col-span-12 md:col-span-9">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SimulatorLayout;
