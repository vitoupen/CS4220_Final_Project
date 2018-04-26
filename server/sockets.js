module.exports = (server) => {
    const
            io = require('socket.io')(server),
            config = require('./config'),
            superagent = require('superagent')

    const _fetch = (command) => {
        return superagent.get(`${config.url}${command}`)
                .then(response => response.body)
                .catch(error => error.response.body)
    }
    const find = (type, id) =>
    {
        return _fetch(`${type}/${id}?api_key=${config.apiKey}&language=en-US`);
    }
    const findKeyword = (id) =>
    {
        return _fetch(`keyword/${id}/movies?api_key=${config.apiKey}&language=en-US&include_adult=false`);
    }

    io.on('connection', socket => {
        socket.on('find', data => {
            find(data.type, data.id).then(result => {
                io.emit('found', result)
            });
        })
        socket.on('find_keyword', id => {
            findKeyword(id).then(result => {
                io.emit('found', result)
            });
        })
    })
}
