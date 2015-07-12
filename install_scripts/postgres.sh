#!/bin/bash

#conflictingreports


function init {
    echo "------------------------------"
    echo "installing conflicting reports"
    echo "------------------------------"
    clear
    installDatabase
}

function installDatabase {
    echo "- installing database"
    db="creports"
    verifyDatabase
}

function dropDatabase {
    echo "- drop database"
    psql -U postgres -c "DROP DATABASE $db"
}

function dropTables {
    echo "- drop tables"
    drop schema public cascade;
    create schema public;
}

function createDatabase {
    echo "- creating $db database"
    createdb -U postgres $db
}

#Check if database exists in postgreSQL using shell
#http://stackoverflow.com/a/16783253
function verifyDatabase {
    echo "- verifying postgres"
    if psql -U postgres -lqt | cut -d \| -f 1 | grep -w "$db"; then
        echo "- database verified"
        createTables
    else
        echo "- database not found"
        createDatabase
        createTables
    fi
}

function createTables {
    echo "- creating tables"
    psql -U postgres --quiet --single-transaction --set AUTOCOMMIT=off --set ON_ERROR_STOP=on -f './postgres.sql' $db
}

init
