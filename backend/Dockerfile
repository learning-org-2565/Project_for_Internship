# Stage 1: Build Stage
FROM python:3.9-slim AS builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install build tools and dependencies
RUN apt-get update && apt-get install -y --no-install-recommends gcc libffi-dev

# Set the working directory
WORKDIR /app

# Copy requirements.txt and pre-build all dependencies
COPY requirements.txt /app/
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /wheels -r requirements.txt

# Stage 2: Runtime Stage
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Copy prebuilt wheels from the builder stage
COPY --from=builder /wheels /wheels
RUN pip install --no-cache-dir --no-index --find-links=/wheels /wheels/*

# Copy the application code
COPY app.py /app/

# Expose the application port
EXPOSE 5000

# Command to run the application
CMD ["python", "app.py"]
