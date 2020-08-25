// Minimal comment file
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class, handles UI tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');
    row.innerHTML = `<td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>`;
    list.appendChild(row);
  }

  static showAlert(message, className){
    const div = document.createElement('div');
    div.className = `alert alert-${className} mt-3`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("form");
    container.insertBefore(div, form);
    setTimeout(()=>document.querySelector(".alert").remove(), 2000);
  } // end of showAlert

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  static deleteBook(el){
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

} // end class UI

// Store Class: handles storage
class Store {
  static getBooks(){
    let books;
    if (localStorage.getItem('books')===null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  } // end getBooks

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  } // end addBook

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index)=>{
      if (book.isbn===isbn) {
        books.splice(index, 1);
      }
    }); 
    localStorage.setItem("books", JSON.stringify(books));
  } // end removeBook
} // end class Store

// Events: display, add, delete items
document.addEventListener('DOMContentLoaded', UI.displayBooks);

document.querySelector('#book-form')
  .addEventListener("submit", (e)=>{
    e.preventDefault();
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;
    if (title === "" || author === "" || isbn === "" ){
      UI.showAlert(`Please fill in all fields...`, "danger");
    } else {
    const book = new Book(title, author, isbn);
    UI.addBookToList(book);
    Store.addBook(book);
    UI.showAlert("Book Added to List", "success");
    UI.clearFields();
    }
}); // end of add a book

document.querySelector("#book-list").addEventListener("click", e=>{
  UI.deleteBook(e.target);
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});  // end of delete a book
