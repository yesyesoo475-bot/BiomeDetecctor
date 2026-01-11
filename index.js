const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(3000);

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN;

const TARGET_CATEGORY_ID = '1444681949913419777'; 

const CONFIG = {
  AURORA: { 
    name: 'AURORA',
    channelId: '1459481518283165769', 
    roleId: '1459482724174925979',
    key: 'biome started - aurora' 
  },
  CYBERSPACE: { 
    name: 'CYBERSPACE',
    channelId: '1446766069078560891', 
    key: 'biome started - cyberspace' 
  },
  DREAMSPACE: { 
    name: 'DREAMSPACE',
    channelId: '1446784055524851793', 
    key: 'biome started - dreamspace' 
  },
  GLITCHED: { 
    name: 'GLITCHED',
    channelId: '1446783997010247862', 
    key: 'biome started - glitched' 
  }
};

client.once('ready', () => {
  console.log(`봇 로그인됨: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.webhookId || message.embeds.length === 0) return;
  if (message.channel.parentId !== TARGET_CATEGORY_ID) return;

  const originalEmbed = message.embeds[0];
  const description = (originalEmbed.description ?? '').toLowerCase();

  const targetConfig = Object.values(CONFIG).find(conf => description.includes(conf.key));
  if (!targetConfig) return;

  try {
    const targetChannel = await client.channels.fetch(targetConfig.channelId);
    if (!targetChannel) return;

    const messageLink = `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`;

    // 본문 구성: [역할핑] [바이옴 이름] 바이옴이 감지되었습니다. + 링크
    let content = "";
    if (targetConfig.roleId) {
      content += `<@&${targetConfig.roleId}> `; // 오로라일 때만 핑 추가
    }
    content += `**${targetConfig.name} 바이옴이 감지되었습니다.**\n`;
    content += `🔗 **원본 메시지 링크:** ${messageLink}`;

    await targetChannel.send({
      content: content,
      embeds: [originalEmbed.data],
      components: message.components
    });

    console.log(`[${new Date().toLocaleString()}] ${targetConfig.name} 전송 완료`);

  } catch (error) {
    console.error('전송 에러:', error);
  }
});

client.login(TOKEN);