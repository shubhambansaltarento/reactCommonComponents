'use client';
import { useTranslation } from "react-i18next";

/**
 * @component Footer
 * Renders the application footer with translated text.
 */
export const Footer = () => {
  const { t, i18n } = useTranslation("translations");
  return <footer className="bg-gray-500 text-white p-4">{t("footer.common")}</footer>;
};
