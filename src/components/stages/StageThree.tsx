
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface StageThreeProps {
  onComplete: () => void;
}

const StageThree: React.FC<StageThreeProps> = ({ onComplete }) => {
  const [epsilon, setEpsilon] = useState([1]);
  const [results, setResults] = useState<any[]>([]);

  const handleApplyDefense = () => {
    // Generate mock results showing privacy impact
    const newResults = Array.from({ length: 10 }, (_, i) => ({
      query: i + 1,
      attackSuccess: Math.max(0, 0.8 - (epsilon[0] * 0.1 * Math.random())),
      utilityLoss: Math.min(1, (1 / epsilon[0]) * 0.5 * Math.random()),
    }));
    setResults(newResults);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">Stage 3: Privacy Defenses</h2>
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
              <p className="text-sm text-muted-foreground">
                Adjust the epsilon value to control the strength of differential privacy. 
                Lower values provide stronger privacy but may reduce utility.
              </p>
            </div>
            <Button className="w-full" onClick={handleApplyDefense}>
              Apply Privacy Defense
            </Button>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Defense Impact</h3>
          <div className="h-64">
            {results.length > 0 ? (
              <AreaChart width={400} height={250} data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="query" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="attackSuccess" stroke="#ea384c" fill="#ea384c" fillOpacity={0.3} />
                <Area type="monotone" dataKey="utilityLoss" stroke="#1EAEDB" fill="#1EAEDB" fillOpacity={0.3} />
              </AreaChart>
            ) : (
              <div className="h-full bg-secondary/10 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Apply defense to see impact</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StageThree;
