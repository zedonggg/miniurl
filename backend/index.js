require('dotenv').config()
const express = require('express')
const shortid = require('shortid')
const redis = require('redis')

const app = express()
app.use(express.json())
app.use(express.static('dist'))

const redisClients = [
    redis.createClient({
        socket: {
            host: process.env.REDIS_HOST_1,
            port: process.env.REDIS_PORT_1
        }
    }), 
    redis.createClient({
        socket: {
            host: process.env.REDIS_HOST_2,
            port: process.env.REDIS_PORT_2
        }
    }), 
    redis.createClient({
        socket: {
            host: process.env.REDIS_HOST_3,
            port: process.env.REDIS_PORT_3
        }
    })
]

function getClient(key) {
    const hash = key.split('').reduce((prev, cur) => prev + cur.charCodeAt(0), 0)
    return redisClients[hash % redisClients.length]
}

app.post('/minify', async (req, res) => {
    const { miniurl, url } = req.body
    if (!miniurl || !url) {
        return res.status(400).send('Specify mini url and url!')
    }

    const client = getClient(miniurl)
    const result = await client.set(miniurl, url, { condition:'NX', expiration: { type: 'EX', value: 3600 } })

    if (result === null) {
        return res.status(409).send('This miniurl is already in use!')
    } else {
        res.json('Miniurl Added successfully!')
    }
})

app.get('/:miniurl', async (req, res) => {
    const miniurl = req.params.miniurl
    const client = getClient(miniurl)
    let result = await client.get(miniurl)

    if (result === null) {
        return res.sendFile(require('path').resolve(__dirname, 'dist', 'index.html'))
    } else {
        if (!/^https?:\/\//i.test(result)) {
            result = 'https://' + result;
        }

        res.redirect(result)
    }
})

connectAndStart = async () => {
    try {
        await Promise.all(redisClients.map(c => c.connect()))
        console.log('All redis clients connected')

        app.listen(process.env.PORT, () => {
            console.log("Server running on port", process.env.PORT)
        })
    } catch (err) {
        console.log('Failed to initialize', err)
        process.exit(1)
    }
}

connectAndStart()
