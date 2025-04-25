
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Shield } from 'lucide-react';

interface StageFourProps {
  onComplete: () => void;
}

const StageFour: React.FC<StageFourProps> = ({ onComplete }) => {
  const [epsilon, setEpsilon] = useState([1]);
  const [results, setResults] = useState<any[]>([]);

  const handleApplyDP = () => {
    // Simulate DP impact with mock data
    const newResults = Array.from({ length: 10 }, (_, i) => ({
      query: i + 1,
      privacyLevel: Math.max(0, 1 - (epsilon[0] * 0.1)),
      utilityLoss: Math.min(1, (1 / epsilon[0]) * 0.5),
    }));
    setResults(newResults);
    setTimeout(() => {
      onComplete();
    }, 2000);
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
            <div className="p-4 bg-secondary/10 rounded-lg">
              <div className="flex gap-2 items-start">
                <Shield className="w-4 h-4 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Differential privacy adds controlled noise to protect individual privacy while maintaining overall utility. 
                  Adjust epsilon to see how different noise levels affect the trade-off between privacy and utility.
                </p>
              </div>
            </div>
            <Button className="w-full" onClick={handleApplyDP}>
              Apply Privacy Defense
            </Button>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Privacy-Utility Trade-off</h3>
          <div className="h-64">
            {results.length > 0 ? (
              <AreaChart width={400} height={250} data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="query" />
                <YAxis />
                <Tooltip />
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
                  stroke="#1EAEDB" 
                  fill="#1EAEDB" 
                  fillOpacity={0.3}
                  name="Utility Loss"
                />
              </AreaChart>
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
