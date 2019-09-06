const express = require('express')
const dotenv = require('dotenv')
const app = express()
const bodyParser = require("body-parser")
const path = require("path")
const request = require("request")

dotenv.config()

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.SERVER_PORT

app.get('/', (req, res) => {
    const mainPage = path.resolve(__dirname, "../public/html/index.html")
    res.sendFile(mainPage)
}
)
app.get('/bookingform.html', (req, res) => {
    const bookingform = path.resolve(__dirname, "../public/html/bookingform.html")
    res.sendFile(bookingform)
}
)
app.get('/citySuggestions', (req, res) => {
    const { searchText = "" } = req.query;
    const { MAPMYINDIA_GRANT_TYPE, MAPMYINDIA_CLIENT_ID, MAPMYINDIA_CLIENT_SECRET } = process.env;

    var options = {
        method: 'POST',
        url: 'https://outpost.mapmyindia.com/api/security/oauth/token',
        qs:
        {
            grant_type: MAPMYINDIA_GRANT_TYPE,
            client_id: MAPMYINDIA_CLIENT_ID,
            client_secret: MAPMYINDIA_CLIENT_SECRET
        }
    };
    new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            const { access_token, token_type } = JSON.parse(body);
            resolve({
                access_token,
                token_type
            })
        });
    }).then((tokenInfo) => {
        var request = require("request");

        var options = {
            method: 'GET',
            url: 'https://atlas.mapmyindia.com/api/places/search/json',
            qs: { query: searchText, pod: 'CITY', region: 'IND' },
            headers: {
                Authorization: `${tokenInfo.token_type} ${tokenInfo.access_token}`
            }
        };
        return new Promise((resolve, reject) => {
            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                if (body)
                    resolve(JSON.parse(body));
                else resolve({});
            });
        })
    }).then(results => {
        res.status(200).send(results).end();
    })
})

app.listen(port, () => console.log(`Server started on port ${port}!`))