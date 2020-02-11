const thinkagain = require('thinkagain')();

var Event = thinkagain.createModel('Event', {
    type: 'object',
    properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        startDateTime: { type: 'string', format:'date-time' },
        endDateTime: { type: 'string', format:'date-time' },
        public: { type: 'boolean' },
        userId: { type: 'string' }
    },
    required: [ 'name', 'startDateTime', 'endDateTime' ]
});
exports.Event = Event;

var User = thinkagain.createModel('User', {
    type: 'object',
    properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        password: { type: 'string' }
    },
    required: [ 'name', 'password' ]
});
exports.User = User;

Event.belongsTo(User, 'user', 'userId', 'id');
