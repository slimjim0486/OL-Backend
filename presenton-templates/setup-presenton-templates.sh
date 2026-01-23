#!/bin/bash

#############################################
# Orbit Learn - Presenton Template Setup
#
# This script sets up custom Orbit Learn branded
# templates in a Presenton self-hosted installation.
#############################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ORBIT_LEARN_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Orbit Learn - Presenton Template Setup                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

#############################################
# Step 1: Find or clone Presenton
#############################################

PRESENTON_PATH=""

# Check common locations
COMMON_PATHS=(
    "$HOME/presenton"
    "$HOME/projects/presenton"
    "$HOME/code/presenton"
    "$HOME/dev/presenton"
    "/opt/presenton"
    "../presenton"
    "../../presenton"
)

echo -e "${YELLOW}Looking for Presenton installation...${NC}"

for path in "${COMMON_PATHS[@]}"; do
    if [ -d "$path/servers/nextjs/presentation-templates" ]; then
        PRESENTON_PATH="$path"
        echo -e "${GREEN}✓ Found Presenton at: $PRESENTON_PATH${NC}"
        break
    fi
done

# If not found, ask user
if [ -z "$PRESENTON_PATH" ]; then
    echo -e "${YELLOW}Presenton not found in common locations.${NC}"
    echo ""
    echo "Options:"
    echo "  1) Enter path to existing Presenton installation"
    echo "  2) Clone Presenton to ~/presenton"
    echo "  3) Exit"
    echo ""
    read -p "Choose option (1/2/3): " choice

    case $choice in
        1)
            read -p "Enter path to Presenton: " PRESENTON_PATH
            if [ ! -d "$PRESENTON_PATH/servers/nextjs/presentation-templates" ]; then
                echo -e "${RED}Error: Invalid Presenton path. Expected to find servers/nextjs/presentation-templates${NC}"
                exit 1
            fi
            ;;
        2)
            echo -e "${BLUE}Cloning Presenton...${NC}"
            git clone https://github.com/presenton/presenton.git "$HOME/presenton"
            PRESENTON_PATH="$HOME/presenton"
            echo -e "${GREEN}✓ Cloned Presenton to $PRESENTON_PATH${NC}"
            ;;
        3)
            echo "Exiting."
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            exit 1
            ;;
    esac
fi

TEMPLATES_DIR="$PRESENTON_PATH/servers/nextjs/presentation-templates"
STATIC_DIR="$PRESENTON_PATH/servers/nextjs/public/static"

#############################################
# Step 2: Copy shared schemas
#############################################

echo ""
echo -e "${BLUE}Step 2: Copying shared schemas...${NC}"

if [ -f "$SCRIPT_DIR/schemas.ts" ]; then
    cp "$SCRIPT_DIR/schemas.ts" "$TEMPLATES_DIR/schemas.ts"
    echo -e "${GREEN}✓ Copied schemas.ts${NC}"
else
    echo -e "${YELLOW}⚠ schemas.ts not found, skipping${NC}"
fi

#############################################
# Step 3: Copy Orbit Learn templates
#############################################

echo ""
echo -e "${BLUE}Step 3: Copying Orbit Learn templates...${NC}"

TEMPLATE_SRC="$SCRIPT_DIR/orbit-learn-teacher"

if [ -d "$TEMPLATE_SRC" ]; then
    # Remove existing if present
    if [ -d "$TEMPLATES_DIR/orbit-learn-teacher" ]; then
        echo -e "${YELLOW}Removing existing orbit-learn-teacher template...${NC}"
        rm -rf "$TEMPLATES_DIR/orbit-learn-teacher"
    fi

    cp -r "$TEMPLATE_SRC" "$TEMPLATES_DIR/orbit-learn-teacher"
    echo -e "${GREEN}✓ Copied orbit-learn-teacher template${NC}"

    # List copied files
    echo ""
    echo "  Templates copied:"
    for file in "$TEMPLATES_DIR/orbit-learn-teacher"/*.tsx; do
        if [ -f "$file" ]; then
            echo "    - $(basename "$file")"
        fi
    done
else
    echo -e "${RED}Error: Template source not found at $TEMPLATE_SRC${NC}"
    exit 1
fi

#############################################
# Step 4: Copy Orbit Learn logo
#############################################

echo ""
echo -e "${BLUE}Step 4: Copying Orbit Learn logo...${NC}"

# Create static directory if it doesn't exist
mkdir -p "$STATIC_DIR"

# Try multiple possible logo locations
LOGO_PATHS=(
    "$ORBIT_LEARN_ROOT/frontend/public/assets/rebranding-jeffrey-2024/orbit-learn-logo-icon 2.png"
    "$ORBIT_LEARN_ROOT/frontend/public/assets/orbit-logo.png"
    "$ORBIT_LEARN_ROOT/frontend/public/logo.png"
)

LOGO_COPIED=false
for logo_path in "${LOGO_PATHS[@]}"; do
    if [ -f "$logo_path" ]; then
        cp "$logo_path" "$STATIC_DIR/orbit-logo.png"
        echo -e "${GREEN}✓ Copied logo from: $(basename "$logo_path")${NC}"
        LOGO_COPIED=true
        break
    fi
done

if [ "$LOGO_COPIED" = false ]; then
    echo -e "${YELLOW}⚠ Logo not found. Creating placeholder...${NC}"
    # Create a simple SVG placeholder
    cat > "$STATIC_DIR/orbit-logo.png" << 'EOF'
<!-- Placeholder - replace with actual Orbit Learn logo -->
EOF
    echo -e "${YELLOW}  Please manually copy the Orbit Learn logo to:${NC}"
    echo -e "${YELLOW}  $STATIC_DIR/orbit-logo.png${NC}"
fi

#############################################
# Step 5: Check Docker status
#############################################

echo ""
echo -e "${BLUE}Step 5: Checking Presenton status...${NC}"

# Check if docker-compose.yml exists
if [ -f "$PRESENTON_PATH/docker-compose.yml" ] || [ -f "$PRESENTON_PATH/compose.yml" ]; then
    # Check if containers are running
    cd "$PRESENTON_PATH"

    if command -v docker &> /dev/null; then
        RUNNING=$(docker ps --filter "name=presenton" --format "{{.Names}}" 2>/dev/null || true)

        if [ -n "$RUNNING" ]; then
            echo -e "${GREEN}✓ Presenton containers are running${NC}"
            echo ""
            read -p "Restart containers to apply changes? (y/n): " restart
            if [ "$restart" = "y" ] || [ "$restart" = "Y" ]; then
                echo -e "${BLUE}Restarting Presenton...${NC}"
                docker compose restart
                echo -e "${GREEN}✓ Restarted${NC}"
            fi
        else
            echo -e "${YELLOW}Presenton containers are not running.${NC}"
            echo ""
            read -p "Start Presenton now? (y/n): " start
            if [ "$start" = "y" ] || [ "$start" = "Y" ]; then
                echo -e "${BLUE}Starting Presenton...${NC}"
                docker compose up development --build -d
                echo -e "${GREEN}✓ Started in background${NC}"
            fi
        fi
    else
        echo -e "${YELLOW}Docker not found. Please start Presenton manually.${NC}"
    fi
else
    echo -e "${YELLOW}docker-compose.yml not found in Presenton directory.${NC}"
fi

#############################################
# Done!
#############################################

echo ""
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete!                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo "Next steps:"
echo ""
echo "  1. Open Presenton (if not running):"
echo -e "     ${BLUE}cd $PRESENTON_PATH && docker compose up development --build${NC}"
echo ""
echo "  2. Preview templates at:"
echo -e "     ${BLUE}http://localhost:5000/template-preview${NC}"
echo ""
echo "  3. Generate a test presentation at:"
echo -e "     ${BLUE}http://localhost:5000/upload${NC}"
echo ""
echo "  4. Select 'orbit-learn-teacher' template when generating"
echo ""
echo -e "${YELLOW}Tip: Try this prompt for testing:${NC}"
echo "  \"Create a Grade 3 Math lesson about understanding fractions\""
echo ""
