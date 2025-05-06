import React, { useState, useMemo, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { useToast } from "@/hooks/use-toast";
// Import the pre-generated data
import stageData from "@/data/generated/stage2_data.json";

interface StageTwoProps {
  onComplete: () => void;
}

interface Patient {
  id: number;
  age: number;
  bloodPressure: string;
  cholesterol: number;
  glucose: number;
  heartRate: number;
  hasDiabetes: boolean;
  hasHypertension: boolean;
  confidence: number;
  wasInTraining: boolean;
}

const StageTwo: React.FC<StageTwoProps> = ({ onComplete }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [confidenceData, setConfidenceData] = useState<any[]>([]);
  const [threshold, setThreshold] = useState([70]);
  const [modelRun, setModelRun] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ accuracy: number; truePositives: number; totalPredicted: number } | null>(null);
  const { toast } = useToast();

  // Load data when component mounts
  useEffect(() => {
    if (stageData) {
      setPatients(stageData.patients);
      setConfidenceData(stageData.confidenceBins);
      // Optional: Set threshold to the optimal one from data
      // setThreshold([stageData.optimalThreshold]);
    }
  }, []);

  const runModel = () => {
    setModelRun(true);
    toast({
      title: "Model predictions complete",
      description: "Analyze the confidence distribution to set your threshold.",
    });
  };

  const checkAccuracy = () => {
    const predictedPositives = patients.filter(p => p.confidence >= threshold[0]);
    const truePositives = predictedPositives.filter(p => p.wasInTraining);
    
    const accuracy = predictedPositives.length > 0 
      ? (truePositives.length / predictedPositives.length) * 100
      : 0;
    
    setResults({
      accuracy,
      truePositives: truePositives.length,
      totalPredicted: predictedPositives.length
    });
    
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
    <div className="w-full p-4 space-y-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Stage 2: Advanced Membership Inference</h2>
        
        <Card className="p-4 mb-4">
          <p className="text-muted-foreground mb-2">
            <strong>What to do:</strong> In this stage, you'll analyze a larger dataset of 100 patients.
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
            <li>Examine the patient data in the table below</li>
            <li>Run the model predictions to see confidence scores</li>
            <li>Study the distribution chart - notice the two peaks (bimodal distribution)</li>
            <li>Set a confidence threshold where you believe patients above that value are likely from the training set</li>
            <li>Check your accuracy to see how well you did</li>
          </ol>
          <p className="text-muted-foreground mt-2 italic">
            <strong>Hint:</strong> Training data typically gets higher confidence scores from the model.
          </p>
        </Card>
          
        <div className="flex gap-4 mb-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Confidence Distribution</h3>
                <div className="h-64">
                  <LineChart width={600} height={200} data={confidenceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      name="Total Patients" 
                      stroke="#9b87f5" 
                      strokeWidth={2}
                    />
                    <ReferenceLine
                      x={`${Math.floor(threshold[0] / 5) * 5}-${Math.floor(threshold[0] / 5) * 5 + 4}`}
                      stroke="red"
                      strokeDasharray="3 3"
                      label={{ value: `Threshold: ${threshold[0]}%`, position: 'top' }}
                    />
                  </LineChart>
                </div>
              </Card>

              {submitted && results && (
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Results Analysis</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Accuracy:</span>{" "}
                      {results.accuracy.toFixed(1)}%
                    </p>
                    <p>
                      <span className="font-medium">Correctly Identified Training Data:</span>{" "}
                      {results.truePositives} out of {results.totalPredicted} predictions
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                      Patients with confidence ≥ {threshold[0]}% were classified as training data
                    </p>
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        With multiple features (age, blood pressure, cholesterol, glucose, heart rate, and medical conditions), 
                        the model shows a clearer separation between training and non-training data. This demonstrates how 
                        richer auxiliary data can enhance membership inference attacks by creating more distinguishable patterns 
                        in prediction confidence.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

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
          </div>
        )}

        <ScrollArea className="h-[400px] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Blood Pressure</TableHead>
                <TableHead>Cholesterol</TableHead>
                <TableHead>Risk Factors</TableHead>
                <TableHead>Confidence</TableHead>
                {submitted && <TableHead>In Training</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow 
                  key={patient.id}
                  className={modelRun && submitted && patient.confidence >= threshold[0] ? 
                    (patient.wasInTraining ? 'bg-green-100' : 'bg-red-100') : ''
                  }
                >
                  <TableCell>{patient.id}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.bloodPressure}</TableCell>
                  <TableCell>{patient.cholesterol}</TableCell>
                  <TableCell>
                    {patient.hasDiabetes && <span className="mr-1 bg-red-100 text-red-800 text-xs px-1 rounded">Diabetes</span>}
                    {patient.hasHypertension && <span className="bg-orange-100 text-orange-800 text-xs px-1 rounded">Hypertension</span>}
                  </TableCell>
                  <TableCell>{modelRun ? `${patient.confidence.toFixed(1)}%` : 'Not available'}</TableCell>
                  {submitted && (
                    <TableCell>{patient.wasInTraining ? 'Yes' : 'No'}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default StageTwo;
