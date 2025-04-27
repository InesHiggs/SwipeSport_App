# Welcome to SwipeSport App 👋

A React Native Expo app for finding sports partners and connecting with them.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

## App Structure

### Navigation

The app uses a bottom tab navigation system implemented with a custom Navbar component that provides consistent navigation across all screens. The navigation is implemented in the root layout (`app/_layout.jsx`) and includes:

- **Home**: Main landing page
- **Find**: Find sports partners with a swipe interface
- **Chats**: Message with matched partners
- **People**: View and manage accepted connections
- **Profile**: User profile management

The navigation bar appears on all authenticated screens and is fixed at the bottom of the screen. It visually indicates the active tab with a colored icon and top border.

### Documentation

Detailed documentation is available in the `docs` directory:
- `Components.md`: Details of all reusable components
- `Pages.md`: Information about all screens in the app
- `Context.md`: Context providers and state management

### Authentication

The app uses Firebase Authentication for user management, including login and signup functionality.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
