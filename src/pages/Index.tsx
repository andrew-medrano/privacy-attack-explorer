import React from 'react';
import SimulatorLayout from '@/components/SimulatorLayout';
import StageOne from '@/components/stages/StageOne';
import StageTwo from '@/components/stages/StageTwo';
import StageThree from '@/components/stages/StageThree';

const Index = () => {
  return (
    <SimulatorLayout>
      <StageOne />
      {/* Other stages will be conditionally rendered based on progress */}
    </SimulatorLayout>
  );
};

export default Index;
