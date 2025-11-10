# Netatmo Wetterstation App

Eine moderne Next.js App zur Anzeige deiner Netatmo Wetterstationen-Daten.

## Features

- 🔐 Sichere OAuth2 Authentifizierung mit Netatmo
- 🌡️ Anzeige aller Wetterdaten (Temperatur, Luftfeuchtigkeit, CO₂, Luftdruck, Lärmpegel)
- 📱 Responsive Design mit Tailwind CSS
- ⚡ Automatische Datenaktualisierung alle 30 Sekunden
- 🔒 Sichere Token-Speicherung in HTTP-only Cookies
- 🎨 Moderne UI mit Farbkodierung für verschiedene Werte

## Setup

### 1. Netatmo API Zugang einrichten

1. Gehe zu [https://dev.netatmo.com/](https://dev.netatmo.com/)
2. Erstelle ein Entwicklerkonto
3. Erstelle eine neue App
4. Notiere dir `Client ID` und `Client Secret`
5. Setze die Redirect URI auf: `http://localhost:3000/api/auth/netatmo/callback`

### 2. Environment Variables konfigurieren

Kopiere `.env.example` zu `.env.local` und fülle die Werte aus:

```bash
cp .env.example .env.local
```

Bearbeite `.env.local`:

```env
NEXT_PUBLIC_NETATMO_CLIENT_ID=deine_client_id
NETATMO_CLIENT_SECRET=dein_client_secret
NEXT_PUBLIC_NETATMO_REDIRECT_URI=http://localhost:3000/api/auth/netatmo/callback
NEXT_PUBLIC_NETATMO_API_BASE_URL=https://api.netatmo.com
ENCRYPTION_KEY=generiere_einen_32_zeichen_schluessel
```

**Encryption Key generieren:**
```bash
openssl rand -hex 32
```

### 3. Dependencies installieren und starten

```bash
npm install
npm run dev
```

Die App ist dann unter [http://localhost:3000](http://localhost:3000) verfügbar.

## Verwendung

1. **Authentifizierung**: Klicke auf "Mit Netatmo anmelden" und autorisiere die App
2. **Daten anzeigen**: Nach der Anmeldung werden automatisch deine Wetterstationen geladen
3. **Aktualisieren**: Die Daten werden alle 30 Sekunden automatisch aktualisiert

## Technische Details

### Architektur

- **Frontend**: Next.js 14 mit App Router
- **Styling**: Tailwind CSS
- **State Management**: SWR für Server State
- **TypeScript**: Vollständige Typisierung
- **Authentication**: OAuth2 mit Netatmo

### Sicherheit

- HTTP-only Cookies für Token-Speicherung
- CSRF-Schutz mit State-Parameter
- Sichere Environment Variables
- Input-Validierung mit Zod

### API Endpoints

- `GET /api/auth/netatmo` - Startet OAuth Flow
- `GET /api/auth/netatmo/callback` - OAuth Callback
- `GET /api/weather` - Lädt Wetterdaten

## Entwicklung

### Code Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API Routes
│   └── page.tsx        # Hauptseite
├── components/         # React Komponenten
├── lib/               # Utilities und Konfiguration
└── types/             # TypeScript Types
```

### Cursor Rules

Das Projekt enthält umfassende Cursor Rules für:
- Next.js Best Practices
- Netatmo API Integration
- TypeScript Guidelines
- Security Best Practices
- Performance Optimization

## Troubleshooting

### Häufige Probleme

1. **"Missing required environment variables"**
   - Überprüfe, ob alle Environment Variables in `.env.local` gesetzt sind

2. **"Access token expired"**
   - Melde dich erneut an, die App wird automatisch zur Login-Seite weiterleiten

3. **"No weather stations found"**
   - Stelle sicher, dass dein Netatmo-Konto Wetterstationen hat
   - Überprüfe, ob die App die richtigen Berechtigungen hat

4. **CORS Fehler**
   - Stelle sicher, dass die Redirect URI in der Netatmo App korrekt konfiguriert ist

## Lizenz

MIT License