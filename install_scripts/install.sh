#!/bin/bash

#conflictingreports

APP_PATH="/var/www/creports/"

function init {
    clear
    echo "------------------------------"
    echo "installing conflicting reports"
    echo "------------------------------"
    cd $APP_PATH
    updateSource
    updatePackages
    initDatabase
    runGulp
    restartServer
}

function restartServer {
    echo "- restarting server"
    forever restartall
}

function updateSource {
    echo "- update source"
    git pull
}

function updatePackages {
    echo "- update packages"
    npm install
    ./node_modules/bower/bin/bower install
}

function runGulp {
    echo "- gulp sass/browserify"
    ./node_modules/gulp/bin/gulp.js sass
    ./node_modules/gulp/bin/gulp.js browserify
}

function initDatabase {
    echo "- executing mongo script"
    mongo < ./install_scripts/mongo.js
}

init
