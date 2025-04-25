
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Patient } from '@/types/patient';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface PatientCardProps {
  patient: Patient;
  onSelect: (id: number) => void;
  showResults: boolean;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onSelect, showResults }) => {
  return (
    <Card className={`p-4 ${patient.selected ? 'border-primary border-2' : ''} ${showResults && patient.wasInTraining ? 'bg-green-100' : ''}`}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Patient {patient.id}</h3>
          <span className="text-sm text-muted-foreground">Confidence: {patient.confidence}%</span>
        </div>
        
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Age</TableCell>
              <TableCell>{patient.age}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Blood Pressure</TableCell>
              <TableCell>{patient.bloodPressure}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Cholesterol</TableCell>
              <TableCell>{patient.cholesterol}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {!showResults && (
          <Button 
            variant={patient.selected ? "default" : "outline"} 
            className="w-full"
            onClick={() => onSelect(patient.id)}
          >
            {patient.selected ? "Selected" : "Select as Training Data"}
          </Button>
        )}
        
        {showResults && (
          <div className={`text-sm p-2 rounded ${patient.wasInTraining ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {patient.wasInTraining ? 'Was in training data' : 'Was not in training data'}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PatientCard;

