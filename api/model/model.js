const thinkagain = require('thinkagain')();

var Event = thinkagain.createModel('Event', {
    type: 'object',
    properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        startDateTime: { type: 'string', format:'date-time' },
        endDateTime: { type: 'string', format:'date-time' }
    },
    required: [ 'name', 'startDateTime', 'endDateTime' ]
});

exports.Event = Event;
