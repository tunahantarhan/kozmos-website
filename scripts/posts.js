import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const selectedCategory = getQueryParam("category");

const categoryList = document.getElementById("category-list");
categoryList.addEventListener("click", (e) => {
    const category = e.target.getAttribute("data-category");
    loadPosts(category);
});

function loadPosts(category = null) {
    const postsRef = ref(db, "posts");

    onValue(postsRef, (snapshot) => {
        const postContainer = document.getElementById("post-container");
        postContainer.innerHTML = "";

        if (snapshot.exists()) {
            let hasPosts = false;
            let postsArray = [];

            snapshot.forEach((childSnapshot) => {
                const postData = childSnapshot.val();
                const timestamp = postData.timestamp || childSnapshot.key;
                postData.id = childSnapshot.key;
                const postDate = new Date(parseInt(timestamp));
                const formattedDate = postDate.toLocaleDateString("tr-TR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                });

                if (!category || postData.category === category) {
                    postsArray.push({ postData, formattedDate, timestamp });
                    hasPosts = true;
                }
            });

            postsArray.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));

            postsArray.forEach(({ postData, formattedDate }) => {
                const postElement = createPostElement(postData, formattedDate);
                postContainer.appendChild(postElement);
            });

            if (!hasPosts) {
                postContainer.innerHTML = `<p><strong>${category}</strong> kategorisinde içerik bulunamadı.</p>`;
            }
        } else {
            postContainer.innerHTML = "<p>Henüz gönderi eklenmedi.</p>";
        }
    }, (error) => {
        console.error("Veri çekme hatası: ", error);
    });
}

function createPostElement(postData, formattedDate) {
    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.id = "post-card";

    postDiv.innerHTML = `
        <h2>${postData.title}</h2>
        <img src="${postData.imageUrl}" alt="${postData.title}" />
        <div class="date-and-time">
            <h5 class="post-card-date"><i class="fa-solid fa-calendar"></i>${formattedDate}</h5>
            <h5 class="post-card-readingTime"><i class="fa-solid fa-glasses"></i>${postData.readingTime} dk.</h5>
        </div>
        <p>${postData.description}</p>
        <a class="read-more clickable" id="read-more-btn" href="post-detail.html?title=${encodeURIComponent(postData.title)}&id=${postData.id}"><i class="fa-regular fa-eye"></i> Devamını Oku</a>
    `;

    postDiv.addEventListener("click", (event) => {
        window.location.href = `post-detail.html?title=${encodeURIComponent(postData.title)}&id=${postData.id}`;
    });

    return postDiv;
}

if (selectedCategory) {
    loadPosts(selectedCategory);
} else {
    loadPosts();
}

document.getElementById("grid-view-btn").addEventListener("click", () => {
    document.getElementById("post-container").style.display = "grid";
})

document.getElementById("list-view-btn").addEventListener("click", () => {
    document.getElementById("post-container").style.display = "block";
})


//mobil görünümde başlangıçta kategori filtreleme açılır kapanır menüsünün kapalı gözükmesi
document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth < 1160) {
        document.getElementById("category-list").style.display = "none";
        document.getElementById("filter-bar-section").style.height = "fit-content";
    }
});

document.getElementById("filter-toggle").addEventListener("click", () => {
    const categoryList = document.getElementById("category-list");
    const filterBarSection = document.getElementById("filter-bar-section");

    if (categoryList.style.display !== "none") {
        categoryList.style.display = "none";
        filterBarSection.style.height = "fit-content";
    } else {
        categoryList.style.display = "block";
        filterBarSection.style.height = "100vh";
    }
});



//mobildeyken filtreleme yaptıktan sonra filtreleme yerinin kapanması (kullanıcı deneyimi için önemli, değişikliğin algılanması adına)
document.querySelectorAll("#category-list li").forEach((item) => {
    item.addEventListener("click", (e) => {
        const category = e.target.getAttribute("data-category");
        loadPosts(category);

        if (window.innerWidth < 1160) {
            document.getElementById("category-list").style.display = "none";
            document.getElementById("filter-bar-section").style.height = "fit-content";
        }
    });
});


