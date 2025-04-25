import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, RefreshCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface StageTwoProps {
  onComplete: () => void;
}

const StageTwo: React.FC<StageTwoProps> = ({ onComplete }) => {
  const [auxiliaryData, setAuxiliaryData] = useState("");
  const [targetRecord, setTargetRecord] = useState("");
  const [attackSuccess, setAttackSuccess] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handleAnalyze = () => {
    // Basic analysis - check if auxiliary data contains the target record
    const success = auxiliaryData.toLowerCase().includes(targetRecord.toLowerCase());
    setAttackSuccess(success);

    if (success) {
      toast({
        title: "Attack Successful!",
        description: "The auxiliary data contains the target record, indicating a successful membership inference attack.",
      });
    } else {
      toast({
        title: "Attack Failed",
        description: "The auxiliary data does not contain the target record.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setAuxiliaryData("");
    setTargetRecord("");
    setAttackSuccess(null);
  };

  return (
    <div className="w-full p-6 space-y-6">
      <h2 className="text-2xl font-bold">Stage 2: Auxiliary Data Attack</h2>
      <p>
        In this stage, you'll use auxiliary data to infer whether a specific record was used to train the model.
      </p>

      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Attack Setup</h3>
        <div>
          <label className="block text-sm font-medium leading-none mb-2">Auxiliary Data</label>
          <Textarea
            placeholder="Enter auxiliary data (e.g., publicly available records)"
            value={auxiliaryData}
            onChange={(e) => setAuxiliaryData(e.target.value)}
          />
          <span className="text-sm text-muted-foreground">
            This is data that an attacker might have access to, which could overlap with the training data.
          </span>
        </div>
        <div>
          <label className="block text-sm font-medium leading-none mb-2">Target Record</label>
          <Input
            type="text"
            placeholder="Enter the record you want to check for"
            value={targetRecord}
            onChange={(e) => setTargetRecord(e.target.value)}
          />
          <span className="text-sm text-muted-foreground">
            The specific data point you suspect was used in the training data.
          </span>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAnalyze}>Analyze</Button>
          <Button variant="outline" onClick={handleReset}>
            <RefreshCcw className="mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      {attackSuccess !== null && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Attack Result</h3>
          {attackSuccess ? (
            <Badge variant="success">Successful Attack</Badge>
          ) : (
            <Badge variant="destructive">Attack Failed</Badge>
          )}
        </Card>
      )}

      {attackSuccess && (
        <Button 
          onClick={onComplete} 
          className="bg-[#F2FCE2] hover:bg-green-100 text-green-800"
        >
          Next Stage
          <ArrowRight className="ml-2" />
        </Button>
      )}
    </div>
  );
};

export default StageTwo;
