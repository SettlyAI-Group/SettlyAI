import React from 'react';
import { Box, Container } from '@mui/material';
import { FeatureCardsSection } from '@/components';

const HomePage: React.FC = () => {
    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                {/* Hero section placeholder */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        Your AI-Powered Guide for Property, Loan & Super Planning
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                        No jargon, just clarity. Plan your future with confidence using smart reports and tools built for first-home buyers and everyday Australians.
                    </p>
                </Box>

                {/* Feature cards section */}
                <FeatureCardsSection />
            </Box>
        </Container>
    );
};

export default HomePage; 