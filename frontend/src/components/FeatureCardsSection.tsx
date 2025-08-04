import React from 'react';
import {
    Grid,
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    CardActions
} from '@mui/material';
import {
    Home as HomeIcon,
    AccountBalance as LoanIcon,
    TrendingUp as SuperIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Hardcoded features data with static content
const features = [
    {
        id: 'settlyhome',
        title: 'SettlyHome',
        description: 'Explore smart suburb picks and lifestyle-friendly neighbourhoods.',
        route: '/features/settlyhome',
        icon: <HomeIcon />
    },
    {
        id: 'settlyloan',
        title: 'SettlyLoan',
        description: 'Compare fixed vs variable, estimate repayments, and test loan stress scenarios.',
        route: '/features/settlyloan',
        icon: <LoanIcon />
    },
    {
        id: 'settlysuper',
        title: 'SettlySuper',
        description: 'Use Your Super Wisely to Boost Your Home Plan.',
        route: '/features/settlysuper',
        icon: <SuperIcon />
    }
];

const FeatureCardsSection: React.FC = () => {
    const navigate = useNavigate();

    // Handle navigation to feature pages
    const handleFeatureClick = (route: string) => {
        navigate(route);
    };

    return (
        <Box sx={{ py: 4, px: 2 }}>
            {/* Section Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    All-in-One Tools to Simplify Your Journey
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Let's plan smarter: from viewing a home to securing a loan and optimizing your super
                </Typography>
            </Box>


        </Box>
    );
};

export default FeatureCardsSection; 