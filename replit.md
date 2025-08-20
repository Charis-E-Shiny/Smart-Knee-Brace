# Knee Brace Health Monitoring System

## Overview

This is a comprehensive health monitoring application designed for smart knee braces. The system tracks patient activity, exercise sessions, fall detection, and provides real-time health insights. It features a React frontend with TypeScript, an Express.js backend, and PostgreSQL database with Drizzle ORM for data persistence. The application is built for medical professionals and patients to monitor knee rehabilitation progress and ensure patient safety through continuous monitoring.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom medical-themed color palette
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **Build Tool**: Vite for fast development and optimized production builds
- **Charts**: Recharts for data visualization and health metrics

The frontend is structured as a single-page application with a fixed sidebar navigation and multiple pages for different health monitoring aspects (dashboard, exercises, step tracking, alerts, reports, settings).

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API endpoints for sensor data, exercises, fall detection, and alerts
- **Middleware**: Custom logging middleware for API request tracking
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Validation**: Zod schemas for request validation and type safety

The backend follows a modular structure with separate route handlers and storage abstraction layer for database operations.

### Data Storage Solutions
- **Database**: PostgreSQL with connection through Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle migrations for database schema versioning
- **Connection Pooling**: Built-in connection management through Neon serverless

### Database Schema Design
The system includes comprehensive health monitoring tables:
- **Users**: Patient authentication and profile management
- **Sensor Data**: Real-time knee brace metrics (step count, flexion/extension angles, stability scores, battery levels)
- **Exercises**: Predefined rehabilitation exercises with targets
- **Exercise Sessions**: Patient exercise tracking with progress metrics
- **Fall Detections**: Fall incident recording with severity levels and confirmation status
- **Alerts**: System notifications for various health and device events
- **Daily Stats**: Aggregated daily health metrics for trend analysis

### Authentication and Authorization
The system implements a session-based authentication approach with PostgreSQL session storage using connect-pg-simple middleware, though the current implementation focuses on the core health monitoring features.

### Real-time Health Monitoring Features
- **Sensor Data Processing**: Continuous monitoring of knee movement, stability, and device status
- **Fall Detection System**: Automatic fall detection with severity assessment and emergency response protocols
- **Exercise Tracking**: Progress monitoring for rehabilitation exercises with completion tracking
- **Alert Management**: Comprehensive notification system for health events, device issues, and emergency situations
- **Health Analytics**: Trend analysis and progress reporting for medical professionals

### Development and Deployment
- **Development**: Hot module replacement with Vite for fast iteration
- **Production Build**: Optimized bundling with separate client and server builds
- **Environment**: Configured for Replit deployment with specialized plugins
- **Type Safety**: Full TypeScript implementation across frontend, backend, and shared schemas