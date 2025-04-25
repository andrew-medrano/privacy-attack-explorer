
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { RefreshCcw } from 'lucide-react';

interface StageOneProps {
  onComplete: () => void;
}

const generateMockData = (sampleCount: number) => {
  return Array.from({ length: sampleCount }, (_, i) => ({
    name: `Sample ${i + 1}`,
    confidence: Math.random() * 0.7 + 0.2, // Random value between 0.2 and 0.9
    wasInTraining: Math.random() > 0.5,
  }));
};

const StageOne: React.FC<StageOneProps> = ({ onComplete }) => {
  const [sampleCount, setSampleCount] = useState([3]);
  const [attacked, setAttacked] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const handleAttack = () => {
    const newResults = generateMockData(sampleCount[0]);
    setResults(newResults);
    setAttacked(true);
    setTotalAttempts(prev => prev + 1);
    
    // Simulate correct guesses based on confidence threshold
    const correct = newResults.reduce((acc, result) => 
      acc + (result.confidence > 0.7 === result.wasInTraining ? 1 : 0), 0);
    setCorrectGuesses(prev => prev + correct);
  };

  const handleReset = () => {
    setAttacked(false);
    setResults([]);
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">Stage 1: Basic Membership Inference</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Model Predictions</h3>
          <div className="h-64">
            {attacked ? (
              <div className="space-y-4">
                <BarChart width={400} height={200} data={results}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="confidence" fill="#9b87f5" />
                </BarChart>
                <div className="text-sm text-muted-foreground">
                  Accuracy: {((correctGuesses / totalAttempts) * 100).toFixed(1)}%
                </div>
              </div>
            ) : (
              <div className="h-full bg-secondary/10 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Launch attack to see predictions</p>
              </div>
            )}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Attack Configuration</h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Number of Samples</label>
              <Slider 
                defaultValue={[3]} 
                max={10} 
                step={1}
                value={sampleCount}
                onValueChange={setSampleCount}
              />
              <span className="text-sm text-muted-foreground mt-1 block">
                Testing {sampleCount} samples
              </span>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">
                This basic attack will attempt to determine which samples were used in the model's training data.
                Higher confidence scores suggest the sample was likely part of the training set.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                onClick={handleAttack}
              >
                {attacked ? "Try Again" : "Launch Attack"}
              </Button>
              {attacked && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                  >
                    <RefreshCcw className="mr-2" />
                    Reset
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={onComplete}
                  >
                    Next Stage
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StageOne;
