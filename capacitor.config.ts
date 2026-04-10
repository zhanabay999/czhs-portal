import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "kz.czhs.portal",
  appName: "ЦЖС Порталы",
  webDir: "out",
  server: {
    // Load from your deployed Vercel URL
    url: "https://czhs-portal.vercel.app",
    cleartext: false,
  },
  android: {
    backgroundColor: "#003DA5",
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#003DA5",
      showSpinner: false,
    },
  },
};

export default config;
