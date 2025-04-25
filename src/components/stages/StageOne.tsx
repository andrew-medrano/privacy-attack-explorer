
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, RefreshCcw } from 'lucide-react';
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
    confidence: 98,
    wasInTraining: true,
  },
  {
    id: 2,
    name: "Patient 2",
    age: 45,
    bloodPressure: "120/80",
    cholesterol: "Normal",
    confidence: 65,
    wasInTraining: false,
  },
  {
    id: 3,
    name: "Patient 3",
    age: 72,
    bloodPressure: "160/95",
    cholesterol: "High",
    confidence: 99,
    wasInTraining: true,
  },
  {
    id: 4,
    name: "Patient 4",
    age: 50,
    bloodPressure: "130/85",
    cholesterol: "Normal",
    confidence: 70,
    wasInTraining: false,
  },
  {
    id: 5,
    name: "Patient 5",
    age: 68,
    bloodPressure: "150/92",
    cholesterol: "High",
    confidence: 95,
    wasInTraining: true,
  },
];

const StageOne: React.FC<StageOneProps> = ({ onComplete }) => {
  const [patients, setPatients] = useState<Patient[]>(
    SAMPLE_PATIENTS.map(p => ({ ...p, confidence: 0 }))
  );
  const [showResults, setShowResults] = useState(false);
  const [predictionsRun, setPredictionsRun] = useState(false);
  const { toast } = useToast();

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
    setPatients(SAMPLE_PATIENTS);
    toast({
      title: "Model Predictions Complete",
      description: "The model has generated confidence scores for each patient. Look for unusually high confidence scores!",
    });
  };

  const handleCheck = () => {
    const selectedPatients = patients.filter(p => p.selected);
    const correctGuesses = selectedPatients.filter(p => p.wasInTraining).length;
    const incorrectGuesses = selectedPatients.filter(p => !p.wasInTraining).length;
    const accuracy = (correctGuesses / 3) * 100; // 3 is the number of actual training samples

    setShowResults(true);
    toast({
      title: `Attack Results`,
      description: `You correctly identified ${correctGuesses} out of 3 training samples. Accuracy: ${accuracy}%`,
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
    <div className="w-full p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Stage 1: Basic Membership Inference</h2>
        
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
    </div>
  );
};

export default StageOne;
