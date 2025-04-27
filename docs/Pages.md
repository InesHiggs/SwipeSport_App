# Pages/Screens

This document describes all the main screens in the SwipeSport App.

## Home Screen

**Path:** `/app/index.jsx`

The main landing page after authentication, displaying the primary navigation options.

**Implementation:**
- Renders a welcome screen with button navigation to different sections of the app
- Background image with gradient overlay for visual appeal
- Contains buttons for Profile, Find Partners, Accepted People, Chats, and Logout

**Navigation Options:**
- Profile: Routes to `/profile`
- Find Partners: Routes to `/meet`
- Accepted: Routes to `/accepted_people`
- Chats: Routes to `/chats`
- Log out: Signs out the user and redirects to `/auth/login`

## Authentication Screens

### Login Screen

**Path:** `/app/auth/login.js` and `/app/auth/Loginin.tsx`

**Implementation:**
- Provides email and password input fields
- Handles Firebase authentication
- Routes to signup page if needed

**Props:** None

### Signup Screen

**Path:** `/app/auth/signup.js` and `/app/auth/SignUpUp.tsx`

**Implementation:**
- Form for user registration with fields for email, password, name, age, gender, and skill level
- Creates user in Firebase Authentication and Firestore
- Redirects to home screen upon successful registration

**Props:** None

## Meet Screen (Find Partners)

**Path:** `/app/meet/index.tsx`

**Implementation:**
- Tinder-like swiping interface to find potential sports partners
- Card-based UI with user details and images
- Animation for swipe left (reject) and swipe right (accept)
- Routes to chat when a user is accepted via right swipe

**States:**
- `profiles`: Array of potential partner profiles
- `currentIndex`: Current profile being shown
- `loading`: Loading state indicator

**Key Features:**
- Filters users based on level preferences
- Sorts based on availability matching
- Animated swipe gestures
- Profile card with user details and photo

## Chats Screens

### Chats List

**Path:** `/app/chats/index.jsx`

**Implementation:**
- Lists all active chats for the current user
- Fetches chat data from Firestore
- Each chat item shows other user's name, last message, and timestamp

**Key Features:**
- Real-time updates
- Integration with Firestore database
- Navigation to individual chat screens

### Single Chat Screen

**Path:** `/app/chats/[id].jsx`

**Implementation:**
- Real-time messaging interface for communicating with another user
- Message input and send functionality
- Message history display
- Creates a new chat if none exists

**Key Features:**
- Real-time message updates with Firestore listeners
- Chat creation for new conversations
- Message bubble UI with sender/receiver distinction

## Profile Screen

**Path:** `/app/profile/index.jsx`

**Implementation:**
- Displays and allows editing of user profile information
- User data is stored in and retrieved from Firestore

## Level Preference Screen

**Path:** `/app/level_preference/index.jsx`

**Implementation:**
- Interface for selecting preferred skill levels for potential partners
- Multiple selection UI with toggle functionality
- Updates preferences in Firestore

**Key Features:**
- MultiSelect buttons for different skill levels
- Persistence of preferences to Firebase
- Visual feedback for selected options

## Opponent Level Screen

**Path:** `/app/opponent_level/index.jsx`

**Implementation:**
- Interface for selecting preferred skill levels for opponents
- Multiple selection UI
- Saves preferences to user profile

## Accepted People Screen

**Path:** `/app/accepted_people/index.jsx`

**Implementation:**
- Lists all people the user has accepted/matched with
- Uses PersonCard component to display user information

## Configuration Screen

**Path:** `/app/configuration/index.jsx`

**Implementation:**
- Settings page for configuring user preferences
- Options for selecting user's own skill level
- Navigation to other preference pages

## Match Screen

**Path:** `/app/match/index.jsx`

**Implementation:**
- Alternative interface for viewing potential matches
- Image-based UI with accept/deny buttons
- Simple matching functionality

**Note:** This appears to be an older/alternative implementation to the Meet screen
