import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { AccountBalance as LoanIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SettlyLoanPage: React.FC = () => {
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
                        <LoanIcon sx={{ fontSize: 64, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h3" component="h1" gutterBottom>
                        SettlyLoan
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Compare fixed vs variable, estimate repayments, and test loan stress scenarios
                    </Typography>
                </Box>

                {/* Content Placeholder */}
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h5" gutterBottom>
                        SettlyLoan Feature
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        This is the SettlyLoan feature page. Here you would find tools for comparing loan options, estimating repayments, and testing different scenarios.
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default SettlyLoanPage; 