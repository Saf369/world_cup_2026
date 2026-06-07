const http = require('http');

const data = JSON.stringify({
  predictionId: "fabed08a-842b-4e48-833d-4af9f67e8e65",
  ranking: [
    {"rank":1,"team":"South Korea","flag":"🇰🇷","groupLetter":"A","advances":true},
    {"rank":2,"team":"Qatar","flag":"🇶🇦","groupLetter":"B","advances":true},
    {"rank":3,"team":"Haiti","flag":"🇭🇹","groupLetter":"C","advances":true},
    {"rank":4,"team":"Australia","flag":"🇦🇺","groupLetter":"D","advances":true},
    {"rank":5,"team":"Ivory Coast","flag":"🇨🇮","groupLetter":"E","advances":true},
    {"rank":6,"team":"Sweden","flag":"🇸🇪","groupLetter":"F","advances":true},
    {"rank":7,"team":"Iran","flag":"🇮🇷","groupLetter":"G","advances":true},
    {"rank":8,"team":"Saudi Arabia","flag":"🇸🇦","groupLetter":"H","advances":true},
    {"rank":9,"team":"Iraq","flag":"🇮🇶","groupLetter":"I","advances":false},
    {"rank":10,"team":"Austria","flag":"🇦🇹","groupLetter":"J","advances":false},
    {"rank":11,"team":"Uzbekistan","flag":"🇺🇿","groupLetter":"K","advances":false},
    {"rank":12,"team":"Ghana","flag":"🇬🇭","groupLetter":"L","advances":false}
  ]
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/bracket/save-best8',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', body));
});

req.write(data);
req.end();
