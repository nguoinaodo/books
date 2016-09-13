// 
    function deleteRequest(book) {
        var arr = book.getAttribute('id').substr(3).split(' ');
        var postData = 'bookId=' + arr[0] + ' ' + arr[1] + '&email=' + arr[2];
        
        console.log('deleteRequest');
        ajaxPost('/api/delReq', postData, function(response) {
            book.remove();
            
        });
    }
    
    function deleteMyRequest(book) {
        var arr = book.getAttribute('id').substr(3).split(' ');
        var postData = 'bookId=' + arr[0] + ' ' + arr[1] + '&ownerEmail=' + arr[2];
        
        console.log('deleteMyRequest');
        ajaxPost('/api/delMyReq', postData, function(response) {
            book.remove();
            
        });
    }
    
    function approveRequest(book) {
        var arr = book.getAttribute('id').substr(3).split(' ');
        var postData = 'bookId=' + arr[0] + ' ' + arr[1] + '&email=' + arr[2];
        
        console.log('approveRequest');
        ajaxPost('/api/approveReq', postData, function(response) {
            book.remove();
            
        });
    }
    
function getRequest() {
    var yourOutstandingReqsList = document.querySelector('#yourOutstandingReqs div');
    
    ajaxRequest('GET', '/api/dashboard/request', function(response) {
        var yourOutstandingReqsArr = response;
        
        yourReqsBtn.innerHTML = 'Your trade requests (' + yourOutstandingReqsArr.length + ' outstanding)';
        
        yourOutstandingReqsArr.forEach(function(req) {
            yourOutstandingReqsList.innerHTML += '<div class="col-md-4 req" id="req' + req.bookId + ' ' + req.ownerEmail + '">' + req.name 
                + '<span class="delReq" onclick="deleteMyRequest(this.parentNode)">&times;</span></div>'; 
        });
    });
}

function getBorrow() {
    var yourApprovedReqsList = document.querySelector('#yourApprovedReqs div');
    
    ajaxRequest('GET', 'api/dashboard/borrow', function(response) {
        var yourApprovedReqsArr = response;
        
        yourApprovedReqsArr.forEach(function(req) {
            yourApprovedReqsList.innerHTML += '<div class="col-md-4 req" id="req' + req.bookId + ' ' + req.ownerEmail + '">' + req.name 
                + '<span class="delReq" onclick="deleteMyRequest(this.parentNode)">&times;</span></div>';
        });
    });
}

function getRequestsForMe() {
    var reqsForYouList = document.querySelector('#reqsForYou div');
    
    ajaxRequest('GET', 'api/dashboard/requestsForMe', function(response) {
        var reqsForYouArr = response;
        
        reqsForYouBtn.innerHTML = 'Trade requests for you (' + reqsForYouArr.length + ' unapprove)';
        
        reqsForYouArr.forEach(function(req) {
            reqsForYouList.innerHTML += '<div class="col-md-4 req" id="req' + req.bookId + ' ' + req.email + '">' + req.name 
                + '<span class="approve" onclick="approveRequest(this.parentNode)">&#10003;</span><span class="delReq" onclick="deleteRequest(this.parentNode)">&times;</span></div>';
        });
    });
}

function getApprove() {
    var reqsYouHaveApprovedList = document.querySelector('#reqsYouHaveApproved div');
    
    ajaxRequest('GET', 'api/dashboard/approve', function(response) {
        var reqsYouHaveApprovedArr = response;
        
        reqsYouHaveApprovedArr.forEach(function(req) {
            reqsYouHaveApprovedList.innerHTML += '<div class="col-md-4 req" id="req' + req.bookId + ' ' + req.email + '">' + req.name 
                + '<span class="delReq" onclick="deleteRequest(this.parentNode)">&times;</span></div>'; 
        });
    });
}

function main() {
    
    var yourOutstandingReqs = document.getElementById('yourOutstandingReqs'),
        yourApprovedReqs = document.getElementById('yourApprovedReqs'),
        reqsForYou = document.getElementById('reqsForYou'),
        reqsYouHaveApproved = document.getElementById('reqsYouHaveApproved');
    var yourReqsBtn = document.getElementById('yourReqsBtn'),
        reqsForYouBtn = document.getElementById('reqsForYouBtn');
    var display1 = false,
        display2 = false;
    
    
    yourOutstandingReqs.style.display = 'none';
    yourApprovedReqs.style.display = 'none';
    reqsForYou.style.display = 'none';
    reqsYouHaveApproved.style.display = 'none';
    
    yourReqsBtn.addEventListener('click', function() {
        if (display1) {
            yourOutstandingReqs.style.display = 'none';
            yourApprovedReqs.style.display = 'none';
            display1 = false;
        } else {
            yourOutstandingReqs.style.display = '';
            yourApprovedReqs.style.display = '';
            display1 = true;
        }
    });
    
    reqsForYouBtn.addEventListener('click', function() {
        if (display2) {
            reqsForYou.style.display = 'none';
            reqsYouHaveApproved.style.display = 'none';
            display2 = false;
        } else {
            reqsForYou.style.display = '';
            reqsYouHaveApproved.style.display = '';
            display2 = true;
        }
    });
    
    // get dashboard info
    
    getRequest();
    getBorrow();
    getRequestsForMe();
    getApprove();
}

ready(main);