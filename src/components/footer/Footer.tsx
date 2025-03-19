import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { Copyright } from '@mui/icons-material';
import useTheme from '@mui/material/styles/useTheme';
import packageJson from '../../../package.json';
import moment from 'moment';

interface FooterProps {}

const Footer = ({}: FooterProps) => {
  const { t } = useTranslation('sv');
  const theme = useTheme();
  const REACT_APP_VERSION = packageJson.version;

  return (
    <Box
      data-testid="footerTestId"
      pl={1}
      pt={1}
      sx={{ backgroundColor: theme.palette.secondary.main, width: '100%' }}
    >
      <Stack direction="row">
        <Typography sx={{ color: theme.palette.secondary.contrastText }} variant="body1">
          <Copyright />
        </Typography>
        <Typography pl={1} sx={{ color: theme.palette.secondary.contrastText }} variant="body1">
          SKAO {moment().year()} | {t('version.label')} {REACT_APP_VERSION}
        </Typography>
      </Stack>
    </Box>
  );
};

export default Footer;
