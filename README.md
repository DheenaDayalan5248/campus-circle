# CampusCircle

CampusCircle is a social media platform designed exclusively for college students. It provides a space for students to connect, share their experiences, and build a vibrant campus community.

## Features

*   **User Authentication:** Secure user registration and login system.
*   **Create and Share Posts:** Users can create posts with text and images to share with their campus community.
*   **News Feed:** A personalized news feed to view posts from connected users and groups.
*   **Like and Comment:** Interact with posts by liking and commenting on them.
*   **User Profiles:** View and manage user profiles with profile pictures, bios, and posts.

## Tech Stack

### Frontend

*   **React:** A JavaScript library for building user interfaces.
*   **React Router:** For declarative routing in the React application.
*   **Axios:** A promise-based HTTP client for making API requests.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.

### Backend

*   **Node.js:** A JavaScript runtime environment for server-side development.
*   **Express:** A fast, unopinionated, minimalist web framework for Node.js.
*   **MongoDB:** A NoSQL database for storing application data.
*   **Mongoose:** An object data modeling (ODM) library for MongoDB and Node.js.
*   **JSON Web Tokens (JWT):** For securing and authenticating API endpoints.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js and npm
*   MongoDB

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/campuscircle.git
    ```
2.  Install all dependencies for both the frontend and backend:
    ```bash
    npm run install-all
    ```

### Running the Application

1.  Start the backend server:
    ```bash
    npm run backend
    ```
2.  In a separate terminal, start the frontend development server:
    ```bash
    npm run frontend
    ```
3.  (Optional) To seed the database with sample data, run:
    ```bash
    npm run seed
    ```

## Project Structure

This project is a monorepo with the frontend and backend code separated into their own directories.

*   `frontend/`: Contains the React application.
*   `backend/`: Contains the Express.js server and API.
