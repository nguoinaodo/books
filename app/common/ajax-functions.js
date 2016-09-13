'use strict';

function ready(fn) {
   if (typeof(fn) !== 'function')
      return;
   
   if (document.readyState === 'complete')
      return fn();
   
   document.addEventListener('DOMContentLoaded', fn, false);
}

function ajaxRequest(method, url, callback) {
   var xhr = new XMLHttpRequest();
   
   xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200)
         callback(JSON.parse(xhr.responseText));
   };
   xhr.open(method, url, true);
   xhr.send();
}

function ajaxPost(url, data, callback) {
   var xhr = new XMLHttpRequest();
   
   xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) 
         callback(JSON.parse(xhr.responseText));
   };
   xhr.open('POST', url, true);
   xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
   xhr.send(data);
}