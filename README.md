# Interactive Virtual Tour  [scrubbed version]

### Internal internship project for Accenture (Heerlen, NL) by Polished Studios (@polishedstudios).

This web application is an interactive, gamified virtual tour made with `Node.js`, `React` and `Marzipano`. It was made to be used as an educational tool within Accenture. 

> The general idea is for user to be curious and interact with various interactions, so that they learn information about different topics, and can answer questions with this new knowledge. The user has the freedom to view and switch between any interaction at any time they want. By doing certain actions the user can unlock new interactions and rooms.

The user can `interact` with different types of `spots` throughout the room, these are:

- Link spots (navigate between rooms).
- Information spots (opens a box with information).
- Video spots (opens a box with short information wherein you can open a video).
- Question spots (opens a dialog window wherein you can answer a question).
- Item spots (each item will have its own spot).

Information boxes for information and videos are fully customizable with html code.

<br>

This virtual tour also has `gamification` elements.

Actions the user can take to trigger events:

- Clicking on a specific interactive spot (e.g. pickup item).
- Answering a specific question correct.
- Achieving a certain score (per room or total).
- Closing a video.

These actions can `unlock` new interactive spots, rooms and items.

## Remarks
- <i>Desktop responsiveness only.</i>
- <i>LocalStorage is used to remember the user. Secure sessions were not in the scope.</i>
<br>

## Setup for self-use
1. Add `.env` file to root directory with the following variables from your Firebase config:
    - REACT_APP_FIREBASE_API_KEY
    - REACT_APP_FIREBASE_AUTH_DOMAIN
    - REACT_APP_FIREBASE_PROJECT_ID
    - REACT_APP_FIREBASE_STORAGE_BUCKET
    - REACT_APP_FIREBASE_MESSAGE_SENDER_ID
    - REACT_APP_FIREBASE_APP_ID
2. Add firebase data: [coming soon].
3. To run the web application locally: `npm install` & `npm start`