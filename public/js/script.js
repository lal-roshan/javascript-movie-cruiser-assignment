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
            return addFavPromise.then(() => {
                favouritesArray.push(favMovie);
                addListUI('favourites', append = true);
                return favouritesArray;
            })
            //If any error occurs in between it will be handled here
            .catch((err) => {
                return err;
            });
        }
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
        + listItemfooter(element, category);
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
    return `<small class="text-muted d-inline-flex flex-wrap originalTitle">`
                + originalTitle +
            `</small>
            <small class="text-muted text-uppercase ml-sm-1 originalLanguage">(`
                + originalLanguage +
            `)</small>`;
}

//Method for creating view for release date of movie
//<param name="releaseDate">The release date of the movie</param>
function listItemReleaseDate(releaseDate) {
    return '<footer class="blockquote-footer flex-wrap d-flex releaseDate">'
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

function listItemfooter(element){
    // let footer =  `<div class="container-fluid">
    //                     <div class="row">
    //                         <div class="col-12 col-md-6">`
    //                             + addFooterLeftSection(element) +
    //                         `</div>`;
    // //if category is moview then we need to add the button for adding to favourite
    // if (movie === 'movie') {
    //     elem = elem + addToFavButton(element.id);
    // }   

    // footer = footer + `</div></div>`;
    let footer = `<div class="movieFooter d-block d-md-flex">`
                + addLeftFooterSection(element);
    //if category is moview then we need to add the button for adding to favourite
    if (movie === 'movie') {
        footer = footer + addToFavButton(element.id);
    }

    footer += `</div>`;
    return footer;
            
    
}

//Method to create view for informations in the left side of footer of a movie detail
//<param name="element">The details of the movie</param>
function addLeftFooterSection(element){
    return `<div class="d-block d-md-flex justify-content-start">`
                + addItemPopularity(element.popularity) +
            `</div>`;
}

function addItemPopularity(popularity){
    
}

//Method for creating the add to favourites button
//<param name="id">The id of the movie</param>
function addToFavButton(id) {
    return `<div class="d-block d-md-flex justify-content-end">
                <button class="btn btn-primary" onclick=addFavourite(` + id + `)>
                    Add To Favourites
                </button>
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


