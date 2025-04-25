
import React from 'react';
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

const ModelInfoCard = () => {
  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 mb-6 border-blue-200 dark:border-blue-800">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 mt-1 text-blue-600 dark:text-blue-400" />
        <div>
          <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">About the Model</h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p>
              This model was trained on private patient data to predict heart disease risk. 
              It analyzes factors like age, blood pressure, and cholesterol levels.
            </p>
            <p>
              <span className="font-medium text-blue-900 dark:text-blue-100">Model Details:</span>
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
