# SwipeSport App Documentation

This documentation describes the components and structure of the SwipeSport App, a React Native application built with Expo for finding sports partners based on skill level, availability, and preferences.

## Table of Contents

1. [Introduction](#introduction)
2. [App Structure](#app-structure)
3. [Pages/Screens](#pagesscreens)
4. [Components](#components)
5. [Context Providers](#context-providers)
6. [Navigation Flow](#navigation-flow)

## Introduction

SwipeSport is a mobile application that allows users to find sports partners (specifically tennis players) based on their skill level, availability, and preferences. The app uses a swipe-based interface similar to dating apps to connect users with potential sports partners.

## App Structure

The application follows the Expo Router file-based routing system, where each file or directory in the `app` folder represents a route in the application. Layout files (`_layout.jsx` or `_layout.tsx`) define the navigation structure for each section.

```
app/
  ├── _layout.jsx                      # Root layout (handles authentication routing)
  ├── index.jsx                        # Home screen
  ├── auth/                            # Authentication screens
  ├── (tabs)/                          # Tab navigation (not currently used)
  ├── accepted_people/                 # Accepted partners screen
  ├── chats/                           # Chat related screens
  ├── components/                      # App-specific UI components
  ├── configuration/                   # Configuration screens
  ├── context/                         # Context providers 
  ├── level_preference/                # Level preference settings screen
  ├── match/                           # Match screen (showing potential partners)
  ├── meet/                            # Meet screen (swiping interface)
  ├── opponent_level/                  # Opponent level preference screen
  └── profile/                         # User profile screen
```
