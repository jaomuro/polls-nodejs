import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import { redis } from "../../lib/redis"


export async function getPoll(app: FastifyInstance) {
    app.get('/polls/:pollId', async (req, res) => { 
        const getPollParams = z.object({
            pollId: z.string().uuid()
        })
    
        const {pollId} = getPollParams.parse(req.params)
        
        const poll = await prisma.poll.findUnique({
            where: {
                id: pollId
            },
            include: {
                options: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        })

        if(!poll) {
            return res.status(400).send({message: 'Poll not found'})
        }

        const result = await redis.zrange(pollId, 0, -1, 'WITHSCORES')

        console.log(result)
    
        return res.send({poll})
    })
}