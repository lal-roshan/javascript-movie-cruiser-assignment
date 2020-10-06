// const DOMops = require('DOMops.js');

function getMovies() {
    let moviesPromise = fetch('http://localhost:3000/movies');

    moviesPromise.then((data) => {
        return data.json();
    })
    .then((response) => {
        let ul = document.getElementById('moviesList');
        if ([...response].length > 0) {
            response.forEach(element => {
                ul.innerHTML = ul.innerHTML + listItem(element, 'movie');
            });
        }
        else {
            ul.innerHTML = ul.innerHTML + nolistItem();
        }
    })
    .catch((error) => {
        console.log(error);
        console.log('Failed to Process Request !!!');
    });

}

function getFavourites() {
    let favouritesPromise = fetch('http://localhost:3000/favourites');

    favouritesPromise.then((data) => {
        return data.json();
    })
    .then((response) => {
        let ul = document.getElementById('favouritesList');
        if([...response].length > 0){
            response.forEach(element => {
                ul.innerHTML = ul.innerHTML + listItem(element);
            });
        }
        else{
            ul.innerHTML = ul.innerHTML + nolistItem();
        }
    })
    .catch((err) => {
        console.log(err);
        console.log('Failed to Process Request !!!');
    });
}

function addFavourite(id) {
    let moviePromise = fetch('http://localhost:3000/movies/' + id);

    moviePromise.then((data) => {
        return data.json();
    })
    .then((response) => {
        let addPromise = fetch('http://localhost:3000/favourites', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(response)
        });

        addPromise.then(() => {
            getFavourites();
        }).
        catch((error) => {
            console.log(error);
            console.log('Failed to Add New Employee Record')
        });

    });
}

function listItem(element, movie) {
    let elem = '<li class=\'list-group-item\''
        + listItemId(element.id)
        + listItemTitle(element.title, element.originalTitle, element.originalLanguage, element.releaseDate)
        + listItemOverview(element.overview);
    if (movie === 'movie') {
        elem = elem + addToFavButton(element.id);
    }
    elem = elem + '</li>';
    return elem;
}

function listItemId(id) {
    return '<p>#' + id + '</p>';
}

function listItemTitle(title, originalTitle, originalLanguage, releaseDate) {
    return '<blockquote class="blockquote">'
        + '<p class="lead text-capitalize font-weight-bold mb-0">' + title + '</p>'
        + listItemOriginalInfo(originalTitle, originalLanguage) 
        + listItemReleaseDate(releaseDate)
        + '</blockquote>';
}

function listItemOriginalInfo(originalTitle, originalLanguage) {
    return '<small class="text-muted d-inline-flex flex-wrap">' + originalTitle 
        + '<div class="text-uppercase ml-sm-1"> (' + originalLanguage + ') </div>'
    + '</small>';
}

function listItemReleaseDate(releaseDate) {
    return '<footer class="blockquote-footer flex-wrap d-flex">' + releaseDate + '</footer>';
}

function listItemOverview(overview) {
    return '<p><u>Overview</u></p>'
    + '<p class=\'d-flex flex-wrap w-100\'>' + overview + '</p>';
}

function nolistItem() {
    return '<li class=\'list-group-item\'>No Items</li>';
}

function addToFavButton(id) {
    return '<div class=\'w-100 d-flex justify-content-end\'>'
        + '<button class=\'btn btn-primary\' onclick=addFavourite(' + id + ')>Add To Favourites</button>'
        + '</div>';
}
module.exports = {
    getMovies,
    getFavourites,
    addFavourite
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution


