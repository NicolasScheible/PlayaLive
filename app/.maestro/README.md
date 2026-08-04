# E2E-Tests (Maestro)

E2E-Tests laufen über [Maestro](https://maestro.mobile.dev), begrenzt auf die wichtigsten Kernabläufe
(siehe `docs/Architecture.md` Kapitel 19 „Testing", Architekturentscheidung 12):
Registrierung, Login, Passwort-Reset, Community-Report erstellen, Favoriten verwalten, Bewertung
erstellen, Navigation zwischen Hauptbereichen. Weitere Flows werden bei Bedarf ergänzt.

## Lokale Installation

Maestro ist ein eigenständiges CLI-Tool (kein npm-Paket) und wird separat installiert:

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

Voraussetzung: eine laufende Java-Runtime (JDK 11+).

## Flows

Flow-Dateien (`*.yaml`) werden in diesem Ordner abgelegt, sobald die zugehörigen Screens
implementiert sind — dieses technische Setup enthält bewusst noch keine Business-Logik und damit
noch keine lauffähigen Flows. Jeder Flow referenziert Screens/Testkennungen (`testID`) aus den
jeweiligen Feature-Modulen unter `src/features/`.

## Ausführen

```bash
npm run test:e2e
```

Führt `maestro test .maestro/` aus (siehe `package.json`).
