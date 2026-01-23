# Custom Presenton image with Orbit Learn templates
FROM ghcr.io/presenton/presenton:latest

# Add orbit-learn-teacher to DEFAULT_TEMPLATES
RUN sed -i 's/DEFAULT_TEMPLATES = \["general", "modern", "standard", "swift"\]/DEFAULT_TEMPLATES = ["general", "modern", "standard", "swift", "orbit-learn-teacher"]/' /app/servers/fastapi/constants/presentation.py

# Copy Orbit Learn teacher templates
COPY orbit-learn-teacher /app/servers/nextjs/presentation-templates/orbit-learn-teacher

# Copy shared schemas
COPY schemas.ts /app/servers/nextjs/presentation-templates/schemas.ts
