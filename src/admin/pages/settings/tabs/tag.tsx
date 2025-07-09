import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { createListItem, deleteListItem, getItems, updateListItem } from '../../../../utils';
import { useRecruitment } from '../../../../context/RecruitmentContext';

interface Tag {
  id: number;
  name: string;
}

const CustomTags: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [progress, setProgress] = useState(true);
  const [removingTag, setRemovingTag] = useState<number | null>(null);
  const [addingTag, setAddingTag] = useState(false);
  const [editingTag, setEditingTag] = useState(false);
  const [editTagId, setEditTagId] = useState<number | null>(null);
  const [editTagName, setEditTagName] = useState('');
  const { getRecruitmentIds } = useRecruitment();

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    setAddingTag(true);
    try {
      const Site = await getRecruitmentIds();
      if (!Site) return;
      const siteId = Site?.siteId || '';
      const tagsId = Site.lists.find((list) => list.name === 'Tags')?.id || '';
      await createListItem(siteId, tagsId, {
        fields: { Title: newTag.trim() },
      });
      setNewTag('');
      await getTags(false);
    } catch (error) {
      console.error('Error adding tag:', error);
    } finally {
      setAddingTag(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setRemovingTag(id);
      const Site = await getRecruitmentIds();
      if (!Site) return;
      const siteId = Site?.siteId || '';
      const tagsId = Site.lists.find((list) => list.name === 'Tags')?.id || '';
      await deleteListItem(siteId, tagsId, id);
      await getTags(false);
    } catch (error) {
      console.error(error);
    } finally {
      setRemovingTag(null);
    }
  };

  const handleEdit = (id: number) => {
    const tag = tags.find((tag) => tag.id === id);
    if (tag) {
      setEditTagId(id);
      setEditTagName(tag.name);
    }
  };

  const handleSaveEdit = async () => {
    if (editTagId && editTagName.trim()) {
      try {
        setEditingTag(true);
        const Site = await getRecruitmentIds();
        if (!Site) return;
        const siteId = Site?.siteId || '';
        const tagsId = Site.lists.find((list) => list.name === 'Tags')?.id || '';
        await updateListItem(siteId, tagsId, editTagId, {
          fields: { Title: editTagName.trim() },
        });
      } catch (error) {
        console.error(error);
      } finally {
        setEditingTag(false);
        setEditTagId(null);
        setEditTagName('');
        await getTags(false);
      }
    }
  };

  const handleCloseDialog = () => {
    setEditTagId(null);
    setEditTagName('');
  };

  const getTags = async (load: boolean = true) => {
    try {
      if (load) setProgress(true);
      const Site = await getRecruitmentIds();
      if (!Site) return;
      const siteId = Site?.siteId || '';
      const tagsId = Site.lists.find((list) => list.name === 'Tags')?.id || '';
      const response = await getItems(siteId, tagsId);
      const flattenedItems = response?.fields.map((item: any) => ({
        id: item.id,
        name: item.fields?.Title || 'not-defined',
        ...item,
      }));
      setTags(flattenedItems);
    } catch (error) {
      console.error(error);
      console.log('error fetching tags:', error);
    } finally {
      setProgress(false);
    }
  };

  useEffect(() => {
    getTags();
  }, []);

  if (progress) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
        AI Filter Tags
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', maxWidth: 600 }}>
        <TextField
          label="Add New Custom Tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="e.g., Machine Learning"
          size="small"
          sx={{
            flex: 1,
            '& .MuiInputBase-root': { borderRadius: 1 },
            '& .MuiInputLabel-root': { color: '#555' },
          }}
        />
        <Button
          variant="contained"
          onClick={handleAddTag}
          disabled={addingTag || !newTag.trim()}
          sx={{ borderRadius: 1, px: 2, py: 0.5, minWidth: 100 }}
        >
          {addingTag ? 'Adding...' : 'Add Tag'}
        </Button>
      </Box>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 500, mb: 1.5 }}>
          Custom Tags ({tags?.length})
        </Typography>
        <TableContainer sx={{ bgcolor: '#fff', borderRadius: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
          <Table sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, py: 1.5, color: '#333' }}>Tag</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, py: 1.5, color: '#333' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tags?.map((tag) => (
                <TableRow key={tag.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                  <TableCell sx={{ py: 1 }}>{tag.name}</TableCell>
                  <TableCell align="right" sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEdit(tag.id)}
                        sx={{ color: '#1976d2', minWidth: 0 }}
                      />
                      {removingTag === tag.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Button
                          variant="text"
                          size="small"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(tag.id)}
                          sx={{ color: '#d32f2f', minWidth: 0 }}
                        />
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={editTagId !== null} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Tag</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tag Name"
            value={editTagName}
            onChange={(e) => setEditTagName(e.target.value)}
            fullWidth
            size="small"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined" size="small">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" disabled={editingTag} size="small">
            {editingTag ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomTags;