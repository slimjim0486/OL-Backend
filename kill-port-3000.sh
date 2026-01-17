#!/bin/bash

# Script to kill the process running on port 3000

PORT=3000

echo "🔍 Checking for process on port $PORT..."

# Find the PID of the process using port 3000
PID=$(lsof -ti :$PORT)

if [ -z "$PID" ]; then
    echo "✅ No process found running on port $PORT"
    exit 0
fi

echo "📌 Found process with PID: $PID"
echo "🔪 Killing process..."

# Kill the process
kill -9 $PID

if [ $? -eq 0 ]; then
    echo "✅ Successfully killed process on port $PORT"
else
    echo "❌ Failed to kill process on port $PORT"
    exit 1
fi
