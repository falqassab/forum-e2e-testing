# ─── 1) build stage ────────────────────────────────────────────────────────────
FROM golang:1.24-alpine AS builder

# Install necessary packages for CGO & SQLite
RUN apk add --no-cache gcc g++ make sqlite-dev

WORKDIR /app

# cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# copy source & compile
COPY . .
RUN CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -o forum

# ─── 2) runtime stage ──────────────────────────────────────────────────────────
FROM alpine:latest

LABEL org.opencontainers.image.title="forum" \
      org.opencontainers.image.description="forum web" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.url="https://learn.reboot01.com/git/malsari/forum" \
      maintainer="qassimahmed231@gmail.com"

# Install sqlite runtime (needed for CGO SQLite)
RUN apk add --no-cache sqlite-libs

WORKDIR /app

# Copy compiled binary
COPY --from=builder /app/forum .

# Copy assets
COPY --from=builder /app/views ./views
COPY --from=builder /app/static ./static
COPY --from=builder /app/db ./db   

EXPOSE 8080
ENTRYPOINT ["/app/forum"]
