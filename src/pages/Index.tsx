
import React, { useState } from 'react';
import SimulatorLayout from '@/components/SimulatorLayout';
import StageOne from '@/components/stages/StageOne';
import StageTwo from '@/components/stages/StageTwo';
import StageThree from '@/components/stages/StageThree';
import { useToast } from "@/hooks/use-toast";

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

  const handleStageSelect = (stage: number) => {
    setCurrentStage(stage);
    toast({
      title: `Navigated to Stage ${stage}`,
      description: "You can now explore this stage.",
      variant: "default"
    });
  };

  return (
    <SimulatorLayout currentStage={currentStage} onStageSelect={handleStageSelect}>
      {currentStage === 1 && <StageOne onComplete={() => handleStageComplete(1)} />}
      {currentStage === 2 && <StageTwo onComplete={() => handleStageComplete(2)} />}
      {currentStage === 3 && <StageThree onComplete={() => handleStageComplete(3)} />}
    </SimulatorLayout>
  );
};

export default Index;
