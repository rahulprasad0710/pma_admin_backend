# PMA Admin — Backend API

A production-ready backend service for the PMA Admin application. Built with TypeScript, Express and TypeORM, this service provides REST APIs for admin features, user / team management, task-status workflows, file uploads, background processing and real-time notifications. The project is containerized with Docker and deployed through a GitHub Actions CI/CD pipeline to AWS EC2.

---

## Table of contents

-   [Overview](#overview)
-   [Key features](#key-features)
-   [Technical stack](#technical-stack)
-   [Architecture & components](#architecture--components)
-   [Notable implementation details](#notable-implementation-details)
-   [Environment variables](#environment-variables)
-   [Local development](#local-development)
-   [Build & run (production)](#build--run-production)
-   [CI / CD and deployment](#ci--cd-and-deployment)
-   [Code references](#code-references)
-   [Contributing](#contributing)
-   [Contact](#contact)
-   [License](#license)

---

## Overview

PMA Admin Backend is a RESTful API service that manages administrative functions such as:

-   Features and feature team membership
-   Task statuses and workflows
-   User / admin management
-   File uploads served via AWS S3 using presigned URLs
-   Background processing for jobs (email, async tasks)
-   Real-time notifications via WebSocket (Socket.io)

The backend emphasizes security (JWT), maintainability (TypeScript + TypeORM), and reliable deployment pipelines (GitHub Actions → Docker → AWS EC2).

---

## Key features

-   REST API built with Express and TypeScript
-   ORM: TypeORM models mapped to PostgreSQL
-   Secure file upload flow using AWS S3 presigned URLs (AWS SDK v3)
-   Background jobs and queues using Bull with Redis
-   Real-time events using Socket.io
-   Authentication with JWT, password hashing with bcryptjs
-   Email delivery via nodemailer / mailersend
-   Containerized Docker images and automated CI/CD using GitHub Actions
-   Basic validation using zod and controlled logging with morgan

---

## Technical stack

-   Node.js + TypeScript
-   Express (API server)
-   TypeORM (data mapping)
-   PostgreSQL (pg)
-   AWS S3 (storage) — @aws-sdk/client-s3, @aws-sdk/s3-request-presigner
-   Redis + Bull (job queue)
-   Socket.io (real-time)
-   JWT, bcryptjs (auth)
-   Docker (containerization)
-   GitHub Actions (CI/CD) → Deploy to AWS EC2
-   Others: multer, nodemailer, mailersend, axios, zod

Packages used are listed in package.json:  
https://github.com/rahulprasad0710/pma_admin_backend/blob/0f0fc48f199afcfc9b3ff8e34e98ea1acbab1e96/package.json

---

## Architecture & components

-   API Layer (Express): Controllers and routes exposing REST endpoints
-   Service Layer: Business logic (e.g., FeatureService)
-   Persistence: TypeORM entities and repositories (Postgres)
-   Storage: AWS S3 for storing assets; server issues presigned URLs to clients
-   Background Jobs: Bull queue processed by worker(s) connected to Redis
-   Real-time: Socket.io server for pushing notifications/events to clients
-   CI/CD: GitHub Actions builds Docker image, pushes registry (or deploys), and uses EC2 to run container(s)

Simple text diagram:
API (Express) → Services → TypeORM → Postgres
↘
→ Redis/Bull (background workers)
API → AWS S3 (signed uploads)
API ↔ Socket.io ↔ Clients

---

## Notable implementation details

-   File uploads / presigned URL:

    -   Uses AWS SDK v3 and s3-request-presigner to generate presigned PUT/GET URLs so clients can upload directly to S3 without exposing credentials.
    -   Example (server-side presign):

-   DB modelling:

    -   Entities (TypeORM) map to core domain models (User, Feature, TaskStatus, FeatureTaskStatus, etc.). Repositories are obtained from dataSource.getRepository(Entity).
    -   Example service reference: FeatureService demonstrates using repositories, relations and upload service:  
        https://github.com/rahulprasad0710/pma_admin_backend/blob/0f0fc48f199afcfc9b3ff8e34e98ea1acbab1e96/src/services/feature.service.ts

-   Background jobs:

    -   Bull queues backed by Redis are used for asynchronous tasks (email sending, long-running operations). This decouples expensive operations from request-response cycle.

-   Auth & security:
    -   JWT tokens, bcrypt hashing for passwords.
    -   Helmet and cors middleware enabled for common protections.
    -   Validation done at controller/service boundaries using zod schemas.

---

## Environment variables

Copy as `.env` (this is an example — do NOT commit secrets):

```
PORT=4000
NODE_ENV=production

DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_USER=your-db-user
DATABASE_PASSWORD=your-db-password
DATABASE_NAME=your-db-name

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxxx
AWS_SECRET_ACCESS_KEY=xxxx
S3_BUCKET_NAME=your-bucket

JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379

# Optional for email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=xxx
SMTP_PASS=xxx
```

---

## Local development

Prerequisites:

-   Node.js (>=18), npm
-   PostgreSQL
-   Redis (for Bull)
-   Docker (optional for local DB/Redis)

Steps:

1. Clone the repo
2. Install dependencies:
    ```
    npm install
    ```
3. Create `.env` using the sample variables above
4. Run migrations or ensure DB tables exist (TypeORM sync or CLI)
5. Start in dev mode:
    ```
    npm run dev
    ```
6. Build and run production:
    ```
    npm run build
    npm start
    ```

Docker:

-   Build image:
    ```
    npm run docker:build
    ```
-   Push / publish as configured in package.json

---

## Build & run (production)

-   Build TypeScript and run:
    ```
    npm run build
    npm start
    ```
-   Dockerized:
    -   Build image and push to your registry; deploy the image to EC2 container runtime (or ECS) as part of CI/CD.

---

## CI / CD and deployment

This repository integrates a GitHub Actions workflow that:

-   Installs dependencies and runs TypeScript build
-   Builds a Docker image
-   Pushes image to Docker registry (if configured)
-   Deploys to an EC2 host (via SSH/commands or by pushing image to a registry that your EC2 instance pulls from)

Workflow file location: `.github/workflows/cicd.yml` (referenced in action logs in the repository run context).

Note: When building inside CI, avoid referencing client-only source paths from server code (e.g., imports to `client/src/...`) — ensure all server imports are local to the server package or moved to a shared package.

---

## Code references

-   package.json (dependencies & scripts):  
    https://github.com/rahulprasad0710/pma_admin_backend/blob/0f0fc48f199afcfc9b3ff8e34e98ea1acbab1e96/package.json
-   Example service (feature service with TypeORM usage & uploads):  
    https://github.com/rahulprasad0710/pma_admin_backend/blob/0f0fc48f199afcfc9b3ff8e34e98ea1acbab1e96/src/services/feature.service.ts
-   Workflow (CI/CD): `.github/workflows/cicd.yml` (see repository for specifics)

---

## Contributing

-   Follow the code style (TypeScript, prefer async/await)
-   Add unit tests where possible and document behavior
-   For shared types between client & server, extract into a shared package or a `common/` directory to avoid cross-package source imports
-   Open a PR and request review; ensure CI passes

---

## Contact

Project maintained by Rahul Prasad — rahulprasad0710 (GitHub). Use issues or PRs for feedback or questions.

---

## License

Specify a license (MIT recommended) — add a LICENSE file to the repo.
