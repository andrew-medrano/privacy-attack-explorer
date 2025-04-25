
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface StageOneProps {
  onComplete: () => void;
}

const mockData = [
  { name: 'Sample A', confidence: 0.85 },
  { name: 'Sample B', confidence: 0.32 },
  { name: 'Sample C', confidence: 0.91 },
];

const StageOne: React.FC<StageOneProps> = ({ onComplete }) => {
  const [attacked, setAttacked] = useState(false);

  const handleAttack = () => {
    setAttacked(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">Stage 1: Basic Membership Inference</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Model Predictions</h3>
          <div className="h-64">
            {attacked ? (
              <BarChart width={400} height={250} data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="confidence" fill="#9b87f5" />
              </BarChart>
            ) : (
              <div className="h-full bg-secondary/10 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Launch attack to see predictions</p>
              </div>
            )}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Attack Configuration</h3>
          <div className="space-y-4">
            <div className="p-4 bg-secondary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">
                This basic attack will attempt to determine which samples were used in the model's training data.
                Higher confidence scores suggest the sample was likely part of the training set.
              </p>
            </div>
            <Button 
              className="w-full" 
              onClick={handleAttack}
              disabled={attacked}
            >
              {attacked ? "Attack Complete" : "Launch Attack"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StageOne;
