import axios from "axios";
import { Box } from "@material-ui/core";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { useStateValue, cachePatientDetails } from '../state';
import { Patient, Entry, HospitalEntry, HealthCheckEntry, OccupationalHealthcareEntry, HealthCheckRating } from '../types';
const PatientInfo = () => {
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  let patient: Patient;
  if (id) {
    patient = patients[id];
  } else {
    return <div>invalid patient id</div>;
  }

  useEffect(() => {
    if (patient && (!patient.ssn || !patient.dateOfBirth)) {
      const fetchPatientDetails = async (id: string) => {
        try {
          const { data: updatedPatient } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
          dispatch(cachePatientDetails(updatedPatient));
        } catch (e) {
          console.error(e);
        }
      };
      void fetchPatientDetails(patient.id);
    }
  }, [dispatch]);
  //TODO: REFACTOR THIS MESS OUT OF THIS COMPONENT ?
  const assertNever = (val: never): never => {
    throw new Error(`unhandled discriminated union member: ${JSON.stringify(val)} `);
  };

  const HospitalEntryDetails: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
    return (
      <ul>
        <h4>{entry.date} - {entry.type}</h4>
        <li>Description:{entry.description}</li>
        <li>Specialist:{entry.specialist}</li>
        {entry.diagnosisCodes
          && <ul>
            <h4>Diagnostic Codes:</h4>
            {entry.diagnosisCodes.map((code: string) => (
              <li key={code}> {code} - {diagnoses[code].name}</li>
            ))}
          </ul>
        }
        {entry.discharge &&
          <li>
            Discharge: {entry.discharge.date} - {entry.discharge.criteria}
          </li>}
      </ul>
    );
  };

  const OccupationalHealthcareEntryDetails: React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => {
    return (
      <ul>
        <h4>{entry.date} - {entry.type}</h4>
        <li>Description:{entry.description}</li>
        <li>Specialist:{entry.specialist}</li>
        {entry.diagnosisCodes
          && <ul>
            <h4>Diagnostic Codes:</h4>
            {entry.diagnosisCodes.map((code: string) => (
              <li key={code}> {code} - {diagnoses[code].name}</li>
            ))}
          </ul>
        }
        <li>Employer: {entry.employerName}</li>
        {entry.sickLeave &&
          <li>Sick Leave: {entry.sickLeave.startDate} through {entry.sickLeave.endDate}</li>
        }
      </ul>
    );
  };

  const HealthCheckEntryDetails: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
    return (
      <ul>
        <h4>{entry.date} - {entry.type}</h4>
        <li>Description:{entry.description}</li>
        <li>Specialist:{entry.specialist}</li>
        {entry.diagnosisCodes
          && <ul>
            <h4>Diagnostic Codes:</h4>
            {entry.diagnosisCodes.map((code: string) => (
              <li key={code}> {code} - {diagnoses[code].name}</li>
            ))}
          </ul>
        }
        <li>Rating: {HealthCheckRating[entry.healthCheckRating]}</li>
      </ul>
    );
  };

  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
      case "Hospital":
        return <HospitalEntryDetails entry={entry} />;
      case "OccupationalHealthcare":
        return <OccupationalHealthcareEntryDetails entry={entry} />;
      case "HealthCheck":
        return <HealthCheckEntryDetails entry={entry} />;
      default:
        assertNever(entry);
        return null;
    }
  };
  return (
    <div>
      <ul>
        <li>Patient: {patient.name}</li>
        <li>ID: {patient.id}</li>
        <li>DOB: {patient.dateOfBirth || 'unknown'}</li>
        <li>SSN: {patient.ssn || 'unknown'}</li>
        <li>Occupation: {patient.occupation}</li>
        <li>Entries: {patient.entries && patient.entries.map((entry: Entry) => (
          <Box key={entry.id} sx={{ border: '2px solid black', borderRadius: 10, margin: 10, padding: 5 }}>
            <EntryDetails entry={entry} />
          </Box>
        ))}</li>
      </ul >
    </div >
  );
};

export default PatientInfo;
