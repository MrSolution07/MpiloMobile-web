#!/bin/bash
# Function to start an app in background
start_app() {
    local app_name=$1
    local port=$2
    
    echo "📱 Starting $app_name on port $port..."
    cd $app_name
    npm run dev -- --port $port &
    cd ..
}

# Start all applications
start_app "patient-website" 5173
start_app "admin-dashboard" 5174
start_app "doctor-dashboard" 5175

echo " All applications started!"
echo "Patient Website: http://localhost:5173"
echo "Admin Dashboard: http://localhost:5174"
echo " Doctor Dashboard: http://localhost:5175"
echo ""

# if you good enough you can run this script to start all applications
# ./start-all.sh 
# well i said if you good enough lol ( this is not AI generated)


