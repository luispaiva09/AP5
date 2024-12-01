// TODO: this code has to be modified to support API calls
// to get, update, create and delete elements



// Fetch all books from the API
async function fetchItems() {
  try {
    const response = await fetch('/books');
    const data = await response.json();
    items = data;  // Update items with the data from the API
    renderItems();  // Re-render the table
  } catch (error) {
    console.error("Error fetching items:", error);
  }
}

// Render the list of books
function renderItems() {
  const tableBody = document.getElementById("itemsTable").querySelector("tbody");
  tableBody.innerHTML = ""; // Clear existing rows

  items.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.id}</td>
      <td contenteditable="false" oninput="updateItem(${index}, 'title', this.innerText)">${item.title}</td>
      <td contenteditable="false" oninput="updateItem(${index}, 'author', this.innerText)">${item.author}</td>
      <td contenteditable="false" oninput="updateItem(${index}, 'edit', this.innerText)">${item.edit}</td>
      <td contenteditable="false" oninput="updateItem(${index}, 'year', this.innerText)">${item.year}</td>
      <td>
		<button onclick="toggleEditMode(${index})">EDITAR</button>
        <button onclick="deleteItem(${index})">APAGAR</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}
  
  
  // TODO : every time a resource is created, updated or deleted, 
  // we need to get all from the database 
  // fetch GET
  // and update the table

// Alternar o estado editável da linha
// Alternar o estado editável da linha
function toggleEditMode(index) {
  const row = document.getElementById("itemsTable").querySelectorAll("tbody tr")[index];
  const cells = row.querySelectorAll("td");

  const isEditable = cells[1].isContentEditable;  // Verifica se o campo "title" é editável

  // Se a linha não é editável, torna-a editável
  if (!isEditable) {
    cells.forEach(cell => {
      if (cell !== cells[0] && cell !== cells[5]) { // Ignora células ID e Ações
        cell.contentEditable = true;
      }
    });

    // Muda o texto do botão para "Save"
    row.querySelector(`button[onclick="toggleEditMode(${index})"]`).outerHTML = `<button onclick="toggleEditMode(${index})">GUARDAR</button>`;
  } else {
    // Caso contrário, salva as alterações e envia ao servidor
    const updatedItem = {
      id: items[index].id,
      title: cells[1].innerText,
      author: cells[2].innerText,
      edit: cells[3].innerText,
      year: cells[4].innerText,
    };

    saveItem(index, updatedItem);

    // Muda o texto do botão de volta para "Edit"
    row.querySelector(`button[onclick="toggleEditMode(${index})"]`).outerHTML = `<button onclick="toggleEditMode(${index})">EDITAR</button>`;
  }
}

// Save an item to the server
async function saveItem(index, updatedItem) {
  try {
    // Send a PUT request to update the item in the database
    const response = await fetch(`/books/${updatedItem.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedItem), // Send the updated item data
    });

    if (response.ok) {
      // On successful update, fetch items again to refresh the table
      fetchItems();
    } else {
      alert("Failed to save item.");
    }
  } catch (error) {
    console.error("Error saving item:", error);
  }
}

// Delete an item
async function deleteItem(index) {
  const item = items[index];

  try {
    // Send a DELETE request to remove the item from the database
    const response = await fetch(`/books/${item.id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      items.splice(index, 1); // Remove item from the array after successful deletion
      renderItems();  // Re-render the table
    } else {
      alert("Failed to delete item.");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
  }
}

// Create a new item
async function createNewItem() {
  const newTitle = document.getElementById("newTitle").value;
  const newAuthor = document.getElementById("newAuthor").value;
  const NewEdit = document.getElementById("NewEdit").value;
  const newYear = document.getElementById("newYear").value;

  if (!newTitle || !newAuthor || !NewEdit || !newYear) {
    alert("Please fill in all fields.");
    return;
  }

  const newItem = {
    title: newTitle,
    author: newAuthor,
    edit: NewEdit,
    year: newYear,
  };

  try {
    // Send a POST request to create a new book
    const response = await fetch('/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem), // Send the new item data
    });

    if (response.ok) {
      // On success, fetch all books again to update the table
      fetchItems();
    } else {
      alert("Failed to create new item.");
    }
  } catch (error) {
    console.error("Error creating new item:", error);
  }

  // Clear the input fields
  document.getElementById("newTitle").value = "";
  document.getElementById("newAuthor").value = "";
  document.getElementById("NewEdit").value = "";
  document.getElementById("newYear").value = "";
}

// Initial render
fetchItems();  // Fetch books when the page loads
