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

// Render 환경변수 Key 이름을 'TOKEN'으로 설정하세요.
const TOKEN = process.env.TOKEN; 

const ALERT_CHANNEL_ID = '1459481518283165769';
const AURORA_ROLE_ID = '1459482724174925979';

const BIOMES = [
  { key: 'biome started - aurora', message: '오로라 바이옴이 감지되었습니다.', rolePing: true },
  { key: 'biome started - cyberspace', message: '사이버스페이스 바이옴이 감지되었습니다.', rolePing: false },
  { key: 'biome started - dreamspace', message: '드림스페이스 바이옴이 감지되었습니다.', rolePing: false },
  { key: 'biome started - glitched', message: '글리치 바이옴이 감지되었습니다.', rolePing: false }
];

client.once('ready', () => {
  console.log(`봇 로그인됨: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.webhookId) return;
  if (message.embeds.length === 0) return;

  const embed = message.embeds[0];
  const text = (embed.description ?? '').toLowerCase();

  for (const biome of BIOMES) {
    if (!text.includes(biome.key)) continue;

    const alertChannel = await client.channels.fetch(ALERT_CHANNEL_ID);
    if (!alertChannel) return;

    let sendText = '';
    if (biome.rolePing) {
      sendText += `<@&${AURORA_ROLE_ID}>\n`;
    }

    sendText += `${biome.message}\n🔗 메시지 링크: ${message.url}`;

    await alertChannel.send(sendText);
    break;
  }
});

client.login(TOKEN);