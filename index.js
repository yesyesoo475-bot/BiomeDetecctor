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

// ===== [ID 설정 섹션] =====
const TARGET_CATEGORY_ID = '1444681949913419777'; 

const CONFIG = {
  AURORA: { channelId: '1459481518283165769', key: 'biome started - aurora' },
  CYBERSPACE: { channelId: '1446766069078560891', key: 'biome started - cyberspace' },
  DREAMSPACE: { channelId: '1446784055524851793', key: 'biome started - dreamspace' },
  GLITCHED: { channelId: '1446783997010247862', key: 'biome started - glitched' }
};

client.once('ready', () => {
  console.log(`봇 로그인됨: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // 웹후크가 보낸 임베드가 없으면 무시
  if (!message.webhookId || message.embeds.length === 0) return;

  // 지정된 카테고리 내의 메시지인지 확인
  if (message.channel.parentId !== TARGET_CATEGORY_ID) return;

  const originalEmbed = message.embeds[0];
  const description = (originalEmbed.description ?? '').toLowerCase();

  // 어떤 바이옴인지 찾기
  let targetConfig = null;
  for (const key in CONFIG) {
    if (description.includes(CONFIG[key].key)) {
      targetConfig = CONFIG[key];
      break;
    }
  }

  if (!targetConfig) return;

  try {
    const targetChannel = await client.channels.fetch(targetConfig.channelId);
    if (!targetChannel) return;

    // 1. 원본 메시지 링크 생성
    const messageLink = `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`;

    // 2. 메시지 전송
    await targetChannel.send({
      // 핑 대신 원본 메시지 링크만 깔끔하게 표시
      content: `🔗 **원본 메시지 링크:** ${messageLink}`,
      
      // 원본 임베드 디자인(색상, 내용, 이미지 등) 그대로 복제
      embeds: [originalEmbed.data], 
      
      // 원본에 달려있던 'Join Server' 버튼과 VIP 서버 링크 그대로 복제
      components: message.components 
    });

    console.log(`${targetConfig.key} 전달 완료 (링크 포함)`);

  } catch (error) {
    console.error('전송 중 에러 발생:', error);
  }
});

client.login(TOKEN);