
import React, { useState } from 'react';
import SimulatorLayout from '@/components/SimulatorLayout';
import StageOne from '@/components/stages/StageOne';
import StageTwo from '@/components/stages/StageTwo';
import StageThree from '@/components/stages/StageThree';
import StageFour from '@/components/stages/StageFour';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { RefreshCcw } from 'lucide-react';

const Index = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const { toast } = useToast();

  const handleStageComplete = (stage: number) => {
    toast({
      title: `Stage ${stage} Complete!`,
      description: "You've successfully completed this stage.",
      variant: "default"
    });
    setCurrentStage(stage + 1);
  };

  const handleReset = () => {
    toast({
      title: "Simulator Reset",
      description: "Returned to the first stage of the Membership Inference Attack simulation.",
      variant: "default"
    });
    setCurrentStage(1);
  };

  return (
    <SimulatorLayout currentStage={currentStage}>
      <div className="mb-6">
        {currentStage === 4 && (
          <div className="flex justify-end mb-4">
            <Button 
              variant="destructive" 
              onClick={handleReset}
            >
              <RefreshCcw className="mr-2" />
              Start Over
            </Button>
          </div>
        )}
      </div>
      {currentStage === 1 && <StageOne onComplete={() => handleStageComplete(1)} />}
      {currentStage === 2 && <StageTwo onComplete={() => handleStageComplete(2)} />}
      {currentStage === 3 && <StageThree onComplete={() => handleStageComplete(3)} />}
      {currentStage === 4 && <StageFour onComplete={() => handleStageComplete(4)} />}
    </SimulatorLayout>
  );
};

export default Index;
