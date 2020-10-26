module.exports = function () {

    const pg = require("pg");
    const Pool = pg.Pool;
    const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/reglist';
    const pool = new Pool({
        connectionString
    });

    async function plateNumber(x) {
        //const item = await pool.query(`select id from reg where plate = $1`[x])

        const code = x.substring(0, 2)
        const theId = await pool.query(`select id from towns where code = $1`, [code])
        const id = theId.rows[0].id

        let checking
        if (id > 0) {
            checking = await pool.query(`select * from reg where reg_numb = $1`, [x])
        } else {
            return false
        }

        if (checking.rowCount === 0) {
            await pool.query(`insert into reg (reg_numb, town_id) values ($1, $2)`, [x, id])
        }
    }

    async function getPlates(){
        const plates = await pool.query('select reg_numb from reg')
        return plates.rows
    }

    async function sort(code) {
       // console.log(code)
        const theId = await pool.query(`select id from towns where code = $1`, [code])
        const id = theId.rows[0].id
        if (code === "all") {
            const filtering = await pool.query(`select reg_numb from reg`)
            return filtering.rows
        } else {
            const place = await pool.query(`select * from reg where town_id = $1`, [id])
            return place.rows[0].reg_numb
        }

    }

    async function clear() {
        const clear = await pool.query('delete from reg');
        return clear.rows
    }

    return {
        plateNumber,
        getPlates,
        sort,
        clear
    }
}