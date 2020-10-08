// const DOMops = require('DOMops.js');

//array for tempoprarily storing all movies
let moviesArray = [];
//array for temporarily storing all favourite movies
let favouritesArray = [];

//Method for fetching all movies and populating them in the view
function getMovies() {
    let moviesPromise = fetch('http://localhost:3000/movies');

    //First trying to fetch the data and returning it as json
    return moviesPromise.then((data) => {
        return data.json();
    })
    //When the data was successfully fetched the returned json is recieved here as response
    .then((response) => {
        //Save the response as an array which represents the movies
        moviesArray = [...response];

        //Add the movie elements in to the view
        addListUI('movie');

        //Return the movies json list as response of the fetch operation
        return response;
    })
    //If some error occurs at any point in the fetch operation, they are handled here
    .catch((error) => {
        console.log(error);
        error.message = 'Dummy error from server';
        return error;
    });

}

//Method for fetching all favourite movies and populating them in the view
function getFavourites() {
    let favouritesPromise = fetch('http://localhost:3000/favourites');

    //First trying to fetch the data and returning it as json
    return favouritesPromise.then((data) => {
        return data.json();
    })
    //When the data was successfully fetched the returned json is recieved here as response
    .then((response) => {

        //Save the response as an array which represents the favourites
        favouritesArray = [...response];

        //Add the favourites elements in to the view
        addListUI('favourites');

        //Return the movies json list as response of the fetch operation
        return response;
    })
    //If some error occurs at any point in the fetch operation, they are handled here
    .catch((err) => {
        console.log(err);
        error.message = 'Dummy error from server';
        return err;
    });
}

//Method to add an item from movie list to favourites list
function addFavourite(id) {

    //Validating whether the selected movie was already added as favourite
    if(favouritesArray && favouritesArray.find(movie => movie.id === id)){
        alert('Movie is already added to favourites');
        throw new Error('Movie is already added to favourites');
    }
    else{
        //Get the movie item with the provided id from the movies array
        let favMovie = moviesArray.find(movie => movie.id === id);

        //If a valid movie was found
        if(favMovie){

            //Creates a post fetch promise with the movie to be added as body
            let addFavPromise = fetch('http://localhost:3000/favourites',{
                method: 'POST',
                headers:{
                    'Content-type': "application/json"
                },
                body: JSON.stringify(favMovie)
            });

            //First trying to post the movie item to favourites
            return addFavPromise.then((data) => {
                return data.json();
            })
            .then((response) => {
                favouritesArray.push(response);
                addListUI('favourites', append = true);
                return favouritesArray;
            })
            .catch((err) => {
                return err;
            });
        }
    }
}
//#region DOM part
function addListUI(category, append = false){
    let ul;
    let items = [];
    if(category === 'movie'){
        ul = document.getElementById('moviesList');
        items = moviesArray;
    }
    else{
        ul = document.getElementById('favouritesList');
        items = favouritesArray;
    }
    if(append){
        ul.innerHTML = '';
    }
    if (items.length > 0) {
        items.forEach(element => {
            let li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = listItem(element, category);
            ul.appendChild(li);
        });
    }
    else {
        let li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = 'No Items!!';
        ul.appendChild(li);
    }
}

function listItem(element, movie) {
    let elem = 
    // '<li class="list-group-item" data-movieId=\''+ element.id +'\'>' +
     listItemId(element.id)
        + listItemTitle(element.title, element.originalTitle, element.originalLanguage, element.releaseDate)
        + listItemOverview(element.overview)
        + addRest(element);
    if (movie === 'movie') {
        elem = elem + addToFavButton(element.id);
    }
    // elem = elem + '</li>';
    return elem;
}

function listItemId(id) {
    return '<p class="id">#' + id + '</p>';
}

function listItemTitle(title, originalTitle, originalLanguage, releaseDate) {
    return '<blockquote class="blockquote">'
        + '<p class="lead text-capitalize font-weight-bold mb-0 title">' + title + '</p>'
        + listItemOriginalInfo(originalTitle, originalLanguage) 
        + listItemReleaseDate(releaseDate)
        + '</blockquote>';
}

function listItemOriginalInfo(originalTitle, originalLanguage) {
    return '<small class="text-muted d-inline-flex flex-wrap originalTitle">' + originalTitle
        + '</small>'
        + '<small class="text-muted text-uppercase ml-sm-1 originalLanguage">(' + originalLanguage + ')</small>';
}

function listItemReleaseDate(releaseDate) {
    return '<footer class="blockquote-footer flex-wrap d-flex releaseDate">' + releaseDate + '</footer>';
}

function listItemOverview(overview) {
    return '<p><u>Overview</u></p>'
    + '<p class=\'d-flex flex-wrap w-100 overview\'>' + overview + '</p>';
}

function addToFavButton(id) {
    return '<div class=\'w-100 d-flex justify-content-end\'>'
        + '<button class=\'btn btn-primary\' onclick=addFavourite(' + id + ')>Add To Favourites</button>'
        + '</div>';
}

function addRest(element){
    return `<div class="d-none restDetails">
                <p class="voteCount">` + element.voteCount + `</p>
                <p class="video">` + element.video + `</p>
                <p class="voteAverage">` + element.voteAverage + `</p>
                <p class="popularity">` + element.popularity + `</p>
                <p class="posterPath">` + element.posterPath + `</p>
                <p class="adult">` + element.adult + `</p>
            </div>`;
}
//#endregion

module.exports = {
    getMovies,
    getFavourites,
    addFavourite
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution


