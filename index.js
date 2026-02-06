const express = require('express');
const app = express();

// 1. Render용 웹 서버 설정
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => {
  console.log(`[System] 웹 서버가 포트 ${PORT}에서 작동 중입니다.`);
});

const { Client, GatewayIntentBits } = require('discord.js');

// 봇의 권한 설정 (Intents)
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 환경변수에서 토큰 가져오기
const TOKEN = process.env.TOKEN;

// 2. 설정 데이터 (ID값들 확인 필수)
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

// 3. 봇 상태 이벤트
client.once('ready', () => {
  console.log(`✅ [Bot] 성공적으로 로그인되었습니다!`);
  console.log(`🤖 접속 계정: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // 웹훅이 아니거나 임베드가 없으면 무시
  if (!message.webhookId || message.embeds.length === 0) return;
  
  // 지정된 카테고리가 아니면 무시
  if (message.channel.parentId !== TARGET_CATEGORY_ID) return;

  const originalEmbed = message.embeds[0];
  const description = (originalEmbed.description ?? '').toLowerCase();

  // 설정된 키워드가 포함되어 있는지 확인
  const targetConfig = Object.values(CONFIG).find(conf => description.includes(conf.key));
  if (!targetConfig) return;

  try {
    const targetChannel = client.channels.cache.get(targetConfig.channelId) 
                          || await client.channels.fetch(targetConfig.channelId);
    
    if (!targetChannel) {
        console.error(`❌ [Error] 채널을 찾을 수 없음: ${targetConfig.channelId}`);
        return;
    }

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

    console.log(`🚀 [${new Date().toLocaleString()}] ${targetConfig.name} 알림 전송 완료`);

  } catch (error) {
    console.error('❌ [Error] 메시지 전송 중 에러 발생:', error);
  }
});

// 4. 로그인 실행 (로그 개선)
console.log("⏳ [System] 디스코드 API 로그인 시도 중...");

if (!TOKEN) {
    console.error("❌ [Error] TOKEN 환경변수가 설정되지 않았습니다! Render 설정을 확인하세요.");
} else {
    client.login(TOKEN).catch(err => {
        console.error("❌ [Login Error] 토큰이 잘못되었거나 권한 설정이 필요합니다:");
        console.error(err.message);
    });
}
