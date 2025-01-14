    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
    import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
    import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

    const firebaseConfig = {
    apiKey: "AIzaSyAbS0qfaMPmvwzHxuqGWXWKme1UwAvEqq0",
    authDomain: "blogwebsite-9e0fd.firebaseapp.com",
    projectId: "blogwebsite-9e0fd",
    storageBucket: "blogwebsite-9e0fd.appspot.com",
    messagingSenderId: "214876249431",
    appId: "1:214876249431:web:120f26b0ef1ab6e219f212",
    measurementId: "G-MDJTGEZD85"
};

    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = getDatabase();

    const loginForm = document.getElementById("login-form");
    const uploadForm = document.getElementById("upload-form");
    const logoutBtn = document.getElementById("logout-btn");
    const loginBtn = document.getElementById("login-btn");

    loginBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    console.log("Login successful", userCredential);
})
    .catch((error) => {
    console.error("Login failed", error);
    alert("Login failed: " + error.message);
});
});

    onAuthStateChanged(auth, (user) => {
    if (user) {
    loginForm.classList.add("hidden");
    uploadForm.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
} else {
    loginForm.classList.remove("hidden");
    uploadForm.classList.add("hidden");
    logoutBtn.classList.add("hidden");
}
});

    logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
        console.log("Logout successful");
    });
});

    document.getElementById("submit-post").addEventListener("click", () => {
    const title = document.getElementById("post-title").value;
    const description = document.getElementById("post-description").value;
    const category = document.querySelector('input[name="category"]:checked')?.value;
    const imageUrl = document.getElementById("post-image").value;
    const text = document.getElementById("post-text").value;
    const readingTime = document.getElementById("post-duration").value;
    const sources = document.getElementById("post-referances").value;
    const timestamp = Date.now();

    if (!title || !description || !category || !imageUrl || !text || isNaN(readingTime)) {
    alert("Tüm zorunlu alanları doldurun!");
    return;
}

    const postRef = ref(db, `posts/${timestamp}`);
    set(postRef, {
    title,
    description,
    category,
    readingTime,
    text,
    imageUrl,
    viewCount: 0,
    sources: sources || null,
})
    .then(() => {
    alert("Gönderi başarıyla eklendi!");
    document.getElementById("post-title").value = "";
    document.getElementById("post-description").value = "";
    document.getElementById("post-category").checked = false;
    document.getElementById("post-image").value = "";
    document.getElementById("post-text").value = "";
    document.getElementById("post-duration").value = "";
    document.getElementById("post-referances").value = "";
})
    .catch((error) => {
    console.error("Gönderi eklenirken hata oluştu", error);
    alert("Gönderi eklenirken hata oluştu: " + error.message);
});
});
