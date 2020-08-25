// Book class, represents a book
// UI class, handles UI tasks
// Store class, handles storage
// Events : display books, add book, delete book

// {Book class, represents a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class, handles UI tasks
class UI {

  // Display Books
  static displayBooks() {

    // ====== hard coded test data =====

    // // get books from storage
    // const storedBooks = [
    //   {
    //     title: 'Book One',
    //     author: 'John Smith',
    //     isbn: 12345
    //   },
    //   {
    //     title: 'Book Two',
    //     author: 'Jane Smith',
    //     isbn: 67890
    //   }
    // ];

    // // assign stored books to a variable
    // const books = storedBooks;
    // ====================================

    const books = Store.getBooks();

    // loop through array of books and call add to list method
    books.forEach(book => UI.addBookToList(book));
  }

  // addBookToList
  static addBookToList(book) {

    // assign dom element to variable
    const list = document.querySelector('#book-list');

    // create a row element to store book data
    const row = document.createElement('tr');

    // create columns of data within each row, incl delete button
    row.innerHTML = `<td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>`;

    // add our newly populated row to the list element
    list.appendChild(row);
  }


  // ======= Validate inputs
  static showAlert(message, className){
    
    // create element on the DOM to hold message
    const div = document.createElement('div');

    // add classes to element
    div.className = `alert alert-${className} mt-3`;

    // add a text node to the element
    div.appendChild(document.createTextNode(message));

    // get parent element and element after div
    const container = document.querySelector(".container");
    const form = document.querySelector("form");

    // insert element inside parent before next
    container.insertBefore(div, form);

    // alert message vanishes after 2s
    setTimeout(()=>document.querySelector(".alert").remove(), 2000);



  } // end of showAlert


  // clear input fields of text
  static clearFields() {

    // get DOM elements and set to empty 
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  // delete a book from the list
  static deleteBook(el){

    if (el.classList.contains("delete")) {

      // if it has delete, remove the whole table row
      el.parentElement.parentElement.remove();
    }
  }

} // end class UI



// Store Class: handles storage
// ==============================

// 3 tasks: Use static methods so can call directly without instantiating a Store, uses Strings not Objects, needs parsing/stringifying to use & re-store
// getBooks(){}
// addBook(book){}
// deleteBook(book){}

class Store {

  static getBooks(){
    
    // initialize a var called books
    let books;

    // if storage is empty, set an empty array as value
    if (localStorage.getItem('books')===null) {
      books = [];

    } else {

      // get item from storage and parse it to an arr of obj
      books = JSON.parse(localStorage.getItem('books'));

    }

    // now we've worked out what's in storage, return it
    return books;

  } // end getBooks


  // add a book to storage [arr of objs => string]
  static addBook(book) {
    
    // get books from storage
    const books = Store.getBooks();

    // add book to end of array
    books.push(book);

    // return to localStorage after stringifying
    localStorage.setItem("books", JSON.stringify(books));

  } // end addBook

  // remove a book by unique isbn from storage (arr to string)
  static removeBook(isbn) {

    // get array of book objects from store
    const books = Store.getBooks();

    // loop through array to check for isbn
    books.forEach((book, index)=>{
      if (book.isbn===isbn) {

        // remove 1 item from array at matching index position
        books.splice(index, 1);
      }
    }); 

    // reset modified array to stringified storage
    localStorage.setItem("books", JSON.stringify(books));

  } // end removeBook



} // end class Store












// Events: display, add, delete items

// display books:
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// add a book:
document.querySelector('#book-form')
  .addEventListener("submit", (e)=>{

    // Prevent submit default action
    e.preventDefault();
    
    // console.log(e);

    // Assign DOM elements to variables
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    // ===== Validate input values
    if (title === "" || author === "" || isbn === "" ){
      UI.showAlert(`Please fill in all fields...`, "danger");

    } else {

    // Instantiate a book object using class Book constructor
    const book = new Book(title, author, isbn);

    // Add book to the UI
    UI.addBookToList(book);

    //========= storing book 
    Store.addBook(book);

    //======== Validation: show success message
    UI.showAlert("Book Added to List", "success");

    // Clear the input fields of text
    UI.clearFields();
    }

    

}); // end of add a book

// delete a book 
document.querySelector("#book-list").addEventListener("click", e=>{

  // send target property to UI deleteBook function
  UI.deleteBook(e.target);

  //===== remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});  // end of delete a book






















