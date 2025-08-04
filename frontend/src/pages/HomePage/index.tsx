import React from 'react';
import { Box, Container } from '@mui/material';
import FeatureCardsSection from '../../components/FeatureCardsSection';

const HomePage: React.FC = () => {
    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                {/* Hero Section */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                        Your AI-Powered Guide for{' '}
                        <span style={{ color: '#6B46C1' }}>Property, Loan & Super Planning</span>
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                        No jargon, just clarity. Plan your future with confidence using smart reports and tools built for first-home buyers and everyday Australians.
                    </p>
                </Box>

                {/* Feature Cards Section */}
                <FeatureCardsSection />
            </Box>
        </Container >
    );
};

export default HomePage;