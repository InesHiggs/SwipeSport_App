# Context Providers

This document describes the context providers used in the SwipeSport App for state management across components.

## ChatContext

**Path:** `/app/context/ChatContext.jsx`

**Implementation:**
- Context for managing chat-related state
- Provides selected chat name information to the component tree

**State Variables:**
- `selectedChatName`: Name of the currently selected chat (default: "Home")

**Methods:**
- `setSelectedChatName`: Updates the selected chat name

**Usage Example:**
```jsx
import { useChatContext } from '@/app/context/ChatContext';

function MyComponent() {
  const { selectedChatName, setSelectedChatName } = useChatContext();
  
  return (
    <View>
      <Text>Current chat: {selectedChatName}</Text>
      <Button onPress={() => setSelectedChatName('New Chat')} title="Change Chat" />
    </View>
  );
}
```

**Provider Implementation:**
The ChatProvider component wraps the application (or part of it) to provide access to chat context:

```jsx
import ChatProvider from '@/app/context/ChatContext';

function App() {
  return (
    <ChatProvider>
      {/* App components */}
    </ChatProvider>
  );
}
```

## Other Context Mechanisms

While there's only one explicit context provider in the codebase, the app also leverages other state management approaches:

### Authentication State

Authentication state is managed in the root layout (`/app/_layout.jsx`) using Firebase's `onAuthStateChanged` listener, which manages redirects based on auth status.

### Firebase Integration

Firebase Auth and Firestore are initialized in `FirebaseConfig.ts` and imported throughout the application, providing a form of global state for authentication and data access.
