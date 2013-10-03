#!/bin/bash
HOST="http://localhost:8000/api"

json-post() {
    local url=$1

    curl \
        -X POST \
        -H "Content-Type: application/json" \
        -d "$(cat)" \
        "${HOST}/${url}"

    echo
}

json-get() {
    local url=$1

    curl \
        -X GET \
        "${HOST}/${url}"
    echo
}

main() {
#     json-post "expenses" <<JSON
# {
#     "payer": 2,
#     "amount": 23.45,
#     "date": "2013-09-22",
#     "payee": 1,
#     "description": "Bagels"
# }
# JSON

    json-get "expenses"
    json-get "total_paid_by/2"
}

main
