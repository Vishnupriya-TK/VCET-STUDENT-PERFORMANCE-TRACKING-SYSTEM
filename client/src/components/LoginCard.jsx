import React from 'react';
import { Card, Box, Typography, TextField, Button, Avatar } from '@mui/material';

const LoginCard = ({
  title,
  subtitle,
  fields,
  onSubmit,
  icon,
  buttonText = 'Login',
  values,
  onChange,
}) => {
  return (
    <Card sx={{ p: 4, borderRadius: 4, minWidth: 320, maxWidth: 400, mx: 'auto', boxShadow: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        {icon && <Avatar sx={{ width: 64, height: 64, mb: 2 }}>{icon}</Avatar>}
        <Typography variant="h5" fontWeight={600} align="center" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" mb={2}>
          {subtitle}
        </Typography>
      </Box>
      <form onSubmit={onSubmit}>
        {fields.map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            type={field.type || 'text'}
            name={field.name}
            value={values[field.name] || ''}
            onChange={onChange}
            fullWidth
            margin="normal"
            required={field.required}
            InputProps={field.InputProps}
          />
        ))}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          {buttonText}
        </Button>
      </form>
    </Card>
  );
};

export default LoginCard; 