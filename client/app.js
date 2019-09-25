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
        this.GETTopsLast = this.GETTopsLast.bind(this);
    }

    componentDidMount() {
        this.GETTopsLast()
    }

    GETTopsLast() {
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
                        let listOfSymbolLinks = []
                        for (let stock of JSON.parse(data)) {
                            listOfSymbolLinks.push(
                                stock["symbol"]
                            )
                        }
                        ls.set('list', listOfSymbolLinks);
                        ls.set('lastCacheRefresh', Date.now());
                        this.setState({
                            isLoaded: true,
                            list: listOfSymbolLinks,
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
        let currentList = [];
        let newList = [];

        if (e.target.value !== "") {
            currentList = this.props.items;

            // Use .filter() to determine which items should be displayed
            // based on the search terms
            newList = currentList.filter(item => {
                const lc = item.toLowerCase();
                const filter = e.target.value.toLowerCase();
                return lc.includes(filter);
            });
        } else {
            newList = this.props.items;
        }

        this.setState({
            filtered: newList
        });
    }

    render() {
        return (
            <div>
                <input type="text" className="input" onChange={this.handleChange} placeholder="Search for a stock's symbol..." />
                <ul>
                    {this.state.filtered.map(item => (
                        <li key={item}>
                            <a href={'http://localhost:3001/' + item}>{item}</a>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("app"));
