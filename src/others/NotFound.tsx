import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Text, useTheme } from '@fluentui/react';
import { Button } from '@fluentui/react-components';


const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Stack
            verticalAlign="center"
            horizontalAlign="center"
            styles={{ root: { height: '100vh', textAlign: 'center' } }}
        >
            <Text
                variant="xxLarge"
                styles={{ root: { marginBottom: '20px', color: theme.palette.white } }}
                >
                404 - Page Not Found
            </Text>
            <Text
                variant="medium"
                styles={{ root: { marginBottom: '30px', color: theme.palette.white } }}
            >
                Sorry, the page you are looking for does not exist.
            </Text>
            <Button onClick={() => navigate('/admin')}>Go to Home</Button>
        </Stack>
    );
};

export default NotFound;