import { Box, Typography } from "@mui/material";

type BannerProps = {
  title?: string;
  description?:string;
  children?: string;
};

const Banner: React.FC<BannerProps> = ({ title, description, children }:BannerProps) => {
  return (
    <Box height={400} bgcolor="lightblue" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Typography variant="h3">{title}</Typography>
      <Typography variant="subtitle1">{description}</Typography>
      {children}
    </Box>
  );
};

export default Banner;
