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
        verifyTables   
    else
        echo "- database not found"
        createDatabase
        verifyTables
    fi
}

function verifyTables {
    echo "- verifying tables"

    count=$(psql -U postgres -tAc "SELECT COUNT(*) FROM pg_tables WHERE schemaname='public';")

    if [ "$count" -gt "1" ]; then
        echo "- tables verified"
    else
        echo "- tables not found"
        createTables
    fi
    exit
}

function createTables {
    echo "- creating tables"
    createArticleTable
    createCategoryTable
    createArticleCategoryTable
    createCountryTable
    createArticleCountryTable
    createAnalysisTable
}

function createCountryTable {
    echo "- create country table"
    psql -U postgres -c "CREATE TABLE country (id SERIAL PRIMARY KEY, name text NOT NULL);"
}

function createArticleTable {
    echo "- create article table"
    psql -U postgres -c "CREATE TABLE article (id SERIAL PRIMARY KEY, domain text NOT NULL, url text NOT NULL, date date NOT NULL, content text, article text);"
}

function createCategoryTable {
    echo "- create analysis table"
    psql -U postgres -c "CREATE TABLE category (id SERIAL PRIMARY KEY, code text NOT NULL, topic text NOT NULL);"
}

function createArticleCategoryTable {
    echo "- create article_category table"
    psql -U postgres -c "CREATE TABLE article_category (article_id SERIAL REFERENCES article(id), category_id SERIAL REFERENCES category(id), PRIMARY KEY (article_id, category_id) );"
}

function createArticleCountryTable {
    echo "- create article_country table"
    psql -U postgres -c "CREATE TABLE article_country (article_id SERIAL REFERENCES article(id), country_id SERIAL REFERENCES country(id), PRIMARY KEY (article_id, country_id) );"
}

function createAnalysisTable {
    echo "- create analysis table"
    psql -U postgres -c "CREATE TABLE analysis (id SERIAL PRIMARY KEY, article_id SERIAL REFERENCES article(id), data text);"
}

init
