#!/bin/bash
cd "$(dirname "$0")/dist"
echo "🦇 Batman Site — Server locale avviato su http://localhost:8000"
echo "   Aprendo il browser..."
open http://localhost:8000
python3 -m http.server 8000
