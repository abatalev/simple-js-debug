const axios = require('axios');

axios.get('/api/posts/1').then(resp => {
    console.log(resp.data);
    document.querySelector('#app').innerHTML = resp.data.title;
});