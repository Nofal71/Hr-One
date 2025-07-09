import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner, Text, tokens } from '@fluentui/react-components';

const ProtectedRoute: React.FC = () => {
  const { error, loading, user  } = useAuth();

  if (loading) return <Spinner size="extra-large" style={{ height: '100dvh' }} />;
  if (error) {
    localStorage.removeItem('auth')
    return <div>{(error as Error).message}</div>;
  } 
    
  if (!user) {
    return (
      <div style={{ width: '100%', height: '100dvh', display: 'grid', placeItems: 'center' }}>
        <Text style={{ color: tokens.colorPaletteRedBackground3, fontSize: '1.5rem' }}>Unauthorized Try Reloading Your App</Text>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
