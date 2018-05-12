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

    const search = (query, type) => {
        return _fetch(`search/${type}?api_key=${config.apiKey}&language=en-US&query=${query}`)
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

        // Search on the querry
        socket.on('search', querryObj => {
            search(querryObj.query, querryObj.choice).then(result => {
                if (result.results) {
                    io.emit('search-successful', result)
                } else {
                    io.emit('no-results-found', result)
                }
            })
            .catch(error => {
                io.emit('no-results-found', error)
            })
        })
    })
}
