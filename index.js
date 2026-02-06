const express = require('express');
const app = express();

// 1. 웹 서버 설정 (Render용)
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => {
  console.log(`[SYSTEM] 웹 서버가 ${PORT}번 포트에서 가동 중입니다.`);
});

const { Client, GatewayIntentBits } = require('discord.js');

// 2. 봇 클라이언트 생성
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ---------------- [ 상세 로그 및 에러 추적 구간 ] ----------------
client.on('debug', info => console.log(`[DEBUG] ${info}`));
client.on('warn', info => console.warn(`[WARN] ${info}`));
client.on('error', error => console.error(`[ERROR] 봇 실행 에러:`, error));

client.on('shardError', error => {
    console.error('❌ [SHARD ERROR] 웹소켓 연결 오류 발생:', error);
});

client.on('shardDisconnect', (event, id) => {
    console.warn(`⚠️ [DISCONNECT] 샤드 ${id}의 연결이 끊겼습니다:`, event);
});

client.on('invalidated', () => {
    console.error('❌ [INVALIDATED] 세션이 무효화되었습니다. 토큰이 올바른지 확인하세요.');
});
// ----------------------------------------------------------------

const TOKEN = process.env.TOKEN;

if (!TOKEN || TOKEN === "") {
  console.error("❌ [ERROR] TOKEN 환경 변수가 비어있습니다! Render의 Environment 설정을 확인하세요.");
} else {
  console.log("🔑 [INFO] 토큰을 읽어왔습니다. 연결을 시도합니다...");
}

const TARGET_CATEGORY_ID = '1444681949913419777'; 

const CONFIG = {
  AURORA: { name: 'AURORA', channelId: '1459481518283165769', roleId: '1459482724174925979', key: 'biome started - aurora' },
  CYBERSPACE: { name: 'CYBERSPACE', channelId: '1446766069078560891', everyone: true, key: 'biome started - cyberspace' },
  DREAMSPACE: { name: 'DREAMSPACE', channelId: '1446784055524851793', everyone: true, key: 'biome started - dreamspace' },
  GLITCHED: { name: 'GLITCHED', channelId: '1446783997010247862', everyone: true, key: 'biome started - glitched' }
};

client.once('ready', () => {
  console.log(`✅ [SUCCESS] 봇 로그인 완료! 계정: ${client.user.tag}`);
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

    let content = "";
    if (targetConfig.everyone) {
      content += "@everyone ";
    } else if (targetConfig.roleId) {
      content += `<@&${targetConfig.roleId}> `;
    }
    
    content += `**${targetConfig.name} Detected**`;

    await targetChannel.send({
      content: content,
      embeds: [originalEmbed.data],
      components: message.components
    });

    console.log(`[${new Date().toLocaleString()}] 📤 ${targetConfig.name} 알림 전송 완료`);
  } catch (error) {
    console.error(`[에러] ${targetConfig.name} 전송 실패:`, error);
  }
});

// 3. 실제 로그인 시도
client.login(TOKEN).catch(err => {
  console.error("❌ [LOGIN FAILED] 디스코드 서버에서 로그인을 거절했습니다.");
  console.error("메시지:", err.message);
  console.error("코드:", err.code);
});
