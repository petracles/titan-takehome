import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bulma/bulma';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            list: [],
            lastCacheRefresh: Date
        };
        this.fetchSymbols = this.fetchSymbols.bind(this);
    }

    componentDidMount() {
        // let now = new Date();
        // let diffMs = (this.state.lastCacheRefresh - now); // milliseconds between now & lastCacheRefresh
        // let diffMin = Math.round(diffMs / 60000); // minutes
        // console.log(diffMin + " minutes since " + this.state.lastCacheRefresh
        // );

        console.log("MOUNTING...")
        this.fetchSymbols()
    }

    fetchSymbols() {
        console.log("refreshSymbols was just called")
        fetch("http://localhost:3001/")
            .then(
                response => response.json()
            )
            .then(
                (data) => {
                    let listOfSymbolStrings = []
                    for (let stock of JSON.parse(data)) {
                        listOfSymbolStrings.push(stock["symbol"] + "was last priced at: $" + stock["price"])
                    }
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
