# Docker Build & Run Guide

## 📦 Build Docker Image

```bash
docker build -t react-tailwind-app .
```

## 🚀 Run Docker Container

### Option 1: Using Docker directly
```bash
docker run -d -p 3000:80 --name react-app react-tailwind-app
```

### Option 2: Using Docker Compose
```bash
docker-compose up -d
```

## 🌐 Access Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 🛠️ Useful Docker Commands

### View running containers
```bash
docker ps
```

### View logs
```bash
docker logs react-app
```

### Stop container
```bash
docker stop react-app
```

### Remove container
```bash
docker rm react-app
```

### Stop and remove with Docker Compose
```bash
docker-compose down
```

### Rebuild and restart
```bash
docker-compose up -d --build
```

## 📁 Project Structure

```
.
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Docker Compose configuration
├── nginx.conf             # Nginx server configuration
├── .dockerignore          # Files to ignore in Docker build
└── src/                   # Application source code
```

## 🔧 Configuration

### Change Port

Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Change 8080 to your desired port
```

Or with docker run:
```bash
docker run -d -p 8080:80 --name react-app react-tailwind-app
```

### Environment Variables

Add environment variables in `docker-compose.yml`:
```yaml
environment:
  - VITE_API_URL=http://localhost:8000
  - NODE_ENV=production
```

## 📊 Docker Image Info

- **Base Image**: Node 18 Alpine (build stage)
- **Production Image**: Nginx Alpine
- **Optimizations**:
  - Multi-stage build (smaller image size)
  - Gzip compression enabled
  - Static asset caching
  - SPA routing support

## 🐳 Docker Hub (Optional)

### Tag image
```bash
docker tag react-tailwind-app yourusername/react-tailwind-app:latest
```

### Push to Docker Hub
```bash
docker push yourusername/react-tailwind-app:latest
```

### Pull and run
```bash
docker pull yourusername/react-tailwind-app:latest
docker run -d -p 3000:80 yourusername/react-tailwind-app:latest
```
