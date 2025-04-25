
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Shield, RefreshCcw } from 'lucide-react';

interface StageThreeProps {
  onComplete: () => void;
}

const generateKAnonymityResults = (k: number, features: number) => {
  return Array.from({ length: features }, (_, i) => ({
    feature: `F${i + 1}`,
    rawAccuracy: 0.8 - (i * 0.05),
    anonymizedAccuracy: Math.max(0.3, 0.8 - (i * 0.05) - (k * 0.05)),
  }));
};

const StageThree: React.FC<StageThreeProps> = ({ onComplete }) => {
  const [k, setK] = useState([2]);
  const [featureCount, setFeatureCount] = useState([5]);
  const [results, setResults] = useState<any[]>([]);
  const [attacked, setAttacked] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleApplyDefense = () => {
    const newResults = generateKAnonymityResults(k[0], featureCount[0]);
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
      <h2 className="text-2xl font-bold mb-4">Stage 3: K-Anonymity Defense</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">K-Anonymity Level</label>
              <Slider 
                defaultValue={[2]} 
                max={10} 
                step={1}
                value={k}
                onValueChange={setK}
              />
              <span className="text-sm text-muted-foreground mt-1 block">
                k = {k} (higher values provide stronger anonymity)
              </span>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Feature Count</label>
              <Slider 
                defaultValue={[5]} 
                max={10} 
                step={1}
                value={featureCount}
                onValueChange={setFeatureCount}
              />
              <span className="text-sm text-muted-foreground mt-1 block">
                Testing with {featureCount} features
              </span>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg">
              <div className="flex gap-2 items-start">
                <Shield className="w-4 h-4 mt-1" />
                <p className="text-sm text-muted-foreground">
                  K-anonymity ensures that each record is indistinguishable from at least k-1 other records. 
                  Experiment with different k values to see how they affect attack success rates.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleApplyDefense}>
                {attacked ? "Try Again" : "Apply K-Anonymity"}
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
          <h3 className="text-lg font-semibold mb-4">Privacy-Utility Trade-off</h3>
          <div className="h-64">
            {results.length > 0 ? (
              <div className="space-y-4">
                <AreaChart width={400} height={200} data={results}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="feature" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="rawAccuracy" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.3}
                    name="Without Defense"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="anonymizedAccuracy" 
                    stroke="#9b87f5" 
                    fill="#9b87f5" 
                    fillOpacity={0.3}
                    name="With K-Anonymity"
                  />
                </AreaChart>
                <div className="text-sm text-muted-foreground">
                  Defense applications: {attempts}
                </div>
              </div>
            ) : (
              <div className="h-full bg-secondary/10 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Apply defense to see comparison</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StageThree;
