// const DOMops = require('DOMops.js');
let favouritesArray = [];
let moviesArray = [];

function getMovies() {
    let moviesPromise = fetch('http://localhost:3000/movies');

    return moviesPromise.then((data) => {
        return data.json();
    })
    .then((response) => {
        moviesArray = [...response];
        addListUI('movie');
        return response;
    })
    .catch((error) => {
        console.log(error);
        error.message = 'Dummy error from server';
        return error;
    });

}

function getFavourites() {
    let favouritesPromise = fetch('http://localhost:3000/favourites');

    return favouritesPromise.then((data) => {
        return data.json();
    })
    .then((response) => {
        favouritesArray = [...response];
        addListUI('favourites');
        return response;
    })
    .catch((err) => {
        console.log(err);
        error.message = 'Dummy error from server';
        return err;
    });
}

function addFavourite(id) {
    if(favouritesArray && favouritesArray.find(movie => movie.id === id)){
        alert('Movie is already added to favourites');
        throw new Error('Movie is already added to favourites');
    }
    else{
        let favMovie = moviesArray.find(movie => movie.id === id);

        if(favMovie){
            let addFavPromise = fetch('http://localhost:3000/favourites',{
                method: 'POST',
                headers:{
                    'Content-type': "application/json"
                },
                body: JSON.stringify(favMovie)
            });

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


