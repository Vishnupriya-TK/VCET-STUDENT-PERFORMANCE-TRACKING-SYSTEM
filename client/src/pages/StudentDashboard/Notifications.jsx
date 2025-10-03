import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const Notifications = () => (
  <Box maxWidth={600} mx="auto" mt={4}>
    <Card sx={{ borderRadius: 4, boxShadow: 3, background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d7fe 100%)', color: '#2D264B', p: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={700} mb={2}>Notifications</Typography>
        <Typography>No notifications yet.</Typography>
      </CardContent>
    </Card>
  </Box>
);

export default Notifications; 