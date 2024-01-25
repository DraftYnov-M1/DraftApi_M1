const express = require('express');
require('dotenv').config()
const app = express();
const cors = require('cors');
const Sequelize = require('sequelize');
const config = require('./config/config.js')[process.env.NODE_ENV || 'development'];
const router = require('./routes/index.js');
const db = require('./models/index.js');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const options = require('./swaggerOptions.js');

app.use(cors())
app.options(process.env.FRONTEND_URL, cors());

const specs = swaggerJsDoc(options);

app.use(swaggerUi.serve);

app.get("/api-docs",swaggerUi.setup(specs));

const sequelize = new Sequelize(config.database, config.username, config.password, {
    port: config.port,
    host: config.host,
    dialect: config.dialect,
    dialectOptions: {
        connectTimeout: 60000
    }
});

sequelize.sync()
    .then(() => {
        console.log('database synchronised');
    })
    .catch(err => {
        console.error('database synchronisation error :', err);
    });

    
    app.get("/", (req, res) => {
        res.send("Welcome to my API");
    })

app.get('/api/data-replication', async (req, res) => {
    try {
        const articles = await db.Article.findAll();
        console.log(articles);
        const publishMessage = await redisClient.publish('articles', JSON.stringify(articles));
        console.log(publishMessage);
        res.status(200).json({
            numberOfSub: publishMessage,
            message: "channel successfully published",
            success: true
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})

app.use("/api", router);

app.listen(process.env.PORT, () => {
    console.log(`server launch on port ${process.env.PORT}`);
});