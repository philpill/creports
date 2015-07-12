#!/bin/bash

#conflictingreports


function init {
    clear
    echo "------------------------------"
    echo "installing conflicting reports"
    echo "------------------------------"
    executeScript
}

function executeScript {
    echo "- executing mongo script"
    mongo < mongo.js
}

init
