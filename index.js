const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

var RegFun = require('./regFunction')
const regFun = RegFun()

const app = express()

const session = require('express-session')
const flash = require('express-flash')

app.use(session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

app.engine('handlebars', exphbs({ layoutsDir: "views/layouts/" }));
app.set('view engine', 'handlebars');

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', async function (req, res) {

    const plates = await regFun.getPlates()

    res.render('index', {
        plateNum: plates
    })
})

app.post('/reg_numbers', async function (req, res) {
    let plate = req.body.plate
  
    if (plate === '') {
        req.flash('error', 'Enter a plate')
    } else if (!(/C[AYJ] \d{3,6}$/.test(plate))) {
        req.flash('error', 'Enter a proper plate')
    } else {
        await regFun.plateNumber(plate)
    }

    const plates = await regFun.getPlates()

    res.render('index', {
        plateNum: plates
    })

})

app.post('/reg_number', async function (req, res) {
    let area = req.body.town
    console.log(area)
    const sorted= await regFun.sort(area)
    res.render('index', {
        plateNum: sorted
    })
})

app.get('/clear', async function (req, res) {
    await regFun.clear()
    res.render('index')
})

const PORT = process.env.PORT || 3091;

app.listen(PORT, function () {
    console.log("App started at port:", PORT)
})