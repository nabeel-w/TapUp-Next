# TapUp: A Smart File Upload and Tagging Platform

## Overview

TapUp is an innovative file upload and tagging platform designed to tackle the challenges of data overload. By combining cutting-edge AI and NLP models with seamless cloud integration, TapUp simplifies file organization, retrieval, and management for both individuals and enterprises.

----------

## Key Features

### 1. **File Management**

-   Drag-and-drop or manual file uploads supporting multiple formats (documents, images, videos, etc.).
-   Organize files into folders, collections, or custom categories.

### 2. **Automated Tagging**

-   AI-driven tagging using **KeyBERT** for consistent and accurate metadata generation.

### 3. **Advanced Search**

-   Locate files using tags, metadata, and keywords.
-   Filtering options for refined search results based on criteria like date, file type, or tags.

### 4. **Version Control**

-   Track file changes, experiment with branching, and merge updates efficiently.

### 5. **Cloud Integration**

-   Seamless integration with **Google Cloud Storage**, with plans for AWS S3 and Azure Blob.
-   Event-driven design using **Google Pub/Sub** for real-time processing.

### 6. **Secure Authentication**

-   OAuth-based authentication using **NextAuth**.
-   Role-based access control for files and administrative tasks.

----------

## Technology Stack

### **Frontend**

-   **Framework**: Next.js (TypeScript)
-   **State Management**: React Context
-   **Styling**: Tailwind CSS
-   **Authentication**: NextAuth.js

### **Backend**

-   **Serverless Architecture**: Google Cloud Run and Pub/Sub
-   **AI Models**: KeyBERT for tagging, LlamaParser for document parsing
-   **Containerization**: Docker for consistent runtime environments

### **Database and Caching**

-   **Primary Storage**: Neon PostgreSQL
-   **Caching**: Upstash Redis
-   **ORM**: Drizzle ORM

----------

## Architecture

TapUp employs a **serverless, event-driven architecture**:

<a href="https://ibb.co/0qMsLFT"><img src="https://i.ibb.co/cJFY9C0/diagram-export-12-27-2024-2-26-22-PM.png" alt="diagram-export-12-27-2024-2-26-22-PM" border="0" /></a>


1.  **File Uploads**:
    -   Direct uploads to Google Cloud Storage using signed URLs.
2.  **Automated Tagging**:
    -   Pub/Sub triggers the **tag generator** service upon file uploads.
3.  **Caching and Persistence**:
    -   Redis for low-latency metadata access.
    -   Periodic synchronization with Neon PostgreSQL for data consistency.
4.  **Scalability**:
    -   Stateless services enable automatic scaling using Cloud Run.

----------

## Deployment

### **Infrastructure**

-   **Frontend**: Deployed on Vercel for seamless builds and serverless API needs.
-   **Backend Services**: Google Cloud Functions and Cloud Run.
-   **Databases**: Hosted on Neon (PostgreSQL) and Upstash (Redis).

### **Automation**

-   **CI/CD**: GitHub Actions for automated builds and testing.
-   **Event-Driven Processing**: Pub/Sub for asynchronous communication.

----------

## Key Metrics

-   **File Processing Time**: <5 seconds for files up to 10 MB.
-   **Search Query Response Time**: ~1.8 seconds.
-   **System Uptime**: 99.9%.

----------

## Security

-   OAuth-based authentication via NextAuth.
-   End-to-end encryption of data in transit and at rest.
-   Secure API keys and role-based access control.
-   Signed URLs for direct file uploads to prevent server memory overhead.

----------

## Future Enhancements

1.  **File Previewer**: In-app file viewing (PDFs, images, etc.).
2.  **Anonify Integration**: Redact sensitive information within uploaded files.
3.  **Enhanced Sharing Features**: Custom permissions, time-limited access, and password protection.
4.  **Advanced Version Control**: File comparisons and rollback options.
5.  **Support for Additional Cloud Providers**: AWS S3 and Azure Blob.
6.  **Scalability Optimization**: Redis sharding and dynamic scaling mechanisms.
7.  **UI/UX Refinement**: Improved drag-and-drop and search interfaces.

----------

## Acknowledgments

-   **Google Cloud Platform** for serverless infrastructure.
-   **KeyBERT and LlamaParser** for AI-based tagging and parsing.
-   **Neon and Upstash** for database and caching solutions.

----------

TapUp aims to redefine file management by blending advanced technology with user-friendly design. Get started today!
