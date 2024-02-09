import fastify from 'fastify'
import {z} from 'zod'
import { PrismaClient } from '@prisma/client'

const app = fastify()

const prisma = new PrismaClient()

//GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS

app.post('/polls', async (req, res) => { 
    const createPollBody = z.object({
        title: z.string()
    })

    const {title} = createPollBody.parse(req.body)

    console.log(title)

    const poll = await prisma.poll.create({
        data: {
            title,
        }
    })

    return res.status(201).send({poll_id: poll.id})
})

app.listen({port: 3333}).then(() => {
    console.log('HTTP server running!')
})

