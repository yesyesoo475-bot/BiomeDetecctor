const express = require('express');
const app = express();

// 24시간 가동을 위한 웹 서버
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

// 바이옴별 설정 데이터
const CONFIG = {
  AURORA: { 
    name: 'AURORA',
    channelId: '1459481518283165769', 
    roleId: '1459482724174925979', // 특정 역할 핑
    key: 'biome started - aurora' 
  },
  CYBERSPACE: { 
    name: 'CYBERSPACE',
    channelId: '1446766069078560891', 
    everyone: true, // 에브리원 핑 여부
    key: 'biome started - cyberspace' 
  },
  DREAMSPACE: { 
    name: 'DREAMSPACE',
    channelId: '1446784055524851793', 
    everyone: true, 
    key: 'biome started - dreamspace' 
  },
  GLITCHED: { 
    name: 'GLITCHED',
    channelId: '1446783997010247862', 
    everyone: true, 
    key: 'biome started - glitched' 
  }
};

client.once('ready', () => {
  console.log(`✅ 봇 로그인 완료: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // 1. 기본 필터링
  if (!message.webhookId || message.embeds.length === 0) return;
  if (message.channel.parentId !== TARGET_CATEGORY_ID) return;

  const originalEmbed = message.embeds[0];
  const description = (originalEmbed.description ?? '').toLowerCase();

  // 2. 바이옴 키워드 확인
  const targetConfig = Object.values(CONFIG).find(conf => description.includes(conf.key));
  if (!targetConfig) return;

  try {
    const targetChannel = await client.channels.fetch(targetConfig.channelId);
    if (!targetChannel) return;

    // 3. 메시지 본문 구성.
    let content = "";
    
    // 에브리원 핑 대상인 경우
    if (targetConfig.everyone) {
      content += "@everyone ";
    } 
    // 특정 역할 핑이 설정된 경우 (AURORA 등)
    else if (targetConfig.roleId) {
      content += `<@&${targetConfig.roleId}> `;
    }

    content += `**${targetConfig.name} Detected**`;

    // 4. 전송 (본문 + 임베드 + 컴포넌트)
    await targetChannel.send({
      content: content,
      embeds: [originalEmbed.data],
      components: message.components
    });

    console.log(`[${new Date().toLocaleString()}] 📤 ${targetConfig.name} (Ping) 전송 완료`);

  } catch (error) {
    console.error(`[에러] ${targetConfig.name} 전송 실패:`, error);
  }
});

client.login(TOKEN);
