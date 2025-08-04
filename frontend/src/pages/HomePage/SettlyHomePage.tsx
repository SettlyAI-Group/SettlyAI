import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SettlyHomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                {/* Back Button */}
                <Button
                    onClick={() => navigate('/')}
                    sx={{ mb: 3 }}
                >
                    ← Back to Home
                </Button>

                {/* Page Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <HomeIcon sx={{ fontSize: 64, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h3" component="h1" gutterBottom>
                        SettlyHome
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Explore smart suburb picks and lifestyle-friendly neighbourhoods
                    </Typography>
                </Box>

                {/* Content Placeholder */}
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h5" gutterBottom>
                        SettlyHome Feature
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        This is the SettlyHome feature page. Here you would find tools and insights for exploring suburbs and finding the perfect home.
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default SettlyHomePage; 