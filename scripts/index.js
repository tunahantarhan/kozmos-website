console.log('Happy developing ✨')

/*
const form = document.querySelector('form');
const searchInput = document.getElementById('search');
const denemeText = document.getElementById('text');
form.addEventListener('submit', (e) => {
    e.preventDefault(); //Submit yapıldığında sayfanın reload atmaması işlevi
    denemeText.innerText = searchInput.value;
});
*/

// Örnek veri kartlarını doldurmak için
function populateSliders() {
    const sampleData = [
        {
            category: "muzik",
            posts: [
                { title: "Müziğin Gücü", image: "https://via.placeholder.com/280x150", description: "Müziğin hayatımızdaki etkisi..." },
                { title: "Rock ve Roll", image: "https://via.placeholder.com/280x150", description: "Rock müziğin altın çağı..." },
            ],
        },
        {
            category: "spor",
            posts: [
                { title: "Sporun Faydaları", image: "https://via.placeholder.com/280x150", description: "Sağlıklı yaşam için spor..." },
                { title: "Futbolun Dinamikleri", image: "https://via.placeholder.com/280x150", description: "Futbol dünyasına bir bakış..." },
            ],
        },
    ];

    sampleData.forEach((category) => {
        const slider = document.getElementById(`slider-${category.category}`);
        if (slider) {
            category.posts.forEach((post) => {
                const card = document.createElement("div");
                card.className = "post-card";
                card.innerHTML = `
          <img src="${post.image}" alt="${post.title}">
          <div class="post-card-content">
            <h3 class="post-card-title">${post.title}</h3>
            <p class="post-card-desc">${post.description}</p>
          </div>
        `;
                slider.appendChild(card);
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", populateSliders);

