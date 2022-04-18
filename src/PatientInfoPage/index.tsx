import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { useStateValue, cachePatientDetails } from '../state';
import { Patient, Entry } from '../types';
const PatientInfo = () => {
  const [{ patients }, dispatch] = useStateValue();
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

  return (
    <div>
      <ul>
        <li>Patient: {patient.name}</li>
        <li>ID: {patient.id}</li>
        <li>DOB: {patient.dateOfBirth || 'unknown'}</li>
        <li>SSN: {patient.ssn || 'unknown'}</li>
        <li>Occupation: {patient.occupation}</li>
        <li>Entries: {patient.entries && patient.entries.map((entry: Entry) => (
          <ul key={entry.id}>
            <h4>{entry.date} - {entry.type}</h4>
            <li>Description:{entry.description}</li>
            <li>Specialist:{entry.specialist}</li>
            {entry.diagnosisCodes
              && <ul>
                <h4>Diagnostic Codes:</h4>
                {entry.diagnosisCodes.map((code: string) => (
                  <li key={code}> {code}</li>
                ))}
              </ul>
            }
            {/*TODO: add conditional rendering of entry types fields*/}
          </ul>
        ))}</li>
      </ul >
    </div >
  );
};

export default PatientInfo;