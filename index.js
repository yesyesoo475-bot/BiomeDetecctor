const express = require('express');
const app = express();

<<<<<<< HEAD
// 24시간 가동을 위한 웹 서버.
=======
// 1. 포트 설정 개선: Render는 process.env.PORT를 사용하는 것을 권장합니다.
const PORT = process.env.PORT || 3000;
>>>>>>> 5fceac098587a5bd8f153d4b8db5d5f5210949d1
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => {
  console.log(`[SYSTEM] 웹 서버가 ${PORT}번 포트에서 가동 중입니다.`);
});

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 2. 환경 변수 체크 로그 추가
const TOKEN = process.env.TOKEN;
<<<<<<< HEAD
=======

if (!TOKEN) {
  console.error("❌ [ERROR] TOKEN 환경 변수를 찾을 수 없습니다! Render의 'Environment Variables' 설정을 다시 확인하세요.");
} else {
  console.log("🔑 [INFO] 토큰을 성공적으로 읽어왔습니다. 로그인을 시도합니다...");
}

>>>>>>> 5fceac098587a5bd8f153d4b8db5d5f5210949d1
const TARGET_CATEGORY_ID = '1444681949913419777'; 

// 바이옴별 설정 데이터
const CONFIG = {
<<<<<<< HEAD
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
=======
  AURORA: { name: 'AURORA', channelId: '1459481518283165769', roleId: '1459482724174925979', key: 'biome started - aurora' },
  CYBERSPACE: { name: 'CYBERSPACE', channelId: '1446766069078560891', everyone: true, key: 'biome started - cyberspace' },
  DREAMSPACE: { name: 'DREAMSPACE', channelId: '1446784055524851793', everyone: true, key: 'biome started - dreamspace' },
  GLITCHED: { name: 'GLITCHED', channelId: '1446783997010247862', everyone: true, key: 'biome started - glitched' }
};

client.once('ready', () => {
  console.log(`✅ [SUCCESS] 봇 로그인 완료: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // 메시지 감지 여부 확인을 위한 로그 (필요 시 주석 해제)
  // console.log(`[DEBUG] 메시지 수신: ${message.channel.id}`);

>>>>>>> 5fceac098587a5bd8f153d4b8db5d5f5210949d1
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

<<<<<<< HEAD
    // 3. 메시지 본문 구성
    let content = "";
    
    // 에브리원 핑 대상인 경우
    if (targetConfig.everyone) {
      content += "@everyone ";
    } 
    // 특정 역할 핑이 설정된 경우 (AURORA 등)
    else if (targetConfig.roleId) {
      content += `<@&${targetConfig.roleId}> `;
    }
=======
    let content = "";
    if (targetConfig.everyone) content += "@everyone ";
    else if (targetConfig.roleId) content += `<@&${targetConfig.roleId}> `;
    
    content += `**${targetConfig.name} Detected**`;
>>>>>>> 5fceac098587a5bd8f153d4b8db5d5f5210949d1

    content += `**${targetConfig.name} Detected**`;

    // 4. 전송 (본문 + 임베드 + 컴포넌트)
    await targetChannel.send({
      content: content,
      embeds: [originalEmbed.data],
      components: message.components
    });

<<<<<<< HEAD
    console.log(`[${new Date().toLocaleString()}] 📤 ${targetConfig.name} (Ping) 전송 완료`);
=======
    console.log(`[${new Date().toLocaleString()}] 📤 ${targetConfig.name} 알림 전송 완료`);
>>>>>>> 5fceac098587a5bd8f153d4b8db5d5f5210949d1

  } catch (error) {
    console.error(`[에러] ${targetConfig.name} 전송 실패:`, error);
  }
});

<<<<<<< HEAD
client.login(TOKEN);
=======
// 3. 로그인 에러 핸들링 추가
client.login(TOKEN).catch(err => {
  console.error("❌ [LOGIN FAILED] 디스코드 로그인 중 치명적 오류 발생:");
  console.error(err);
});
>>>>>>> 5fceac098587a5bd8f153d4b8db5d5f5210949d1
