#!/bin/bash

# Messaggio di commit predefinito o passato come argomento
MESSAGE=${1:-"Update: $(date '+%Y-%m-%d %H:%M:%S')"}

echo "🚀 Inizio preparazione commit..."

# Aggiunge tutti i file
git add .

# Esegue il commit
# Il commit fallisce se non ci sono modifiche, quindi usiamo || true
git commit -m "$MESSAGE" || echo "Nessuna modifica da committare."

# Push sul repository
echo "☁️ Invio dei dati a GitHub..."
# Se il push semplice fallisce, prova a impostare l'upstream
git push || git push -u origin $(git branch --show-current)

if [ $? -eq 0 ]; then
    echo "✅ Successo! Il tuo codice è online."
else
    echo "❌ Errore durante il push. Controlla la tua connessione o le credenziali."
fi
