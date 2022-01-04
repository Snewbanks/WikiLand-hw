import './App.css';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wikiSearchReturnValues: [],
      wikiSearchTerms: ''
    }
  }

  useWikiSearch = (e) => {
    e.preventDefault();

    this.setState({
      wikiSearchReturnValues: []
    });

    var url = "https://en.wikipedia.org/w/api.php";
    
    const pointerToThis = this;

  
    var params = {
      action: "query",
      list: "search",
      srsearch: this.state.WikiSearchTerms,
      format: 'json'
    };
    
    url = url + '?origin=*';
    Object.keys(params).forEach((key) => {
      url += '&' + key + "=" + params[key];
    });

    fetch(url)
      .then(
        function (response) {
          return response.json();
        }
      )
      .then(
        function (response) {

          for (var key in response.query.search) {
            pointerToThis.state.wikiSearchReturnValues.push({
              queyResultPageFullURL: 'no link', 
              queryResultPageID: response.query.search[key].pageid,
              queryResultPageTitle: response.query.search[key].title,
              queryResultPageSnippet: response.query.search[key].snippet,
            });

          }
        }
      )
      .then(
        function (response) {
          for (var key2 in pointerToThis.state.wikiSearchReturnValues) {
            
            let page = pointerToThis.state.wikiSearchReturnValues[key2];
            let pageID = page.queryResultPageID;
            let urlForRetrievingPageURLByPageID = `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=info&pageids=${pageID}&inprop=url&format=json`;

            fetch(urlForRetrievingPageURLByPageID)
            .then(
              function (response) {
                return response.json();
              }
            )
            .then(
              function (response) {
                page.queryResultPageFullURL = response.query.pages[pageID].fullurl;

                pointerToThis.forceUpdate();
              }
            )
          }

        }
      )

  }

  changeWikiSearchTerms = (e) => {
    this.setState({
      WikiSearchTerms: e.target.value
    });
  }

  render() {
    let wikiSearch = [];

    for (var key3 in this.state.wikiSearchReturnValues) {
      wikiSearch.push(
        <div className="search" key={key3}>
          <h3><a href={this.state.wikiSearchReturnValues[key3].queryResultPageFullURL}>{this.state.wikiSearchReturnValues[key3].queryResultPageTitle}</a></h3>
          <span className='link'><a href={this.state.wikiSearchReturnValues[key3].queryResultPageFullURL}>{this.state.wikiSearchReturnValues[key3].queryResultPageFullURL}</a></span>
          <p className="description" dangerouslySetInnerHTML={{__html: this.state.wikiSearchReturnValues[key3].queryResultPageSnippet}}></p>
        </div>
      );
    }

    console.log(wikiSearch);

    return (
      <div className="App">
        <h1>WikiLand</h1>
        <form action="">
          <input type="text" value={this.state.WikiSearchTerms || ''} onChange={this.changeWikiSearchTerms} placeholder='Type To Search ' />
          <button type='submit' onClick={this.useWikiSearch}>Enter</button>
        </form>
        {wikiSearch}
      </div>
    );
  }
}

export default App;