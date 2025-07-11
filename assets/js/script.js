$(document).ready(function () {

    // toggle mobile menu
    $('[data-toggle="toggle-nav"]').on('click', function () {
        $(this).closest('nav').find($(this).attr('data-target')).toggleClass('hidden');
        return false;
    });

    // feather icons
    feather.replace();

    // smooth scroll
    var scroll = new SmoothScroll('a[href*="#"]');

    // tiny slider
    $('#slider-1').slick({
        infinite: true,
        prevArrow: $('.prev'),
        nextArrow: $('.next'),
    });

    $('#slider-2').slick({
        dots: true,
        arrows: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        centerMode: true,
        customPaging: function (slider, i) {
            return '<div class="bg-white br-round w-1 h-1 opacity-50 mt-5" id=' + i + '> </div>'
        },
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 1
            }
        }, ]
    });
});



async function performSearch() {
  const assetType = document.getElementById("assetType").value;
  const query = document.getElementById("searchInput").value.trim().toLowerCase();

  const resultArea = document.getElementById("resultArea");
  resultArea.innerHTML = ''; // clear old results

  if (!query) return alert("Please enter a search term!");

  if (assetType === "icon") {
    const url = `https://api.iconify.design/search?query=${query}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.icons.length === 0) {
        resultArea.innerHTML = `<p class="white fs-s3">No icons found for "${query}".</p>`;
        return;
      }

      // Display first 20 icons
      const icons = data.icons.slice(0, 20);
      icons.forEach(icon => {
        const iconUrl = `https://api.iconify.design/${icon}.svg`;

        const iconDiv = document.createElement('div');
        iconDiv.className = "p-2 m-2 bg-indigo-lightest-10 br-8 inline-block";

        const img = document.createElement('img');
        img.src = iconUrl;
        img.alt = icon;
        img.width = 40;

        iconDiv.appendChild(img);
        resultArea.appendChild(iconDiv);
      });

    } catch (err) {
      resultArea.innerHTML = `<p class="white fs-s3">Error loading icons.</p>`;
      console.error(err);
    }
  }
}
