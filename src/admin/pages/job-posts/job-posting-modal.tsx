import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography,
} from '@mui/material';
import styled from 'styled-components';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { createListItem } from '../../../utils';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface JobPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteId: number | null | string;
  listId: number | null | string;
  onSave: () => void;
}

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    max-width: 500px;
    background-color: #fff;
  }
`;

const StyledContainer = styled(Box)`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledFileInput = styled('input')`
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  color: #1a1a1a;
  background-color: #fafafa;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const JobPostingModal: React.FC<JobPostingModalProps> = ({ isOpen, onClose, siteId, listId, onSave }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [status, setStatus] = useState<string>('Active');
  const [file, setFile] = useState<File | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false)

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(' ') + '\n';
        }
        return text;
      } else if (
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      }
      return '';
    } catch (error) {
      console.error('Error extracting text:', error);
      return '';
    }
  };

  const handleSave = async () => {
    if (!jobTitle || (!jobDescription && !file)) return;
    setIsConfirmOpen(true);
  };

  const confirmSave = async () => {
    if (!siteId || !listId) return;
    let extractedText = '';
    if (file) {
      extractedText = await extractTextFromFile(file);
    }
    setSaving(true)
    await createListItem(siteId, listId, {
      fields: {
        job_title: jobTitle,
        job_description: jobDescription + extractedText,
        job_status: status
      }
    })
    setSaving(false)
    setJobTitle('');
    setJobDescription('');
    setFile(null);
    setStatus('Active');
    setIsConfirmOpen(false);
    onClose();
    onSave();
  };

  return (
    <>
      <StyledDialog open={isOpen} onClose={onClose}>
        <DialogTitle sx={{ fontWeight: 600, color: '#1a1a1a' }}>
          Create New Job Posting
        </DialogTitle>
        <DialogContent>
          <StyledContainer>
            <TextField
              label="Job Title"
              placeholder="Enter job title (e.g., Software Engineer)"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  '& fieldset': { borderColor: '#e0e0e0' },
                },
              }}
            />
            <TextField
              label="Job Description"
              placeholder="Describe the job responsibilities and requirements"
              multiline
              rows={5}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  '& fieldset': { borderColor: '#e0e0e0' },
                },
              }}
            />
            <Box>
              <Typography sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
                Upload Job Document
              </Typography>
              <StyledFileInput
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </Box>
            <FormControl fullWidth size="small">
              <InputLabel>Job Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Job Status"
                sx={{ borderRadius: '4px', '& fieldset': { borderColor: '#e0e0e0' } }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </StyledContainer>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant="text"
            onClick={onClose}
            sx={{ color: '#1976d2', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!jobTitle || (!jobDescription && !file)}
            sx={{
              bgcolor: '#1976d2',
              color: '#fff',
              fontWeight: 600,
              '&:hover': { bgcolor: '#115293' },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </StyledDialog>

      <StyledDialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <DialogTitle sx={{ fontWeight: 600, color: '#1a1a1a' }}>
          Confirm Save
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#4a4a4a' }}>
            Are you sure you want to save this job posting?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant="text"
            onClick={() => setIsConfirmOpen(false)}
            sx={{ color: '#1976d2', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmSave}
            disabled={saving}
            sx={{
              bgcolor: '#1976d2',
              color: '#fff',
              fontWeight: 600,
              '&:hover': { bgcolor: '#115293' },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </StyledDialog>
    </>
  );
};

export default JobPostingModal;