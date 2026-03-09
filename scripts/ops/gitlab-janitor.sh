#!/bin/bash
# Script de limpieza masiva de pipelines (GitLab - API)
TOKEN="tu-token-aqui"
PROJECT_ID="tu-id-aqui"

# Obtener IDs de pipelines y eliminarlos en bucle
PIPELINES=$(curl --header "PRIVATE-TOKEN: $TOKEN" "https://gitlab.com/api/v4/projects/$PROJECT_ID/pipelines?per_page=20" | jq '.[].id')

for ID in $PIPELINES; do
    echo "Eliminando Pipeline ID: $ID"
    curl --request DELETE --header "PRIVATE-TOKEN: $TOKEN" "https://gitlab.com/api/v4/projects/$PROJECT_ID/pipelines/$ID"
done

echo "Proceso de limpieza completado."
