'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
    homepage,
    favicon,
    material_css,
    templates,
    libs
};

function homepage(req, res, next) {
    const file = path.join(__dirname, '..', '..', 'html', 'homepage.html');
    const contents = fs.readFileSync(file, 'utf8');
    res.contentType('text/html');
    res.send(contents);
}

function favicon(req, res, next) {
    const file = path.join(__dirname, '..', '..', 'html', 'favicon.ico');
    res.sendFile(file);
}

function material_css(req, res, next) {
    const file = path.join(__dirname, '..', '..', 'node_modules', 'angular-material', 'angular-material.min.css');
    const contents = fs.readFileSync(file, 'utf8');
    res.contentType('text/css');
    res.send(contents);
}

function templates(req, res, next) {
    const name = req.swagger.params.name.value;
    const file = path.join(__dirname, '..', '..', 'html', 'templates', name);
    const contents = fs.readFileSync(file, 'utf8');
    res.contentType('text/html');
    res.send(contents);
}

function libs(req, res, next) {
    const folder = req.swagger.params.folder.value;
    const name = req.swagger.params.name.value;
    const file = path.join(__dirname, '..', '..', 'node_modules', folder, name);
    const contents = fs.readFileSync(file, 'utf8');
    res.contentType('text/javascript');
    res.send(contents);
}
