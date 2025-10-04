# 🗺️ TripGraph - AI-Powered Graph-Based Trip Planner

TripGraph is an intelligent, graph-powered trip planning system that creates optimized, time-aware travel itineraries. By leveraging advanced graph algorithms and AI, TripGraph generates feasible daily schedules that respect real-world constraints like opening hours, travel times, walking limits, and user preferences.

[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4)](https://lovable.dev)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

TripGraph transforms trip planning from a tedious manual process into an intelligent, automated experience. Users simply provide their destination, travel dates, budget, pace preferences, and interests. TripGraph then:

1. **Builds a dynamic city graph** - Maps out points of interest with real-time data including opening hours, travel times, and connections
2. **Generates optimized itineraries** - Creates day-by-day schedules that maximize experiences while respecting constraints
3. **Provides intelligent reasoning** - Explains why each stop was chosen and how it fits into the overall plan
4. **Enables flexible modifications** - Allows users to swap any activity with a single tap, maintaining itinerary feasibility

Perfect for travelers who want personalized, realistic itineraries without the hassle of manual planning.

---

## ✨ Key Features

### 🧠 Intelligent Planning
- **AI-Powered Recommendations** - Leverages Google Gemini 2.5 Flash for natural language understanding and smart suggestions
- **Context-Aware** - Remembers conversation history and trip details throughout the planning session
- **Adaptive Itineraries** - Adjusts plans based on user pace (relaxed, moderate, fast) and interests

### 📊 Graph-Based Architecture
- **City Knowledge Graph** - Represents destinations as interconnected nodes with metadata
- **Time-Aware Routing** - Considers opening hours, closing times, and optimal visit durations
- **Travel Time Calculations** - Uses real geolocation data to compute accurate transit times
- **Constraint Satisfaction** - Ensures walking limits, budget, and schedule feasibility

### 🎨 Modern User Experience
- **Real-Time Streaming** - Chat responses stream token-by-token for immediate feedback
- **Visual Itineraries** - Beautiful HTML-rendered daily schedules with maps and timelines
- **Interactive Graphs** - Mermaid diagrams visualizing trip structure and flow
- **Tabbed Interface** - Organized view of itinerary, visual graph, and explanations
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

### 🔄 Dynamic Modifications
- **One-Tap Swaps** - Replace any activity while maintaining schedule integrity
- **Real-Time Updates** - Instant recalculation of affected time blocks
- **Persistent State** - Conversation and trip data saved locally across sessions

---

## 🏗️ Architecture

TripGraph follows a modern, decoupled architecture:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React UI      │────▶│   n8n Workflow   │────▶│  External APIs  │
│  (Frontend)     │     │   (Orchestration)│     │  (Gemini, Geo)  │
│                 │◀────│                  │◀────│                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
      │                         │
      │                         │
      ▼                         ▼
┌─────────────────┐     ┌──────────────────┐
│  localStorage   │     │  State Machine   │
│  (Persistence)  │     │  (Memory)        │
└─────────────────┘     └──────────────────┘
```

### Components

1. **Frontend (React + TypeScript)**
   - User interface and interaction layer
   - Chat interface with streaming responses
   - Local state management and persistence
   - Responsive UI components (shadcn/ui)

2. **Backend Orchestration (n8n)**
   - Workflow automation and business logic
   - AI model integration (Google Gemini)
   - API coordination and data processing
   - State management and memory

3. **External Services**
   - **Google Gemini 2.5 Flash** - Natural language processing and itinerary generation
   - **OpenMeteo Geocoding API** - Location data and coordinates
   - **Mermaid Live Editor** - Graph visualization rendering

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible component library
- **Lucide React** - Icon system
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching

### Backend / Integration
- **n8n** - Workflow automation platform
- **Google Gemini 2.5 Flash** - AI language model
- **OpenMeteo Geocoding API** - Geolocation services

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Git** - Version control

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **bun** - Package manager
- **Git** - Version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tripgraph.git
   cd tripgraph
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Configure environment**
   
   The n8n webhook endpoint is already configured in the codebase. If you need to change it, update the URL in `src/components/ChatInterface.tsx`:
   ```typescript
   const response = await fetch("https://aliassaad1.app.n8n.cloud/webhook/plan", {
     // ...
   });
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to see TripGraph in action!

---

## 📖 Usage Guide

### Planning Your First Trip

1. **Start a Conversation**
   - Type your destination: "I want to visit Paris"
   - TripGraph will greet you and start gathering information

2. **Provide Trip Details**
   - Dates: "May 15-20, 2025"
   - Budget: "$1500"
   - Pace: "Moderate pace"
   - Interests: "Art museums, local cuisine, historical sites"

3. **Review Your Itinerary**
   - View the generated day-by-day schedule
   - Check the visual graph showing trip structure
   - Read AI explanations for each recommendation

4. **Make Adjustments**
   - Request changes: "Swap the Louvre visit with Musée d'Orsay"
   - Add activities: "Include a Seine river cruise"
   - Modify pace: "Make day 3 more relaxed"

### Chat Interface Features

- **Streaming Responses** - Watch AI responses appear in real-time
- **Message History** - All conversations are saved locally
- **Context Awareness** - TripGraph remembers your preferences throughout the session
- **Tabbed Views** - Switch between itinerary, graph, and explanations

---

## 📁 Project Structure

```
tripgraph/
├── src/
│   ├── components/
│   │   ├── ChatInterface.tsx      # Main chat component with streaming
│   │   └── ui/                    # shadcn/ui components
│   ├── pages/
│   │   ├── Index.tsx              # Home page
│   │   └── NotFound.tsx           # 404 page
│   ├── hooks/
│   │   ├── use-mobile.tsx         # Mobile detection hook
│   │   └── use-toast.ts           # Toast notification hook
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Global styles and design tokens
│   └── vite-env.d.ts              # Vite type definitions
├── public/
│   ├── robots.txt                 # SEO robots file
│   └── favicon.ico                # App favicon
├── workflow.json                  # n8n workflow configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

---

## 🔌 API Integration

### n8n Workflow

TripGraph uses an n8n workflow for backend orchestration. The workflow handles:

1. **Input Processing** - Normalizes and validates user messages
2. **State Management** - Maintains conversation context and trip data
3. **Information Extraction** - Uses AI to extract structured trip details
4. **Completeness Checking** - Validates if enough info exists to plan
5. **Geocoding** - Fetches location coordinates and metadata
6. **Itinerary Generation** - Creates optimized daily schedules
7. **Visualization** - Generates Mermaid graphs and explanations
8. **Response Formatting** - Returns structured HTML/JSON responses

### Webhook Endpoint

**URL:** `https://aliassaad1.app.n8n.cloud/webhook/plan`

**Method:** `POST`

**Request Body:**
```json
{
  "text": "User message text",
  "accumulatedText": "All previous context"
}
```

**Response Format:**
The API streams back HTML content with tabbed sections containing:
- Daily itinerary with timeline
- Visual Mermaid graph
- AI-generated explanations

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use semantic commit messages
- Ensure responsive design for all components
- Test on multiple browsers and devices
- Update documentation for new features

---

## 📄 License

This project is built with [Lovable](https://lovable.dev/projects/d86bc005-cdf1-4a79-b410-404cf4215e75).

---

## 🙏 Acknowledgments

- **n8n** - For the powerful workflow automation platform
- **Google Gemini** - For advanced AI capabilities
- **shadcn/ui** - For beautiful, accessible components
- **Lovable** - For the rapid development platform

---

**Made with for travelers who deserve better planning tools**
