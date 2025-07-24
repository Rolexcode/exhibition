$(document).ready(function () {
  // toggle mobile menu
  $('[data-toggle="toggle-nav"]').on("click", function () {
    $(this)
      .closest("nav")
      .find($(this).attr("data-target"))
      .toggleClass("hidden");
    return false;
  });

  // feather icons
  feather.replace();

  // smooth scroll
  var scroll = new SmoothScroll('a[href*="#"]');

  // tiny slider
  $("#slider-1").slick({
    infinite: true,
    prevArrow: $(".prev"),
    nextArrow: $(".next"),
  });

  $("#slider-2").slick({
    dots: true,
    arrows: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: true,
    customPaging: function (slider, i) {
      return (
        '<div class="bg-white br-round w-1 h-1 opacity-50 mt-5" id=' +
        i +
        "> </div>"
      );
    },
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });
});





const PEXELS_API_KEY = "Tg7h6H6MGULaRTJqIPihDNiZfiCRVdsNk3lUqM5EZqewsXReAAAfVfl7"; // <-- Replace this!

async function performSearch() {
  const assetType = document.getElementById("assetType").value;
  const queryInput = document.getElementById("searchInput");
  const query = queryInput.value.trim().toLowerCase();
  const resultArea = document.getElementById("resultArea");

  resultArea.innerHTML = "";

  if (!query) return showToast("Please enter a search term!");

  switch (assetType) {
    case "icon":
      await searchIcons(query, resultArea);
      break;
    case "photo":
      await searchImages(query, resultArea);
      break;
    case "video":
      await searchVideos(query, resultArea);
      break;
    case "svg":
      showToast("SVG search is coming soon...");
      break;
    default:
      showToast("Unsupported asset type selected.");
  }
}


// ICON SEARCH (Iconify)
async function searchIcons(query, resultArea) {
  const queryInput = document.getElementById("searchInput");
  const url = `https://api.iconify.design/search?query=${query}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.icons?.length) {
      resultArea.innerHTML = `<p class="white fs-s3">No icons found for "${query}".</p>`;
      return;
    }

    const grid = createGrid();
    const icons = data.icons.slice(0, 30);
    for (const icon of icons) {
      const iconUrl = `https://api.iconify.design/${icon}.svg`;

      const wrapper = createAssetWrapper();

      const img = document.createElement("img");
      img.src = iconUrl;
      img.alt = icon;
      img.width = 40;
      img.className = "mb-2";
      img.style.backgroundColor = "#374151";
      img.style.padding = "6px";
      img.style.borderRadius = "8px";

      const downloadBtn = createDownloadButton(() => downloadSVG(iconUrl, icon));

      wrapper.appendChild(img);
      wrapper.appendChild(downloadBtn);
      grid.appendChild(wrapper);
    }

    resultArea.appendChild(grid);
    queryInput.value = "";
  } catch (err) {
    resultArea.innerHTML = `<p class="white fs-s3">Error loading icons.</p>`;
    console.error(err);
    showToast("Error loading icons.");
  }
}

// PHOTO SEARCH (Unsplash)
const UNSPLASH_ACCESS_KEY = "e4thUoQWrH9Q9hJWXdqVITQO5WDZOhFuxyDG9lTAGXQ";

async function searchImages(query, resultArea) {
  const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=9&client_id=${UNSPLASH_ACCESS_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results?.length) {
      resultArea.innerHTML = `<p class="white fs-s3">No images found for "${query}".</p>`;
      return;
    }

    const grid = createGrid("150px");

    for (const item of data.results) {
      const wrapper = createAssetWrapper();

      const img = document.createElement("img");
      img.src = item.urls.small;
      img.alt = item.alt_description || query;
      img.width = 150;
      img.className = "mb-2 br-3";

      const downloadBtn = createDownloadButton(async () => {
        try {
          const blob = await fetch(item.urls.full).then(res => res.blob());
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${query || "unsplash-image"}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (err) {
          console.error("Image download failed:", err);
          showToast("Image download failed.");
        }
      });

      wrapper.appendChild(img);
      wrapper.appendChild(downloadBtn);
      grid.appendChild(wrapper);
    }

    resultArea.appendChild(grid);
  } catch (err) {
    console.error("Error loading images:", err);
    showToast("Error loading images.");
  }
}

// NEW: VIDEO SEARCH (Pexels)
async function searchVideos(query, resultArea) {
  const url = `https://api.pexels.com/videos/search?query=${query}&per_page=6`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    const data = await res.json();

    if (!data.videos?.length) {
      resultArea.innerHTML = `<p class="white fs-s3">No videos found for "${query}".</p>`;
      return;
    }

    const grid = createGrid("300px");

    data.videos.forEach((video) => {
      const wrapper = createAssetWrapper();

      const vid = document.createElement("video");
      vid.src = video.video_files.find((v) => v.quality === "sd").link;
      vid.controls = true;
      vid.width = 300;
      vid.className = "mb-2";

      const downloadBtn = createDownloadButton(() => {
        const link = document.createElement("a");
        link.href = vid.src;
        link.download = `${query}-video.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });

      wrapper.appendChild(vid);
      wrapper.appendChild(downloadBtn);
      grid.appendChild(wrapper);
    });

    resultArea.appendChild(grid);
  } catch (err) {
    console.error("Video fetch failed:", err);
    showToast("Failed to load videos.");
  }
}

// UTILITIES
function createGrid(minWidth = "100px") {
  const grid = document.createElement("div");
  grid.className = "grid gap-6 mt-6";
  grid.style.gridTemplateColumns = `repeat(auto-fill, minmax(${minWidth}, 1fr))`;
  return grid;
}

function createAssetWrapper() {
  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-col items-center justify-center p-3 bg-[#1e1e1e] br-6";
  return wrapper;
}

function createDownloadButton(onClick) {
  const btn = document.createElement("button");
  btn.className = "p-1 bg-transparent border-none";
  btn.innerHTML = downloadIconSVG();
  btn.onclick = onClick;
  return btn;
}

function downloadSVG(url, name) {
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${name}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((err) => {
      console.error("Download error:", err);
      showToast("SVG download failed.");
    });
}

function downloadIconSVG() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-download" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="#60a5fa" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 11l5 5l5 -5" />
      <path d="M12 4v12" />
    </svg>
  `;
}

// Toast Message
function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #111;
    color: #fff;
    padding: 12px 20px;
    border-radius: 6px;
    z-index: 1000;
    box-shadow: 0 0 10px #0005;
    font-size: 14px;
  `;
  document.body.appendChild(toast);
  setTimeout(() => document.body.removeChild(toast), 3000);
}
