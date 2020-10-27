const assert = require('assert')
const RegFun = require('../regFunction')

describe("the registration function", function(){

	const regFun = RegFun()

    const pg = require("pg");
    const Pool = pg.Pool;
	const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/reglist';
	const pool = new Pool({
		connectionString
    });
    const INSERT_QUERY = "insert into reg (reg_numb) values ($1)";

    beforeEach(async function () {
        await pool.query("delete from reg");
        await pool.query("delete from towns");
        await pool.query(`insert into towns (town, code) values ($1, $2)`, ["cape town", "CA"])
        await pool.query(`insert into towns (town, code) values ($1, $2)`, ["paarl", "CJ"])
        await pool.query(`insert into towns (town, code) values ($1, $2)`, ["belville", "CY"])
    });
    
    it("should be able to add a plate", async function () {

		// await pool.query(INSERT_QUERY, ["jack", 1]);
        // await pool.query(INSERT_QUERY, ["shaun", 1]);
        await regFun.plateNumber("CA 12345")

		const results = await pool.query("select count(*) from reg");
		
		// how many bookings should have been added?
		assert.equal(1, results.rows[0].count);

	});

	it('should be able to add plates from different towns', async function(){

		await regFun.plateNumber("CJ 321654")
		await regFun.plateNumber("CA 123456")

		const results = await regFun.getPlates()
		
		await assert.deepEqual([{reg_numb: 'CJ 321654'},{reg_numb: 'CA 123456'}], results)
	})

	it('should be able to add plates and sort them by a code', async function(){
		await regFun.plateNumber("CJ 321654")
        await regFun.plateNumber("CA 123456")
        await regFun.plateNumber("CA 123565")
		

		const results = await regFun.sort('CJ')
		const result = results[0].reg_numb

		await assert.equal('CJ 321654', result)
	})

	it('should be able to clear the database', async function(){
		await regFun.plateNumber("CJ 321654")
        await regFun.plateNumber("CA 123456")
        await regFun.plateNumber("CJ 321654")
        await regFun.plateNumber("CA 123456")
        
		await regFun.clear()

		const results = await pool.query("select count(*) from reg");

		await assert.deepEqual(0, results.rows[0].count)
	})
})