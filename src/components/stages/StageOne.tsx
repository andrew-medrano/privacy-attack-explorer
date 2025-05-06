import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from 'lucide-react';
import PatientCard from '../PatientCard';
import ModelInfoCard from '../ModelInfoCard';
import { Patient } from '@/types/patient';
import { useToast } from "@/hooks/use-toast";
// Import pre-calculated data
import stageData from "@/data/generated/stage1_data.json";

interface StageOneProps {
  onComplete: () => void;
}

const StageOne: React.FC<StageOneProps> = ({ onComplete }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [predictionsRun, setPredictionsRun] = useState(false);
  const { toast } = useToast();

  // Load pre-calculated data when component mounts
  useEffect(() => {
    if (stageData) {
      // Map the data to include the selected property
      const mappedPatients = stageData.map(patient => ({
        ...patient,
        selected: false
      }));
      setPatients(mappedPatients);
    }
  }, []);

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
    // Reset just the selection, not the confidence values
    setPatients(patients.map(p => ({ ...p, selected: false })));
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
