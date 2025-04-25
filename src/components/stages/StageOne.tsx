import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Info } from 'lucide-react';
import PatientCard from '../PatientCard';
import ModelInfoCard from '../ModelInfoCard';
import { Patient } from '@/types/patient';
import { useToast } from "@/hooks/use-toast";

interface StageOneProps {
  onComplete: () => void;
}

const SAMPLE_PATIENTS: Patient[] = [
  {
    id: 1,
    name: "Patient 1",
    age: 65,
    bloodPressure: "140/90",
    cholesterol: "High",
    confidence: 0,
    wasInTraining: true,
  },
  {
    id: 2,
    name: "Patient 2",
    age: 45,
    bloodPressure: "120/80",
    cholesterol: "Normal",
    confidence: 0,
    wasInTraining: false,
  },
  {
    id: 3,
    name: "Patient 3",
    age: 72,
    bloodPressure: "160/95",
    cholesterol: "High",
    confidence: 0,
    wasInTraining: false,
  },
  {
    id: 4,
    name: "Patient 4",
    age: 50,
    bloodPressure: "130/85",
    cholesterol: "Normal",
    confidence: 0,
    wasInTraining: true,
  },
  {
    id: 5,
    name: "Patient 5",
    age: 68,
    bloodPressure: "150/92",
    cholesterol: "High",
    confidence: 0,
    wasInTraining: false,
  },
  {
    id: 6,
    name: "Patient 6",
    age: 55,
    bloodPressure: "145/88",
    cholesterol: "Normal",
    confidence: 0,
    wasInTraining: false,
  },
];

const StageOne: React.FC<StageOneProps> = ({ onComplete }) => {
  const [patients, setPatients] = useState<Patient[]>(SAMPLE_PATIENTS);
  const [showResults, setShowResults] = useState(false);
  const [predictionsRun, setPredictionsRun] = useState(false);
  const { toast } = useToast();

  const generateConfidenceScore = (wasInTraining: boolean) => {
    const mean = wasInTraining ? 70 : 65;
    const noise = (Math.random() - 0.5) * 10; // Adds random noise between -5 and +5
    const score = Math.round(mean + noise);
    return Math.min(Math.max(score, 50), 95); // Clamp between 50 and 95
  };

  const handlePatientSelect = (id: number) => {
    if (!predictionsRun) {
      toast({
        title: "Run predictions first",
        description: "You need to run the model predictions before selecting patients.",
        variant: "destructive",
      });
      return;
    }
    setPatients(patients.map(p => ({
      ...p,
      selected: p.id === id ? !p.selected : p.selected,
    })));
  };

  const runPredictions = () => {
    setPredictionsRun(true);
    setPatients(patients.map(p => ({
      ...p,
      confidence: generateConfidenceScore(p.wasInTraining)
    })));
    toast({
      title: "Model Predictions Complete",
      description: "The model has generated confidence scores for each patient. Look for patterns in the confidence scores!",
    });
  };

  const handleCheck = () => {
    const selectedPatients = patients.filter(p => p.selected);
    const correctGuesses = selectedPatients.filter(p => p.wasInTraining).length;
    const incorrectGuesses = selectedPatients.filter(p => !p.wasInTraining).length;
    const accuracy = (correctGuesses / 2) * 100; // 2 is the number of actual training samples

    setShowResults(true);
    toast({
      title: `Attack Results`,
      description: `You correctly identified ${correctGuesses} out of 2 training samples. Accuracy: ${accuracy}%`,
    });

    if (accuracy >= 66) {
      toast({
        title: "Stage Complete!",
        description: "You've successfully demonstrated a membership inference attack. Move on to learn about more sophisticated attacks.",
        variant: "default"
      });
    }
  };

  const handleReset = () => {
    setPatients(SAMPLE_PATIENTS.map(p => ({ ...p, confidence: 0 })));
    setShowResults(false);
    setPredictionsRun(false);
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Stage 1: Basic Membership Inference</h2>
        
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">What to do:</h3>
            <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200">
              <li>Review the model information above</li>
              <li>Click "Run Model Predictions" to get confidence scores</li>
              <li>Select which patients you think were in the training data (hint: look for patterns in confidence scores)</li>
            </ol>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-2 italic">
              Hint: Training data patients tend to have slightly higher confidence scores
            </p>
          </div>
        </Card>
      </div>
      
      <ModelInfoCard />

      {!predictionsRun && (
        <div className="flex justify-center my-6">
          <Button 
            size="lg"
            onClick={runPredictions}
            className="w-full max-w-md"
          >
            Run Model Predictions
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onSelect={handlePatientSelect}
            showResults={showResults}
          />
        ))}
      </div>

      {predictionsRun && !showResults && patients.filter(p => p.selected).length > 0 && (
        <div className="flex gap-2 justify-end">
          <Button 
            variant="outline" 
            onClick={handleReset}
          >
            <RefreshCcw className="mr-2" />
            Try Again
          </Button>
          <Button onClick={handleCheck}>
            Check Predictions
          </Button>
        </div>
      )}

      {showResults && (
        <div className="flex gap-2 justify-end">
          <Button 
            variant="outline" 
            onClick={handleReset}
          >
            <RefreshCcw className="mr-2" />
            Try Again
          </Button>
          <Button onClick={onComplete}>
            Next Stage
          </Button>
        </div>
      )}
    </div>
  );
};

export default StageOne;
