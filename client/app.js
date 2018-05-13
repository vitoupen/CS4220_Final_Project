const socket = io()

//----Components----
const historyComponent = {
    template: `
    <div>
        <div v-if="history.length">
            <h3><u>History:  </u></h3>
            <div>
                <a v-for="element in history" class="btn btn-link" @click="search(element.name, element.choice)">
                    {{element.name}}
                </a>
            </div>
        </div>
    </div>`,
    methods: {
        search: function (name, choice) {
            app["query"] = name
            socket.emit('search', {
                query: name,
                choice: choice
            })
        }
    },
    props: ['history', 'choice']
}
const resultComponent = {
    template: `
    <div>
        <div v-if="result.names.length"><h3> <u>Results:  </u></h3></div><br>
        <ol>     
            <li v-for="name in result.names">
                <a class="btn btn-link" @click="find(result.ids[result.names.indexOf(name)], choice)">
                {{name}}
                </a>
            </li>
        </ol>
    </div>`,
    methods: {
        find: function (id, choice) {
            //When given an id and type
            //It gets the details about the item and returns the json_object
            if (choice != "keyword") {
                socket.emit('find', {
                    id: id,
                    type: choice
                })
            } else {
                socket.emit('find_keyword', id)
            }
        }
    },
    props: ['result', 'choice']
}
const detailComponent = {
    template: `
    <div v-if="json.id">
        <div align="center">
            <img v-if="json.poster_path":src="json.poster_path" width="200" height="200">
            <img v-else-if="json.logo_path" :src="json.logo_path" width="200" height="200">
            <img v-else-if="json.profile_path" :src="json.profile_path" width="200" height="200">
            <img v-else :src="no_image" width="200" height="200">
        </div>
        <br>
            <div>
                <table class="table table-bordered">
                    <tbody v-for="(value, key) in json">
                        <tr>
                            <td>{{key}}</td>
                            <td v-if="Array.isArray(value)">
                                <span v-for="arr in value">
                                    <span v-if="arr.name">
                                        <table class="table table-bordered">
                                            <tbody v-for="value1 in value">
                                                <tr v-for="(value, key) in value1">
                                                    <td>{{key}}</td>
                                                    <td>{{value}}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </span>
                                    <span v-else>{{arr}}&nbsp;&nbsp</span>
                                </span>
                            </td>
                            <td v-else-if="value instanceof Object">{{value.name}}</td>
                            <td v-else>{{value}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>`,
    props: ['json','no_image']
}

//----Vue----
const app = new Vue({
    el: '#search-app',
    data: {
        category: ['keyword','company','movie','tv','person'],
        choice: '',
        query: '',
        history: [],
        json_object_returned_from_find_method: {},

        // The result of the search
        result: {},

        // Will be used to show the user a list of choices to select from
        nameAndIdObj: {
            names: [],
            ids: []
        },
        no_image:'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
    },
    methods: {
        searchQuery: function () {
            if (!(this.query && this.choice)) {
                return alert("Select a category to search")
            } else {
                // Push an element to the history if the query hasn't been added already
                let notInHistory = true;
                for (let index = 0; index < this.history.length && notInHistory; index++) {
                    if (this.history[index].name == this.query) {
                        notInHistory = false
                    }
                }
                if (notInHistory) {
                    this.history.push({name: this.query, choice: this.choice});
                }
                
                socket.emit('search', {
                    query: this.query,
                    choice: this.choice
                })
            }
        },
    },
    components: {
        'result-component': resultComponent, 'detail-component': detailComponent, 
        'history-component': historyComponent
    }
})

//----Sockets----
socket.on('found', json_object => {

    let path =''

    if(json_object.poster_path){
        path = json_object.poster_path
        json_object.poster_path="https://image.tmdb.org/t/p/original"+ path
    }
    if(json_object.logo_path){
        path = json_object.logo_path
        json_object.logo_path="https://image.tmdb.org/t/p/original"+ path
    }
    if(json_object.backdrop_path){
        path = json_object.backdrop_path
        json_object.backdrop_path ="https://image.tmdb.org/t/p/original"+ path
    }
    if(json_object.profile_path){
        path = json_object.profile_path
        json_object.profile_path ="https://image.tmdb.org/t/p/original"+ path
    }
    app.json_object_returned_from_find_method = json_object;
})

socket.on('search-successful', result => {
    // Declare and hook up necessary variables
    app.result = result
    const resultsArr = app.result.results
    
    // Declare a temp obj that will hold a list of names and ids.
    let tempObj = {
        names: [],
        ids: []
    }

    let name = "name"   // Name will be used to grab the name in the obj of interest
    if (app.choice == "movie") name = "title"   // Name must be a movie if the user is searching for a movie

     // Create a displaySize var to display a max of 10 items to the user
     let displaySize = resultsArr.length
     if (displaySize > 10) {
         displaySize = 10
     }
    
    // Grab the names and ids up to a certain size from the obj's results and store them temporarily
    for (let index = 0; index < displaySize; index++) {
        tempObj.names.push(resultsArr[index][name])
        tempObj.ids.push(resultsArr[index].id)
    }
    
    // Assume the a json obj was prev attained so reassign it to an empty obj
    app.json_object_returned_from_find_method = {}

    // tempObj is filled, reassign the name and id obj to the tempObj
    app.nameAndIdObj = tempObj
})

// Alert the usr if no results were found 
socket.on('no-results-found', result => {
    console.log(result)
    alert(`No Results were found for ${app.query}.\nPlease check your spelling and try again.`)
})
