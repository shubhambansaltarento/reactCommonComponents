'use client'
import {
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";


import { ImageOutlined, Check } from '@mui/icons-material';

export type SelectableCardOption = {
  value: string;
  titleKey: string;
  descriptionKey: string;
  //  type: "IMAGE" | "TEXT";
};

export const SelectableCardGroup = ({
  name,
  value,
  onChange,
  options = [],
}: {
  name: string;
  value: string;
  onChange: (val: string) => void;
  options: SelectableCardOption[];
}) => {
  const { t } = useTranslation("translations");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <RadioGroup
      name={name}
      value={value}
      onChange={handleChange}
      // flex container for responsiveness
      row
      style={{ width: "100%" }}
      sx={{ width: "100%" }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",      // Single column on extra-small screens
            sm: "1fr",      // Single column on small screens
            md: "1fr 1fr",  // Two columns on medium screens and above
          },
          gap: "1rem",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
          position: "relative",
          left: "10px",
        }}
      >
        {options.map((option) => (
          <FormControlLabel
            sx={{
              position: 'relative',
              display: 'block',
              width: '100%',
            }}
            key={option.value}
            value={option.value}
            control={<Radio sx={{ display: "none" }} />}
            label={
              <Box sx={{ position: 'relative', display: 'block' }}>
                {/* Checkmark positioned outside the card */}
                {value === option.value && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: "#4caf50",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                      border: "2px solid white",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    <Check sx={{ color: "#fff", fontSize: 12 }} />
                  </Box>
                )}
                <Card
                  className={`
                  h-[200px] flex relative flex-col justify-between cursor-pointer transition duration-200 !rounded-[8px]
                  ${value === option.value
                      ? "border-1  border-[var(--primary-1100)]  text-white shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                      : "border border-[var(--primary-600)] bg-white text-black"
                    }
                  hover:border-[var(--primary-900)]
                `}
                >

                  <CardContent
                    className={`
                  flex flex-col h-full bg-white
                  ${value === option.value}
                  `}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ backgroundColor: "grey.200", height: "40px", width: "40px", display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px' }}>
                        <ImageOutlined />
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2">{t(option.titleKey)}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t(option.descriptionKey)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box mt={2} flexGrow={1}>
                      {option.value === "IMAGE" ? (
                        <>
                          <Box
                            sx={{
                              width: "100%",
                              height: 60,
                              bgcolor: "grey.200",
                              borderRadius: 2,
                            }}
                          />
                          <Box
                            mt={1}
                            width="60%"
                            height={10}
                            bgcolor="grey.300"
                            borderRadius={1}
                          />
                          <Box
                            mt={1}
                            width="40%"
                            height={10}
                            bgcolor="grey.300"
                            borderRadius={1}
                          />
                        </>
                      ) : (
                        <>
                          <Box
                            mt={1}
                            width="80%"
                            height={10}
                            bgcolor="grey.300"
                            borderRadius={1}
                          />
                          <Box
                            mt={1}
                            width="70%"
                            height={10}
                            bgcolor="grey.300"
                            borderRadius={1}
                          />
                          <Box
                            mt={1}
                            width="40%"
                            height={10}
                            bgcolor="grey.300"
                            borderRadius={1}
                          />
                          <Box mt={3} height={15} />
                        </>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            }
          />
        ))}
      </Box>

    </RadioGroup>
  );
};
