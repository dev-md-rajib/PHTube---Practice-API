var retrievedVideos = [];

function searchVideos() {
  const searchBar = document.getElementById("searchText");
  const text = searchBar.value;
  const link =
    "https://openapi.programming-hero.com/api/phero-tube/videos?title=" +
    text.trim();
  console.log(link);

  fetch(link)
    .then((res) => res.json())
    .then((data) => {
      retrievedVideos = data.videos;
      showVideos();
    });
}

function convertToNumber(str) {
  // Extract the numeric part and the suffix
  const suffix = str.slice(-1).toUpperCase();
  const value = parseFloat(str.slice(0, -1));

  // Multiply based on the suffix
  switch (suffix) {
    case "K": // Thousands
      return value * 1000;
    case "M": // Millions
      return value * 1000000;
    case "B": // Billions
      return value * 1000000000;
    default:
      // If no suffix, return the parsed value
      return parseFloat(str);
  }
}

// sorting
function sortByViews() {
  retrievedVideos.sort((a, b) => {
    let viewA = convertToNumber(a.others.views);
    let viewB = convertToNumber(b.others.views);

    return viewB - viewA;
  });
  showVideos();
}

function createVideo(video) {
  const card = document.createElement("div");
  card.classList.add(
    "card",
    "max-w-max",
    "flex",
    "flex-col",
    "items-start",
    "gap-3",
    "auto-rows-fr"
  );

  card.innerHTML = `
  
  <div class="img-container w-[300px] h-[200px] border overflow-hidden  rounded-lg">
            <img
              class="w-full h-full object-cover rounded-lg"
              src="${video.thumbnail}"
              alt="thumbnail of the video" />
            
          </div>

          <div class="flex gap-3 ">
            <div class="w-[40px] h-[40px]">
              <img class="w-full h-full object-cover rounded-[50%]" src="${
                video.authors[0]["profile_picture"]
              }" alt="" />
            </div>
            <div class="">
              <h2 class="font-bold">
                ${video.title}
              </h2>
              <div class="flex items-center gap-2">
                <p class="text-gray-500">${video.authors[0]["profile_name"]}</p>
                <div>
                  <img class="w-fit ${
                    video.authors[0]["verified"] == true ? "" : "hidden"
                  }" src="assets/Vector.png" alt="" />
                </div>
              </div>

              <p class="text-gray-500"> ${
                video["others"]["views"] + " views"
              }</p>
            </div>
          </div>
  `;

  return card;
}

function showVideos() {
  console.log(retrievedVideos);
  const container = document.getElementById("video-container");
  const empty = document.getElementById("empty-section");
  if (retrievedVideos.length == 0) {
    empty.classList.remove("hidden");
    container.classList.add("hidden");
    return;
  }
  empty.classList.add("hidden");
  container.classList.remove("hidden");

  container.innerHTML = "";

  for (video of retrievedVideos) {
    const vid = createVideo(video);
    container.appendChild(vid);
  }
}

function loadInitialVideos() {
  const link = "https://openapi.programming-hero.com/api/phero-tube/videos";
  fetch(link)
    .then((res) => res.json())
    .then((data) => {
      retrievedVideos = data.videos;
      showVideos();
    });
}

loadInitialVideos();
function addEventListenerToCategory(button, obj) {
  button.addEventListener("click", () => {
    const api =
      "https://openapi.programming-hero.com/api/phero-tube/category/" +
      obj["category_id"];

    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        retrievedVideos = data.category;
        showVideos();
      });

    const container = document.getElementById("category-button-container");
    const childs = container.childNodes;
    childs.forEach((child) => {
      child.classList.add("bg-gray-300");
      child.classList.remove("bg-red-500");
    });

    button.classList.add("bg-red-500");
  });

  return button;
}

function createCatButton(obj) {
  console.log(obj);
  const button = document.createElement("button");
  button.classList.add(
    "btn",
    "btn-primary",
    "bg-gray-300",
    "border-none",
    "text-gray-700"
  );
  button.innerText = obj.category;
  const btn = addEventListenerToCategory(button, obj);
  return btn;
}

function showCategory(data) {
  const cats = data.categories;
  //   console.log(cats);
  const catContainer = document.getElementById("category-button-container");
  for (cat of cats) {
    const button = createCatButton(cat);
    catContainer.appendChild(button);
  }
}

function loadCategory() {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => showCategory(data));
}

loadCategory();
