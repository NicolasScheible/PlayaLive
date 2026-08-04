# services/

Service Layer — einzige Schnittstelle zu Supabase und externen APIs (siehe
`docs/Architecture.md` Kapitel 8/9 und `docs/ADR/005-API-Architecture.md`). Benannte Services:
`AuthService`, `LocationService`, `EventService`, `ArtistService`, `FavoriteService`,
`ReportService`, `ReviewService`, `SpecialService`, `HappyHourService`, `NotificationService`,
`WeatherService`. Einige Services (`ReportService`, `ReviewService`, Trust-Score-Berechnung) nutzen
zusätzlich eine Repository-Schicht — siehe `docs/Architecture.md` Kapitel 9 für die genaue Zuordnung.
Screens/Komponenten greifen nie direkt auf Supabase zu, sondern ausschließlich über diese Services.
