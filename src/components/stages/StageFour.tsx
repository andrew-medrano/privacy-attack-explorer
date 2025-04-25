
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Shield, RefreshCcw } from 'lucide-react';

interface StageFourProps {
  onComplete: () => void;
}

const generateDPResults = (epsilon: number, dataPoints: number) => {
  return Array.from({ length: dataPoints }, (_, i) => ({
    query: i + 1,
    privacyLevel: Math.max(0, 1 - (epsilon * 0.1)),
    utilityLoss: Math.min(1, (1 / epsilon) * 0.5),
    attackSuccess: Math.max(0.2, 1 - (1 / epsilon) * 0.4),
  }));
};

const StageFour: React.FC<StageFourProps> = ({ onComplete }) => {
  const [epsilon, setEpsilon] = useState([1]);
  const [dataPoints, setDataPoints] = useState([5]);
  const [results, setResults] = useState<any[]>([]);
  const [attacked, setAttacked] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleApplyDP = () => {
    const newResults = generateDPResults(epsilon[0], dataPoints[0]);
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
      <h2 className="text-2xl font-bold mb-4">Stage 4: Differential Privacy</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Epsilon (ε)</label>
              <Slider 
                defaultValue={[1]} 
                max={10} 
                step={0.1}
                value={epsilon}
                onValueChange={setEpsilon}
              />
              <span className="text-sm text-muted-foreground mt-1 block">
                ε = {epsilon[0]} (smaller values = stronger privacy)
              </span>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Number of Queries</label>
              <Slider 
                defaultValue={[5]} 
                max={10} 
                step={1}
                value={dataPoints}
                onValueChange={setDataPoints}
              />
              <span className="text-sm text-muted-foreground mt-1 block">
                Testing with {dataPoints} queries
              </span>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg">
              <div className="flex gap-2 items-start">
                <Shield className="w-4 h-4 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Differential privacy adds controlled noise to protect individual privacy while maintaining overall utility. 
                  Adjust epsilon to see how different noise levels affect the privacy-utility trade-off.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleApplyDP}>
                {attacked ? "Try Again" : "Apply Privacy Defense"}
              </Button>
              {attacked && (
                <>
                  <Button variant="outline" onClick={handleReset}>
                    <RefreshCcw className="mr-2" />
                    Reset
                  </Button>
                  <Button variant="secondary" onClick={onComplete}>
                    Complete Tutorial
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Privacy-Utility Trade-off</h3>
          <div className="h-64">
            {results.length > 0 ? (
              <div className="space-y-4">
                <AreaChart width={400} height={200} data={results}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="query" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="privacyLevel" 
                    stroke="#9b87f5" 
                    fill="#9b87f5" 
                    fillOpacity={0.3}
                    name="Privacy Level"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="utilityLoss" 
                    stroke="#94A3B8" 
                    fill="#94A3B8" 
                    fillOpacity={0.3}
                    name="Utility Loss"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="attackSuccess" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.3}
                    name="Attack Success"
                  />
                </AreaChart>
                <div className="text-sm text-muted-foreground">
                  Defense applications: {attempts}
                </div>
              </div>
            ) : (
              <div className="h-full bg-secondary/10 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Apply privacy defense to see impact</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StageFour;
