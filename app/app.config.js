// Minimale dynamische Erweiterung der bestehenden app.json (siehe docs/ADR/008-Security.md):
// google-services.json ist git-ignored (Secrets werden laut ADR-008 nie versioniert) und liegt
// daher bei einem EAS Cloud Build nicht im hochgeladenen Projektarchiv. Wird sie als EAS File
// Environment Variable "GOOGLE_SERVICES_JSON" bereitgestellt, materialisiert EAS sie im
// Build-Container und legt den lokalen Dateipfad in process.env.GOOGLE_SERVICES_JSON ab, bevor
// die Expo-Config aufgelöst wird — das ist der einzige Zweck von EAS File Environment Variables,
// ohne diese Reihenfolge wäre die Funktion nutzlos. Lokal bzw. ohne gesetzte Variable bleibt
// android.googleServicesFile unverändert aus app.json ("./google-services.json").
//
// app.json bleibt alleinige Quelle für alle übrigen Werte — hier wird ausschließlich dieses eine
// Feld bedingt überschrieben. `config` ist laut @expo/config bereits die aus app.json geladene,
// defaultbefüllte Konfiguration (node_modules/@expo/config/build/Config.js: "If a function is
// exported from the app.config.js then a partial config will be passed as an argument. The
// partial config is composed from any existing app.json").
module.exports = ({ config }) => {
  if (process.env.GOOGLE_SERVICES_JSON) {
    config.android.googleServicesFile = process.env.GOOGLE_SERVICES_JSON;
  }

  return { expo: config };
};
