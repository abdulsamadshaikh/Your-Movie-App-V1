/*  
Project Name: Your Movie App
Description: Get to know about your favorite movie. Give me a thumbs-up, If you like it. Enjoy!
Author: Abdul Samad
Author URI: https://getabdulsamad.com/
Version: 1.0
Tags: Mobile-friendly, All-Devices-Supported. 
*/

// Declare Counter variable
let curruntActive = 1

// API Variables
const API_KEY = '6c52291a2a51c6480e900b270690c575'
let API_URL_page = `${curruntActive}`
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=${API_URL_page}`
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query="`
// DOM Variables
const body = document.body;
const PopularMovies = document.getElementById('PopularMovies')
const PopularTitleEl = document.getElementById('PopularTitle')
const fallbackImg = '/img/fallback.jpg'
const PopularTitle = document.querySelector('#PopularTitle span')
const moviesContainer = document.getElementById('moviesContainer')
const form = document.getElementById('form')
const search = document.getElementById('search')
const searchBtn = document.getElementById('searchBtn')
const BackToHomeBtn = document.getElementById('BackToHome')
const pagination = document.getElementById('pagination')
const prevBtn = document.getElementById('prevBtn')
const nextBtn = document.getElementById('nextBtn')
const scrollUp = document.getElementById('scrollUp')

// Get initial Movies
getMovies(API_URL)

// Fetch Data function Using Async/Await Method
async function getMovies(url) {
    const res = await fetch(url)
    const data = await res.json()
    showMovies(data.results)
}

// Set DATA in DOM
function showMovies (movies) {
    moviesContainer.innerHTML = ''

    movies.forEach((movie) => {
        const {title, poster_path, vote_average, overview} = movie

        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')

        movieEl.innerHTML = `
                <div id="thumbnail" class="movie-thumbnail">
                    <img src="${checkMoviePoster()}" alt="${title}">
                </div>
                <div class="movie-info">
                    <h3>${title}</h3>
                    <span id="rating" class="${getClassByRate(vote_average)}">${vote_average}</span>
                </div>
                <div class="movie-overview">
                    <h3>Overview</h3>
                    <p>${overview}</p>
                </div>`

            moviesContainer.appendChild(movieEl)

            // Check Movie Poster If available or not
            function checkMoviePoster () {
                if (poster_path) {
                    return IMG_PATH + poster_path
                }
                else {
                    return fallbackImg
                }
            }
    })
}

// Ratings fucntion
function getClassByRate (rate) {
    if (rate >= 8) {
        return 'green'
    } 
    else if (rate >= 5) {
        return 'orange'
    }
    else {
        return 'red'
    }
}

// Movie Search fucntion
form.addEventListener('submit', (e) => {
    e.preventDefault()

    form.classList.add('active')
    const searchTerm = search.value
    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm)
        
        const getSearchResult = SEARCH_API + searchTerm

        async function getMoviesSearchResult (url) {
            const getRes = await fetch(url)
            const getData = await getRes.json()
            //console.log(getData.total_results)

            if (getData.total_results === 0) {
                moviesContainer.innerHTML = `
                <div class="not-found">
                    <p>We're sorry but we couldn't find a match. Please try another search.</p>
                    <button type="text" id="BackToHomeNotFound" class="back-to-home-not-found">Back To Home</button>
                </div>`

                const BackToHomeNt = document.getElementById('BackToHomeNotFound')
                BackToHomeNt.addEventListener('click', () => {
                    window.location.reload()
                })
            }
            else {
                BackToHomeBtn.style.display = 'block'
                BackToHomeBtn.addEventListener('click', () => {
                    window.location.reload()
                })
            }
        }
        getMoviesSearchResult (getSearchResult)
        search.value = ''

        PopularTitle.innerHTML = `<b>You Searched For:</b> ${searchTerm}`
        PopularTitle.classList.add('search-result')
        pagination.style.display = 'none'
    }
    else {
        window.location.reload()
        pagination.style.display = 'block'
    }
})

// Header Search Function
function searchBox () {
    searchBtn.innerHTML = '<i id="expandIcon" class="fas fa-arrows-alt-h"></i>'
    const expandIcon = document.getElementById('expandIcon')

    form.addEventListener('mouseover', (exapndIn) => {
        exapndIn.preventDefault()
        form.classList.add('active')
        searchBtn.innerHTML = '<i id="searcIcon" class="fas fa-search"></i>'
    })

    body.addEventListener('click', (exapndOut) => {
        if (exapndOut.target.closest('form')) return
        exapndOut.preventDefault()
        form.classList.remove('active')
        searchBtn.innerHTML = '<i id="expandIcon" class="fas fa-arrows-alt-h"></i>'
    })

}
searchBox ()

// Update Counter For Pagination
function updateCounter () {
    if (curruntActive === 1) {
        prevBtn.disabled = true
    }

    nextBtn.addEventListener('click', (next) => {
        curruntActive++

        if (curruntActive > 1) {
            prevBtn.disabled = false
            const GET_API_URL_PAGE_NEXT = `${API_URL + curruntActive}`
            getMovies(GET_API_URL_PAGE_NEXT)
        }
    })

    prevBtn.addEventListener('click', (prev) => {
        if (curruntActive === 1) {
            prevBtn.disabled = true
            return false
        }
        else {
            curruntActive--
            prevBtn.disabled = false
            const GET_API_URL_PAGE_PREV = `${API_URL + curruntActive}`
            getMovies(GET_API_URL_PAGE_PREV)
        }
    })
}
updateCounter ()

// Window On Scroll
window.scroll({
    top: 0, 
    left: 0, 
    behavior: 'smooth' 
})
scrollUp.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth'}) 
window.onscroll = () => window.scrollY > 500 ? scrollUp.style.display = 'block' : scrollUp.style.display = 'none'

// Onload Function
function onLoad () {
    BackToHomeBtn.style.display = 'none'
    scrollUp.style.display = 'none'
}
onLoad ()