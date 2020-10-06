function listItem(element, movie){
    let elem = '<li class=\'list-group-item\''
        + listItemId(element.id)
        + listItemTitle(element.title, element.originalTitle, element.originalLanguage, element.releaseDate)
        + listItemOverview(element.overview);
    if(movie === 'movie'){
        elem = elem + addToFavButton(element.id);
    }
    elem = elem + '</li>';
    return elem;
}

function listItemId(id){
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
    return '<small class="text-muted">' + originalTitle + '(' + originalLanguage + ')' + '</small>';
}

function listItemReleaseDate(releaseDate){
    return '<footer class="blockquote-footer">' + releaseDate +'</footer>';
}

function listItemOverview(overview){
    return '<p><u>Overview</u></p>'
        + '<p class=\'d-flex flex-wrap w-100\'>' + overview + '</p>';
}

function nolistItem(){
    return '<li class=\'list-group-item\'>No Items</li>';
}

function addToFavButton(id){
    return '<div class=\'w-100 d-flex justify-content-end\'>'
        + '<button class=\'btn btn-primary\' onclick=addFavourite(' + id +')>Add To Favourites</button>'
        + '</div>';
}

// module.exports = {
//     listItem
// };