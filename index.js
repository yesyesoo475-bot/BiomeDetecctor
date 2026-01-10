const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// ===== 설정 =====
const TOKEN = process.env.DISCORD_TOKEN;

const ALERT_CHANNEL_ID = '1459481518283165769';
const AURORA_ROLE_ID = '1459482724174925979';

// 감지할 바이옴 설정
const BIOMES = [
  {
    key: 'biome started - aurora',
    message: '오로라 바이옴이 감지되었습니다.',
    rolePing: true
  },
  {
    key: 'biome started - cyberspace',
    message: '사이버스페이스 바이옴이 감지되었습니다.',
    rolePing: false
  },
  {
    key: 'biome started - dreamspace',
    message: '드림스페이스 바이옴이 감지되었습니다.',
    rolePing: false
  },
  {
    key: 'biome started - glitched',
    message: '글리치 바이옴이 감지되었습니다.',
    rolePing: false
  }
];
// =================

client.once('ready', () => {
  console.log(`봇 로그인됨: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // 웹후크 메시지만
  if (!message.webhookId) return;

  // 임베드 없으면 무시
  if (message.embeds.length === 0) return;

  // 로그 기준: description에 내용 있음
  const embed = message.embeds[0];
  const text = (embed.description ?? '').toLowerCase();

  for (const biome of BIOMES) {
    if (!text.includes(biome.key)) continue;

    const alertChannel = await client.channels.fetch(ALERT_CHANNEL_ID);
    if (!alertChannel) return;

    let sendText = '';

    // 오로라만 역할 핑
    if (biome.rolePing) {
      sendText += `<@&${AURORA_ROLE_ID}>\n`;
    }

    sendText +=
      `${biome.message}\n` +
      `🔗 메시지 링크: ${message.url}`;

    await alertChannel.send(sendText);
    break; // 한 메시지에 하나만 감지
  }
});

client.login(TOKEN);
