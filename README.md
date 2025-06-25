# Casey (MIRA)

## Project Overview

This frontend is part of the **Casey (MIRA)** system, supporting both user-facing and agent-facing workflows. Originally developed for the New York State Department of Health in collaboration with Google, the project focuses on improving the Medicaid application process.

There are two main personas:

1. **Applicants** – Individuals applying for Medicaid.
2. **Agents** – Staff assisting users during the application process.

Key features include:

- ✉️ **AI-generated emails**: Agents can generate personalized, context-aware emails via an LLM backend and send them with one click.
- 🔗 **LangChain + Python backend**: Integrated with a React frontend to enable dynamic conversations and user support.
- ☁️ **Hosted on GCP**: All services are deployed on Google Cloud for scalability and reliability.

The backend utilizes the [Core Solution Services repository](https://github.com/GoogleCloudPlatform/core-solution-services) from Google Cloud.

# Local Development

## Install dependencies

```bash
npm install
```

## Run a local dev server

```bash
npm run dev
```

## Build for production

```bash
npm run build
