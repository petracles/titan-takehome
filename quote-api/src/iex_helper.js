import request from 'request'

function make_API_call(url){
    return new Promise((resolve, reject) => {
        request(url, { json: true }, (err, res, body) => {
          if (err) reject(err)
          resolve(body)
        });
    })
}

export default {
    make_API_call
}