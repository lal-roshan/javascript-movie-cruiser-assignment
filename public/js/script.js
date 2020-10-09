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
        if(data.ok){
            return data.json();
        }
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
        if(data.ok){
            return data.json();
        }
    })
    //When the data was successfully fetched the returned json is recieved here as response
    .then((response) => {
            //Save the response as an array which represents the favourites
            favouritesArray = [...response];

            //Add the favourites elements in to the view
            addListUI('favourites');

            //Return the movi;es json list as response of the fetch operation
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
//<param name="id">Denotes the id of the movie that is to be added to favourites</param>
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

            //First trying to post the movie item to favourites and adding it to view if successful
            return addFavPromise.then((data) => {
                if(data.ok){
                    return data.json();
                }
            })
            .then((response) => {
                favouritesArray.push(response);
                /*Commented because when adding a favourite the page refreshes and anyway the newly added one will be
                populated in view using getFavourites.
                So for avoiding same operation on DOM multiple times
                // addListUI('favourites', append = true);
                */
                return favouritesArray;
            })
            //If any error occurs in between it will be handled here
            .catch((err) => {
                return err;
            });
        }
    }
}

//Method to delete an item from avourites list
//<param name="id">Denotes the id of the movie that is to be deleted from favourites</param>
function deleteFavourite(id) {

    let favouriteIndex = favouritesArray.findIndex(movie => movie.id === id);
    //Validating whether the selected movie was added as favourite
    if (favouriteIndex === -1) {
        alert('Movie is not added to favourites');
        throw new Error('Movie is not added to favourites');
    }
    else {

        //Creates a post fetch promise with the movie to be added as body
        let addFavPromise = fetch('http://localhost:3000/favourites/' + id, {
            method: 'DELETE'
        });

        //First trying to delete the movie item to favourites and adding it to view if successful
        return addFavPromise.then((data) => {
            if (data.ok) {
                 return data.json();
            }
        })
        .then(() => {
            favouritesArray.splice(favouriteIndex,1);
             return favouritesArray;
        })
         //If any error occurs in between it will be handled here
        .catch((err) => {
            return err;
        });
    }
}

//#region DOM part

//Method for adding the provided items to the view
//<param name="category">Denotes whether it is a movie list or favourites list</param>
//<param name="append">Denotes whether the item is to be appended to list or the list is
// to be populated as a whole, by default it is false</param>
function addListUI(category, append = false){
    let ul;
    let items = [];

    //Select the UL element from the view based on category
    if(category === 'movie'){
        ul = document.getElementById('moviesList');
        items = moviesArray;
    }
    else{
        ul = document.getElementById('favouritesList');
        items = favouritesArray;
    }

    //If the item is not be appended then clear all items in the UL
    if(!append){
        ul.innerHTML = '';
    }

    //If there are items in the array then add each of them as List Items in view
    if (items.length > 0) {
        items.forEach(element => {
            let li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = listItem(element, category);
            ul.appendChild(li);
        });
    }
    //If the array is empty add a List item with 'No Items!!' as content
    else {
        let li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = 'No Items!!';
        ul.appendChild(li);
    }
}

//Method for populating the content of List items
//<param name="element">Details of the movie item that is to be added to view</param>
//<param name="category">Used to determine whether or not to add a button at the end of item</param>
function listItem(element, category) {
    let elem = listItemId(element.id)
        + listItemTitle(element.title, element.originalTitle, element.originalLanguage, element.releaseDate)
        + listItemOverview(element.overview)
        + listItemFooter(element, category);
    return elem;
}

//Method for creating view for ID
function listItemId(id) {
    return '<p class="id">#' + id + '</p>';
}

//Method for creating view for Title , that contains The actual title, original title,
//original language and release date of the movie
//<param name="title">The title of the movie</param>
//<param name="orignalTitle">The original title of the movie</param>
//<param name="orignalLanguage">The original language of the movie</param>
//<param name="releaseDate">The release date of the movie</param>
function listItemTitle(title, originalTitle, originalLanguage, releaseDate) {
    return '<blockquote class="blockquote">'
        + '<p class="lead text-capitalize font-weight-bold mb-0 title">' + title + '</p>'
        + listItemOriginalInfo(originalTitle, originalLanguage) 
        + listItemReleaseDate(releaseDate)
        + '</blockquote>';
}

//Method for creating view for information related to original language and title of movie
//<param name="orignalTitle">The original title of the movie</param>
//<param name="orignalLanguage">The original language of the movie</param>
function listItemOriginalInfo(originalTitle, originalLanguage) {
    return `<small class="text-muted d-inline-flex flex-wrap originalTitle" title="Original Title">`
                + originalTitle +
            `</small>
            <small class="text-muted text-uppercase ml-sm-1 originalLanguage" title="Original Language">
                (` + originalLanguage + `)
            </small>`;
}

//Method for creating view for release date of movie
//<param name="releaseDate">The release date of the movie</param>
function listItemReleaseDate(releaseDate) {
    return '<footer class="blockquote-footer flex-wrap d-flex releaseDate" title="Release Date">'
                + releaseDate +
            '</footer>';
}

//Method for creating view for overview of movie
//<param name="overview">The overview of the movie</param>
function listItemOverview(overview) {
    return `<p><u>Overview</u></p>
            <p class="d-flex flex-wrap w-100 overview">`
                + overview +
            `</p>`;
}

//Method for creating view for informations to be shown in footer
//<param name="element">Details of the movie</param>
//<param name="category">Used to determine whether or not to add a button at the end of item</param>
function listItemFooter(element, category){
    let footer = `<hr class="mt-5"/>`
                + addItemPopularity(element.popularity)
                + addVotes(element.voteAverage, element.voteCount);

    //if category is movie then we need to add the button for adding to favourite
    if (category === 'movie') {
        footer = footer + addToFavButton(element.id);
    }
    //if category is not movie then we need to add the button for deleting from favourite
    else{
        footer = footer + addRemoveFavButton(element.id);
    }
    return footer;
}

//Method for creating view for showing the popularity of the movie
//<param name="popularity">The popularity figure of the movie</param>
function addItemPopularity(popularity) {
    return `<div class="text-dark d-flex justify-content-start mb-3 w-100" title="Popularity">`
                + popularity +
            `<i class="fas fa-fire-alt d-flex text-hot ml-2 text-align-center"></i>
            </div>`;
}

//Method for creating views for rating of the movie
//<param name="voteAverage">Average votes of the movie</param>
//<param name="voteCount">Number of votes for the movie</param>
function addVotes(voteAverage, voteCount){
    return `<div class="d-flex justify-content-start mb-3 w-100" title="Rating">`
                + addVoteAverage(voteAverage)
                + addVoteCount(voteCount) +
            `</div>`;
}

//Method for creating view for star rating of the movie
//<param name="voteAverage">Average votes of the movie</param>
function addVoteAverage(voteAverage){
    let rating = '<h5 class="mr-2">' + voteAverage.toFixed(1) +'</h5>';
    let stars = '<div class="stars">';
    let average = 1;
    while (average <= 5){
        if(voteAverage >= average)
        {
            stars += `<i class="fas fa-star checked"></i>`;
        }
        else if ((average - voteAverage) > 0 && (average - voteAverage) < 1){
            stars += `<i class="fas fa-star-half-alt checked"></i>`;
        }
        else{
            stars += `<i class="far fa-star"></i>`;
        }
        average++;
    }
    stars += `</div>`;
    rating += stars;
    return rating;
}

//Method for creating view for showing number of reviews of the movie
//<param name="voteCount">Number of votes for the movie</param>
function addVoteCount(voteCount) {
    return `<div class="text-muted ml-1">(` + voteCount + `)</div>`;
}

//Method for creating the add to favourites button
//<param name="id">The id of the movie</param>
function addToFavButton(id) {
    return `<div class="d-flex justify-content-end my-4 w-100">
                <button class="btn btn-dark" onclick=addFavourite(` + id + `) title="Add to favourites">
                    Add To Favourites
                </button>
            </div>`;
}

//Method for creating the remove from favourites button
//<param name="id">The id of the movie</param>
function addRemoveFavButton(id){
    return `<div class="d-flex justify-content-end my-4 w-100">
                <span class="fas fa-trash text-danger h4" onclick=deleteFavourite(` + id + `) title="Remove from favourites"></span>
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
// it's normal execution*/