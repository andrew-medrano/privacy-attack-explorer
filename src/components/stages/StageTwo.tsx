
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RefreshCcw } from 'lucide-react';

interface StageTwoProps {
  onComplete: () => void;
}

const generateResults = (similarity: number, queryCount: number) => {
  return Array.from({ length: 5 }, (_, i) => ({
    name: `Sample ${i + 1}`,
    accuracy: Math.min(0.95, (similarity / 100) * (1 + queryCount / 10) * (Math.random() * 0.3 + 0.7)),
    baseAccuracy: (similarity / 100) * Math.random() * 0.6,
  }));
};

const StageTwo: React.FC<StageTwoProps> = ({ onComplete }) => {
  const [similarity, setSimilarity] = useState([50]);
  const [queryCount, setQueryCount] = useState([1]);
  const [results, setResults] = useState<any[]>([]);
  const [attacked, setAttacked] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleAttack = () => {
    const newResults = generateResults(similarity[0], queryCount[0]);
    setResults(newResults);
    setAttacked(true);
    setAttempts(prev => prev + 1);
  };

  const handleReset = () => {
    setAttacked(false);
    setResults([]);
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">Stage 2: Advanced Auxiliary Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Data Quality Control</h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Auxiliary Data Similarity</label>
              <Slider 
                defaultValue={[50]} 
                max={100} 
                step={1} 
                value={similarity}
                onValueChange={setSimilarity}
              />
              <span className="text-sm text-muted-foreground mt-1 block">
                {similarity}% similar to training data
              </span>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Query Count</label>
              <Slider 
                defaultValue={[1]} 
                max={10} 
                step={1}
                value={queryCount}
                onValueChange={setQueryCount}
              />
              <span className="text-sm text-muted-foreground mt-1 block">
                {queryCount} queries per sample
              </span>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Experiment with auxiliary data quality and multiple queries to see how they impact attack success.
                Higher similarity and more queries typically improve accuracy.
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleAttack}>
                {attacked ? "Try Again" : "Launch Advanced Attack"}
              </Button>
              {attacked && (
                <>
                  <Button variant="outline" onClick={handleReset}>
                    <RefreshCcw className="mr-2" />
                    Reset
                  </Button>
                  <Button variant="secondary" onClick={onComplete}>
                    Next Stage
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Attack Results</h3>
          <div className="h-64">
            {results.length > 0 ? (
              <div className="space-y-4">
                <LineChart width={400} height={200} data={results}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#9b87f5" 
                    name="With Enhanced Data"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="baseAccuracy" 
                    stroke="#94A3B8" 
                    name="Basic Attack"
                  />
                </LineChart>
                <div className="text-sm text-muted-foreground">
                  Attack attempts: {attempts}
                </div>
              </div>
            ) : (
              <div className="h-full bg-secondary/10 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Configure and launch attack to see results</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StageTwo;
