import React, { useState } from 'react';
import { Dialog, DialogSurface, DialogTitle, DialogBody, DialogActions, Button, tokens, Label, Input, Spinner } from '@fluentui/react-components';
import { CvLibraryItem } from '../candidates/types';

interface EditFormProps {
  formValues: CvLibraryItem;
  onSubmit: (values: CvLibraryItem) => Promise<void>;
  onClose: () => void;
}

const EditForm: React.FC<EditFormProps> = ({ formValues, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<CvLibraryItem>(formValues);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Years_Of_Experience' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(_, { open }) => !open && onClose()}>
      <DialogSurface style={{
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: '8px',
        boxShadow: tokens.shadow16,
        padding: '24px',
        width: '90vw',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <DialogTitle style={{
          fontSize: '20px',
          fontWeight: 600,
          color: tokens.colorNeutralForeground1,
          marginBottom: '16px',
        }}>
          Edit Candidate Profile
        </DialogTitle>
        <DialogBody style={{
          padding: '0 24px',
          maxHeight: '60vh',
          overflowY: 'auto',
          flexGrow: 1,
        }}>
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' , marginTop:'12px' }}>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: tokens.colorNeutralForeground1 }}>
                First Name
              </Label>
              <Input
                name="First_Name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
                disabled={isSubmitting}
                style={{
                  padding: '8px',
                  border: `1px solid ${tokens.colorNeutralStroke1}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: tokens.colorNeutralBackground2,
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' , marginTop:'12px' }}>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: tokens.colorNeutralForeground1 }}>
                Last Name
              </Label>
              <Input
                name="Last_Name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
                disabled={isSubmitting}
                style={{
                  padding: '8px',
                  border: `1px solid ${tokens.colorNeutralStroke1}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: tokens.colorNeutralBackground2,
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' , marginTop:'12px' }}>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: tokens.colorNeutralForeground1 }}>
                Email Address
              </Label>
              <Input
                name="Email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                disabled={isSubmitting}
                style={{
                  padding: '8px',
                  border: `1px solid ${tokens.colorNeutralStroke1}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: tokens.colorNeutralBackground2,
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' , marginTop:'12px' }}>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: tokens.colorNeutralForeground1 }}>
                Phone Number
              </Label>
              <Input
                name="Phone_Number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Enter phone number"
                disabled={isSubmitting}
                style={{
                  padding: '8px',
                  border: `1px solid ${tokens.colorNeutralStroke1}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: tokens.colorNeutralBackground2,
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' , marginTop:'12px' }}>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: tokens.colorNeutralForeground1 }}>
                Job Title
              </Label>
              <Input
                name="Job_Title"
                value={formData.job_title}
                onChange={handleChange}
                placeholder="Enter job title"
                disabled={isSubmitting}
                style={{
                  padding: '8px',
                  border: `1px solid ${tokens.colorNeutralStroke1}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: tokens.colorNeutralBackground2,
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' , marginTop:'12px' }}>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: tokens.colorNeutralForeground1 }}>
                Current Salary
              </Label>
              <Input
                name="Current_Salary"
                value={formData.current_salary}
                onChange={handleChange}
                placeholder="Enter current salary"
                disabled={isSubmitting}
                style={{
                  padding: '8px',
                  border: `1px solid ${tokens.colorNeutralStroke1}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: tokens.colorNeutralBackground2,
                }}
              />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' , marginTop:'12px' }}>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: tokens.colorNeutralForeground1 }}>
                Expected Salary
              </Label>
              <Input
                name="Expected_Salary"
                value={formData.expected_salary}
                onChange={handleChange}
                placeholder="Enter expected salary"
                disabled={isSubmitting}
                style={{
                  padding: '8px',
                  border: `1px solid ${tokens.colorNeutralStroke1}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: tokens.colorNeutralBackground2,
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' , marginTop:'12px' }}>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: tokens.colorNeutralForeground1 }}>
                Source
              </Label>
              <Input
                name="Source"
                value={formData.source}
                onChange={handleChange}
                placeholder="Enter source"
                disabled={isSubmitting}
                style={{
                  padding: '8px',
                  border: `1px solid ${tokens.colorNeutralStroke1}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: tokens.colorNeutralBackground2,
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' , marginTop:'12px' }}>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: tokens.colorNeutralForeground1 }}>
                Years of Experience
              </Label>
              <Input
                name="Years_Of_Experience"
                value={formData.years_of_experience}
                onChange={handleChange}
                placeholder="Enter years of experience"
                disabled={isSubmitting}
                style={{
                  padding: '8px',
                  border: `1px solid ${tokens.colorNeutralStroke1}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: tokens.colorNeutralBackground2,
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' , marginTop:'12px' }}>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: tokens.colorNeutralForeground1 }}>
                City
              </Label>
              <Input
                name="City"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                disabled={isSubmitting}
                style={{
                  padding: '8px',
                  border: `1px solid ${tokens.colorNeutralStroke1}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: tokens.colorNeutralBackground2,
                }}
              />
            </div>
          </div>
        </DialogBody>
        <DialogActions style={{ justifyContent: 'flex-end', marginTop: '16px', padding: '0 24px 16px' }}>
          <Button
            appearance="secondary"
            onClick={onClose}
            disabled={isSubmitting}
            style={{ minWidth: '100px' }}
          >
            Cancel
          </Button>
          <Button
            appearance="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{ minWidth: '100px' }}
          >
            {isSubmitting ? <Spinner size="tiny" label="Saving..." /> : 'Save'}
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
};

export default EditForm;