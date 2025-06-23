const BASE_URL = "http://localhost:3000/posts";
let currentPostId = null;

function main() {
  displayPosts();
  addNewPostListener();
  addEditPostListener();
}

function displayPosts() {
  fetch('http://localhost:3000/posts')
    .then(res => res.json())
    .then(posts => {
      const list = document.getElementById("post-list");
      list.innerHTML = "";
      posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';

        postDiv.innerHTML = `
          <h4>${post.title}</h4>
          <p>${post.author}</p>
          <button class="btn classy-btn edit-btn">Edit</button>
          <button class="btn classy-btn delete-btn">Delete</button>
          <button class="btn classy-btn read-btn">Read More</button>
        `;

        postDiv.querySelector(".read-btn").addEventListener("click", () => handlePostClick(post));
        list.appendChild(postDiv);
      });

      if (posts.length > 0) {
        handlePostClick(posts[0]); 
      }
    });
}

function handlePostClick(post) {
  currentPostId = post.id;
  const detail = document.getElementById("post-detail");
  detail.innerHTML = `
    <h2>${post.title}</h2>
    <img src="${post.image}" alt="${post.title}" style = "max-width: 100%;height: auto; margin: 10px 0;">
    <p>${post.content}</p>
    <p><em>by ${post.author}</em></p>
    <button id="edit-btn">Edit</button>
    <button id="delete-btn">Delete</button>
  `;

  document.getElementById("edit-btn").addEventListener("click", () => {
    const editForm = document.getElementById("edit-post-form");
    document.getElementById("edit-title").value = post.title;
    document.getElementById("edit-content").value = post.content;
    editForm.classList.remove("hidden");
  });

  document.getElementById("delete-btn").addEventListener("click", () => {
    fetch(`${BASE_URL}/${post.id}`, { method: "DELETE" })
      .then(() => {
        displayPosts();
        document.getElementById("post-detail").innerHTML = "<p>Select a post to view details</p>";
      });
  });
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const newPost = {
      title: form.title.value,
      content: form.content.value,
      author: form.author.value
    };

    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
    .then(res => res.json())
    .then(() => {
      displayPosts();
      form.reset();
    });
  });
}

function addEditPostListener() {
  const editForm = document.getElementById("edit-post-form");
  const cancelBtn = document.getElementById("cancel-edit");

  editForm.addEventListener("submit", e => {
    e.preventDefault();
    const updated = {
      title: document.getElementById("edit-title").value,
      content: document.getElementById("edit-content").value
    };

    fetch(`${BASE_URL}/${currentPostId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    })
    .then(() => {
      displayPosts();
      handlePostClick({ id: currentPostId, ...updated });
      editForm.classList.add("hidden");
    });
  });

  cancelBtn.addEventListener("click", () => {
    editForm.classList.add("hidden");
  });
}

document.addEventListener("DOMContentLoaded", main);