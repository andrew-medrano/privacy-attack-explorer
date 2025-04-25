
import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Histogram, Bar } from 'recharts';
import { useToast } from "@/hooks/use-toast";

interface StageTwoProps {
  onComplete: () => void;
}

interface Patient {
  id: number;
  age: number;
  bloodPressure: string;
  confidence: number;
  wasInTraining: boolean;
}

const generatePatients = (count: number): Patient[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    age: Math.floor(Math.random() * 50) + 25,
    bloodPressure: `${Math.floor(Math.random() * 40) + 120}/${Math.floor(Math.random() * 20) + 70}`,
    confidence: 0,
    wasInTraining: i < 20, // 20% of patients are in training set
  }));
};

const generateConfidence = (wasInTraining: boolean): number => {
  const baseMean = wasInTraining ? 70 : 65;
  const noise = (Math.random() - 0.5) * 10;
  return Math.min(Math.max(Math.round(baseMean + noise), 50), 95);
};

const StageTwo: React.FC<StageTwoProps> = ({ onComplete }) => {
  const [patients, setPatients] = useState<Patient[]>(generatePatients(100));
  const [threshold, setThreshold] = useState([70]);
  const [modelRun, setModelRun] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const runModel = () => {
    const updatedPatients = patients.map(patient => ({
      ...patient,
      confidence: generateConfidence(patient.wasInTraining)
    }));
    setPatients(updatedPatients);
    setModelRun(true);
    toast({
      title: "Model predictions complete",
      description: "Analyze the confidence distribution to set your threshold.",
    });
  };

  const confidenceData = useMemo(() => {
    if (!modelRun) return [];
    const bins: { range: string; count: number }[] = [];
    for (let i = 50; i < 95; i += 5) {
      bins.push({
        range: `${i}-${i + 5}`,
        count: patients.filter(p => p.confidence >= i && p.confidence < i + 5).length
      });
    }
    return bins;
  }, [patients, modelRun]);

  const checkAccuracy = () => {
    const predictedPositives = patients.filter(p => p.confidence >= threshold[0]);
    const truePositives = predictedPositives.filter(p => p.wasInTraining);
    const accuracy = (truePositives.length / predictedPositives.length) * 100;
    
    setSubmitted(true);
    toast({
      title: "Results",
      description: `Your threshold identified training set members with ${accuracy.toFixed(1)}% accuracy.`,
    });

    if (accuracy >= 60) {
      toast({
        title: "Stage Complete!",
        description: "You've successfully demonstrated understanding of confidence thresholds.",
      });
    }
  };

  return (
    <div className="w-full p-4 space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Stage 2: Advanced Membership Inference</h2>
        
        <Card className="p-4">
          <p className="text-muted-foreground mb-4">
            Analyze the confidence distribution of 100 patients and determine a threshold that identifies training set members.
            Set a confidence threshold where you believe patients above that value are more likely to be from the training set.
          </p>
          
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={runModel} 
              disabled={modelRun && !submitted}
            >
              Run Model Predictions
            </Button>
            {modelRun && !submitted && (
              <Button onClick={checkAccuracy}>
                Check Accuracy
              </Button>
            )}
            {submitted && (
              <Button onClick={onComplete}>
                Next Stage
              </Button>
            )}
          </div>

          {modelRun && (
            <div className="space-y-6">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Confidence Distribution</h3>
                <div className="h-64">
                  <LineChart width={600} height={200} data={confidenceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#9b87f5" />
                  </LineChart>
                </div>
              </Card>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confidence Threshold</label>
                <Slider
                  defaultValue={[70]}
                  max={95}
                  min={50}
                  step={1}
                  value={threshold}
                  onValueChange={setThreshold}
                  disabled={submitted}
                />
                <span className="text-sm text-muted-foreground">
                  Threshold: {threshold[0]}% confidence
                </span>
              </div>

              <ScrollArea className="h-[400px] border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Blood Pressure</TableHead>
                      <TableHead>Confidence</TableHead>
                      {submitted && <TableHead>In Training</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.map((patient) => (
                      <TableRow 
                        key={patient.id}
                        className={submitted && patient.confidence >= threshold[0] ? 
                          (patient.wasInTraining ? 'bg-green-100' : 'bg-red-100') : ''
                        }
                      >
                        <TableCell>{patient.id}</TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.bloodPressure}</TableCell>
                        <TableCell>{patient.confidence}%</TableCell>
                        {submitted && (
                          <TableCell>{patient.wasInTraining ? 'Yes' : 'No'}</TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StageTwo;
