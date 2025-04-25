
import React from 'react';
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

const ModelInfoCard = () => {
  return (
    <Card className="p-4 bg-secondary/10 mb-6">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 mt-1 text-primary" />
        <div>
          <h3 className="font-medium mb-2">About the Model</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              This model was trained on private patient data to predict heart disease risk. 
              It analyzes factors like age, blood pressure, and cholesterol levels.
            </p>
            <p>
              <span className="font-medium text-foreground">Model Details:</span>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Average Accuracy: 85% on validation data</li>
                <li>Trained on private hospital records</li>
                <li>Outputs confidence scores (0-100%)</li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ModelInfoCard;
