# Interactive Virtual Tour  [scrubbed version]

### Internal internship project for Accenture (Heerlen, NL) by Polished Studios (@polishedstudios).

This web application is an interactive, gamified virtual tour made with `Node.js`, `React` and `Marzipano`. It was made to be used as an educational tool within Accenture. 

> The general idea is for user to be curious and interact with various interactions, so that they learn information about different topics, and can answer questions with this new knowledge. The user has the freedom to view and switch between any interaction at any time they want. By doing certain actions the user can unlock new interactions and rooms.

### Deployed on https://polishedstudios-virtualtour.herokuapp.com/
<i>Please wait a moment after clicking the link. The app may take up to 1 minute to start up from sleep mode.</i>

## About the virtual tour

![Virtual Tour Screenshot](https://i.imgur.com/pC1JoOz.png)

<br>

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
2. Add example firebase data:

    > Table header is document id.

    collection: `scenes`

    | OS |  |  |
    | -------- | ------- | ------- |
    | **name** | <i>string</i> | Outside |
    | **initialViewParameters** | <i>array (numbers)</i> | 0.25 |
    |  |  | 0 |
    |  |  | 10 |

    | LR |  |  |
    | -------- | ------- | ------- |
    | **name** | <i>string</i> | Living Room |
    | **initialViewParameters** | <i>array (numbers)</i> | -0.4 |
    |  |  | 0.25 |
    |  |  | 0 |

    | BR |  |  |
    | -------- | ------- | ------- |
    | **name** | <i>string</i> | Bathroom |
    | **initialViewParameters** | <i>array (numbers)</i> | -0.31 |
    |  |  | 0.13 |
    |  |  | 10 |
    

    collection: `hotspots`

    | OS-ITEM-1 |  |  |
    | -------- | ------- | ------- |
    | **scene** | <i>string</i> | Outside |
    | **type** | <i>string</i> | item |
    | **yaw** | <i>number</i> | 0.92 |
    | **pitch** | <i>number</i> | -0.045 |
    | **tooltip** | <i>string</i> | Pickup key |
    | **unlockedby** | <i>string</i> | canPickupKey |

    | OS-L-1 |  |  |
    | -------- | ------- | ------- |
    | **scene** | <i>string</i> | Outside |
    | **type** | <i>string</i> | link |
    | **yaw** | <i>number</i> | -0.08 |
    | **pitch** | <i>number</i> | -0.16 |
    | **tooltip** | <i>string</i> | Go inside |
    | **target** | <i>string</i> | Living Room |
    | **unlockedby** | <i>string</i> | key |

    | LR-L-1 |  |  |
    | -------- | ------- | ------- |
    | **scene** | <i>string</i> | Living Room |
    | **type** | <i>string</i> | link |
    | **yaw** | <i>number</i> | 0.54 |
    | **pitch** | <i>number</i> | 0.06 |
    | **tooltip** | <i>string</i> | Go outside |
    | **target** | <i>string</i> | Outside |

    | LR-L-2 |  |  |
    | -------- | ------- | ------- |
    | **scene** | <i>string</i> | Living Room |
    | **type** | <i>string</i> | link |
    | **yaw** | <i>number</i> | -2.435 |
    | **pitch** | <i>number</i> | 0.2 |
    | **tooltip** | <i>string</i> | Go to bathroom |
    | **target** | <i>string</i> | Bathroom |
    | **unlockedby** | <i>string</i> | bathroom |

    | LR-I-1 |  |  |
    | -------- | ------- | ------- |
    | **scene** | <i>string</i> | Living Room |
    | **type** | <i>string</i> | info |
    | **yaw** | <i>number</i> | -0.44 |
    | **pitch** | <i>number</i> | 0.21 |
    | **title** | <i>string</i> | Apple |
    | **info** | <i>array (strings)</i> | `<p>This is an apple. There are various apples...</p>` |
    |  |  | `<img class="image" alt="Info" link="https://i.imgur.com/2qJ91K5.png"/>` |
    |  |  | `<i class="centered">Click the image to view it in a bigger window.</i>` |

    | LR-I-2 |  |  |
    | -------- | ------- | ------- |
    | **scene** | <i>string</i> | Living Room |
    | **type** | <i>string</i> | info |
    | **yaw** | <i>number</i> | 0.172 |
    | **pitch** | <i>number</i> | 0.02 |
    | **title** | <i>string</i> | Fridge |
    | **info** | <i>array (strings)</i> | `<p>This is a fridge.</p>` |
    |  |  | `<p>You can learn more about fridges.</p>` |
    |  |  | `<i>More information about fridges</i><img class="one-link" alt="Info" link="https://i.imgur.com/5hejNL8.png"/>` |
    | **unlockedby** | <i>string</i> | fridge |
    | **size** | <i>string</i> | sm |

    | LR-V-1 |  |  |
    | -------- | ------- | ------- |
    | **scene** | <i>string</i> | Living Room |
    | **type** | <i>string</i> | video |
    | **yaw** | <i>number</i> | -0.78 |
    | **pitch** | <i>number</i> | 0.6 |
    | **title** | <i>string</i> | Apples: History & Nutrition |
    | **info** | <i>array (strings)</i> | `<p>This is a video about the history and nutrition of apples.</p>` |
    |  |  | `<i>Watch video</i><img class="one-link" alt="Video" link="https://www.youtube.com/embed/HD4o26HcHi0"/>` |
    | **size** | <i>string</i> | sm |

    | LR-Q-1 |  |  |
    | -------- | ------- | ------- |
    | **scene** | <i>string</i> | Living Room |
    | **type** | <i>string</i> | question |
    | **yaw** | <i>number</i> | -0.17 |
    | **pitch** | <i>number</i> | 0.04 |
    | **question** | <i>string</i> | What fruit is present in this room? |
    | **answers** | <i>array (strings)</i> | Banana |
    |  |  | Lemon |
    |  |  | Apple |
    | **correctAnswer** | <i>number</i> | 2 |

    | BR-L-1 |  |  |
    | -------- | ------- | ------- |
    | **scene** | <i>string</i> | Bathroom |
    | **type** | <i>string</i> | link |
    | **yaw** | <i>number</i> | 1.76 |
    | **pitch** | <i>number</i> | -0.08 |
    | **tooltip** | <i>string</i> | Go back |
    | **target** | <i>string</i> | Living Room |


3. To run the web application locally: `npm install` & `npm start`
