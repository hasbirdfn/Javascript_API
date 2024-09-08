// Jquery untuk proses search keyword
// $('.search-button').on('click', function () { //button search

//     $.ajax({
//         // film bisa diganti sesuai keinginan
//         // ada parameter s yaitu untuk search
//         url : 'http://www.omdbapi.com/?apikey=eb2a539e&s=' + $('.input-keyword').val(),
//         success : results => { // callback
//             const movies = results.Search;
//             let cards = ''; // dibuat var let cards utk menumpuk
//             // setelah itu kita looping, data nya kita masukan kedalam card
//             movies.forEach(m => {
//                 cards += showCards(m); // buat fumction agar lebih rapih 
//         });
//             // tolong carikan class movies container, lalu isi htmlnya ganti pake cards yg sudah ditumpuk.
//             //maka hasilnya sesuai jumlah film pada api. 
//             $('.movies-container').html(cards); // 
    
//             // ketika tombol detail diklik
//             // manggil class modal imdbid
//             $('.modal-detail-button').on('click', function () {
//                  // cara mengambil ${m.imdbID}
//             //manggil ajax
//             $.ajax({
//                 url : 'http://www.omdbapi.com/?apikey=eb2a539e&i=' + $(this).data('imdbid'),
//                 success : m =>  {
//                     const movieDetail = showMovieDetail(m);
//               $('.modal-body').html(movieDetail); // diambil dari atas
//                 },
//                 error : (e) => {
//                     // kondisi jika error
//                     console.log(e.responseText);
//                 }
//             });
//         });
//         },
//         error : (e) => {
//             // kondisi jika error
//             console.log(e.responseText);
//         }
//     });
// });


// Menggantikan Codingan diatas menggunakan Fetch valilla javascript
// query selector = jika 1 elemen yg diambil
// query selectorAll = jika elemen nyabanyak. akan menghasilkan nodelis(array)

//langkah pengerjaan 1 buatkan function eventhendler (button search)
// const searchButton = document.querySelector('.search-button');
// searchButton.addEventListener('click', function () {
//     // kalo tombol di klik 
//     const inputKeyword = document.querySelector('.input-keyword'); // mencari dan mengambil class input-keyword
//     //mengambilkan fungsinya, tapi fetch mengembalkan ke promise,jadi datanya galangsung dapat.
//     //  maka perlu kasih method fulfield kalo berhail ngapain / gagal ngapain. menggunakan then
//     fetch('http://www.omdbapi.com/?apikey=eb2a539e&s=' + inputKeyword.value) // apapun yg diketik user, ambil value nya
//     .then(response => response.json())// datanya tampil, tapi bentuk nya masih promise, maka perlu then lagi dgn asynchronous
//     .then(response => {
//         // Langkah pengerjaan kedua2s
//         const movies = response.Search;
//         let cards = ''; // melakukan penumpukan data 
//         movies.forEach(m => cards += showCards(m)); // sudah tampil 10 film
//         const moviesContainer = document.querySelector('.movies-container') //ditampilkan pada index html
//         moviesContainer.innerHTML = cards;


//     // ketika tombol detail di-klik
//     const modalDetailButton = document.querySelectorAll('.modal-detail-button');
//     modalDetailButton.forEach(btn => {
//         btn.addEventListener('click', function () {
//            const imdbid = this.dataset.imdbid;
//            fetch( 'http://www.omdbapi.com/?apikey=eb2a539e&i='+ imdbid)
//            .then(response => response.json())
//            .then(m => {
//             const movieDetail = showMovieDetail(m);
//             const modalBody = document.querySelector('.modal-body');
//             modalBody.innerHTML = movieDetail; 
//            }); 
//         }); 
//     });
//     }); // nah ini bentuk nya sudah object
// }); 


// Cara ke 3 dilakukan refactoring / disederhanakan setiap codenya
// tambahkan asynch dan await agar dibaca js adalah asynchronous
const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', async function () { // krn sychronous, js gapaham yg mana asynchronous, maka tambahkan asych dan await 
    const inputKeyword = document.querySelector('.input-keyword');// ketik keyword, tunggu dulu sampe promise nya resolve
    // mengambil keyword yg diinput oleh user
    const movies = await getMovies(inputKeyword.value);
    updateUI(movies); // simpan ke container
});

// menampilkan tombol button
// event binding, element yg gaada tapi nantinya ada

document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('modal-detail-button')) {
        const imdbid = e.target.dataset.imdbid;
        const movieDetail = await getMovieDetail(imdbid); // mengambil data yg dipilih
        updateUIDetail(movieDetail); // menampilkan UI Detail
    }
});

function getMovieDetail(imdbid) {
    //mengembalikan nilai, maka perlu di return
   return fetch( 'http://www.omdbapi.com/?apikey=eb2a539e&i='+ imdbid)
    .then(response => response.json())
    .then(m => m);
}

function updateUIDetail(m) {
    const movieDetail = showMovieDetail(m);
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = movieDetail; 
}

function getMovies (keyword) {
    //karena mengembalikan data, perlu return
    return fetch('http://www.omdbapi.com/?apikey=eb2a539e&s=' + keyword) // jalanin perintah
        .then(response => response.json()) // krn ini promise 
        .then(response => response.Search);
}

function updateUI(movies) { 
    let cards = ''; 
    movies.forEach(m => cards += showCards(m)); 
    const moviesContainer = document.querySelector('.movies-container') 
    moviesContainer.innerHTML = cards;
}

// Jquery untuk proses mengambil data api
// halaman awal ketika di search data
function showCards(m) {
    return `<div class="col-md-4 my-3">
            <div class="card">
                <img src="${m.Poster}" class="card-img-top"> 
                <div class="card-body">
                  <h5 class="card-title">${m.Title}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
                  <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal" data-target="#movieDetailModal" data-imdbid="${m.imdbID}">Show Details</a>
                </div>
              </div>
        </div>`; 
}

// Function DetailMovie, mengambil data dari API.
function showMovieDetail(m) {
    return `<div class="container-fluid">
            <div class="row">
                <div class="col-md-4">
                    <img src="${m.Poster}" class="img-fluid">
                </div>
                <div class="col-md">
                    <ul class="list-group">
                        <li class="list-group-item"><h4>${m.Title} (${m.Year})</h4></li>
                        <li class="list-group-item"><strong>Director: </strong>${m.Director}</li>
                        <li class="list-group-item"><strong>Actors: </strong>${m.Actors}</li>
                        <li class="list-group-item"><strong>Writer: </strong>${m.Writer}</li>
                        <li class="list-group-item"><strong>Genre: </strong>${m.Genre}</li>
                        <li class="list-group-item"><strong>Plot: </strong>${m.Plot}</li>
                      </ul>
                </div>
            </div>
          </div>`;
} 