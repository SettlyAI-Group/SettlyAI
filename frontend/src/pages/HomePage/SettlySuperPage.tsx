import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { TrendingUp as SuperIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SettlySuperPage: React.FC = () => {
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
                        <SuperIcon sx={{ fontSize: 64, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h3" component="h1" gutterBottom>
                        SettlySuper
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Use Your Super Wisely to Boost Your Home Plan
                    </Typography>
                </Box>

                {/* Content Placeholder */}
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h5" gutterBottom>
                        SettlySuper Feature
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        This is the SettlySuper feature page. Here you would find tools for optimizing your superannuation strategy to help with your home buying goals.
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default SettlySuperPage; 