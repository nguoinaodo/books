function delBook(book) {
    var list = book.parentNode,
        bookId = book.getAttribute('id');
    var postData = 'bookId=' + bookId;
    
    ajaxPost('/api/delbook', postData, function(response) {
        list.removeChild(book); 
    });
}

function main() {
    var addBtn = document.getElementById('addBtn'),
        bookInput = document.getElementById('bookName'),
        booksList = document.getElementById('booksList');
    
    // get my books
    ajaxRequest('GET', '/api/mybooks', function(response) {
        response.forEach(function(book) {
            
            booksList.innerHTML += '<div id="' + book.bookId + '" class="col-md-2 col-xs-4 thumbnail "><img src="'
                + book.cover + '" class="img-responsive" alt="' + book.name + '"><span class="delBook" onclick="delBook(this.parentNode)">&times;</span></div>'; 
        });
    });
    
    addBtn.addEventListener('click', addBook);
    
    function addBook() {
        var bookName = bookInput.value;
        
        if (bookName.length === 0) 
            alert('Enter something!');
        
        var postData = 'name=' + bookName;
        
        ajaxPost('/api/addbook', postData, function(response) {
            var cover = response.cover,
                name = response.name,
                bookId = response.bookId;
            
            booksList.innerHTML += '<div id="' + bookId + '" class="col-md-2 col-xs-4 thumbnail "><img src="'
                + cover + '" class="img-responsive" alt="' + name + '"><span class="delBook" onclick="delBook(this.parentNode)">&times;</span></div>';
        });
    }
}

ready(main);