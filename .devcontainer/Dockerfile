# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/devcontainers/typescript-node:0-18

# ‑‑ Example: extra Debian packages
RUN apt-get update && apt-get install -y \
    git-lfs \
    libvips-dev \
 && apt-get clean && rm -rf /var/lib/apt/lists/*
