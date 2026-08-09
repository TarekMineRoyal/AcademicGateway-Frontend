# 🎓 AcademicGateway-Frontend

> Single Page Application (SPA) user interface and web client for the [AcademicGateway](https://github.com/TarekMineRoyal/AcademicGateway) platform.

`AcademicGateway-Frontend` is built with **React 19**, **Vite**, **Tailwind CSS**, and **TanStack React Query**. It provides a responsive interface connecting students, academic faculty, industry project providers, reviewers, tech support, and system administrators.

---

## 🏗 Architecture Highlights

### 🌐 System Integration
This client serves as the user-facing entry point for the platform ecosystem:
* **AcademicGateway-Frontend (This Repo):** Renders role-based web dashboards, interactive project workflow graphs, authentication forms, and profile management screens.
* **AcademicGateway-Backend:** Serves REST API endpoints, issues JWT tokens, handles business logic, and orchestrates semantic queries with [AcademicGateway-AI](https://github.com/TarekMineRoyal/AcademicGateway-AI).

Key architectural features in this service include:

* **React 19 & Vite Engine:** Uses React 19 for component rendering paired with Vite for instant module reloading (HMR) and optimized production bundlings.
* **TanStack Query State Management:** Manages server state caching, background revalidation, and global authentication error interception (`QueryCache`/`MutationCache`) to automatically purge expired JWTs and trigger login redirects.
* **Resilient API Client:** Centralized Axios instance (`apiClient.js`) configured with request timeout rules, automatic Bearer token headers, and automated key casing transformations (`PascalCase`/`snake_case` API payloads into `camelCase` JS objects).
* **Domain Feature Slices:** Modular architecture separating UI logic into self-contained domain features (`curriculum`, `identity`, `professor`, `provider`, `skills`, `student`).
* **Interactive DAG Workflow Rendering:** Integrates `@xyflow/react` and `@dagrejs/dagre` to visualize complex project milestones, execution strategies, and dynamic project graphs.
* **Role-Based Security & Routing:** React Router configuration supporting six distinct user personas (`Administrator`, `Reviewer`, `Student`, `Provider`, `Professor`, `TechSupport`) guarded by route protection wrappers.

---

## 📂 Project Structure

```text
AcademicGateway-Frontend/
├── public/                  # Static web assets and SVG icon sprites
├── src/                     # Application source code
│   ├── config/              # Persona navigation rules and role constants
│   ├── context/             # React authentication and global state contexts
│   ├── features/            # Encapsulated domain feature slices (identity, student, professor, etc.)
│   ├── layouts/             # Top-level workspace shell and container layouts
│   ├── pages/               # Main application route page views
│   ├── routes/              # React Router setup, protected route guards, & public routes
│   ├── shared/              # Reusable UI widgets, API client, & custom hooks
│   ├── App.jsx              # Core application provider hierarchy
│   ├── index.css            # Global styles & Tailwind CSS directives
│   └── main.jsx             # React DOM root entry point
├── legacy/                  # Legacy feature modules maintained during architecture transition
├── .env                     # Local environment settings
├── eslint.config.js         # ESLint configuration & feature boundary enforcement rules
├── index.html               # HTML entry point document
├── package.json             # Node dependencies and build scripts
└── vite.config.js           # Vite bundler, path aliases, & test runner configuration
```

---

## ⚙️ Prerequisites & Setup

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher
* **AcademicGateway-Backend**: Running instance accessible over network/localhost (default backend runs at `https://localhost:7053`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/TarekMineRoyal/AcademicGateway-Frontend.git](https://github.com/TarekMineRoyal/AcademicGateway-Frontend.git)
   cd AcademicGateway-Frontend
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the project root directory (see [Configuration](#-configuration)).

---

## 🎛 Configuration

Environment settings are managed using Vite variables prefixed with `VITE_`:

| Environment Variable | Description | Default Value |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL pointing to the `AcademicGateway-Backend` REST API | `https://localhost:7053/api` |

---

## 🚀 Running the Application

### Local Development Server
Start the Vite development server with hot module replacement:

```bash
npm run dev
```

The application will launch locally at `http://localhost:5173`.

---

## 📦 Production & Containerization

### Building for Production
To generate optimized static production assets:

```bash
npm run build
```

Preview the production build output locally:

```bash
npm run preview
```

### Docker Setup (Nginx Web Server)
For containerized deployments using Nginx:

```dockerfile
# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build Docker image
docker build -t academicgateway-frontend .

# Run Container
docker run -d -p 80:80 --name gateway-frontend academicgateway-frontend
```

---

## 🧪 Running the Test Suite

The test suite uses **Vitest** and **React Testing Library**.

Execute the test commands:

```bash
# Run unit & integration tests once
npm run test:run

# Run tests in watch mode
npm test

# Generate code coverage report
npm run test:coverage

# Run ESLint style and feature boundary verification
npm run lint
```

---

## 🔗 Related Repositories

| Repository | Description |
| :--- | :--- |
| **[AcademicGateway](https://github.com/TarekMineRoyal/AcademicGateway)** | Master documentation hub and system architecture blueprints. |
| **[AcademicGateway-Backend](https://github.com/TarekMineRoyal/AcademicGateway-Backend)** | Primary web application, business logic, and relational backend API. |
| **[AcademicGateway-Frontend](https://github.com/TarekMineRoyal/AcademicGateway-Frontend)** | User Web Application & UI client *(this repository)*. |
| **[AcademicGateway-AI](https://github.com/TarekMineRoyal/AcademicGateway-AI)** | Vector search and semantic matchmaking microservice. |

---

## 🌐 Project Ecosystem

This frontend service is one component of the broader **AcademicGateway** platform:

| Repository | Role | Direct Connection to this Service? |
| :--- | :--- | :--- |
| **[AcademicGateway-Backend](https://github.com/TarekMineRoyal/AcademicGateway-Backend)** | Core API & Business State | **Yes** — Consumes REST endpoints for authentication, data workflows, and domain management. |
| **[AcademicGateway-Frontend](https://github.com/TarekMineRoyal/AcademicGateway-Frontend)** | User Web Application | *(This repository)* |
| **[AcademicGateway-AI](https://github.com/TarekMineRoyal/AcademicGateway-AI)** | Vector Search Microservice | **Indirect** — Communicates through backend API orchestrations for recommendations. |
