// const DOMops = require('DOMops.js');

function getMovies() {
    let moviesPromise = fetch('http://localhost:3000/movies');

    return moviesPromise.then((data) => {
        return data.json();
    })
    .then((response) => {
        let ul = document.getElementById('moviesList');
        ul.innerHTML = '';
        if ([...response].length > 0) {
            response.forEach(element => {
                ul.innerHTML = ul.innerHTML + listItem(element, 'movie');
            });
        }
        else {
            ul.innerHTML = ul.innerHTML + nolistItem();
        }
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
        let ul = document.getElementById('favouritesList');
        ul.innerHTML = '';
        if([...response].length > 0){
            response.forEach(element => {
                ul.innerHTML = ul.innerHTML + listItem(element);
            });
        }
        else{
            ul.innerHTML = ul.innerHTML + nolistItem();
        }
        return response;
    })
    .catch((err) => {
        console.log(err);
        error.message = 'Dummy error from server';
        return error;
    });
}

function addFavourite(id) {

    let movieItem = document.querySelector('#moviesList [data-movieId=\'' + id + '\']');

    // alert(movieItem.innerHTML);

    if(movieItem){
        let voteCount = movieItem.querySelector('.restDetails .voteCount').innerText;
        let video = movieItem.querySelector('.restDetails .video').innerText;
        let voteAverage = movieItem.querySelector('.restDetails .voteAverage').innerText;
        let title = movieItem.querySelector('.title').innerText;
        let popularity = movieItem.querySelector('.restDetails .popularity').innerText;
        let posterPath = movieItem.querySelector('.restDetails .posterPath').innerText;
        let originalLanguage = movieItem.querySelector('.originalLanguage').innerText;
        originalLanguage = originalLanguage.slice(1, originalLanguage.length - 1);
        let originalTitle = movieItem.querySelector('.originalTitle').innerText;
        let adult = movieItem.querySelector('.restDetails .adult').innerText;
        let overview = movieItem.querySelector('.overview').innerText;
        let releaseDate = movieItem.querySelector('.releaseDate').innerText;

        let movie = {
            voteCount: voteCount,
            id: id,
            video: video,
            voteAverage: voteAverage,
            title: title,
            popularity: popularity,
            posterPath: posterPath,
            originalLanguage: originalLanguage,
            originalTitle: originalTitle,
            adult: adult,
            overview: overview,
            releaseDate: releaseDate,
        }

        let jsonMovie = JSON.stringify(movie);
        let addPromise = fetch('http://localhost:3000/favourites', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: movie
        });

        return addPromise.then((response) => {
            console.log('then');
            console.log(response.statusText);
            if(response.status === 400){
                console.log('Movie is already added to favourites');
                return Promise.reject('Movie is already added to favourites');
            }
            getFavourites();
            return jsonMovie;
        }).
        catch((error) => {
            console.log('catch');
            error.message = 'Dummy error from server';
            return error;
        });
    }

    // return moviePromise.then((data) => {
    //     return data.json();
    // })
    // .then((response) => {
    //     let addPromise = fetch('http://localhost:3000/favourites', {
    //         method: 'POST',
    //         headers: {
    //             'content-type': 'application/json'
    //         },
    //         body: JSON.stringify(response)
    //     });

    //     addPromise.then(() => {
    //         getFavourites();
    //         return response;
    //     }).
    //     catch((error) => {
    //         console.log(error);
    //         console.log('Failed to Add New Employee Record')
    //         return null;
    //     });

    // }).
    // catch((err) => {
    //     return null;
    // });
}

function listItem(element, movie) {
    let elem = '<li class="list-group-item" data-movieId=\''+ element.id +'\'>'
        + listItemId(element.id)
        + listItemTitle(element.title, element.originalTitle, element.originalLanguage, element.releaseDate)
        + listItemOverview(element.overview)
        + addRest(element);
    if (movie === 'movie') {
        elem = elem + addToFavButton(element.id);
    }
    elem = elem + '</li>';
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

function nolistItem() {
    return '<li class=\'list-group-item\'>No Items</li>';
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

module.exports = {
    getMovies,
    getFavourites,
    addFavourite
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution


