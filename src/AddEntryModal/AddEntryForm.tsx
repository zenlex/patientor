import { Button, Grid, TextField } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import {
  DiagnosisSelection,
  EntryOption,
  HealthCheckOption,
  SelectField,
} from '../AddPatientModal/FormField';
import { useStateValue } from '../state';
import { Entry, EntryType, HealthCheckRating } from '../types';

export type EntryFormValues = Omit<Entry, 'id' | 'date'>;

const entryTypeOptions: EntryOption[] = [
  { value: EntryType.HealthCheck, label: 'Health Check' },
  { value: EntryType.Hospital, label: 'Hospital' },
  { value: EntryType.OccupationalHealthcare, label: 'Occupational Healthcare' },
];

const HealthRatingOptions: HealthCheckOption[] = [
  { value: HealthCheckRating.Healthy, label: 'Healthy' },
  { value: HealthCheckRating.LowRisk, label: 'Low Risk' },
  { value: HealthCheckRating.HighRisk, label: 'High Risk' },
  { value: HealthCheckRating.CriticalRisk, label: 'Critical Risk' },
];

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
      initialValues={{
        type: EntryType.HealthCheck,
        description: '',
        specialist: '',
        diagnosisCodes: [],
        healthCheckRating: HealthCheckRating.Healthy,
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        // const requiredError = 'Field is required';
        const errors: { [field: string]: string } = {};
        // if (!values.description) {
        //   errors.description = requiredError;
        // }
        console.log('validating values: ', { values });
        console.log('Validation Errors: ', errors);
        return errors;
        //TODO: Add additional error/field validation and enable/disable fields by type for form
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, handleChange }) => {
        return (
          <Form className='form ui'>
            <SelectField
              label='Entry Type'
              name='type'
              options={entryTypeOptions}
            />
            <SelectField
              label='Health Check Rating'
              name='healthCheckRating'
              options={HealthRatingOptions}
            />
            <Field
              label='Description'
              id='description'
              placeholder='Description'
              onChange={handleChange}
              component={TextField}
            />
            <Field
              label='Specialist'
              id='specialist'
              placeholder='zenlex MD'
              name='specialist'
              onChange={handleChange}
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            <Grid>
              <Grid item>
                <Button
                  color='secondary'
                  variant='contained'
                  style={{ float: 'left' }}
                  type='button'
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: 'right',
                  }}
                  type='submit'
                  variant='contained'
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
