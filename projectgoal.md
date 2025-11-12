# Project Goal: Netatmo Wetterstation mit historischen Daten

## Summary
Erweiterung der bestehenden Netatmo-App um eine Datenbank-basierte Speicherung historischer Wetterdaten und eine Visualisierung von Temperaturkurven. Die App soll regelmäßig Daten von der Netatmo API abrufen, in einer Datenbank speichern und dem Benutzer sowohl aktuelle als auch historische Daten in Form von Graphen anzeigen.

## Motivation
Die aktuelle App zeigt nur Live-Daten an, die direkt von der Netatmo API abgerufen werden. Es gibt keine Möglichkeit, historische Trends zu analysieren oder Temperaturverläufe über längere Zeiträume zu betrachten. Durch die Speicherung der Daten in einer Datenbank und die Visualisierung in Graphen können Benutzer:
- Temperaturtrends über Tage, Wochen oder Monate analysieren
- Langfristige Muster erkennen
- Daten auch dann abrufen, wenn die Netatmo API temporär nicht verfügbar ist
- Eigene Analysen und Auswertungen durchführen

## MVP (Minimum Viable Product)

### Entwicklungsansatz: Test-Driven Development (TDD)
Die gesamte Entwicklung erfolgt testgetrieben nach dem TDD-Prinzip:
- **Red**: Tests werden zuerst geschrieben und schlagen fehl (Funktionalität existiert noch nicht)
- **Green**: Minimale Implementierung, um Tests zum Laufen zu bringen
- **Refactor**: Code-Optimierung bei bestehenden Tests
- **Test-Pyramide**: Unit-Tests (Basis), Integration-Tests (Mitte), E2E-Tests (Spitze)
- Alle Features müssen durch Tests abgedeckt sein, bevor sie als fertig gelten

### Core Features

#### 1. Datenbank-Setup
- **Datenbankauswahl**: SQLite für einfache Entwicklung, PostgreSQL für Produktion
- **Schema-Design**: Tabellen für Wetterstationen, Module und Messwerte
- **Migration-System**: Datenbankschema-Versionierung und Migrations
- **Datenmodell**: 
  - Stations-Tabelle (id, name, location, etc.)
  - Modules-Tabelle (id, station_id, name, type, etc.)
  - Measurements-Tabelle (id, module_id, timestamp, temperature, humidity, co2, pressure, noise)

#### 2. Cronjob-System
- **Scheduling**: Regelmäßige Ausführung (z.B. alle 15 Minuten)
- **Datenabruf**: Verwendung der bestehenden Netatmo API-Integration
- **Datenverarbeitung**: Extraktion und Normalisierung der API-Daten
- **Speicherung**: Persistierung in Datenbank mit Timestamp
- **Fehlerbehandlung**: Retry-Logik und Logging bei Fehlern
- **Implementierung**: Next.js API Route mit externem Cronjob-Service (z.B. Vercel Cron, GitHub Actions, oder lokaler Cron)

#### 3. Historische Daten-API
- **Endpoint**: `GET /api/weather/history`
- **Parameter**: 
  - `moduleId`: ID des Moduls
  - `startDate`: Startdatum (optional, default: 24h zurück)
  - `endDate`: Enddatum (optional, default: jetzt)
  - `interval`: Aggregationsintervall (optional, z.B. '1h', '1d')
- **Response**: Array von Messwerten mit Timestamps
- **Performance**: Indexierung auf Timestamp und Module-ID für schnelle Abfragen

#### 4. Temperaturkurven-Seite
- **Route**: `/temperature` oder `/history`
- **Graph-Komponente**: Verwendung einer Charting-Library (z.B. Recharts, Chart.js, oder Victory)
- **Zeitraum-Auswahl**: 
  - Dropdown oder Buttons für vordefinierte Zeiträume (24h, 7d, 30d, 90d, 1y)
  - Custom Date Range Picker für flexible Auswahl
  - Default: 24 Stunden
- **Graph-Features**:
  - Linien-Graph für Temperaturverlauf
  - Tooltip mit genauen Werten beim Hover
  - Zoom-Funktionalität (optional für MVP)
  - Responsive Design
- **Module-Auswahl**: Möglichkeit, zwischen verschiedenen Modulen zu wechseln

#### 5. Integration in bestehende App
- **Navigation**: Link zur neuen Temperaturkurven-Seite im Hauptmenü
- **Konsistenz**: Verwendung des bestehenden Design-Systems und Styling
- **Authentifizierung**: Nutzung der bestehenden OAuth2-Authentifizierung

### Success Criteria
- Cronjob läuft zuverlässig und speichert Daten alle 15 Minuten
- Datenbank enthält mindestens 1 Woche historische Daten nach 1 Woche Betrieb
- Temperaturkurven-Seite zeigt korrekte Daten für Zeiträume von 24h bis 1 Jahr
- API-Endpoint liefert Daten in < 500ms für Zeiträume bis 1 Jahr
- Keine Datenverluste bei API-Fehlern (Retry-Mechanismus funktioniert)
- UI ist responsive und funktioniert auf Desktop und Mobile
- **Alle Features haben umfassende Test-Abdeckung (Unit, Integration, E2E)**
- **Test-Coverage von mindestens 80% für kritische Business-Logik**
- **Alle Tests müssen vor jedem Commit grün sein**

### Timeline
- **Woche 1**: Test-Infrastruktur-Setup, Datenbank-Setup, Schema-Design, Migration-System (testgetrieben)
- **Woche 2**: Cronjob-Implementierung, Datenabruf und Speicherung (testgetrieben)
- **Woche 3**: Historische Daten-API, Graph-Komponente, Temperaturkurven-Seite (testgetrieben)
- **Woche 4**: Integration, E2E-Tests, Bug-Fixes, Dokumentation

## Full Product Vision

### Extended Functionality

#### Erweiterte Visualisierungen
- **Multi-Metric Graphen**: Gleichzeitige Anzeige von Temperatur, Luftfeuchtigkeit, CO2, etc.
- **Vergleichsansichten**: Vergleich mehrerer Module oder Zeiträume
- **Heatmaps**: Kalender-Heatmap für Temperaturverläufe
- **Statistiken**: Min/Max/Durchschnittswerte für ausgewählte Zeiträume
- **Export-Funktionalität**: CSV/JSON Export der historischen Daten

#### Erweiterte Datenanalyse
- **Trend-Analyse**: Automatische Erkennung von Trends und Mustern
- **Alarme/Benachrichtigungen**: Warnungen bei ungewöhnlichen Werten
- **Vorhersagen**: Einfache Prognosen basierend auf historischen Daten
- **Korrelationen**: Analyse von Zusammenhängen zwischen verschiedenen Metriken

#### Datenverwaltung
- **Datenbereinigung**: Automatische Bereinigung alter Daten (z.B. älter als 2 Jahre)
- **Backup-System**: Regelmäßige Backups der Datenbank
- **Datenimport**: Möglichkeit, historische Daten nachträglich zu importieren
- **Multi-User-Support**: Unterstützung mehrerer Benutzer mit separaten Daten

#### Performance-Optimierungen
- **Caching**: Intelligentes Caching häufig abgerufener Daten
- **Datenaggregation**: Pre-aggregierte Daten für häufig angefragte Zeiträume
- **Lazy Loading**: Lazy Loading für große Datensätze
- **Pagination**: Paginierung für sehr große Zeiträume

#### UI/UX Verbesserungen
- **Dashboard**: Übersichts-Dashboard mit Key Metrics
- **Filter**: Erweiterte Filteroptionen (nach Station, Modul, Metrik)
- **Favoriten**: Speichern häufig verwendeter Ansichten
- **Dark Mode**: Unterstützung für Dark Mode
- **Accessibility**: Verbesserte Barrierefreiheit

#### Integrationen
- **Webhooks**: Webhooks für externe Systeme
- **REST API**: Vollständige REST API für externe Zugriffe
- **Export-Integrationen**: Direkter Export zu Google Sheets, Excel, etc.
- **Mobile App**: Native Mobile App (optional)

### Future Considerations

#### Skalierung
- **Multi-Tenant**: Unterstützung für mehrere Netatmo-Konten
- **Cloud-Deployment**: Deployment auf Cloud-Plattformen (Vercel, AWS, etc.)
- **Datenbank-Migration**: Migration zu größeren Datenbanken bei Bedarf
- **CDN**: Content Delivery Network für statische Assets

#### Erweiterte Features
- **Machine Learning**: ML-basierte Vorhersagen und Anomalie-Erkennung
- **IoT-Integration**: Integration mit anderen IoT-Geräten
- **Wetter-APIs**: Integration mit externen Wetter-APIs für Vergleichsdaten
- **Social Features**: Teilen von Graphen und Statistiken

#### Technologische Evolution
- **Real-time Updates**: WebSocket-basierte Echtzeit-Updates
- **Progressive Web App**: PWA-Funktionalität für Offline-Nutzung
- **Edge Computing**: Edge-basierte Datenverarbeitung
- **Blockchain**: Optional: Blockchain-basierte Datenverifizierung

## Technical Considerations

### Datenbank
- **Entwicklung**: SQLite für einfache lokale Entwicklung
- **Produktion**: PostgreSQL für Skalierbarkeit und Performance
- **ORM**: Prisma oder Drizzle für Type-Safe Datenbankzugriffe
- **Migrations**: Automatische Schema-Migrations

### Cronjob-Implementierung
- **Optionen**:
  - Vercel Cron Jobs (wenn auf Vercel deployed)
  - GitHub Actions (für kostenlose Option)
  - Externer Cron-Service (z.B. cron-job.org)
  - Lokaler Cron (für Self-Hosting)
- **Resilienz**: Retry-Mechanismus bei Fehlern
- **Monitoring**: Logging und Alerting bei Fehlern

### Charting-Library
- **Optionen**: 
  - Recharts (React-native, gut für Next.js)
  - Chart.js mit react-chartjs-2
  - Victory (flexibel, aber größer)
- **Kriterien**: 
  - TypeScript-Support
  - Responsive Design
  - Gute Performance mit großen Datensätzen
  - Einfache Customization

### Performance
- **Datenbank-Indizes**: Indizes auf Timestamp und Module-ID
- **API-Optimierung**: Pagination und Filterung auf Datenbank-Ebene
- **Frontend-Optimierung**: Code-Splitting, Lazy Loading, Memoization
- **Caching**: Server-side Caching für häufig abgerufene Daten

### Sicherheit
- **Authentifizierung**: Nutzung der bestehenden OAuth2-Authentifizierung
- **Autorisierung**: Prüfung, dass Benutzer nur auf eigene Daten zugreifen kann
- **SQL-Injection**: Verwendung von ORM/Prepared Statements
- **Rate Limiting**: Rate Limiting für API-Endpoints

## Success Metrics

### Technische Metriken
- **Datenbank-Performance**: 
  - Query-Zeit < 500ms für Zeiträume bis 1 Jahr
  - Speicher-Effizienz: < 1MB pro Monat Daten pro Modul
- **Cronjob-Zuverlässigkeit**: 
  - > 99% Success Rate
  - < 1% Datenverlust
- **API-Performance**: 
  - Response-Zeit < 500ms (p95)
  - Verfügbarkeit > 99.9%

### User Experience Metriken
- **Page Load Time**: < 2 Sekunden für Temperaturkurven-Seite
- **Graph-Rendering**: < 1 Sekunde für 1 Jahr Daten
- **User Satisfaction**: Positive Feedback zu Graph-Darstellung

### Business Metriken
- **Datenqualität**: Vollständigkeit der gespeicherten Daten
- **Nutzung**: Anzahl der Aufrufe der Temperaturkurven-Seite
- **Retention**: Regelmäßige Nutzung der App nach Implementierung

