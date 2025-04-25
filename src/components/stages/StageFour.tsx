
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Shield } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface StageFourProps {
  onComplete: () => void;
}

const generateDPResults = (epsilon: number) => {
  // Generate results based on epsilon (privacy parameter)
  // Lower epsilon = more privacy but less utility
  // Fixed to 5 data points for simplicity
  return Array.from({ length: 5 }, (_, i) => ({
    query: i + 1,
    privacyLevel: Math.max(0, 1 - (epsilon * 0.1)),  // Higher with lower epsilon
    utilityLoss: Math.min(1, (1 / epsilon) * 0.5),   // Higher with lower epsilon
    attackSuccess: Math.max(0.2, 1 - (1 / epsilon) * 0.4), // Lower with lower epsilon
  }));
};

const StageFour: React.FC<StageFourProps> = ({ onComplete }) => {
  const [epsilon, setEpsilon] = useState([1]);
  const [results, setResults] = useState<any[]>([]);
  const [attacked, setAttacked] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleApplyDP = () => {
    const newResults = generateDPResults(epsilon[0]);
    setResults(newResults);
    setAttacked(true);
    setAttempts(prev => prev + 1);
  };

  const handleReset = () => {
    setAttacked(false);
    setResults([]);
  };

  // Calculate aggregate statistics to show the overall effect
  const calculateAggregateStats = () => {
    if (results.length === 0) return null;
    
    const avgPrivacy = results.reduce((sum, r) => sum + r.privacyLevel, 0) / results.length;
    const avgUtility = 1 - results.reduce((sum, r) => sum + r.utilityLoss, 0) / results.length;
    const avgAttackSuccess = results.reduce((sum, r) => sum + r.attackSuccess, 0) / results.length;
    
    return [
      { name: "Privacy Protection", value: avgPrivacy * 100 },
      { name: "Data Utility", value: avgUtility * 100 },
      { name: "Attack Success", value: avgAttackSuccess * 100 }
    ];
  };

  const aggregateStats = calculateAggregateStats();
  
  const chartConfig = {
    privacy: { 
      label: "Privacy Level", 
      theme: { light: "#9b87f5", dark: "#9b87f5" } 
    },
    utility: { 
      label: "Utility", 
      theme: { light: "#94A3B8", dark: "#94A3B8" } 
    },
    attack: { 
      label: "Attack Success", 
      theme: { light: "#ef4444", dark: "#ef4444" } 
    },
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
                  Adjust epsilon to see how different noise levels affect the privacy-utility trade-off.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleApplyDP}>
                {attacked ? "Try Again" : "Apply Privacy Defense"}
              </Button>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Privacy-Utility Trade-off</h3>
          <div className="h-64">
            {results.length > 0 ? (
              <div className="space-y-4">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={results}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="query" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
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
                  </ResponsiveContainer>
                </ChartContainer>
                
                {aggregateStats && (
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Defense Results</h4>
                    <div className="grid gap-2">
                      {aggregateStats.map((stat, i) => (
                        <div key={i} className="grid grid-cols-2 text-sm">
                          <span>{stat.name}:</span>
                          <span className="font-mono">{Math.round(stat.value)}%</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      {epsilon[0] < 0.5 ? 
                        "Strong privacy protection significantly reduces attack success, but also reduces utility." :
                        epsilon[0] > 5 ? 
                          "Weak privacy protection preserves utility but allows successful attacks." : 
                          "Balanced privacy-utility trade-off provides some protection while maintaining reasonable utility."
                      }
                    </p>
                    {attempts >= 2 && (
                      <div className="mt-4">
                        <Button variant="secondary" onClick={onComplete} className="w-full">
                          Complete Simulation
                        </Button>
                      </div>
                    )}
                  </Card>
                )}
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
