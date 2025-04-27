## **Sports Player Matching App UI Design Description**

This document outlines the user interface design, color theme, typography, UI elements, and interactions for the sports player matching application, "Swipesport". The design aims for a minimal aesthetic with a distinct accent color and intuitive interactions.

### **1\. UI Layout**

The application utilizes a tab-based navigation structure for the main functionalities, accessible via a translucent bottom navigation bar.

**1.1. Main Navigation:**

* **Navigation Bar:** Translucent bottom navigation bar present across the main sections of the app.  
* **Tabs:** Three primary tabs:  
  * **Meet (Default):** The initial landing page for discovering potential sports partners.  
  * **Messages:** Access to user conversations.  
  * **Profile:** User's personal profile settings and information.

**1.2. Login/Registration Pages:**

* **Background:** White background with two blurred "blurbs" as background elements.  
  * A larger blurred blurb of grass green covering approximately 40% of the screen.  
  * A smaller blurred blurb of parrot green.  
* **Form Elements:** Clean, minimal textboxes for input fields.  
* **Buttons:** Fully rounded buttons for "Login" and "Register", following the Material You design language.

**1.3. Main Content Area (Meet Tab):**

* **Clean UI:** The central area is dedicated to displaying player cards with minimal clutter.  
* **Player Cards:** Moderately rounded cards occupying the majority of the space above the navigation bar, designed for swiping interactions.

### **2\. Color Theme**

The application's color theme is minimal with a strong accent color inspired by grass and parrot green.

* **Primary Accent Color:** A vibrant green, positioned between grass green and parrot green. This color is used for interactive elements, active tab indicators, and the background blurbs on the login/registration pages. (Specific Hex Code to be defined \- *Suggestion: \#4CAF50 or similar vibrant green*).  
* **Backgrounds:** Predominantly white or very light grey for main content areas to maintain a clean and minimal feel.  
* **Text:** Dark grey or black for primary text, ensuring readability against light backgrounds.  
* **Inactive Elements:** Subtle grey or desaturated versions of the accent color for inactive navigation icons and other non-interactive elements.

### **3\. Typography**

The application utilizes two distinct font families to create visual hierarchy and brand identity.

* **App Title ("Swipesport"):** Playfair Display, used prominently in the translucent navigation bar.  
* **All Other UI Text:** Inter, used for all body text, labels, buttons, and headings throughout the application. This provides a clean and modern feel.

### **4\. UI Elements**

* **Navigation Bar Icons:** Minimal and clean icons representing "Meet", "Messages", and "Profile". The active icon is highlighted with the primary accent color.  
* **Buttons:** Fully rounded buttons, inspired by Material You, with a solid fill of the accent color for primary actions (e.g., Login, Register, potentially call-to-action buttons within the app). Secondary buttons may have an outline with the accent color.  
* **Textboxes:** Clean, minimal design with subtle borders or underlines.  
* **Player Cards:** Moderately rounded rectangular cards containing player information.

### **5\. Interactions**

* **Navigation:** Tapping on a navigation bar icon transitions the user to the corresponding section (Meet, Messages, or Profile) with a smooth animation. The active tab icon and text change to the accent color.  
* **Login/Registration:** Users interact with textboxes for input and tap the rounded buttons to submit their credentials or register.  
* **Player Card Swiping (Meet Tab):**  
  * Users can swipe a player card to the left to indicate disinterest ("Nope").  
  * Users can swipe a player card to the right to indicate interest ("Like").  
  * A visual Большой (large) and distinct feedback mechanism (e.g., a temporary icon or color change) should indicate the direction of the swipe and the resulting action (Like or Nope).  
  * Upon swiping, the next player card is presented in the center of the screen with a suitable transition animation.  
* **Button Interaction:** Buttons provide visual feedback upon being pressed (e.g., a slight change in color or a ripple effect).

