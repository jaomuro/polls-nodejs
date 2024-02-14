type Message = {pollOptionId: string, votes: number}

type Subscriber = (message: Message) => (void)


class VotingPubSub {
    private channels: Record<string, Subscriber[]> = { }

    subscribe(pollId: string, subscriber:Subscriber) {
        if (!this.channels[pollId]) {
            this.channels[pollId] = [] // é inicializado então um novo canal com o pollId fornecido mas sem subscribers logo o array estará vazio.
        }

        this.channels[pollId].push(subscriber)
    }

    publish(pollId: string, message: Message) {
        if(!this.channels[pollId]){
            return;
        }
        for(const subscriber of this.channels[pollId]){
            subscriber(message)
        }
    }
}

export const voting = new VotingPubSub()