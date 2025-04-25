
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
    });
    setCurrentStage(stage + 1);
  };

  return (
    <SimulatorLayout currentStage={currentStage}>
      {currentStage === 1 && <StageOne onComplete={() => handleStageComplete(1)} />}
      {currentStage === 2 && <StageTwo onComplete={() => handleStageComplete(2)} />}
      {currentStage === 3 && <StageThree onComplete={() => handleStageComplete(3)} />}
    </SimulatorLayout>
  );
};

export default Index;
