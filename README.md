# SunWind Analytics – Backend Service

SunWind Analytics is a **production-grade backend service** designed for a solar energy monitoring, analytics, and billing platform.  
It provides secure, scalable APIs for energy data processing, automated billing, Stripe-based payments, anomaly detection, and weather-aware analytics.

The system is built using **TypeScript** and follows **Clean Architecture principles** to ensure long-term maintainability, testability, and clear separation of concerns.

---

## 🌐 Live Services

- **Backend API**  
  https://sunwind-analytics-backend-1.onrender.com

- **Energy Data API (Self-Hosted)**  
  https://sunwind-analytics-data-api-1.onrender.com

- **Frontend Application**  
  https://sunwind-analytics-frontend.netlify.app

---

## 🎯 Backend Responsibilities

This service is responsible for:

- Synchronizing solar energy generation data
- Managing users and solar units
- Performing energy analytics
- Generating and managing invoices
- Processing payments via Stripe
- Detecting anomalies in energy production
- Providing weather context for solar performance
- Securing APIs with authentication and authorization
- Running automated background processes

---

## 🏗️ System Architecture

The backend is structured using **Clean Architecture**, separating business logic from frameworks and external services.

| Layer | Responsibility |
|------|---------------|
| **Presentation Layer** | Handles HTTP requests, Express routes, controllers, and request validation |
| **Application Layer** | Contains use cases, business workflows, and application services |
| **Domain Layer** | Defines core business entities and domain rules |
| **Infrastructure Layer** | Implements database access, Stripe integration, external APIs, and schedulers |



### Architectural Benefits
- Framework-independent business logic
- Easier testing and refactoring
- Clear ownership of responsibilities
- Scalable feature development

---

## 🧪 Technology Stack

### Core
- **Node.js**
- **TypeScript**
- **Express.js**

### Database
- **MongoDB**
- **Mongoose**

### Authentication & Security
- **Clerk** (JWT-based authentication)
- Role-based access control

### Payments & Billing
- **Stripe Embedded Checkout**
- **Stripe Webhooks** (server-verified payment confirmation)

### External Integrations
- **Open-Meteo API** – weather data
- **Self-Hosted Data API** – energy generation records

### Background Processing
- **Cron-based schedulers**
- Automated invoice generation
- Periodic data synchronization
- Anomaly detection jobs

### Hosting
- **Render** (Backend services)

---

## 🗄️ Database Design

The backend uses **MongoDB** with a schema optimized for time-series data and billing accuracy.

### Core Collections

- **Users**
    - Application users mapped to authentication provider
- **SolarUnits**
    - Installed solar systems
- **EnergyGenerationRecords**
    - Time-series energy production data
- **Invoices**
    - Monthly billing records with payment state
- **Anomalies**
    - Detected irregular energy patterns

Each collection is designed to support **analytics, billing, and historical analysis** efficiently.

---

## 🔁 Background Jobs & Automation

The backend runs scheduled jobs to automate operational workflows.

### Energy Data Synchronization
- Pulls generation data from the Data API
- Normalizes and stores records
- Ensures consistent time-series data

### Invoice Generation
- Automatically generates monthly invoices
- Billing cycles anchored to installation date
- Calculates energy usage per billing period

### Anomaly Detection
- Analyzes historical energy data
- Detects sudden drops, prolonged low output, and abnormal spikes
- Stores anomalies with severity and resolution state

---

## 💳 Billing & Payment Flow

1. Monthly invoice is generated automatically
2. User initiates payment from the frontend
3. Backend creates a Stripe Checkout Session
4. Stripe handles secure payment processing
5. Stripe Webhook notifies backend of payment result
6. Invoice status is updated in the database

✔️ Payment state is **never trusted from the frontend**  
✔️ Stripe webhooks are the single source of truth

---

## 🔐 API Security Model

- Token-based authentication using Clerk
- Protected routes require valid JWT
- Users can only access their own resources
- Admin-level endpoints are role restricted

---

## 🔗 API Overview

### Invoices
GET /api/invoices
GET /api/invoices/:id


### Payments
POST /api/payments/create-checkout-session
POST /api/stripe/webhook


### Weather
GET /api/weather/current


### Anomalies
GET /api/anomalies
GET /api/anomalies/trend



---

## ⚙️ Environment Configuration

The backend is configured using environment variables:

```env
MONGODB_URI=

CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SIGNING_SECRET=

DATA_API_URL=

STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=

FRONTEND_URL=
FRONTEND_URL_LOCAL=

PORT=
SYNC_CRON_SCHEDULE=
INVOICE_CRON_SCHEDULE=
