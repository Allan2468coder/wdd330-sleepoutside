const userList = document.getElementById("user-list");
const statusMessage = document.getElementById("status");
const retryButton = document.getElementById("retry-button");

async function loadUsers() {
  statusMessage.textContent = "Loading users…";
  retryButton.hidden = true;
  userList.replaceChildren();

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error(`User request failed with status ${response.status}.`);
    }

    const users = await response.json();

    if (!Array.isArray(users)) {
      throw new Error("The user service returned an unexpected response.");
    }

    const userItems = users.map((user) => {
      if (
        typeof user.name !== "string" ||
        typeof user.email !== "string" ||
        typeof user.id !== "number"
      ) {
        throw new Error("The user service returned an invalid user record.");
      }

      const item = document.createElement("li");
      const name = document.createElement("strong");
      const email = document.createElement("a");

      name.textContent = user.name;
      email.href = `mailto:${user.email}`;
      email.textContent = user.email;
      item.append(name, email);

      return item;
    });

    userList.replaceChildren(...userItems);
    statusMessage.textContent = `Showing ${userItems.length} users.`;
  } catch (error) {
    statusMessage.textContent =
      "We couldn’t load the users. Check your connection and try again.";
    retryButton.hidden = false;
  }
}

retryButton.addEventListener("click", loadUsers);
loadUsers();
