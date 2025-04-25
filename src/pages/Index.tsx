
import React, { useState } from 'react';
import SimulatorLayout from '@/components/SimulatorLayout';
import StageOne from '@/components/stages/StageOne';
import StageTwo from '@/components/stages/StageTwo';
import StageThree from '@/components/stages/StageThree';
import StageFour from '@/components/stages/StageFour';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Info } from 'lucide-react';

const Index = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const { toast } = useToast();

  const handleStageComplete = (stage: number) => {
    toast({
      title: `Stage ${stage} Complete!`,
      description: "You've successfully completed this stage.",
    });
    setCurrentStage(stage + 1);
  };

  return (
    <SimulatorLayout currentStage={currentStage}>
      <div className="mb-6">
        <div className="bg-secondary/10 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 mt-1 text-primary" />
            <div>
              <h3 className="font-medium mb-2">About This Stage</h3>
              {currentStage === 1 && (
                <p className="text-sm text-muted-foreground">
                  In this stage, you'll perform a basic membership inference attack using synthetic data. 
                  Try to determine which samples were used to train the model based on confidence scores.
                </p>
              )}
              {currentStage === 2 && (
                <p className="text-sm text-muted-foreground">
                  Now you have access to better auxiliary data. Adjust the similarity to the training data 
                  and experiment with different query strategies to improve attack success.
                </p>
              )}
              {currentStage === 3 && (
                <p className="text-sm text-muted-foreground">
                  Explore how k-anonymity and data generalization protect against membership inference. 
                  Compare attack success rates with and without these defenses.
                </p>
              )}
              {currentStage === 4 && (
                <p className="text-sm text-muted-foreground">
                  Learn about differential privacy and how adding controlled noise can protect against 
                  membership inference while maintaining utility.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {currentStage === 1 && <StageOne onComplete={() => handleStageComplete(1)} />}
      {currentStage === 2 && <StageTwo onComplete={() => handleStageComplete(2)} />}
      {currentStage === 3 && <StageThree onComplete={() => handleStageComplete(3)} />}
      {currentStage === 4 && <StageFour onComplete={() => handleStageComplete(4)} />}
    </SimulatorLayout>
  );
};

export default Index;
