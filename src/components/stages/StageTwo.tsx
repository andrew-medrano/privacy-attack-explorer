
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface StageTwoProps {
  onComplete: () => void;
}

const StageTwo: React.FC<StageTwoProps> = ({ onComplete }) => {
  const [similarity, setSimilarity] = useState([50]);
  const [queryCount, setQueryCount] = useState([1]);
  const [results, setResults] = useState<any[]>([]);

  const handleAttack = () => {
    // Generate mock results based on similarity and query count
    const newResults = Array.from({ length: 5 }, (_, i) => ({
      name: `Sample ${i + 1}`,
      accuracy: (similarity[0] / 100) * (1 + queryCount[0] / 10) * Math.random(),
    }));
    setResults(newResults);
    setTimeout(() => {
      onComplete();
    }, 2000);
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
            <Button className="w-full" onClick={handleAttack}>Launch Advanced Attack</Button>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Attack Results</h3>
          <div className="h-64">
            {results.length > 0 ? (
              <LineChart width={400} height={250} data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="#9b87f5" />
              </LineChart>
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
