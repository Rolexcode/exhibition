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

async function performSearch() {
  const assetType = document.getElementById("assetType").value;
  const queryInput = document.getElementById("searchInput");
  const query = queryInput.value.trim().toLowerCase();
  const resultArea = document.getElementById("resultArea");

  resultArea.innerHTML = "";

  if (!query) {
    alert("Please enter a search term!");
    return;
  }

  if (assetType === "icon") {
    const url = `https://api.iconify.design/search?query=${query}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data.icons || data.icons.length === 0) {
        resultArea.innerHTML = `<p class="white fs-s3">No icons found for "${query}".</p>`;
        return;
      }

      const grid = document.createElement("div");
      grid.className = "grid gap-6 mt-6";
      grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(100px, 1fr))";

      const icons = data.icons.slice(0, 30);

      for (const icon of icons) {
        const iconUrl = `https://api.iconify.design/${icon}.svg`;

        const wrapper = document.createElement("div");
        wrapper.className =
          "flex flex-col items-center justify-center p-3 bg-[#1e1e1e] br-6";

        const img = document.createElement("img");
        img.src = iconUrl;
        img.alt = icon;
        img.width = 40;
        img.className = "mb-2";
img.style.backgroundColor = "#374151"; // soft light-gray (Tailwind gray-100)
img.style.padding = "6px";
img.style.borderRadius = "8px";


        const downloadBtn = document.createElement("button");
        downloadBtn.className = "p-1 bg-transparent border-none";
        downloadBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-download" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="#60a5fa" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
  <path d="M7 11l5 5l5 -5" />
  <path d="M12 4v12" />
</svg>`;

        downloadBtn.onclick = () => downloadSVG(iconUrl, icon);

        wrapper.appendChild(img);
        wrapper.appendChild(downloadBtn);
        grid.appendChild(wrapper);
      }

      resultArea.appendChild(grid);
      queryInput.value = "";
    } catch (err) {
      resultArea.innerHTML = `<p class="white fs-s3">Error loading icons.</p>`;
      console.error(err);
    }
  }
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
    .catch((err) => console.error("Download error:", err));
}
