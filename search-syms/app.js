import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ls from 'local-storage';
import 'bulma/bulma';

const
    FIVE_MIN_IN_SEC = 300,
    DATE_MS_TO_SEC_DIV = 1000

class App extends Component {
    constructor(props) {
        super(props);
        let ls_list = []
        if (ls.get('list')) {
            ls_list = ls.get('list')
        }

        let ls_lastCacheRefresh = new Date()
        if (ls.get('lastCacheRefresh')) {
            ls_lastCacheRefresh = ls.get('lastCacheRefresh');
        }

        this.state = {
            error: null,
            isLoaded: false,
            list: ls_list,
            lastCacheRefresh: ls_lastCacheRefresh
        };
        this.fetchSymbols = this.fetchSymbols.bind(this);
    }

    componentDidMount() {
        console.log("MOUNTING...")
        this.fetchSymbols()
    }

    fetchSymbols() {
        let now = new Date()
        let diffSecs = ((now - ls.get('lastCacheRefresh')) / DATE_MS_TO_SEC_DIV)
        console.log("It has been " + diffSecs + " seconds since we last fetched!")
        if (diffSecs >= FIVE_MIN_IN_SEC) {
            console.log("FETCHING")
            fetch("http://localhost:3001/")
                .then(
                    response => response.json()
                )
                .then(
                    (data) => {
                        let listOfSymbolStrings = []
                        for (let stock of JSON.parse(data)) {
                            listOfSymbolStrings.push(stock["symbol"] + " was last priced at: $" + stock["price"])
                        }
                        ls.set('list', listOfSymbolStrings);
                        ls.set('lastCacheRefresh', Date.now());
                        this.setState({
                            isLoaded: true,
                            list: listOfSymbolStrings,
                            lastCacheRefresh: Date.now()
                        });
                    },
                    (error) => {
                        this.setState({
                            isLoaded: true,
                            error: error
                        });
                    }
                )
        } else {
            console.log("!!! NOT !!! FETCHING")
        }
    }

    render() {
        return (
            <div className="content">
                <div className="container">
                    <section className="section">
                        <List items={this.state.list} />
                    </section>
                </div>
            </div>
        );
    }
}

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filtered: []
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.setState({
            filtered: this.props.items
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            filtered: nextProps.items
        });
    }

    handleChange(e) {
        // Variable to hold the original version of the list
        let currentList = [];
        // Variable to hold the filtered list before putting into state
        let newList = [];

        // If the search bar isn't empty
        if (e.target.value !== "") {
            // Assign the original list to currentList
            currentList = this.props.items;

            // Use .filter() to determine which items should be displayed
            // based on the search terms
            newList = currentList.filter(item => {
                // change current item to lowercase
                const lc = item.toLowerCase();
                // change search term to lowercase
                const filter = e.target.value.toLowerCase();
                // check to see if the current list item includes the search term
                // If it does, it will be added to newList. Using lowercase eliminates
                // issues with capitalization in search terms and search content
                return lc.includes(filter);
            });
        } else {
            // If the search bar is empty, set newList to original task list
            newList = this.props.items;
        }
        // Set the filtered state based on what our rules added to newList
        this.setState({
            filtered: newList
        });
    }

    render() {
        return (
            <div>
                <input type="text" className="input" onChange={this.handleChange} placeholder="Search..." />
                <ul>
                    {this.state.filtered.map(item => (
                        <li key={item}>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("app"));
