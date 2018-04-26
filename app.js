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
    props: ['history','result']
}
const app = new Vue({
    el: '#search-app',
    data: {
        category: ['tv'],
        choice: '',
        query: '',
        result: [],
        //array for storing result object (extra-credit)
        history: []
    },
    methods:{

        getCategory: function(){
           
            //Need to get all the category from the backend
       
        },
        searchQuery: function(){  
            //Testing
            this.result = []
            let searchResult = {query: this.query,result: {} }
            this.result.push('result')
            searchResult.result = this.result
            this.history.push(searchResult)
            //Send the query to the backend
        }
    },
    components:{
        'result-component': resultComponent
    }
 })
 //Sockets

 