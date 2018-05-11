const socket = io()
const resultComponent = {
    template: `
    <div>
    <p v-if="result.names.length">Current Results: </p>
    {{result.ids[0]}}
        <ol>     
            <li v-for="name in result.names">
                <span @click="find(result.ids[0], choice)">
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
const detailComponent = {
    template:`<div v-if="json">
        {{json}}
    </div>`,
    props: ['json']
}
const app = new Vue({
    el: '#search-app',
    data: {
        category: ['tv','movie','keyword','company','people'],
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
        displayChoices: false,
        answerChoice: '',
        //array for storing result object (extra-credit)
        history: [],
        noResults: false
    },
    methods: {

        getCategory: function () {

            //Need to get all the category from the backend

        },
        searchQuery: function () {
            //Testing
            if (!(this.query && this.choice)) {
                return
            } else {
                socket.emit('search', {
                    query: this.query,
                    choice: this.choice
                })
            }


            // this.result = []
            // let searchResult = {query: this.query, result: {}}
            // this.result.push('result')
            // searchResult.result = this.result
            // this.history.push(searchResult)
            //Send the query to the backend
        },
        // When usr selected the choice they want
        selected: function () {
            const indexOfAnswerChoice = this.namesAndIdObj.names.indexOf(this.answerChoice)

            if (this.type == 'keyword') {
                socket.emit
            }
        },
    },
    components: {
        'result-component': resultComponent, 'detail-component': detailComponent
    }
})
//Sockets
socket.on('found', json_object => {
    displayChoices = false
    app.json_object_returned_from_find_method = json_object;
})

socket.on('search-successful', result => {
    let name = "name"
    if (app.choice == "movie") name = "title"

    // TODO: Implement the functionality of extracting the names of the result
    app.result = result

    app.result.results.forEach(element => {
        app.nameAndIdObj.names.push(element[name])
        app.nameAndIdObj.ids.push(element.id)
    });
    /* console.log("\n\nNow showing the names and IDs obj")
    console.log(app.nameAndIdObj) */

    displayChoices = true
})

// Show a comp when this is true
socket.on('no-results-found', result => {
    app.noResults = true
})

socket.on('search-failed', result => {
    // Indicate that the usr got a bad search
})

//app.find(3986, "keyword");
/*
 company
 keyword
 movie
 tv
 people
 */