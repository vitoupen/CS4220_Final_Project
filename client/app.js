const resultComponent = {
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
}
const socket = io()
const app = new Vue({
    el: '#search-app',
    data: {
        category: ['tv'],
        choice: '',
        query: '',
        json_object_returned_from_find_method: {},
        result: [],
        //array for storing result object (extra-credit)
        history: []
        
    },
    methods: {

        getCategory: function () {

            //Need to get all the category from the backend

        },
        searchQuery: function () {
            //Testing
            this.result = []
            let searchResult = {query: this.query, result: {}}
            this.result.push('result')
            searchResult.result = this.result
            this.history.push(searchResult)
            //Send the query to the backend
        },
        find: function (id, type)
        {
            //When given an id and type
            //It gets the details about the item and returns the json_object
            if (type != "keyword")
                socket.emit('find', {id: id, type: type})
            //It might have to get the results from a keyword search
            else
                socket.emit('find_keyword', id)
            
            
        }
    },
    components: {
        'result-component': resultComponent
    }
})
//Sockets
socket.on('found', json_object => {
    app.json_object_returned_from_find_method = json_object;
})
//app.find(3986, "keyword");
/*
 company
 keyword
 movie
 tv
 people
 */