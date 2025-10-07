
SUPABASE_URL="https://aqpatmwevvoorwxygleq.supabase.co"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcGF0bXdldnZvb3J3eHlnbGVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODQ2NzQxMSwiZXhwIjoyMDY0MDQzNDExfQ.8FzeqbTsD-deBpprsr37SfkqFRqCbS2lEk2y3XAeTcY"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color


if [ "$SUPABASE_URL" = "YOUR_SUPABASE_URL" ] || [ "$SERVICE_ROLE_KEY" = "YOUR_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED} ERROR: Please update SUPABASE_URL and SERVICE_ROLE_KEY in the script first!${NC}"
    echo ""
    exit 1
fi



SUCCESS_COUNT=0
ERROR_COUNT=0

# Function to create a user
create_user() {
    local email=$1
    local password=$2
    local first_name=$3
    local last_name=$4
    
    RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/auth/v1/admin/users" \
        -H "apikey: ${SERVICE_ROLE_KEY}" \
        -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"${email}\",
            \"password\": \"${password}\",
            \"email_confirm\": true,
            \"user_metadata\": {
                \"display_name\": \"${first_name} ${last_name}\",
                \"first_name\": \"${first_name}\",
                \"last_name\": \"${last_name}\"
            }
        }")
    
    # Check if response contains an error
    if echo "$RESPONSE" | grep -q "error"; then
        echo -e "${RED}Error creating user for ${email}${NC}"
        echo "   $(echo $RESPONSE | grep -o '"message":"[^"]*"')"
        ((ERROR_COUNT++))
    else
        USER_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
        echo -e "${GREEN}Created user for ${first_name} ${last_name} (${email})${NC}"
        echo "   User ID: ${USER_ID}"
        echo "   Temporary Password: ${password}"
        echo ""
        ((SUCCESS_COUNT++))
    fi
}


create_user "christian@solutionincorporate.com" "TempPass123!" "Christian" "Hussein"
create_user "david.brown@hospital.co.za" "TempPass123!" "David" "Brown"
create_user "james.wilson@hospital.co.za" "TempPass123!" "James" "Wilson"
create_user "lisa.davis@hospital.co.za" "TempPass123!" "Lisa" "Davis"
create_user "mike@test.com" "TempPass123!" "MIKE" "KATUTWA"
create_user "sarah.johnson@hospital.co.za" "TempPass123!" "Sarah" "Johnson"

echo "============================================================"
echo -e "${GREEN}Successfully created: ${SUCCESS_COUNT} users${NC}"
echo -e "${RED}❌Errors: ${ERROR_COUNT} users${NC}"
echo "============================================================"

# Admin details
# ADMIN_EMAIL="admin@mpilo.com"
# ADMIN_PASSWORD="Admin123!Mpilo"
# ADMIN_FIRST_NAME="Tumi"
# ADMIN_LAST_NAME="Mpilo"
# ADMIN_PHONE="0987654321"



