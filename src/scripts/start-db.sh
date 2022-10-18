#!/bin/bash
set -e

SERVER="some-postgres";
PW="mysecretpassword";
US="postgres";
DB="mydatabase";

echo "echo stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"
(docker kill $SERVER || :) && \
  (docker rm $SERVER || :) && \
  docker run --name $SERVER \
  -e POSTGRES_PASSWORD=$PW \
  -e POSTGRES_USER=$US \
  -p 5432:5432 \
  -d postgres

# wait for pg to start
echo "sleep wait for pg-server [$SERVER] to start";
SLEEP 3;

# create the db
echo "CREATE DATABASE $DB ENCODING 'UTF-8';" | docker exec -i $SERVER psql -U postgres
echo "\l" | docker exec -i $SERVER psql -U postgres
# create the table
echo "CREATE TABLE \"user\"(\"userId\" SERIAL PRIMARY KEY NOT NULL, \"email\" CHAR(20) NOT NULL, \"hkId\" VARCHAR(10) NOT NULL);" | docker exec -i $SERVER psql -d $DB -U postgres
echo "CREATE TABLE \"candidate\"(\"candidateId\" SERIAL PRIMARY KEY NOT NULL, \"electionId\" INT NOT NULL, \"userId\" INT NOT NULL);" | docker exec -i $SERVER psql -d $DB -U postgres
echo "CREATE TABLE \"vote\"(\"voteId\" SERIAL PRIMARY KEY NOT NULL, \"candidateId\" INT NOT NULL, \"voterId\" INT NOT NULL);" | docker exec -i $SERVER psql -d $DB -U postgres
echo "CREATE TABLE \"election\"(\"electionId\" SERIAL PRIMARY KEY NOT NULL, \"status\" INT NOT NULL);" | docker exec -i $SERVER psql -d $DB -U postgres
# create the admin user
echo "INSERT INTO \"user\" (\"email\", \"hkId\") VALUES ('admin@admin.com', 'A012345(6)');" | docker exec -i $SERVER psql -d $DB -U postgres