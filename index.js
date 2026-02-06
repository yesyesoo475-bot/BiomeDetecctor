const express = require('express');
const app = express();

// 1. Render의 포트 할당 방식에 맞게 수정
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => {
  console.log(`[System] 웹 서버가 포트 ${PORT}에서 작동 중입니다.`);
});

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 환경 변수 로드
const TOKEN = process.env.TOKEN;

// 2. 로그인 문제 해결을 위한 디버깅 코드 추가
if (!TOKEN) {
  console.error("❌ [Error] 환경 변수 'TOKEN'을 찾을 수 없습니다. Render 설정의 Environment 탭을 확인하세요.");
} else {
  console.log(`✅ [System] 토큰 로드 성공 (길이: ${TOKEN.length}자)`);
}

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
  console.log(`✅ [Bot] 성공적으로 로그인되었습니다: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // 웹훅 메시지이며 임베드가 있는지, 특정 카테고리인지 확인
  if (!message.webhookId || message.embeds.length === 0) return;
  if (message.channel.parentId !== TARGET_CATEGORY_ID) return;

  const originalEmbed = message.embeds[0];
  const description = (originalEmbed.description ?? '').toLowerCase();

  const targetConfig = Object.values(CONFIG).find(conf => description.includes(conf.key));
  if (!targetConfig) return;

  try {
    // 3. 캐시를 먼저 확인하여 성능 최적화
    const targetChannel = client.channels.cache.get(targetConfig.channelId) 
                          || await client.channels.fetch(targetConfig.channelId);
    
    if (!targetChannel) {
      console.warn(`⚠️ [Warn] 채널을 찾을 수 없습니다: ${targetConfig.name}`);
      return;
    }

    // 4. message.url 속성 활용
    const messageLink = message.url;

    let content = "";
    if (targetConfig.roleId) {
      content += `<@&${targetConfig.roleId}> `;
    }
    content += `**${targetConfig.name} 바이옴이 감지되었습니다.**\n`;
    content += `🔗 **원본 메시지 링크:** ${messageLink}`;

    await targetChannel.send({
      content: content,
      embeds: [originalEmbed.data],
      components: message.components
    });

    console.log(`🚀 [${new Date().toLocaleString()}] ${targetConfig.name} 전송 완료`);

  } catch (error) {
    console.error('❌ [Error] 메시지 전송 중 에러 발생:', error);
  }
});

// 실제 로그인 시도
client.login(TOKEN).catch(err => {
  console.error("❌ [Login Error] 디스코드 로그인 실패:");
  console.error(err);
});
