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

const postId = getQueryParam("id");

if (postId) {
    const postRef = ref(db, `posts/${postId}`);

    onValue(postRef, (snapshot) => {
        if (snapshot.exists()) {
            const postData = snapshot.val();

            document.title = `${postData.title} | Kozmos - Galaksi Rehberiniz`;

            const postDate = new Date(parseInt(postId));
            const formattedDate = postDate.toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            });
            
            document.getElementById("post-title").innerText = postData.title;
            document.getElementById("post-category").innerHTML = capitalizeLetters(postData.category);
            document.getElementById("post-date").innerHTML = formattedDate;
            document.getElementById("post-writer").innerHTML = postData.writer;
            document.getElementById("post-duration").innerHTML = `${postData.readingTime} dk.`;
            //document.getElementById("post-view-count").innerHTML = `${postData.viewCount} görüntüleme`;
            document.getElementById("post-description").innerHTML = postData.description;
            document.getElementById("post-text").innerHTML = postData.text;
            document.getElementById("post-image").src = postData.imageUrl;
            document.getElementById("post-sources").innerHTML = postData.sources ? postData.sources : "Kaynak belirtilmemiş.";
        } else {
            console.error("Post bulunamadı.");
        }
    }, (error) => {
        console.error("Veri çekme hatası: ", error);
    });
} else {
    console.error("Post ID bulunamadı.");
}

function capitalizeLetters(str) {
    const splitStr = str.split('-');
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' & ');
}