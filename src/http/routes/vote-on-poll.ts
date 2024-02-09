import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import { randomUUID } from 'node:crypto'

export async function voteOnPoll(app: FastifyInstance) {
    app.post('/polls/:pollId/votes', async (req, res) => { 
        const voteOnPollBody = z.object({
            pollOptionId: z.string().uuid()
        })

        const voteOnPollParams = z.object({
            pollId: z.string().uuid()
        })
    
        const { pollOptionId } = voteOnPollBody.parse(req.body)
        const { pollId } = voteOnPollParams.parse(req.params)


        let {sessionId} = req.cookies

        if(sessionId){
            const userPreviousVotedOnPull = await prisma.vote.findUnique({
                where: {
                    sessionId_pollId: {
                        sessionId,
                        pollId,
                    }
                }
            })

            if(userPreviousVotedOnPull && userPreviousVotedOnPull.pollOptionId !== pollOptionId) {
                await prisma.vote.delete({
                    where: {
                        id: userPreviousVotedOnPull.id
                    }
                })
            } else if (userPreviousVotedOnPull){
                return res.status(400).send({message: 'You already voted on this poll. '})
            }
        }

        if(!sessionId){
            sessionId = randomUUID()

            res.setCookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 30, //30 dias
                signed: true,
                httpOnly: true
            })
        }

        await prisma.vote.create({
            data: {
                sessionId,
                pollId,
                pollOptionId

            }
        })

    
        return res.status(201).send()
    })



}