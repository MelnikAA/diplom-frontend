const config = {
  locale: import.meta.env.VITE_DEFAULT_LOCALE,
  country: import.meta.env.VITE_COUNTRY,
  termsLink: import.meta.env.VITE_TERMS_AND_CONDITIONS_URL,
  tariffsLink: import.meta.env.VITE_TARIFFS_URL,
  insuranceLink: import.meta.env.VITE_INSURANCE_URL,
  company: import.meta.env.VITE_COMPANY_NAME,
  mainPage: import.meta.env.VITE_MAIN_PAGE,
};
export default config;
