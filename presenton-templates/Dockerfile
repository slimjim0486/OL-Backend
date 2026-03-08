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

# Copy Orbit Learn registry shim for the current Presenton template registry
COPY orbit-learn-teacher.registry.tsx /app/servers/nextjs/app/presentation-templates/orbit-learn-teacher.registry.tsx

# Register Orbit Learn templates in Presenton's hardcoded Next.js template registry
RUN python - <<'PY'
from pathlib import Path
import re

path = Path("/app/servers/nextjs/app/presentation-templates/index.tsx")
text = path.read_text()

import_line = 'import { orbitLearnTeacherTemplates, orbitLearnTeacherTemplateSettings } from "./orbit-learn-teacher.registry";'
if import_line not in text:
    anchor = 'import neoSwiftSettings from "./neo-swift/settings.json";'
    text = text.replace(anchor, anchor + "\n" + import_line)

if "...orbitLearnTeacherTemplates," not in text:
    text = text.replace(
        "    ...swiftTemplates,\n\n\n];",
        "    ...swiftTemplates,\n    ...orbitLearnTeacherTemplates,\n\n\n];",
    )

if 'id: "orbit-learn-teacher"' not in text:
    marker = '\n];\n\n// Helper to get templates by group ID'
    block = """
    {
        id: "orbit-learn-teacher",
        name: "Orbit Learn Teacher",
        description: orbitLearnTeacherTemplateSettings.description,
        settings: orbitLearnTeacherTemplateSettings as TemplateGroupSettings,
        layouts: orbitLearnTeacherTemplates,
    },
"""
    text = text.replace(marker, block + marker)

path.write_text(text)
PY

# Set working directory to Next.js app for rebuild
WORKDIR /app/servers/nextjs

# Install any missing dependencies and rebuild Next.js to include new templates
RUN npm install && npm run build

# Reset working directory
WORKDIR /app
