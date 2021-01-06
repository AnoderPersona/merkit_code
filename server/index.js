const express = require("express"); //express es una libreria
const app = express();
const cors = require("cors");
const pool = require("./db")

//middleware
app.use(cors());
app.use(express.json()); //req.body

//rutas

// *****************Productos*************************

//crear productos

app.post("/productos", async(req,res) => {
    try {
        const { nombre, descripcion, marca, stock, codigo, unidad, precio, foto } = req.body;

        const nuevoProducto = await pool.query(
            "INSERT INTO productos (nombre, descripcion, marca, stock, codigo, unidad, precio, foto) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", 
            [nombre, descripcion, marca, stock, codigo, unidad, precio, foto]
        );

        res.json(nuevoProducto.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
})


//get todos los productos

app.get("/productos", async(req,res) => {
    try {
        const allProductos = await pool.query("SELECT * FROM productos");
        res.json(allProductos.rows);

    } catch (err) {
        console.error(err.message);
    }
})


//get un producto

app.get("/productos/:id", async(req,res) => {
    try {
        const {id} = req.params;
        const producto = await pool.query("SELECT * FROM productos WHERE id_productos = $1",[id]);
        
        res.json(producto.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});


//update productos

app.put("/productos/:id", async (req, res) => {
    try {
        
        const { id } = req.params;
        const { nombre, descripcion, marca, stock, codigo, unidad, precio, foto } = req.body;
        const updateProducto = await pool.query("UPDATE productos SET (nombre, descripcion, marca, stock, codigo, unidad, precio, foto) = ($1, $2, $3, $4, $5, $6, $7, $8) WHERE id_productos = $9", 
        [nombre, descripcion, marca, stock, codigo, unidad, precio, foto, id]);

        res.json("Producto se actualizó")

    } catch (err) {
        console.error(err.message)
    }
})

//borrar productos

app.delete("/productos/:id", async (req, res) => {
    try {
        
        const {id} = req.params;
        const borraProducto = await pool.query("DELETE FROM productos WHERE id_productos = $1", [id]);

        res.json("Producto se borró");

    } catch (err) {
        console.error(err.message)
    }
})

//filter productos

app.get("/productos/search/:condicion", async(req,res) => {
    try {
        const {condicion} = req.params;
        const algunosProductos = await pool.query("SELECT * FROM productos WHERE lower(nombre) like lower($1) or lower(descripcion) like lower(lower($1)) or lower(nombre) like lower($2) or lower(descripcion) like lower($2) or lower(nombre) like lower($3) or lower(descripcion) like lower($3) or lower(nombre) like lower($4) or lower(descripcion) like lower($4)",[condicion+'%', condicion, '%'+condicion, '%'+condicion+'%']);
        
        res.json(algunosProductos.rows);

    } catch (err) {
        console.error(err.message);
    }
});


// *****************Ventas*************************

//crear venta

app.post("/ventas", async(req,res) => {
    try {
        const { unidad, cantidad, precio, fecha } = req.body;

        const nuevaVenta = await pool.query(
            "INSERT INTO item_ventas (unidad, cantidad, precio) VALUES($1, $2, $3, $4, $5, $6) RETURNING *", 
            [unidad, cantidad, precio],

            "INSERT INTO venta (fecha) VALUES(TO_DATE($1,'/DD/MM/YYYY')) RETURNING *", 
            [fecha]
        );

        res.json(nuevaVenta.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
})


//get todos los productos
/* 
app.get("/productos", async(req,res) => {
    try {
        const allProductos = await pool.query("SELECT * FROM productos");
        res.json(allProductos.rows);

    } catch (err) {
        console.error(err.message);
    }
})


//get un producto

app.get("/productos/:id", async(req,res) => {
    try {
        const {id} = req.params;
        const producto = await pool.query("SELECT * FROM productos WHERE id_productos = $1",[id]);
        
        res.json(producto.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});


//update productos

app.put("/productos/:id", async (req, res) => {
    try {
        
        const { id } = req.params;
        const { nombre, descripcion, marca, stock, codigo, unidad, precio, foto } = req.body;
        const updateProducto = await pool.query("UPDATE productos SET (nombre, descripcion, marca, stock, codigo, unidad, precio, foto) = ($1, $2, $3, $4, $5, $6, $7, $8) WHERE id_productos = $9", 
        [nombre, descripcion, marca, stock, codigo, unidad, precio, foto, id]);

        res.json("Producto se actualizó")

    } catch (err) {
        console.error(err.message)
    }
})

//borrar productos

app.delete("/productos/:id", async (req, res) => {
    try {
        
        const {id} = req.params;
        const borraProducto = await pool.query("DELETE FROM productos WHERE id_productos = $1", [id]);

        res.json("Producto se borró");

    } catch (err) {
        console.error(err.message)
    }
})

//filter productos

app.get("/productos/search/:condicion", async(req,res) => {
    try {
        const {condicion} = req.params;
        const algunosProductos = await pool.query("SELECT * FROM productos WHERE lower(nombre) like lower($1) or lower(descripcion) like lower(lower($1)) or lower(nombre) like lower($2) or lower(descripcion) like lower($2) or lower(nombre) like lower($3) or lower(descripcion) like lower($3) or lower(nombre) like lower($4) or lower(descripcion) like lower($4)",[condicion+'%', condicion, '%'+condicion, '%'+condicion+'%']);
        
        res.json(algunosProductos.rows);

    } catch (err) {
        console.error(err.message);
    }
});

 */


app.listen(5000, () => {
    
    console.log("Server corriendo en puerto 5000");
});