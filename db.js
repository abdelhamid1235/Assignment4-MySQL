const mysql2 = require("mysql2/promise");

let db = mysql2.createPool({
    host:"127.0.0.1",
    port:'3306',
    user:"root",
    password:"",
    database:"retail_db_assignment",

    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit : 0
})
async function bootstrap(app , port){
    try {
        const [data , fields] = await db.query("SELECT 1+1 AS RESULT");
        console.log("Connect DataBase ✔️");
        app.listen(port , ()=>{
            console.log(`Server is runing in port :: ${port}`);
        })
    } catch (error) {
        console.log("failed connection DataBase ❌");
        process.exit(1);
    }
}

module.exports = {db , bootstrap};