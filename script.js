"use strict";

const btnSort = document.querySelector(".sort");
const categories = document.querySelector(".categories");
const grid = document.querySelector(".content-grid");

let currentCategory = "1000";
let currentVideos = [];
let categoryList = [];

btnSort.addEventListener("click", () => {
  currentVideos.sort((a, b) => {
    return parseInt(b.others.views) - parseInt(a.others.views);
  });
  console.log(currentVideos);
  renderVideos();
});

const getCategories = async function () {
  try {
    let html = "";
    const res = await fetch(
      "https://openapi.programming-hero.com/api/videos/categories"
    ).then((res) => res.json());

    res.data.forEach((el) => {
      html += `<li><a data-id=${el.category_id} class="category" href="#">${el.category}</a></li>`;
    });

    categories.innerHTML = html;

    categoryList = [...categories.querySelectorAll(".category")];
  } catch (err) {
    console.error("Could not fetch data!");
  }
};

const getVideos = async function (categoryId) {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/videos/category/${categoryId}`
    ).then((res) => res.json());

    currentVideos = res.data;
    renderVideos();
  } catch (err) {
    console.error("Could not fetch data!");
  }

  await getCategories();

  categoryList.forEach((el) => {
    if (el.dataset.id === currentCategory) el.classList.add("active-category");
    else el.classList.remove("active-category");
  });
};

const renderVideos = function () {
  if (currentVideos.length !== 0) {
    let html = "";
    currentVideos.forEach((video) => {
      const timeStamp =
        video.others.posted_date < 86400 ? video.others.posted_date : "";
      html += `<div class="content">
    <div class="thumbnail">
      <img src="${video.thumbnail}" />
      <p class="timestamp ${timeStamp ? "" : "hidden"}">${parseInt(
        timeStamp / 3600
      )}hrs ${parseInt(timeStamp % 60)}min ago</p>
    </div>
    <div class="details">
      <div class="cover">
        <img src="${video.authors[0].profile_picture}" />
      </div>
      <div class="text">
        <h2 class="title">
          ${video.title}
        </h2>
        <p class="channel-name">${video.authors[0].profile_name}</p>
        <p class="views">${video.others.views}</p>
      </div>
    </div>
  </div>`;
    });

    grid.innerHTML = html;
  } else {
    const html = `<div class="empty">
    <img src="./Icon.png" alt="Nothing to display" />    <h1>Oops!! Sorry, There is no content here</h1>
  </div>`;
    grid.innerHTML = html;
  }
};

getVideos(currentCategory);

categories.addEventListener("click", (e) => {
  if (e.target.tagName === "A") currentCategory = e.target.dataset.id;
  getVideos(currentCategory);
});
