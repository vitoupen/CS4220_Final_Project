/* const resultComponent = {
    template: `<div>
    <p v-if="history.length">Search History</p>
        <ol>
            <li v-for="result in history">{{result}}</li>
        </ol>
    <br>
    <p v-if="result.length">Current Result: </p>
            <li v-for="result in result">{{result}}</li>
    </div>`,
    props: ['history', 'result']
} */
const resultComponent = {
    template: `<div>
    <p v-if="displayChoices">Current Result: </p>
            <li v-for="result in nameAndIdObj.names">{{result}}</li>
    </div>`,
    props: ['nameAndIdObj','displayChoices']
}

const socket = io()
const app = new Vue({
    el: '#search-app',
    data: {
        category: ['tv'],
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
                socket.emit('search', {query: this.query, choice: this.choice})
            }


            // this.result = []
            // let searchResult = {query: this.query, result: {}}
            // this.result.push('result')
            // searchResult.result = this.result
            // this.history.push(searchResult)
            //Send the query to the backend
        },
        // When usr selected the choice they want
        selected: function() {
            const indexOfAnswerChoice = this.namesAndIdObj.names.indexOf(this.answerChoice)
            
            if (this.type == 'keyword') {
                socket.emit
            }
        },
        find: function (id)
        {
            //When given an id and type
            //It gets the details about the item and returns the json_object
            if (type != "keyword")
                socket.emit('find', {id: id, type: type})
            //It might have to get the results from a keyword search
            else
                socket.emit('find_keyword', id)
        },
    },
    components: {
        'result-component': resultComponent
    }
})
//Sockets
socket.on('found', json_object => {
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

    console.log("\n\nNow showing the names and IDs obj")
    console.log(app.nameAndIdObj)

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