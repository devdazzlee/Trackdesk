#!/bin/bash

# Script to find and help replace all credentials: "include" with Authorization headers
# Run this to see all instances, then update them

echo "Finding all instances of credentials: 'include'..."
echo ""

# Count instances per file
echo "=== FILES TO UPDATE ==="
grep -r 'credentials: "include"' frontend/app/ --files-with-matches | while read file; do
    count=$(grep -c 'credentials: "include"' "$file" 2>/dev/null || echo "0")
    echo "$count instances in $file"
done

echo ""
echo "=== TOTAL ==="
total=$(grep -r 'credentials: "include"' frontend/app/ | wc -l | tr -d ' ')
echo "$total total instances to update"

echo ""
echo "=== UPDATE PATTERN ==="
echo ""
echo "For each fetch call, replace:"
echo "  credentials: \"include\","
echo ""
echo "With:"
echo "  headers: getAuthHeaders(),"
echo ""
echo "And add import at top:"
echo "  import { getAuthHeaders } from \"@/lib/getAuthHeaders\";"
echo ""

