import request from 'request'

function make_API_call(url) {
    var options = {
        method: 'GET',
        url: url,
        // headers: {
        //     'Access-Control-Allow-Credentials': '*',
        //     'Accept': 'application/json'
        // }
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) reject(error)
            resolve(body)
        });
    })
}

export default {
    make_API_call
}