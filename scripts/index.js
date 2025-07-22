import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
    getDatabase,
    ref,
    onValue,
    orderByKey,
    limitToLast,
    query
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAbS0qfaMPmvwzHxuqGWXWKme1UwAvEqq0",
    authDomain: "blogwebsite-9e0fd.firebaseapp.com",
    projectId: "blogwebsite-9e0fd",
    storageBucket: "blogwebsite-9e0fd.firebasestorage.app",
    messagingSenderId: "214876249431",
    appId: "1:214876249431:web:120f26b0ef1ab6e219f212",
    measurementId: "G-MDJTGEZD85"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const searchInput = document.getElementById("search");
const searchResultsContainer = document.getElementById("searchResults");

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    searchResultsContainer.innerHTML = "";

    if (query.length < 2) return;

    const postsRef = ref(db, "posts");
    onValue(postsRef, (snapshot) => {

        const results = [];

        snapshot.forEach((childSnapshot) => {
            const postData = childSnapshot.val();
            const title = (postData.title || "").toLowerCase();
            const description = (postData.description || "").toLowerCase();
            const category = (postData.category || "").toLowerCase();

            if (title.includes(query) || description.includes(query) || category.includes(query)) {
                results.push({ id: childSnapshot.key, ...postData });
            }
        });

        if (results.length === 0) {
            searchResultsContainer.innerHTML = "<p>Sonuç bulunamadı.</p>";
            return;
        }

        results.forEach((post) => {
            const card = document.createElement("div");
            card.id = "search-card";
            card.innerHTML = `
                <img src="${post.imageUrl}" alt="${post.title}">
                <div>
                    <h3>${post.title}</h3>
                    <p>${post.description.substring(0, 70) + '...'}</p>
                </div>
            `;
            card.addEventListener("click", () => {
                window.location.href = `post-detail.html?title=${encodeURIComponent(post.title)}&id=${post.id}`;
            });
            searchResultsContainer.appendChild(card);
        });
    }, { onlyOnce: true }); // her inputta sadece bir kere tetiklesin
});

function populateSliders() {
    const postsRef = ref(db, 'posts');

    onValue(postsRef, (snapshot) => {
        const categories = {};

        snapshot.forEach((childSnapshot) => {
            const postData = childSnapshot.val();
            const timestamp = childSnapshot.key;

            const postDate = new Date(parseInt(timestamp));
            const formattedDate = postDate.toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            });

            if (!categories[postData.category]) {
                categories[postData.category] = [];
            }
            categories[postData.category].push({
                id: timestamp,  //database'de zaten id timestamp olarak tutuluyor
                title: postData.title,
                image: postData.imageUrl,
                description: postData.description.substring(0, 100) + '...',
                date: formattedDate,
                readingTime: postData.readingTime
            });
        });

        for (const category in categories) {
            //en yeni 3 post card filtreleme ve sıralama
            categories[category].sort((a, b) => b.id - a.id);
            const latestPosts = categories[category].slice(0, 3);

            const slider = document.getElementById(`slider-${category}`);
            if (slider) {
                slider.innerHTML = "";
                latestPosts.forEach((post) => {
                    const card = document.createElement("div");
                    card.className = "post-card";
                    card.innerHTML = `
                        <img src="${post.image}" alt="${post.title}">
                        <div class="post-card-content">
                            <h3 class="post-card-title">${post.title}</h3>
                            <p class="post-card-desc">${post.description}</p>
                            <div class="date-and-time">
                                <h5 class="post-card-date"><i class="fa-solid fa-calendar"></i>${post.date}</h5>
                                <h5 class="post-card-readingTime"><i class="fa-solid fa-glasses"></i>${post.readingTime} dk.</h5>
                            </div>
                        </div>
                    `;
                    slider.appendChild(card);

                    card.addEventListener("click", () => {
                        window.location.href = `post-detail.html?title=${encodeURIComponent(post.title)}&id=${post.id}`;
                    });
                });
            } else {
                console.warn(`Kategori için slider bulunamadı: ${category}`);
            }
        }
    }, (error) => {
        console.error("Veriyi çekerken hata oluştu: ", error);
    });
}


//en son paylaşımlar kısmı için slider doldurma
function populateLatestPosts() {
    const latestPostsRef = query(ref(db, 'posts'), orderByKey(), limitToLast(3));

    onValue(latestPostsRef, (snapshot) => {
        const posts = [];
        snapshot.forEach((childSnapshot) => {
            const postData = childSnapshot.val();
            const timestamp = childSnapshot.key;

            const postDate = new Date(parseInt(timestamp));
            const formattedDate = postDate.toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            });

            posts.unshift({ //sıralama
                id: timestamp,
                title: postData.title,
                image: postData.imageUrl,
                description: postData.description.substring(0, 100) + '...',
                date: formattedDate,
                readingTime: postData.readingTime
            });
        });

        const slider = document.getElementById("slider-tum-yazilar");
        if (slider) {
            slider.innerHTML = "";
            posts.forEach((post) => {
                const card = document.createElement("div");
                card.className = "post-card";
                card.innerHTML = `
                    <img src="${post.image}" alt="${post.title}">
                    <div class="post-card-content">
                        <h3 class="post-card-title">${post.title}</h3>
                        <p class="post-card-desc">${post.description}</p>
                        <div class="date-and-time">
                            <h5 class="post-card-date"><i class="fa-solid fa-calendar"></i>${post.date}</h5>
                            <h5 class="post-card-readingTime"><i class="fa-solid fa-glasses"></i>${post.readingTime} dk.</h5>
                        </div>
                    </div>
                `;
                slider.appendChild(card);

                card.addEventListener("click", () => {
                    window.location.href = `post-detail.html?title=${encodeURIComponent(post.title)}&id=${post.id}`;
                });
            });
        } else {
            console.warn("Gönderi bulunamadı.");
        }
    }, (error) => {
        console.error("Veri çekme hatası: ", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    populateLatestPosts();
    populateSliders();
});