# Frontend COLDCHAIN Mobile

A React Native (Expo) mobile app for cold-chain shipment monitoring and live vehicle tracking. The app provides login, shipment lists and details, live GPS tracking, alerts, and dashboard charts — intended for logistics operators who need real-time visibility into temperature-sensitive shipments.

## Stack
- Language(s): JavaScript (React Native)
- Framework / runtime: Expo (React Native)
- Notable libraries:
  - @react-navigation/native, @react-navigation/bottom-tabs, @react-navigation/native-stack (navigation)
  - axios (HTTP client)
  - socket.io-client (real-time updates)
  - react-native-maps (maps & live tracking)
  - react-native-chart-kit (charts)

## Key features
- User authentication (Login screen)
- Dashboard with charts and summary metrics
- Shipments list and detailed shipment view
- Live tracking of trucks on a map
- Alerts page for temperature, route, or delivery issues
- Reusable UI components (Header, PrimaryButton, StatusBadge, GlassCard)

## Project structure
```
App.js                  # App entry: loads fonts and starts navigator
app.json                # Expo app configuration
src/
  navigation/
    AppNavigator.js     # Root navigator that wires navigation stacks
    BottomTabNavigator.js# Tab navigator for main app screens
  screens/
    Login.js            # Login flow
    Dashboard.js        # Dashboard + charts
    Shipments.js        # Shipments listing
    ShipmentDetails.js  # Shipment detail page
    LiveTracking.js     # Map + realtime tracking
    TruckDetails.js     # Truck detail page
    Alerts.js           # Alerts and notifications
  components/
    Header.js           # App header component
    PrimaryButton.js    # Button component used across screens
    GlassCard.js        # Reusable card UI
    StatusBadge.js      # Status indicator component
  services/
    api.js              # Axios instance / API helpers
  theme.js              # Colors and shared styles
.env.example            # Example environment variables (copy to .env)
```

How it fits together:
- App.js loads fonts and renders the navigation tree defined in src/navigation.
- Screens fetch and send data through src/services/api.js (axios); real-time updates use socket.io-client.
- Maps and tracking are implemented in LiveTracking using react-native-maps; charts are rendered with react-native-chart-kit.

## How to run it
The shortest path from a fresh clone to a running process or passing tests.

Prerequisites:
- Node.js (16+ recommended)
- npm or yarn
- Expo CLI (optional but recommended): `npm install -g expo-cli`
- For iOS/Android testing: Expo Go app on device or an emulator

Commands:
```
# Clone
git clone https://github.com/youssefismail-hub/Frontend-COLDCHAIN-Mobile.git
cd Frontend-COLDCHAIN-Mobile

# Install dependencies
npm install
# or
yarn install

# Start the dev server (Expo)
npm run start
# or
yarn start

# Open on Android
npm run android
# or
yarn android

# Open on iOS
npm run ios
# or
yarn ios

# Run for web
npm run web
# or
yarn web
```

## Environment variables
There is a `.env.example` in the repo. Copy it to `.env` and set the required values before running. Typical entries you may need to configure:
- API_BASE_URL (or similar) — backend REST API endpoint used by src/services/api.js
- SOCKET_URL — socket server for real-time tracking/alerts
- MAPS_API_KEY — (optional) maps provider API key if required for your setup

Open `.env.example` to confirm exact variable names used and update accordingly.

## Development notes
- Fonts are loaded via @expo-google-fonts in App.js; the app returns null until fonts finish loading.
- Navigation is split into an AppNavigator and BottomTabNavigator; add or adjust screens there.
- API calls are centralized in src/services/api.js — update base URL and auth handling there.
- If using Google Maps on Android/iOS, ensure platform-specific map API keys and configuration are applied (see react-native-maps docs).

## Testing on device
- Scan the QR code from `expo start` with Expo Go (Android/iOS) to test on a device.
- For live GPS tracking features you may need to enable location services and supply mock GPS data or run tests with a real device.

## Building for production
This project uses Expo. For production builds, follow Expo's build/EAS documentation:
- Managed workflow builds: `expo build` (or EAS Build if configured)
- Configure app.json or app.config.js with application identifiers, icon, and permissions.

## Contributing
Contributions are welcome. Suggested workflow:
1. Fork the repo
2. Create a feature branch (feature/...)
3. Commit changes with clear messages
4. Open a pull request describing the change and any testing steps

Please open issues for bugs or feature requests.

## License
See the LICENSE file in the repository for license details.

## Troubleshooting
- App shows a blank screen: ensure fonts loaded successfully (App returns null until fontsLoaded).
- API requests failing: verify `.env` variables and that API server is reachable.
- Maps not rendering: confirm platform map API key and native setup for react-native-maps.

## Maintainer / Contact
Repository owner: youssefismail-hub (see GitHub profile for contact)

## Try asking
- "How do I configure the backend base URL used by the app? Which env variable does src/services/api.js read?"
- "Where should I add another tab in the app — which file wires the bottom tabs?"
- "LiveTracking isn't receiving socket updates — what socket URL and events does the client expect?"
