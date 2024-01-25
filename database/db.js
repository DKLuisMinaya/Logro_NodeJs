const mysql = require('mysql')

const conexion=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'proyectoc'
})
conexion.connect((error)=>{
    if(error){
    console.log('el error es:'+error)
    return
    }else
    console.log('La conexxcion base de datos ha sido exitosa')
})
module.exports=conexion