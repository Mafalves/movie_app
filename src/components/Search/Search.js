import React from 'react';
import axios from "axios";
import './search.css';
const API_KEY = "43a5c8136ed44049ff6e6cd7416c5688"

// Gets the data for the Movies and TV Show tabs
const fetchData = async (type, category) => {
    const { data } = await axios.get(`https://api.themoviedb.org/3/${type}/${category}?api_key=${API_KEY}&language=en-US&page=1`)
    return data.results
}

// Gets the data from the searches
const fetchSearch = async (filter, query) => {
    const { data } = await axios.get(`https://api.themoviedb.org/3/search/${filter}?api_key=${API_KEY}&query=${query}`)
    return data.results
}

export default class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: "",
            searchFilter: "multi",
            category: "popular",
            isSelected: "movie",
            isLoading: false,
            content: [],
        };

        this.handleChangeQuery = this.handleChangeQuery.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeFilter = this.handleChangeFilter.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Loads the page already with the movies results
    async componentDidMount() {
        const data = await fetchData(this.state.isSelected, this.state.category)
        this.setState({ content: data })
    }

    // Handles changes on the query typed by the user 
    handleChangeQuery(event) {
        this.setState({
            searchQuery: event.target.value,
        });
    }

    // Handles changes on the filter selected by the user 
    handleChangeFilter = (event) => {
        this.setState({
            searchFilter: event.target.value,
        });
    }

    // Handles changes on the category selected by the user 
    handleChangeCategory = async (event) => {
        this.setState({
            isLoading: true,
            category: event.target.value,
        })

        const data = await fetchData(this.state.isSelected, event.target.value)

        console.log(data)
        this.setState({
            content: data,
            isLoading: false
        })
    }

    // Loads the page for the Movie tab when selected by the user 
    handleClickMovie = async (event) => {
        event.preventDefault();
        this.setState({ isLoading: true, isSelected: event.target.value })
        const data = await fetchData(event.target.value, this.state.category)
        this.setState({
            content: data,
            isLoading: false
        })
    }

    // Clears the content for the Search tab when selected by the user 
    handleClickSearch = async (event) => {
        event.preventDefault();
        this.setState({ isLoading: false, isSelected: event.target.value, content: [] })
    }

    // Loads the page with the results from the search
    handleSubmit = async (event) => {
        event.preventDefault();

        this.setState({ isLoading: true, isSelected: "search" })
        const data = await fetchSearch(this.state.searchFilter, this.state.searchQuery)

        this.setState({
            content: data,
            isLoading: false
        })
    }

    // Changes the category select options depending on watch tab the user current is
    getCategorySelect = (isSelected) => {
        switch (isSelected) {
            case 'movie':
                return (
                    <select value={this.state.category} onChange={this.handleChangeCategory} className="categories">
                        <option option value="upcoming">upcoming</option>
                        <option value="top_rated">top_rated</option>
                        <option value="popular">popular</option>
                        <option value="now_playing">now_playing</option>
                    </select>
                )
            case 'tv':
                return (
                    <select select value={this.state.category} onChange={this.handleChangeCategory} className="categories">
                        <option option value="airing_today">airing_today</option>
                        <option value="on_the_air">on_the_air</option>
                        <option value="popular">popular</option>
                        <option value="top_rated">top_rated</option>
                    </select>
                )
            default:
                return null
        }
    }

    render() {
        const { content } = this.state

        return (
            <div>
                <form className="search-form">

                    <input type="search" placeholder="Search" onChange={this.handleChangeQuery}></input>

                    <select value={this.state.searchFilter} onChange={this.handleChangeFilter}>
                        <option value="movie">movie</option>
                        <option value="multi">multi</option>
                        <option value="tv">tv</option>
                    </select>

                    <button value="Search" onClick={this.handleSubmit} className="btnSearch">Search</button>
                </form>

                <div className="container">
                    <nav>
                        <button onClick={this.handleClickMovie} value="movie">MOVIES</button>
                        <button onClick={this.handleClickSearch} value="search">SEARCH RESULTS</button>
                        <button onClick={this.handleClickMovie} value="tv"> TV SHOWS</button>
                    </nav>

                    {this.getCategorySelect(this.state.isSelected)}

                    <div className="results">
                        {content.map(res => {
                            return (<div className="result__content">
                                <img className="image-api" src={`https://image.tmdb.org/t/p/w500/${res.poster_path}`} />
                                <div className="text-api">
                                    <h3>{res.original_title}</h3>
                                    <p>Release Date: {res.release_date ? res.release_date : "undefined"}</p>
                                    <p>Popularity: {res.popularity}</p>
                                    <p className="text-api__overview">{res.overview}</p>
                                </div>
                            </div>)
                        })}
                    </div>
                </div>
            </div >
        );
    }
}


