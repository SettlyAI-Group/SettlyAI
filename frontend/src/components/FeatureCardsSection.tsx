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

            {/* Feature Cards Grid - Responsive layout */}
            <Grid container spacing={3} justifyContent="center">
                {features.map((feature) => (
                    <Grid
                        item
                        xs={12} // Full width on mobile
                        sm={6}   // Half width on small screens
                        md={4}   // One-third width on desktop
                        key={feature.id}
                    >
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 3,
                                    cursor: 'pointer'
                                }
                            }}
                            onClick={() => handleFeatureClick(feature.route)}
                        >
                            <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                                {/* Feature Icon - Purple accent color */}
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mb: 2,
                                    color: 'primary.main' // Uses theme's primary color (purple)
                                }}>
                                    <Box sx={{ fontSize: 48 }}>
                                        {feature.icon}
                                    </Box>
                                </Box>

                                {/* Feature Title */}
                                <Typography
                                    variant="h6"
                                    component="h3"
                                    gutterBottom
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    {feature.title}
                                </Typography>

                                {/* Feature Description */}
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 2 }}
                                >
                                    {feature.description}
                                </Typography>
                            </CardContent>

                            {/* CTA Button */}
                            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                <Button
                                    variant="text"
                                    color="primary"
                                    endIcon={<span>→</span>}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 'medium'
                                    }}
                                >
                                    Explore →
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default FeatureCardsSection; 