# Custom Presenton image with Orbit Learn templates
FROM ghcr.io/presenton/presenton:latest

# Add orbit-learn-teacher to DEFAULT_TEMPLATES in FastAPI
RUN sed -i 's/DEFAULT_TEMPLATES = \["general", "modern", "standard", "swift"\]/DEFAULT_TEMPLATES = ["general", "modern", "standard", "swift", "orbit-learn-teacher"]/' /app/servers/fastapi/constants/presentation.py

# Fix: Round border_radius to integer in AutoShapeBox conversion (fixes Pydantic validation error)
RUN sed -i 's/border_radius: borderRadius || undefined/border_radius: borderRadius ? Math.round(borderRadius) : undefined/' /app/servers/nextjs/utils/pptx_models_utils.ts

# Fix: Correct gemini_flash model name (gemini-2.5-flash-image-preview -> gemini-2.5-flash-image)
RUN sed -i 's/gemini-2.5-flash-image-preview/gemini-2.5-flash-image/g' /app/servers/fastapi/services/image_generation_service.py

# Copy Orbit Learn teacher templates
COPY orbit-learn-teacher /app/servers/nextjs/presentation-templates/orbit-learn-teacher

# Copy shared schemas used by the Orbit Learn templates
COPY schemas.ts /app/servers/nextjs/presentation-templates/schemas.ts

# Set working directory to Next.js app for rebuild
WORKDIR /app/servers/nextjs

# Install any missing dependencies and rebuild Next.js to include new templates
RUN npm install && npm run build

# Reset working directory
WORKDIR /app
