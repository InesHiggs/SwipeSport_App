# Components

This document describes the reusable components used throughout the SwipeSport App.

## App Components

These components are specific to the app's domain and located in the `/app/components/` directory.

### PersonCard

**Path:** `/app/components/PersonCard.jsx`

**Implementation:**
- Card component to display a person's basic information
- Shows profile image, name, level, and age
- Used in Accepted People screen and potentially elsewhere

**Props:**
- `name`: Person's name (string)
- `level`: Skill level (string)
- `age`: Person's age (number)
- `image`: URL to profile image (string, optional)

### MessageBubble

**Path:** `/app/components/MessageBubble.jsx`

**Implementation:**
- Chat bubble component for displaying individual messages
- Different styles for sent vs received messages
- Text content with appropriate styling

**Props:**
- `message`: The message object containing text and sender information
- `currentUserId`: ID of the current user to determine message alignment

### ChatItem

**Path:** `/app/components/ChatItem.jsx`

**Implementation:**
- List item component for the chats list
- Displays avatar, name, preview of last message, and time
- Touchable to navigate to individual chat

**Props:**
- `chat`: Chat object containing id, name, image, lastMessage, and time information

## UI Components

These are more general UI components located in the `/components/` directory.

### ThemedText

**Path:** `/components/ThemedText.tsx`

**Implementation:**
- Text component that adjusts to current theme (light/dark)
- Handles font styles and color scheme adaptations

**Props:**
- `type`: Type of text (title, subtitle, body, etc.)
- `style`: Additional style overrides
- `children`: Text content

### ThemedView

**Path:** `/components/ThemedView.tsx`

**Implementation:**
- View component that adjusts to current theme (light/dark)
- Handles background colors based on color scheme

**Props:**
- `style`: Style overrides
- `children`: Child components

### ExternalLink

**Path:** `/components/ExternalLink.tsx`

**Implementation:**
- Component for external links that open in browser/external app
- Handles proper URL opening

**Props:**
- `href`: URL to open
- `children`: Link content

### Collapsible

**Path:** `/components/Collapsible.tsx`

**Implementation:**
- Collapsible/expandable section component
- Animated transitions for expand/collapse

**Props:**
- `title`: Section title
- `children`: Content to show when expanded
- `initiallyExpanded`: Whether to start expanded

### HapticTab

**Path:** `/components/HapticTab.tsx`

**Implementation:**
- Tab component with haptic feedback on press
- Enhanced touch experience

### ParallaxScrollView

**Path:** `/components/ParallaxScrollView.tsx`

**Implementation:**
- ScrollView with parallax effect on header
- Enhances visual appeal when scrolling

**Props:**
- Standard ScrollView props
- `headerComponent`: Component to display in parallax header
- `parallaxHeight`: Height of the parallax header

### UI Components

**Path:** `/components/ui/`

- **IconSymbol**: Icon components for various platforms (iOS has specific implementation)
- **TabBarBackground**: Background for tab bars with platform-specific implementations
