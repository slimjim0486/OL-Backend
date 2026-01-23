# Custom Presenton image with Orbit Learn templates
FROM ghcr.io/presenton/presenton:latest

# Add orbit-learn-teacher to DEFAULT_TEMPLATES in FastAPI
RUN sed -i 's/DEFAULT_TEMPLATES = \["general", "modern", "standard", "swift"\]/DEFAULT_TEMPLATES = ["general", "modern", "standard", "swift", "orbit-learn-teacher"]/' /app/servers/fastapi/constants/presentation.py

# Fix: Round border_radius to integer in AutoShapeBox conversion (fixes Pydantic validation error)
RUN sed -i 's/border_radius: borderRadius || undefined/border_radius: borderRadius ? Math.round(borderRadius) : undefined/' /app/servers/nextjs/utils/pptx_models_utils.ts

# Copy Orbit Learn teacher templates
COPY orbit-learn-teacher /app/servers/nextjs/presentation-templates/orbit-learn-teacher

# Set working directory to Next.js app for rebuild
WORKDIR /app/servers/nextjs

# Install any missing dependencies and rebuild Next.js to include new templates
RUN npm install && npm run build

# Reset working directory
WORKDIR /app
