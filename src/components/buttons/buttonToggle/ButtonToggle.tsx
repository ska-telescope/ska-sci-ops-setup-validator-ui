import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';

export interface ButtonToggleProps {
  ariaDescription?: string;
  ariaTitle?: string;
  current: string;
  disabled?: boolean;
  height?: number;
  options: { id: string; label: string; value: any }[];
  setValue?: Function;
  testId: string;
  toolTip?: string;
  value: any;
}

export function ButtonToggle({
  ariaDescription = 'button',
  ariaTitle = 'ButtonToggle',
  current,
  disabled = false,
  height = 50,
  setValue,
  value,
  options,
  testId,
  toolTip = ''
}: ButtonToggleProps): JSX.Element {
  const updateValue = (e: any, id: string) =>
    typeof setValue !== 'undefined' ? setValue(e, id) : null;

  return (
    <Box>
      <Tooltip title={toolTip} arrow>
        <ToggleButtonGroup
          aria-label={ariaTitle}
          aria-describedby={ariaDescription}
          aria-hidden={false}
          color="secondary"
          data-testid={testId}
          disabled={disabled}
          exclusive
          onChange={updateValue}
          value={value}
        >
          {options.map((option: { id: string; label: string; value: any }): JSX.Element => {
            return (
              <ToggleButton
                aria-label={option.id}
                id={option.id}
                data-testid={testId + option.id}
                key={option.id}
                selected={option.id === current}
                sx={{
                  width: '80px',
                  height: `${height}px`,  // Use proper height with px unit
                  fontSize: '18px',
                  padding: '0px 8px',
                  '&.Mui-selected': {
                    color: 'primary.main',
                    backgroundColor: 'secondary.main',
                    fontWeight: 'bold',
                    ':disabled': {
                      color: 'primary.contrastText',
                      backgroundColor: 'primary.dark'
                    }
                  },
                  ':hover': {
                    color: 'primary.main',
                    backgroundColor: 'secondary.dark'
                  }
                }}
                value={option.id}
              >
                {option.label}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </Tooltip>
    </Box>
  );
}

export default ButtonToggle;
