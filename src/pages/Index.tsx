
import React, { useState } from 'react';
import SimulatorLayout from '@/components/SimulatorLayout';
import StageOne from '@/components/stages/StageOne';
import StageTwo from '@/components/stages/StageTwo';
import StageThree from '@/components/stages/StageThree';
import Summary from '@/components/stages/Summary';
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

  const handleRestart = () => {
    setCurrentStage(1);
    toast({
      title: "Simulator Reset",
      description: "Starting from the beginning.",
      variant: "default"
    });
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
      {currentStage === 4 && <Summary onRestart={handleRestart} />}
    </SimulatorLayout>
  );
};

export default Index;
