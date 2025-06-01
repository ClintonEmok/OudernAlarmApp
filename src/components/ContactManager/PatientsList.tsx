
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Contact } from '../../types';

interface PatientsListProps {
  patients: Contact[];
}

const PatientsList: React.FC<PatientsListProps> = ({ patients }) => {
  if (patients.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Mijn Patiënten ({patients.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {patients.map((patient) => (
            <Card key={patient.id} className="border-green-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                    <p className="text-sm text-gray-600">{patient.email}</p>
                    {patient.phone_number && (
                      <p className="text-sm text-gray-500">{patient.phone_number}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientsList;
