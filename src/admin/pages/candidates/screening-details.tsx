import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { CvLibraryItem } from './types';

interface ScreeningDetailsProps {
  candidate: CvLibraryItem | null;
  position: string;
  onClose: () => void;
}

const ScreeningDetails: React.FC<ScreeningDetailsProps> = ({ candidate, position, onClose }) => {
  const screenedData = candidate?.screen_results.find((p: any) => p.position === position)?.screen_results;
  return (
    <Dialog
      open={!!candidate}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          backgroundColor: '#f9fafb',
        },
      }}
    >
      <DialogTitle className="text-2xl font-bold text-gray-800">
        Screening Results for {candidate?.first_name || 'Candidate'}
      </DialogTitle>
      <Divider />
      <DialogContent className="space-y-6 p-6">
        {screenedData ? (
          <div className="space-y-6">
            {/* Total Score and Summary */}
            <Box className="bg-white p-4 rounded-lg shadow-sm">
              <Typography variant="h6" className="text-lg font-semibold text-gray-700 mb-2">
                Overview for {position}
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                <strong>Total Score: </strong>
                {screenedData?.['Total Score']?.find((s: string) =>
                  s.includes('Weighted Average Total Score')
                )?.split(': ')[1] || 'N/A'}
              </Typography>
              <Typography variant="body1" className="text-gray-600 mt-2">
                <strong>Summary: </strong>
                {screenedData?.Summary || 'No summary available'}
              </Typography>
            </Box>

            {/* Technical Skills */}
            {screenedData?.['Technical Skills Scores=']?.['Individual Scores'] && (
              <Box className="bg-white p-4 rounded-lg shadow-sm">
                <Typography variant="h6" className="text-lg font-semibold text-gray-700 mb-2">
                  Technical Skills
                </Typography>
                <div className="grid gap-2">
                  {Object.entries(screenedData['Technical Skills Scores=']['Individual Scores']).map(
                    ([skill, data]: [string, any]) => (
                      <Typography key={skill} variant="body2" className="text-gray-600">
                        <strong>{skill}: </strong>Score {data.Score}, {data.Justification}
                      </Typography>
                    )
                  )}
                </div>
              </Box>
            )}

            {/* Grouped Scores */}
            {screenedData?.['Technical Skills Scores=']?.['Grouped Scores'] && (
              <Box className="bg-white p-4 rounded-lg shadow-sm">
                <Typography variant="h6" className="text-lg font-semibold text-gray-700 mb-2">
                  Grouped Scores
                </Typography>
                <div className="grid gap-2">
                  {Object.entries(screenedData['Technical Skills Scores=']['Grouped Scores']).map(
                    ([group, data]: [string, any]) => (
                      <Typography key={group} variant="body2" className="text-gray-600">
                        <strong>{group}: </strong>Score {data.Score}, {data.Justification}
                      </Typography>
                    )
                  )}
                </div>
              </Box>
            )}

            {/* Project Portfolio */}
            {screenedData?.['Project Portfolio Scores='] && (
              <Box className="bg-white p-4 rounded-lg shadow-sm">
                <Typography variant="h6" className="text-lg font-semibold text-gray-700 mb-2">
                  Project Portfolio
                </Typography>
                <div className="grid gap-2">
                  {Object.entries(screenedData['Project Portfolio Scores=']).map(
                    ([project, data]: [string, any]) =>
                      project !== 'Overall Project Portfolio Score=' && (
                        <Typography key={project} variant="body2" className="text-gray-600">
                          <strong>{project}: </strong>Score {data.Score}, {data.Justification}
                        </Typography>
                      )
                  )}
                </div>
              </Box>
            )}

            {/* Education */}
            {screenedData?.['Education Scores='] && (
              <Box className="bg-white p-4 rounded-lg shadow-sm">
                <Typography variant="h6" className="text-lg font-semibold text-gray-700 mb-2">
                  Education
                </Typography>
                <div className="grid gap-2">
                  {Object.entries(screenedData['Education Scores=']).map(
                    ([edu, data]: [string, any]) =>
                      edu !== 'Overall Education Score=' && (
                        <Typography key={edu} variant="body2" className="text-gray-600">
                          <strong>{edu}: </strong>Score {data.Score}, {data.Justification}
                        </Typography>
                      )
                  )}
                </div>
              </Box>
            )}

            {/* Soft Skills */}
            {screenedData?.['Soft Skills Scores'] && (
              <Box className="bg-white p-4 rounded-lg shadow-sm">
                <Typography variant="h6" className="text-lg font-semibold text-gray-700 mb-2">
                  Soft Skills
                </Typography>
                <div className="grid gap-2">
                  {Object.entries(screenedData['Soft Skills Scores']).map(
                    ([skill, data]: [string, any]) =>
                      skill !== 'Overall Soft Skill Score=' && (
                        <Typography key={skill} variant="body2" className="text-gray-600">
                          <strong>{skill}: </strong>Score {data.Score}, {data.Justification}
                        </Typography>
                      )
                  )}
                </div>
              </Box>
            )}
          </div>
        ) : (
          <Typography variant="body1" className="text-gray-600 text-center">
            Not screened yet for {position}
          </Typography>
        )
        }
      </DialogContent>
      <Divider />
      <DialogActions className="p-4">
        <Button
          onClick={onClose}
          variant="contained"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScreeningDetails;