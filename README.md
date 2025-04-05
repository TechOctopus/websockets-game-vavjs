> [!WARNING]
>
> This repository contains a solution for an assignment in the VAVJS course at FIIT STU. If you are currently enrolled in this course or a similar one, please **do not copy** this code or parts of it and submit it as your own work. Submitting plagiarized work can lead to serious academic consequences according to the university's regulations.
>
> You may use this repository for inspiration or reference _after_ you have completed and submitted your own work, or if you are no longer taking the course. **It is crucial that you develop your own solution to understand the concepts and learn effectively.** The best way to learn is by doing the work yourself.

# Server-Side Game Project

This project was created as an assignment for the **VAVJS_B (Application Development in JavaScript)** course at the **[FIIT STU](https://www.fiit.stuba.sk/en.html?page_id=749)**.

The goal of this assignment was to refactor the previous client-side game into a full-fledged server-side application using Node.js, Express (recommended), and WebSockets, incorporating features like user authentication, persistent scoring, multi-game management, and an admin interface. The application is designed to be run using Docker.

## Assignment Goal

The main objective is to rewrite the previous client-side game into a server-side version with the capability to manage multiple players and game instances.

## Technical Requirements & Constraints

- **Submission Files:**
  - **Required:** `docker-compose.yml`, `package.json`, `index.html`, max 7 `*.js` or `*.json` files (including server code, server-side game logic, client-side game logic).
  - **Optional:** `Dockerfile`, `.dockerignore`.
  - **DO NOT SUBMIT:** Images (`node_modules` will be ignored by `.dockerignore` or should not be included in the archive).
- **File Headers:** Every submitted file (`.html`, `.js`, `.json`, `Dockerfile`, `.yml`) MUST contain a header comment with the author's name.
  - HTML: `<!-- Your Name -->`
  - JS/JSON/Dockerfile/YML: `// Your Name` or `# Your Name` (as appropriate)
- **Execution:**
  - The application MUST start correctly using only `docker-compose build` followed by `docker-compose up`.
  - Solutions requiring any other startup sequence will be graded with 0 points, regardless of functionality.
- **Environment:**
  - Only `node:23.0` or `node:lts` base images are allowed in the Docker setup. Using any other Node.js version will result in 0 points.
- **Networking:**
  - The HTTP server MUST listen on port `8080`.
  - The WebSocket (WS) server MUST listen on port `8082`.
  - Failure to adhere to these ports will result in 0 points.
- **Communication:**
  - The server serves static content (`index.html`, JS files).
  - All other communication (game state updates, interactions) MUST use JSON format.
  - WebSockets (port 8082) are strictly for sending the current game board state from the server to the client. No other data should be sent over WS.
  - Key presses are sent from the client to the server via HTTP requests and processed server-side.
- **Frameworks/Libraries:**
  - **Recommended:** `Express`
  - **Required:** `ws`, `fetch` (or native Node fetch)
  - **Forbidden:** `React`, `Angular`, `Vue`, `socket.io`, `html2json`, and similar high-level frameworks/libraries that abstract core functionalities required by the assignment. If unsure about a library, consult the instructor.

## Detailed Tasks

| No. | Done | Task                                                                                                                 | Points |
| --- | ---- | -------------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | x    | Rewriting the original game into a server-side solution                                                              | 1      |
| 2   | x    | Sending key presses to the server and processing them server-side via HTTP                                           | 1      |
| 3   | x    | Returning only the current game board from the server via WebSockets and rendering it using Canvas                   | 1      |
| 4   | x    | Option to select a ship image, remembering the choice for the logged-in user                                         | 1      |
| 5   | x    | Server-side storage of max score for logged-in and anonymous users                                                   | 1      |
| 6   | x    | Displaying current and best scores from the server (per user/session)                                                | 1      |
| 7   | x    | Allowing multiple independent games in parallel (at least 1000)                                                      | 1      |
| 8   | x    | User registration (email, login, password + confirmation) and login on the page                                      | 1      |
| 9   | x    | Session sharing between backend (server) and frontend (browser)                                                      | 1      |
| 10  | x    | Admin interface displaying a table of registered users with the option to delete a user (admin only)                 | 1      |
| 11  | x    | Displaying a list of currently played games (username/null) with the option for all users to spectate                | 1      |
| 12  | x    | Import and export of user data (name, email, password, max score, max speed) in CSV format (admin user "admin" only) | 1      |
| 13  | x    | Using an object-oriented representation for the page structure (inspired by the JSON example)                        | 1      |
| 14  | x    | Server returns static content; all other communication (board, interaction) uses JSON                                | 1      |
| 15  | x    | Input validation (email format, login format, password requirements)                                                 | 1      |
|     |      | **SUM**                                                                                                              | **15** |

## Specific Implementation Details

- **Admin User:** Default credentials are `login: admin`, `password: admin`.
- **Input Validation:**
  - **Email:** Must be unique and match a basic format like `string@string.domain` (e.g., `a@b.co`).
  - **Login:** Must be unique, contain only letters (`[a-zA-Z]`). Anonymous users represented as `"[N/A]"`.
  - **Password:** Must be stored hashed on the server.
- **Page Structure Inspiration (Object Representation):**
  ```json
  [
    {
      "tag": "div",
      "id": "id1",
      "innerTags": [
        {
          "tag": "p",
          "innerText": "Lorem ipsum"
        },
        {
          "tag": "button",
          "id": "register",
          "innerText": "Click me"
        }
      ]
    }
  ]
  ```
- **Base `index.html` Structure:**
  ```html
  <!-- Your Name -->
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <!-- Add other meta tags or links if necessary -->
      <title>VAVJS Server-Side Game</title>
      <!-- Example Title -->
    </head>
    <body>
      <!-- Content will be generated by client.js -->
    </body>
    <script src="client.js"></script>
    <!-- Load your client-side script -->
  </html>
  ```

## How to Run the Project

```bash
# Clone the repository
git clone https://github.com/TechOctopus/websockets-game-vavjs
cd websockets-game-vavjs
# Build and run the Docker containers
docker-compose build
docker-compose up
# Access the application in your web browser
http://localhost:8080
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
