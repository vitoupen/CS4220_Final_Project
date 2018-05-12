const socket = io()
const resultComponent = {
    template: `
    <div>
    <p v-if="result.names.length">Current Results: </p>
        <ol>     
            <li v-for="name in result.names">
                <span @click="find(result.ids[result.names.indexOf(name)], choice)">
               {{name}}
               </span>
            </li>
        </ol>
    </div>`,
    methods:{
        find: function (id, choice) {
            //When given an id and type
            //It gets the details about the item and returns the json_object
            if (choice != "keyword")
                socket.emit('find', {
                    id: id,
                    type: choice
                })
            //It might have to get the results from a keyword search
            else
                socket.emit('find_keyword', id)
        }
    },
    props: ['result','choice']
}

// TODO: Fix showing empty obj
const detailComponent = {
    template:`
    <div v-if="json">
        {{json}}
    </div>`,
    props: ['json']
}
const app = new Vue({
    el: '#search-app',
    data: {
        category: ['tv','movie','company','people'],
        choice: '',
        query: '',
        json_object_returned_from_find_method: {},

        // The result of the search
        result: {},

        // Use this to show a user a list of choices to select from
        // Make a comp that uses this.
        nameAndIdObj: {
            names: [],
            ids: []
        },
        //array for storing result object (extra-credit)
        history: [],
        noResults: false
    },
    methods: {
        searchQuery: function () {
            if (!(this.query && this.choice)) {
                return
            } else {
                if (this.choice == "any") this.choice = 'keyword'
                socket.emit('search', {
                    query: this.query,
                    choice: this.choice
                })
            }
        },
    },
    components: {
        'result-component': resultComponent, 'detail-component': detailComponent
    }
})
//Sockets
socket.on('found', json_object => {
    app.json_object_returned_from_find_method = json_object;
})

socket.on('search-successful', result => {
    app.noResults = false

    let name = "name"
    let tempObj = {
        names: [],
        ids: []
    }

    if (app.choice == "movie") name = "title"

    app.result = result

    app.result.results.forEach(element => {
        tempObj.names.push(element[name])
        tempObj.ids.push(element.id)
    });

    // Assume the a json obj was prev attained so reassign it to an empty obj
    app.json_object_returned_from_find_method = {}
    app.nameAndIdObj = tempObj
})

// Show a comp when this is true
socket.on('no-results-found', result => {
    app.noResults = true
})

//app.find(3986, "keyword");
/*
 company
 keyword
 movie
 tv
 people
 */