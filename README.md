# 🚀 NEXORA AI LAB

### A Professional Multi-Application AI Laboratory

NEXORA AI LAB is a collection of five intelligent applications built with modern Artificial Intelligence technologies, including LangChain, LangGraph, FastAPI, React, and Docker.

The platform brings together multiple AI-powered solutions in one unified environment, providing a modern and intuitive user experience.

---

## ✨ Applications

| Application | Description | Frontend | Backend |
|---|---|---:|---:|
| **LINGUA AI** | AI-powered multilingual translation | 5174 | 8000 |
| **SENTIMENT AI** | Text sentiment analysis | 5175 | 8001 |
| **NEXORA CHAT** | Conversational AI chatbot | 5176 | 8002 |
| **DOCUVISION** | Intelligent document OCR and text extraction | 5177 | 8003 |
| **WEATHERFLOW AI** | AI-powered weather assistant | 5178 | 8004 |

### 1. LINGUA AI
An intelligent translation platform powered by LangChain and Groq.

Features:
- Multilingual text translation
- Multiple translation tones
- Translation history
- Translation statistics

### 2. SENTIMENT AI
An application that analyzes text and identifies its emotional polarity.

Features:
- Text sentiment classification
- Sentiment analysis results
- Analysis history

### 3. NEXORA CHAT
An AI-powered conversational assistant.

Features:
- Interactive AI conversations
- Context-aware responses
- Conversation management

### 4. DOCUVISION
An intelligent document processing application.

Features:
- OCR text extraction
- Document upload and processing
- AI-powered document understanding

### 5. WEATHERFLOW AI
An intelligent weather assistant built with LangGraph.

Features:
- Current weather information
- Weather forecasts
- Interactive weather assistance

---

## 🛠️ Technologies

**Backend**
- Python
- FastAPI
- LangChain
- LangGraph
- Groq API
- SQLite

**Frontend**
- React
- Vite
- JavaScript
- Tailwind CSS
- Recharts
- Lucide React

**DevOps**
- Docker
- Docker Compose
- Nginx
- Git
- GitHub

---

## 🏗️ Project Architecture

```text
NEXORA-AI-LAB/
│
├── backend/                 # LINGUA AI backend
├── frontend/                # LINGUA AI frontend
│
├── sentiment-analysis/      # SENTIMENT AI
│
├── projects/
│   ├── chatbot/             # NEXORA CHAT
│   ├── docuvision/          # DOCUVISION
│   └── weatherflow-ai/      # WEATHERFLOW AI
│
├── nexora-portal/           # Main application portal
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Python
- Node.js and npm
- Docker Desktop
- Git

### Run with Docker Compose

1. Clone the repository:

```bash
git clone https://github.com/nermine-ben-rhouma/NEXORA-AI-LAB.git
```

2. Navigate to the project:

```bash
cd NEXORA-AI-LAB
```

3. Configure the required environment variables using the provided `.env.example` templates. Add your own API keys locally where required.

4. Build and start all applications:

```bash
docker compose up -d --build
```

5. Check running containers:

```bash
docker compose ps
```

---

## 🌐 Application Access

| Application | URL |
|---|---|
| NEXORA AI LAB Portal | http://localhost:5180 |
| LINGUA AI | http://localhost:5174 |
| SENTIMENT AI | http://localhost:5175 |
| NEXORA CHAT | http://localhost:5176 |
| DOCUVISION | http://localhost:5177 |
| WEATHERFLOW AI | http://localhost:5178 |

### API Documentation

Each backend provides interactive Swagger documentation:

- LINGUA AI: http://localhost:8000/docs
- SENTIMENT AI: http://localhost:8001/docs
- NEXORA CHAT: http://localhost:8002/docs
- DOCUVISION: http://localhost:8003/docs
- WEATHERFLOW AI: http://localhost:8004/docs

---

## 🐳 Docker Commands

Start all services:

```bash
docker compose up -d
```

Rebuild all services:

```bash
docker compose up -d --build
```

Stop all services:

```bash
docker compose down
```

View running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

---

## 🔐 Security

- API keys must be stored in local environment files.
- Never commit real API keys or passwords.
- `.env`, database files, and uploaded documents should remain excluded from Git.
- Use `.env.example` files containing placeholders only.

---

## 🎯 Project Objective

NEXORA AI LAB demonstrates the practical integration of modern Large Language Model technologies and AI frameworks through five independent but unified applications.

The project focuses on modular architecture, API development, frontend integration, AI-powered workflows, and containerized deployment.

---

## 👩‍💻 Author

**Nermine Ben Rhouma**


---

