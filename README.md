### DinnaFind (pronunciation: /ˈdɪnəˌfaɪnd/) - Because ‘Yelp’ is what you do after eating bad sushi.

DinnaFind is your foodie wingman, using **Touch Grass™️ Precision Geofencing Technology** to nudge you toward epic eats and away from the same old takeout. Discover restaurants, save favorites, and get sassy reminders to try that dumpling spot you keep ignoring.

#### How It Works

- **Reverse Foodie Shaming**: Get roasted for defaulting to fast food when a gem is nearby. Example: “POV: You’re at McDonald’s, but that artisanal taco truck is _right there_.”
- **Carb Respect Mode**: Our **Bread-Pilled Discovery Engine™️** prioritizes carb-heavy spots—because gluten’s a vibe, not a villain.
- **Grandma’s Guilt Trip API**: Location-based reminders of family-recommended spots, with a side of “Nonna’s disappointed” if you skip them.
- **Smart Geofencing**: Walk near a saved pizza joint? Get a ping. Drive past that legendary arepa truck? We’ll let you know.

🎪 Shameless Engagement Hacks

- 🔔 Enable "Hangry Mode" for alerts that escalate from polite to your grandmother's guilt in 15min
  📍 "POV: You're geotagged at McDonald's but saved 17 artisanal toast spots"
  🍔 "Like a food wingman, but with 200% more tough love"
  🕵️♂️ "Catfish-Free Check-In" Uses AI, satellite imagery, and vibes to confirm that "quaint café" isn't just a gas station hot dog stand with VSCO filters.

📲 Off-App Engagement Boosters

- "Lived Experience Points (LEP)" <new tagline>
  "Bread-Pilled Discovery Engine" - Prioritizes carb-forward establishments because gluten is not the enemy, blandness is.
  "Forklift Certified" Badge Unlocked after visiting 5 saved spots. Proof you're not a foodie NPC.

#### Testimonials

> Thanks to DinnaFind, I found a meatball sub so good it ended my family's 47-year feud over Sunday gravy. We're all friends now—even Uncle Tony apologized for Christmas '03!
> — **Maria**, 41, Peacemaker of the Tri-State Area

> DinnaFind's omnichannel approach revolutionized my lunch game. I'm eating like a unicorn startup founder with next-level taste buds.
> — **Brittany**, 29, Marketing Manager

> Got a notification while doomscrolling in an Uber. Now I’m emotionally attached to a falafel stand.
> — **Aisha**, 28, Former Smoothie Bowl Enthusiast

> DinnaFind swapped my 20-piece McNugget session for a poke bowl alert. My inner child wept, but my cholesterol threw a party.
> — **Mike**, 32, Professional Sadboi

> Woke up to 'THE CHURROS ARE NEAR' at 2 a.m. Zero regrets.
> — **Diego**, 24, Chaos Goblin

> _Named 'Best App That’s Not Your Notes App Full of Forgotten Ramen Places' —TechCrunch, Probably_

### Features

- 🍔 **Discover** - Find restaurants near you powered by Foursquare Places API
- 📍 **Location-based** - Search restaurants in your area or any location
- 💾 **Save Favorites** - Build your personal restaurant bucket list
- ✅ **Track Visits** - Mark restaurants as visited
- 🏷️ **Organize** - Add notes, tags, and priorities to your saved places
- 📱 **Cross-platform** - Works on iOS and Android

##### Tech Stack

- **Framework**: React Native with Expo (Managed Workflow)
- **Language**: TypeScript
- **Package Manager**: Bun
- **Navigation**: Expo Router (file-based routing)
- **Location Services**:
  - Expo Location (Geolocation & Geofencing)
  - Background location tracking
- **State Management**: Redux Toolkit with Redux Saga
- **Storage**: Expo SecureStore & AsyncStorage
- **APIs**:
  - Restaurant discovery API (TBD - Foursquare/Google Places)
  - Custom backend for social features

### Getting Started

##### Prerequisites

- Node.js 18+
- Bun (latest version)
- Expo Go app on your phone
- iOS Simulator (Mac) or Android Emulator (optional)

#### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/dinnafind.git
cd dinnafind && bun install
```

#### Running the App

```bash
# Start Expo development server
bun start

# Run on iOS Simulator
bun ios

# Run on Android Emulator
bun android

# Run on Expo Go (scan QR code)
bun start --tunnel
```

### Project Structure

```
dinnafind/
├── __mocks__/          # Mock files for testing
├── __tests__/          # Test files
├── api/                # API integration layer
├── app/                # Expo Router screens
│   ├── (tabs)/         # Tab navigation screens
│   └── auth/           # Authentication flow
├── assets/             # Static assets (fonts, images)
├── components/         # Reusable UI components
│   ├── common/         # Shared components
│   └── screens/        # Screen-specific components
├── constants/          # App constants
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── models/             # TypeScript models/interfaces
├── providers/          # App providers
├── services/           # Business logic services
├── store/              # Redux store configuration
│   ├── slices/         # Redux Toolkit slices
│   ├── sagas/          # Redux Sagas
│   └── reducers/       # Redux reducers
├── theme/              # Theme configuration
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Core Features Implementation

##### Geolocation & Geofencing

```typescript
// Real-time location tracking for nearby restaurants
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

// Geofencing for restaurant notifications
const GEOFENCE_TASK = 'restaurant-geofence';
```

##### Restaurant Discovery

- User location-based search
- Friend recommendations
- Curated lists from trusted sources
- Smart notifications based on proximity

##### Development

```bash
# Type checking
bun typecheck

# Linting
bun lint

# Run tests
bun test

# Build for preview
bun expo export
```

##### Building for Production

```bash
# Configure EAS
bun eas build:configure

# Build for iOS
bun eas build --platform ios

# Build for Android
bun eas build --platform android
```

##### Environment Variables

```bash
cp .env.example .env.local
```

Then add your API keys to `.env.local`:

- **Foursquare API**: Get your API key from [Foursquare Developers](https://foursquare.com/developers)
- **Supabase**: Create a project and get your keys from [Supabase](https://supabase.com)

```env
# .env.local
FOURSQUARE_CLIENT_ID=
FOURSQUARE_CLIENT_SECRET=
FOURSQUARE_API_KEY=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_KEY=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
API_URL=https://api.foursquare.com/v3
EXPO_ROUTER_APP_ROOT=./app
```

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

#### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### License

This project is licensed under the MIT License.
