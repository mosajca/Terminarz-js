'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
    homepage,
    material_css
};

function homepage(req, res, next) {
    const file = path.join(__dirname, '..', '..', 'html', 'homepage.html');
    const contents = fs.readFileSync(file, 'utf8');
    res.send(contents);
}

function material_css(req, res, next) {
    const file = path.join(__dirname, '..', '..', 'node_modules', 'angular-material', 'angular-material.min.css');
    const contents = fs.readFileSync(file, 'utf8');
    res.contentType('text/css');
    res.send(contents);
}
