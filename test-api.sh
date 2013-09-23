#!/bin/bash
HOST="http://localhost:8000"

json-put() {
    local url=$1

    curl \
        -X PUT \
        -H "Content-Type: application/json" \
        -d "$(cat)" \
        "${HOST}/${url}"

    echo
    echo
}

json-get() {
    local url=$1

    curl -X GET "${HOST}/${url}"
    echo
    echo
}

main() {
    json-put "api/expenses" <<JSON
{
    "payer": 2,
    "amount": 23.45,
    "date": "2013-09-22",
    "spent_for_id": 1,
    "description": "Bagels"
}
JSON


    json-get "api/expenses"
}
