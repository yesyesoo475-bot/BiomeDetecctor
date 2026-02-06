const express = require('express');
const app = express();

// 1. Render 포트 설정
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

const TOKEN = process.env.TOKEN;

// 2. 바이옴 설정 데이터
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
  console.log(`✅ [Bot] 로그인 성공! 접속 계정: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.webhookId || message.embeds.length === 0) return;
  if (message.channel.parentId !== TARGET_CATEGORY_ID) return;

  const originalEmbed = message.embeds[0];
  const description = (originalEmbed.description ?? '').toLowerCase();

  const targetConfig = Object.values(CONFIG).find(conf => description.includes(conf.key));
  if (!targetConfig) return;

  try {
    const targetChannel = client.channels.cache.get(targetConfig.channelId) 
                          || await client.channels.fetch(targetConfig.channelId);
    
    if (!targetChannel) return;

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
    console.error('❌ [Error] 메시지 전송 중 에러:', error);
  }
});

// 4. 실행 및 로그인 로직 (디버깅 강화)
console.log("⏳ [System] 디스코드 로그인 시도 시작...");

if (!TOKEN || TOKEN.length < 10) {
    console.error("❌ [Error] 유효한 TOKEN이 설정되지 않았습니다. Environment 설정을 확인하세요.");
} else {
    client.login(TOKEN)
      .then(() => {
        console.log("📡 [System] 디스코드 API에 로그인 요청을 보냈습니다.");
      })
      .catch(err => {
        console.error("❌ [Login Error] 로그인 중 에러가 발생했습니다:");
        console.error(err); // 구체적인 에러 이유(인텐트 부족, 토큰 만료 등)가 여기에 찍힙니다.
      });
}
