function request(book) {
    var arr = book.getAttribute('id').split(' ');
    var postData = 'bookId=' + arr[0] + ' ' + arr[1] + '&ownerEmail=' + arr[2];
    
    ajaxPost('/api/request', postData, function(response) {
        var requestSpan = book.children[1];
        
        book.removeChild(requestSpan);
    });  
}

function main() {
    var booksList = document.getElementById('booksList');
    
    ajaxRequest('GET', '/api/allbooks', function(response) {
        response.forEach(function(item) {
            var book = item[0],
                isMyOwnBook = item[1];
            
            if (book.available && !isMyOwnBook)
                booksList.innerHTML += '<div id="' + book.bookId  + ' ' + book.ownerEmail + '" class="col-md-2 col-xs-4 thumbnail "><img src="'
                    + book.cover + '" class="img-responsive" alt="' + book.name + '"><span class="request" onclick="request(this.parentNode)">&#8644;</span></div>'; 
            else 
                booksList.innerHTML += '<div id="' + book.bookId + '" class="col-md-2 col-xs-4 thumbnail "><img src="'
                    + book.cover + '" class="img-responsive" alt="' + book.name + '"></div>';
        });
    });
}

ready(main);