/*********************************************************************************
 *  WEB422 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: IN HO HAN Student ID: 106053218 Date: 06/02/2023
 *  Railway URL: https://movieclient-production.up.railway.app/
 *
 ********************************************************************************/

let page = 1;
let perPage = 10;
const search = document.getElementById("searchForm");
const clear = document.getElementById("clearForm");
const currentPage = document.querySelector("#current-page");
const previousPage = document.querySelector("#previous-page");
const nextPage = document.querySelector("#next-page");
const searchInput = document.getElementById("title");
const tbody = document.querySelector("tbody");
const modalTitle = document.querySelector(".modal-title");
const modalBody = document.querySelector(".modal-body");

function loadMovieData(title = null) {
  let pagination = document.querySelector(".pagination");
  let movieString = "";

  if (title != null) {
    page = 1;
    pagination.classList.add("d-none");
    movieString = `https://blush-duck-slip.cyclic.app/api/movies?page=${page}&perPage=${perPage}&title=${title}`;
  } else {
    pagination.classList.remove("d-none");
    movieString = `https://blush-duck-slip.cyclic.app/api/movies?page=${page}&perPage=${perPage}`;
  }

  fetch(movieString)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      tbody.innerHTML = createTable(data);
      currentPage.innerHTML = page;
      const rows = Array.from(document.querySelectorAll(".table tbody tr"));
      rowsEvent(rows);
    })
    .catch((err) => {
      console.log(err);
    });
}

function rowsEvent(rows) {
  rows.map((row) => {
    row.addEventListener("click", (e) => {
      let id = e.target.closest("tr").dataset.id;
      fetch(`https://blush-duck-slip.cyclic.app/api/movies/${id}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const { movie } = data;
          modalTitle.innerHTML = movie.title;
          modalBody.innerHTML = createModal(movie);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
}

function createModal(movie) {
  const modalString = `
  ${
    movie.poster
      ? `<img class="img-fluid w-100" src="${movie.poster}"><br><br>`
      : ""
  }
  ${
    movie.directors.length > 0
      ? ` <strong>Directed By:</strong> ${movie.directors.join(", ")}<br><br>`
      : ""
  } 
  ${movie.fullplot ? `<p>${movie.fullplot}</p>` : ""} 
  ${
    movie.cast.length > 0
      ? `<strong>Cast:</strong> ${movie.cast.join(", ")}<br><br>`
      : ""
  }
  ${
    movie.awards.text
      ? ` <strong>Awards:</strong> ${movie.awards?.text}<br>`
      : ""
  }${
    movie.imdb
      ? `<strong>IMDB Rating:</strong> ${movie.imdb.rating} (${movie.imdb.votes} votes)`
      : ""
  }
  `;
  return modalString;
}

function createTable(data) {
  var movieString = "";
  data.movies.map((movie) => {
    movieString += `
    <tr data-id="${movie._id}"
        data-bs-toggle="modal"  
        data-bs-target="#detailsModal">
        <td>${movie.year}</td>
        <td>${movie.title}</td>
        <td>${movie.plot}</td>
        <td>${movie.rated ? movie.rated : "N/A"}</td>
        <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60)
      .toString()
      .padStart(2, "0")}</td>
      </tr>
      `;
  });
  return movieString;
}

window.addEventListener("DOMContentLoaded", (e) => {
  loadMovieData();
  previousPage.addEventListener("click", (e) => {
    if (page > 1) {
      page -= 1;
      loadMovieData();
    }
  });
  nextPage.addEventListener("click", (e) => {
    page += 1;
    loadMovieData();
  });
  search.addEventListener("submit", (e) => {
    e.preventDefault();
    loadMovieData(searchInput.value);
  });
  clear.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.value = "";
    loadMovieData();
  });
});
