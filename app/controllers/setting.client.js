function main() {
    var saveProfileBtn = document.getElementById('saveProfile'),
        savePassBtn = document.getElementById('savePass');
    
    saveProfileBtn.addEventListener('click', function() {
        var city = document.getElementById('city').value,
            state = document.getElementById('state').value,
            postData = 'city=' + city + '&state=' + state;
        var url = '/api/settingProfile';
        
        console.log('click');
        
        ajaxPost(url, postData, function(response) {
            console.log('save profile');
            
            if (response.state === 'success')
                alert('Profile updated!'); 
            else if (response.state === 'failed')
                alert('Update failed!');
        });
    });
    
    savePassBtn.addEventListener('click', function() {
        var currentPass = document.getElementById('currentPass').value,
            newPass = document.getElementById('newPass').value;
        var url = '/api/settingPassword';
        var postData = 'currentPass=' + currentPass + '&newPass=' + newPass;
        
        ajaxPost(url, postData, function(response) {
            if (response.state === 'success')
                alert('Password updated!');
            else if (response.state === 'invalid password')
                alert('Invalid password!');
            else 
                alert('Update failed!');
        });
    });
}

ready(main);