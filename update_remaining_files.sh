#!/bin/bash
echo "Remaining files to update:"
grep -r 'credentials: "include"' frontend/app/ --files-with-matches 2>/dev/null | while read file; do
    count=$(grep -c 'credentials: "include"' "$file" 2>/dev/null || echo "0")
    echo "$count instances in $file"
done
echo ""
echo "Total remaining: $(grep -r 'credentials: "include"' frontend/app/ 2>/dev/null | wc -l)"

