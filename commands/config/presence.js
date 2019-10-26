import Command from '../../classes/Command.js';
import * as error from '../../classes/Exception.js';

const STATUSINFO = {
    dnd: {
        title: "do not disturb",
        color: 15746887,
    },
    idle: {
        title: "idle",
        color: 16426522,
    },
    online: {
        title: "online",
        color: 4437378,
    },
};

export default new Command({
    name: 'presence',
    keys: [
        "game",
        "status",
    ],
    visibility: 'dev',
    async action(msg, args) {
        if (args[0] && this.getList('delete').includes(args[0])) {
            await this.bot.user.setPresence({
                game: null,
                status: this.bot.user.presence.status,
            });
            this.embed(msg, { title: 'current presence removed', type: "success" });
        } else if (args[0]) {
            const status = args[0];
            if (status in STATUSINFO) {
                // status
                await this.bot.user.setStatus(status);
                this.embed(msg, {
                    color: STATUSINFO[status].color,
                    title: `changed my status to **${STATUSINFO[status].title}**`,
                    type: "success",
                });
            } else {
                // game
                await this.bot.user.setPresence({
                    game: { name: status },
                    status: this.bot.user.presence.status,
                });
                this.embed(msg, { title: `changed my presence to **${status}**`, type: "success" });
            }
        } else {
            const { color, title } = STATUSINFO[this.bot.user.presence.status];
            const description = this.bot.user.presence.game && this.bot.user.presence.game.name;
            this.embed(msg, { color, title, description });
        }
    },
});
