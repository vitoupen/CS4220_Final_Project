const socket = io()

//----Components----
const resultComponent = {
    template: `
    <div>
        <div v-if="result.names.length"><h3> <u>Results:  </u></h3></div><br>
        <ul>     
            <li v-for="name in result.names">
                <button class="btn btn-primary" @click="find(result.ids[result.names.indexOf(name)], choice)">
                {{name}}
                </button>
            </li>
        </ul>
    </div>`,
    methods: {
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
        category: ['company','movie','tv','person'],
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
        no_image:'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
        noResults: false
    },
    methods: {
        searchQuery: function () {
            if (!(this.query && this.choice)) {
                return alert("Select a category to search")
            } else {
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
    alert("No Results found in the Database.")
    app.noResults = true
})
