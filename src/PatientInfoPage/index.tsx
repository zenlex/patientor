import { useParams } from "react-router-dom";

const PatientInfo = () => {
  const { id } = useParams();

  return (
    <div>
      TODO: Patient Info
      ID: {id}
    </div>
  );
};

export default PatientInfo;