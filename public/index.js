console.log('app. js')

let hamburger = document.querySelector('.hamburger')
let navItem = document.querySelector('.nav-items')
let navbar = document.getElementById('navbar')

hamburger.addEventListener('click', () => {
    if (hamburger.classList.contains('open')) {
        hamburger.classList.remove('open')
    } else {
        hamburger.classList.add('open')
    }
    console.log('click')
    navItem.classList.toggle('nav')
})

window.onscroll = function () { myFunction() }

function myFunction(e) {
    if (window.scrollY > 0) {
        navbar.classList.add('sticky')
        hamburger.classList.add('fixed')
    } else {
        navbar.classList.remove('sticky')
        hamburger.classList.remove('fixed')
        console.log('scrolling')
    }
}

let all = document.getElementById('all')
let beach = document.getElementById('beach')
let hill = document.getElementById('hill')

let sea = document.getElementsByClassName('sea')
let hillGallery = document.getElementsByClassName('hill')

all.classList.add('add')
all.addEventListener('click', () => {
    all.classList.add('add')
    beach.classList.remove('add')
    hill.classList.remove('add')
    for (let i = 0; sea.length > i; i++) {
        sea[i].style.display = 'block'
        hillGallery[i].style.display = 'block'
    }
})

beach.addEventListener('click', () => {
    beach.classList.add('add')
    hill.classList.remove('add')
    all.classList.remove('add')
    for (i = 0; sea.length > i; i++) {
        sea[i].style.display = 'block'
        hillGallery[i].style.display = 'none'
    }
    console.log('beach click')

})


hill.addEventListener('click', () => {
    hill.classList.add('add')
    beach.classList.remove('add')
    all.classList.remove('add')
    for (let i = 0; hillGallery.length > i; i++) {
        hillGallery[i].style.display = 'block'
        sea[i].style.display = 'none'
    }
})
