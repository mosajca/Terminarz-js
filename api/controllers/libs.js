'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
    fileserve
};

function fileserve(req, res, next) {
    const folder = req.swagger.params.folder.value
    const name = req.swagger.params.name.value
    const file = path.join(__dirname, '..', '..', 'node_modules', folder, name);
    const contents = fs.readFileSync(file, 'utf8');
    res.contentType('text/javascript');
    res.send(contents);
}
