const RegFun = require('./regFunction')
const regFun = RegFun()

module.exports = function regRoutes() {
    async function home(req, res, next) {

        try {
            const plates = await regFun.getPlates()

            res.render('index', {
                plateNum: plates
            })
        } catch (err) {
            next(err)
        }

    }

}