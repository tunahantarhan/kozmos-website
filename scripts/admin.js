import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { get, getDatabase, ref, remove, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
const postsList = document.getElementById("posts-list");
const submitBtn = document.getElementById("submit-post");
const updateBtn = document.getElementById("update-post");

updateBtn.style.display = "none";

let updatingPostId = null;
let currentUserRole = null;

tinymce.init({
    selector: '#post-text',
    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
    height: 400,
    setup: function (editor) {
        editor.on('change', function () {
            editor.save();
        });
    }
});

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
        const userRoleRef = ref(db, `users/${user.uid}/role`);
        get(userRoleRef).then((snapshot) => {
            if (snapshot.exists()) {
                currentUserRole = snapshot.val();
                loginForm.classList.add("hidden");
                uploadForm.classList.remove("hidden");
                logoutBtn.classList.remove("hidden");
                document.getElementById("all-posts").classList.remove("hidden");
                fetchPosts();
            } else {
                alert("Erişim hatası.");
                signOut(auth);
            }
        }).catch((error) => {
            console.error("Rol alınırken hata:", error);
            alert("Giriş hatası: " + error.message);
        });
    } else {
        loginForm.classList.remove("hidden");
        uploadForm.classList.add("hidden");
        logoutBtn.classList.add("hidden");
        document.getElementById("all-posts").classList.add("hidden");
    }
});

logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
        console.log("Logout successful");
    });
});

submitBtn.addEventListener("click", () => {
    const postData = collectPostData();
    if (!postData) return;

    const timestamp = Date.now();
    const postRef = ref(db, `posts/${timestamp}`);

    set(postRef, { ...postData, viewCount: 0 })
        .then(() => {
            alert("Gönderi başarıyla eklendi!");
            clearForm();
            fetchPosts();
        })
        .catch((error) => {
            console.error("Gönderi eklenirken hata oluştu", error);
            alert("Gönderi eklenirken hata oluştu: " + error.message);
        });
});

updateBtn.addEventListener("click", () => {
    if (!updatingPostId) return;
    const postData = collectPostData();
    if (!postData) return;

    const postRef = ref(db, `posts/${updatingPostId}`);
    set(postRef, postData)
        .then(() => {
            alert("Yazı güncellendi!");
            updatingPostId = null;
            updateBtn.style.display = "none";
            submitBtn.style.display = "inline-block";
            clearForm();
            fetchPosts();
        })
        .catch((error) => {
            console.error("Güncelleme hatası:", error);
            alert("Güncelleme sırasında hata oluştu: " + error.message);
        });
});

function collectPostData() {
    const title = document.getElementById("post-title").value;
    const description = document.getElementById("post-description").value;
    const category = document.querySelector('input[name="category"]:checked')?.value;
    const writer = document.getElementById("post-writer").value;
    const imageUrl = document.getElementById("post-image").value;
    const text = tinymce.get("post-text").getContent();
    const readingTime = document.getElementById("post-duration").value;
    const sources = document.getElementById("post-referances").value;

    if (!title || !description || !category || !imageUrl || !text || isNaN(readingTime)) {
        alert("Tüm zorunlu alanları doldurun!");
        return null;
    }

    return { title, description, category, writer, imageUrl, text, readingTime, sources: sources || null };
}

function clearForm() {
    document.getElementById("post-title").value = "";
    document.getElementById("post-description").value = "";
    document.getElementById("post-image").value = "";
    document.getElementById("post-writer").value = "";
    tinymce.get("post-text").setContent("");
    document.getElementById("post-duration").value = "";
    document.getElementById("post-referances").value = "";
    const selectedCategory = document.querySelector('input[name="category"]:checked');
    if (selectedCategory) selectedCategory.checked = false;
}

function fetchPosts() {
    const postsRef = ref(db, "posts");
    get(postsRef).then((snapshot) => {
        postsList.innerHTML = "";
        if (snapshot.exists()) {
            const posts = snapshot.val();
            Object.keys(posts).reverse().forEach((key) => {
                const post = posts[key];
                const postCard = document.createElement("div");
                postCard.classList.add("post-card");
                postCard.innerHTML = `
                <div style="display: flex; gap: 10px">
                    <img src="${post.imageUrl}" style="height: 50px; width: 100px">
                    <div>
                        <h3>${post.title}</h3>
                        <span>${post.writer || "Bilinmiyor"}</span>
                        <span>${new Date(parseInt(key)).toLocaleDateString()}</span>
                    </div>
                </div>
                <div>
                    <button class="delete-btn" data-id="${key}"><b>SİL</b></button>
                    <button class="edit-btn" data-id="${key}"><b>GÜNCELLE</b></button>
                </div>
                `;
                postCard.style.display = "flex";
                postCard.style.justifyContent = "space-between";
                postCard.style.alignItems = "center";
                postCard.style.marginBottom = "20px";
                postCard.style.border = "1px solid black";
                postCard.style.padding = "10px";
                postCard.style.width = "95%";
                postsList.appendChild(postCard);
            });

            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.addEventListener("click", function () {
                    const postId = this.getAttribute("data-id");
                    deletePost(postId);
                });
            });

            document.querySelectorAll(".edit-btn").forEach(btn => {
                btn.addEventListener("click", function () {
                    const postId = this.getAttribute("data-id");
                    const post = snapshot.val()[postId];
                    document.getElementById("post-title").value = post.title;
                    document.getElementById("post-description").value = post.description;
                    document.getElementById("post-image").value = post.imageUrl;
                    document.getElementById("post-writer").value = post.writer;
                    document.getElementById("post-duration").value = post.readingTime;
                    document.getElementById("post-referances").value = post.sources || "";
                    tinymce.get("post-text").setContent(post.text);
                    document.querySelector(`input[name="category"][value="${post.category}"]`).checked = true;

                    updatingPostId = postId;
                    submitBtn.style.display = "none";
                    updateBtn.style.display = "inline-block";
                });
            });
        } else {
            postsList.innerHTML = "<p>Henüz yazı eklenmemiş.</p>";
        }
    }).catch((error) => {
        console.error("Yazıları çekerken hata oluştu:", error);
    });
}

function deletePost(postId) {
    if (currentUserRole !== "admin") {
        alert("Bu işlem için yetkiniz yok.");
        return;
    }
    if (confirm("Bu gönderiyi silmek istediğinize emin misiniz?")) {
        const postRef = ref(db, `posts/${postId}`);
        get(postRef).then((snapshot) => {
            if (snapshot.exists()) {
                return remove(postRef);
            } else {
                alert("Veri bulunamadı.");
            }
        }).then(() => {
            alert("Gönderi silindi!");
            fetchPosts();
        }).catch((error) => {
            console.error("Silme hatası:", error);
            alert("Gönderi silinirken bir hata oluştu: " + error.message);
        });
    }
}
