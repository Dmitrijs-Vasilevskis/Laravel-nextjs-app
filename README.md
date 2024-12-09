# Laravel-Next.js Real-Time Web Application

## Project Overview

This project is a real-time web application built with **Laravel** (backend) and **Next.js** (frontend). It leverages the **Laravel Reverb** package to implement WebSocket protocols, enabling dynamic synchronization and interaction among users. The key features include synchronized YouTube video playback, live chat, friend management, and private messaging.

---

## Features

### 1. **Synchronized YouTube Video Playback**
- Multiple users in the same room can watch YouTube videos in sync.
- Actions such as play, pause, or seek are mirrored across all participants.

### 2. **Live Chat**
- Real-time chat functionality within the room.
- Users can interact and communicate during video playback.

### 3. **Friend Management**
- Add users from the chat to your friend list.
- Manage and track connections within the app.

### 4. **Direct Messaging**
- Private messaging for users on your friend list.
- Secure and instant communication outside the chat room.

---

## Tech Stack

### Backend
- **Laravel**
  - API and WebSocket backend.
  - Uses the **Laravel Reverb** package for WebSocket communication.
  - Endpoints for user management, session handling, and chat functionality.

### Frontend
- **Next.js**
  - Modern and responsive user interface.
  - Integrates with the backend via RESTful APIs and WebSocket protocols.

### Real-time Communication
- **Laravel Reverb**
  - Implements WebSocket protocol for real-time synchronization and messaging.

