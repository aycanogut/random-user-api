import axios from "axios";
import "./styles/style.css";
import "./styles/normalize.css";

// DOM Pages ( select and filter page )
const container = document.querySelector("#app");
const userSelectPage = document.querySelector("#user-select");
const userFilterPage = document.querySelector("#user-filter");

// userSelectPage and userFilterPage form elements
const formSelect = userSelectPage.querySelector(".form-user-select");
const formFilter = userFilterPage.querySelector(".form-filter");

// userFilterPage select item
const citySelect = formFilter.querySelector("#city-select");

// slide age inputs
const minimumAge = formFilter.querySelector("#min-age");
const maximumAge = formFilter.querySelector("#max-age");

// new query search button
const newQueryButton = userFilterPage.querySelector(".new-query-btn-item");

// array of all users to store data on localStorage
let users = [];

// list node of DOM
const ul = userFilterPage.querySelector(".users");

// main function ( gets input data from user and makes an api request with that data )
const userSelection = (e) => {
  // userSelectPage input values
  const userCountValue = formSelect.querySelector("#user-count").value;
  const userGender = formSelect.querySelector("#gender-select").value;

  // data validation and
  if (!userCountValue) {
    alert("Enter a value.");
    e.preventDefault();
  } else {
    userSelectPage.remove();
    userFilterPage.classList.remove("hide-item");
  }

  // users data from API with count and gender informations
  const url = `https://randomuser.me/api/?results=${userCountValue}&inc=name,gender,age,location,picture,dob&gender=${userGender}`;

  // this function gets data from randomuser API with axios and creates UI. then appends the data to the DOM dynamically
  const getUsers = async (url) => {
    const response = await axios(url);

    // create an array from json data
    users = response.data.results;

    // map that data and create new user
    users.map((item) => {
      const name = `${item.name.first} ${item.name.last}`;
      const gender = item.gender;
      const age = item.dob.age;
      let location = item.location.city.toString().split(" ").join("-");
      const image = item.picture.large;
      const id = Date.now(); // :) create unique id for each user
      item.id = id; // match with item

      // single user ( list item )
      const listItem = `
        <li class="user" id=${id}>
          <img class="user-image" src="${image}" alt="user image" />
          <span class="user-name">${name}</span>
          <span>${age}</span>
          <span>${location}</span>
        </li>`;

      // append user items to the ul dom node
      ul.innerHTML += listItem;

      // filter page city options
      const city = `<option class="city-option" value=${location}>${location}</option>`;

      // append cities to the select dom node ( this code renders options dynamically in select input )
      citySelect.innerHTML += city;
    });

    // set user items to the localStorage
    localStorage.setItem("users", JSON.stringify(users));
  };

  // invoke the getUsers function with api url parameter
  getUsers(url);
};

// this function filters rendered users by their city and age range
const filterUsers = (e) => {
  ul.innerHTML = ""; // clear users wrapper before filtering
  let users = JSON.parse(localStorage.getItem("users"));

  users.map((item) => {
    const name = `${item.name.first} ${item.name.last}`;
    const gender = item.gender;
    const age = item.dob.age;
    let location = item.location.city.toString().split(" ").join("-");
    const image = item.picture.large;
    const id = Date.now(); // :) create unique id for each user
    item.id = id; // match with item

    // single user ( list item )
    const listItem = `
      <li class="user" id=${id}>
        <img class="user-image" src="${image}" alt="user image" />
        <span class="user-name">${name}</span>
        <span>${age}</span>
        <span>${location}</span>
      </li>`;

    // update dom if the city is same
    if (citySelect.value === location) {
      if (age <= maximumAge.value && age >= minimumAge.value) {
        ul.innerHTML += listItem;
      } else {
        ul.innerHTML = `<h1>No Related Search</h1>`;
      }
    }
  });

  e.preventDefault();
};

// addEventListeners

// index page event listener for form submit
formFilter.addEventListener("submit", (e) => {
  filterUsers(e);
});

// form submit event ( invokes the main function )
formSelect.addEventListener("submit", (e) => {
  userSelection(e);
});

// update slider values in real time
minimumAge.addEventListener(
  "change",
  (e) => (document.querySelector("#slider-min").textContent = e.target.value)
);

maximumAge.addEventListener(
  "change",
  (e) => (document.querySelector("#slider-max").textContent = e.target.value)
);

// filter-page new query button event
newQueryButton.addEventListener("click", () => {
  userFilterPage.classList.add("hide-item");
  app.append(userSelectPage);

  // clear localStorage and DOM
  let users = JSON.parse(localStorage.getItem("users"));
  users = [];
  localStorage.setItem("users", JSON.stringify(users));
  citySelect.innerHTML = "";
  ul.innerHTML = "";
});

// conditional rendering of document
window.onload = () => {
  const users = JSON.parse(localStorage.getItem("users"));

  if (users.length === 0) {
    userFilterPage.classList.add(".hide-item");
    console.log(users.length);
  }
  if (users.length !== 0) {
    userSelectPage.remove();
    userFilterPage.classList.remove("hide-item");
    // map that data and create new user
    users.map((item) => {
      const name = `${item.name.first} ${item.name.last}`;
      const gender = item.gender;
      const age = item.dob.age;
      let location = item.location.city.toString().split(" ").join("-");
      const image = item.picture.large;
      const id = Date.now(); // :) create unique id for each user
      item.id = id; // match with item
      // single user ( list item )
      const listItem = `
        <li class="user" id=${id}>
          <img class="user-image" src="${image}" alt="user image" />
          <span class="user-name">${name}</span>
          <span>${age}</span>
          <span>${location}</span>
        </li>`;
      // append user items to the ul dom node
      ul.innerHTML += listItem;
      // filter page city options
      const city = `<option class="city-option" value=${location}>${location}</option>`;
      // append cities to the select dom node ( this code renders options dynamically in select input )
      citySelect.innerHTML += city;
    });
  }
};
