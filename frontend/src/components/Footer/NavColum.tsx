import { Box, Link, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface NavColumnProps {
  title: string;
  links: Array<{ text: string; href: string }>;
}

const NavColumn = ({ title, links }: NavColumnProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ flex: 1, minWidth: theme.spacing(15) }}>
      {' '}
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.common.white,
          fontWeight: theme.typography.fontWeightBold,
          mb: theme.spacing(2),
          fontSize: theme.typography.pxToRem(16),
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(1),
        }}
      >
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            sx={{
              color: theme.palette.grey[400],
              textDecoration: 'none',
              fontSize: theme.typography.pxToRem(14),
              '&:hover': {
                color: theme.palette.common.white,
                textDecoration: 'none',
              },
            }}
          >
            {link.text}
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default NavColumn;
