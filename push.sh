#!/bin/bash

# Messaggio di commit predefinito o passato come argomento
MESSAGE=${1:-"Update: $(date '+%Y-%m-%d %H:%M:%S')"}

echo "🚀 Inizio preparazione commit..."

# Aggiunge tutti i file
git add .

# Esegue il commit
git commit -m "$MESSAGE"

# Push sul repository
echo "☁️ Invio dei dati a GitHub..."
git push

if [ $? -eq 0 ]; then
    echo "✅ Successo! Il tuo codice è online."
else
    echo "❌ Errore durante il push. Controlla la tua connessione o le credenziali."
fi
