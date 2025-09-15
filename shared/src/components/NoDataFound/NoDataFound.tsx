import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";

import "./NoDataFound.css";
import { NoData } from "../../generated-icon";
export const NoDataFound = () => {
  const { t } = useTranslation("translations");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 2,
        pt: 5,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <NoData className="text-6xl" />
      </Box>
      <Typography variant="h5" fontWeight="500" gutterBottom className="!text-[22px]">
      {t("NO_DATA_FOUND.NO_MATCH_FOUND")}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 540, mb: 4 }}
      >
        {t("NO_DATA_FOUND.NO_MATCH_FOUND_DESCRIPTION")} <br/>{t("NO_DATA_FOUND.NO_MATCH_FOUND_DESCRIPTION_1")}
      </Typography>
    </Box>
  );
};
