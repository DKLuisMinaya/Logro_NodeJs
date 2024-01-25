const express=require('express')
const router=express.Router()
const conexion=require('./database/db')



router.get('/',(req,res)=>{
    res.render('index')
})

router.post('/create', (req, res) => {
    res.redirect('/create');
});

const crud=require('./controllers/crud')
router.post('/store',crud.save)
router.get('/create', (req, res) => {
    const buscar = req.query.buscar;

    // Verifica si hay un valor en el campo de búsqueda
    if (buscar) {
        
        conexion.query(`SELECT * FROM empleados WHERE departamento LIKE '%${buscar}%'`, (error, resultados) => {
            if (error) {
                throw error;
            } else {
                res.render('create', { resultados: resultados, buscar: buscar });
            }
        });
    } else {
        // Si no hay un valor, muestra todos los empleados
        conexion.query('SELECT * FROM empleados', (error, resultados) => {
            if (error) {
                throw error;
            } else {
                res.render('create', { resultados: resultados });
            }
        });
    }
});



router.get('/tareas',(req,res)=>{
    conexion.query('SELECT * FROM empleados',(error,resultados)=>{
        if(error)
        throw error
    else
    res.render('tareas',{resultados:resultados})
    })
})
router.get('/mostrarEmpleados',(req,res)=>{
    const consulta = 'SELECT * FROM empleados ORDER BY fechaContratacion';

  conexion.query(consulta, (error, empleados) => {
    if (error) {
      console.error('Error al obtener empleados:', error.message);
      return res.status(500).send('Error interno del servidor');
    }else

    res.render('mostrar', { empleados });
  });
})
router.post('/tareasfinal',crud.tareaa)
router.get('/tareasmessage',(req,res)=>{
    res.render('tareasfin')

})


router.post('/pagarEmpleado', (req, res) => {
    const empleadoId = req.body.empleadoId;
    const verificacionQuery = 'SELECT * FROM empleados WHERE id = ? AND pagado = 0';
  
    conexion.query(verificacionQuery, [empleadoId], (verificacionError, empleado) => {
      if (verificacionError) {
        console.error('Error al verificar el estado del empleado:', verificacionError.message);
        return res.status(500).send('Error interno del servidor');
      }
  
      if (empleado.length === 0) {
        return res.status(400).send('El empleado ya ha sido pagado o no existe.');
      }
  
      const salarioTotal = empleado[0].salario * empleado[0].horasTrabajadas;
      const updateQuery = 'UPDATE empleados SET pagado = 1 WHERE id = ?';
  
      conexion.query(updateQuery, [empleadoId], (updateError) => {
        if (updateError) {
          console.error('Error al actualizar el campo pagado:', updateError.message);
          return res.status(500).send('Error interno del servidor');
        }
        res.redirect('/mostrarEmpleados');
      });
    });
  });

  router.get('/total', (req, res) => {
    const consulta = 'SELECT * FROM empleados WHERE pagado = 1 ORDER BY fechaContratacion';
  
    conexion.query(consulta, (error, empleadosPagados) => {
      if (error) {
        console.error('Error al obtener empleados pagados:', error.message);
        return res.status(500).send('Error interno del servidor');
      }
  
      res.render('total', { empleadosPagados });
    });
  });

    module.exports=router