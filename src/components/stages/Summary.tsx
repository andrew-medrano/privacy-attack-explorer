
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RefreshCcw, Shield, TrendingUp, FileText } from 'lucide-react';

interface SummaryProps {
  onRestart: () => void;
}

const privacyData = [
  { epsilon: 0.1, accuracy: 65, privacy: 95 },
  { epsilon: 0.3, accuracy: 75, privacy: 85 },
  { epsilon: 0.5, accuracy: 82, privacy: 75 },
  { epsilon: 0.7, accuracy: 87, privacy: 65 },
  { epsilon: 0.9, accuracy: 90, privacy: 55 },
  { epsilon: 1.1, accuracy: 92, privacy: 45 },
];

const Summary: React.FC<SummaryProps> = ({ onRestart }) => {
  return (
    <div className="w-full p-6 space-y-6">
      <h2 className="text-2xl font-bold">Summary: Privacy vs Utility Trade-off</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">What You've Learned</h3>
          <div className="space-y-4">
            <div className="flex gap-2 items-start">
              <div className="mt-1 bg-blue-100 p-2 rounded-full">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Stage 1: Basic Attack</h4>
                <p className="text-sm text-muted-foreground">
                  You learned how machine learning models can inadvertently memorize training data,
                  making them vulnerable to membership inference attacks.
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 items-start">
              <div className="mt-1 bg-purple-100 p-2 rounded-full">
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">Stage 2: Shadow Models</h4>
                <p className="text-sm text-muted-foreground">
                  You explored how attackers can use auxiliary data and shadow models to improve
                  their attack accuracy by learning the model's behavior patterns.
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 items-start">
              <div className="mt-1 bg-green-100 p-2 rounded-full">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Stage 3: Differential Privacy</h4>
                <p className="text-sm text-muted-foreground">
                  You discovered how differential privacy can protect against these attacks by adding
                  calibrated noise, trading some accuracy for enhanced privacy protection.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Privacy-Utility Trade-off</h3>
          <div className="space-y-4">
            <div className="h-[450px]">
              <LineChart 
                width={400} 
                height={400} 
                data={privacyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="epsilon" 
                  label={{ 
                    value: 'Privacy Budget (ε)', 
                    position: 'bottom', 
                    offset: 20 
                  }}
                />
                <YAxis 
                  label={{ 
                    value: 'Score (%)', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: -5 
                  }} 
                />
                <Tooltip />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#22c55e" 
                  name="Model Accuracy"
                />
                <Line 
                  type="monotone" 
                  dataKey="privacy" 
                  stroke="#3b82f6" 
                  name="Privacy Protection"
                />
              </LineChart>
            </div>
            <p className="text-sm text-muted-foreground mt-10">
              This chart illustrates the fundamental trade-off in differential privacy: 
              as we increase the privacy budget (ε), we get better model accuracy but 
              weaker privacy guarantees. A smaller ε means stronger privacy but potentially 
              lower utility.
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Final Thoughts</h3>
        <p className="text-muted-foreground mb-6">
          Machine learning privacy is not just about protecting data during training—it's about 
          ensuring that the deployed models themselves don't inadvertently reveal sensitive 
          information about their training data. Differential privacy provides a mathematical 
          framework to make principled trade-offs between privacy and utility, allowing us to 
          build models that are both useful and respectful of individual privacy.
        </p>
        <Button variant="destructive" onClick={onRestart}>
          <RefreshCcw className="mr-2" />
          Start Over
        </Button>
      </Card>
    </div>
  );
};

export default Summary;
