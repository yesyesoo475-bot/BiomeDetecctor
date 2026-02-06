const express = require('express');
const app = express();

// 1. 포트 설정
const PORT = process.env.PORT || 3000;
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

// ================= [여기에 디버그 코드 추가] =================
client.on('debug', info => console.log(`[DEBUG] ${info}`));
client.on('error', console.error);
client.on('warn', console.warn);
// ==========================================================

const TOKEN = process.env.TOKEN;

if (!TOKEN) {
  console.error("❌ [ERROR] TOKEN 환경 변수를 찾을 수 없습니다!");
} else {
  console.log("🔑 [INFO] 토큰을 성공적으로 읽어왔습니다. 로그인을 시도합니다...");
}

const TARGET_CATEGORY_ID = '1444681949913419777'; 

const CONFIG = {
  AURORA: { name: 'AURORA', channelId: '1459481518283165769', roleId: '1459482724174925979', key: 'biome started - aurora' },
  CYBERSPACE: { name: 'CYBERSPACE', channelId: '1446766069078560891', everyone: true, key: 'biome started - cyberspace' },
  DREAMSPACE: { name: 'DREAMSPACE', channelId: '1446784055524851793', everyone: true, key: 'biome started - dreamspace' },
  GLITCHED: { name: 'GLITCHED', channelId: '1446783997010247862', everyone: true, key: 'biome started - glitched' }
};

client.once('ready', () => {
  console.log(`✅ [SUCCESS] 봇 로그인 완료: ${client.user.tag}`);
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

// ================= [로그인 부분 수정] =================
client.login(TOKEN).catch(err => {
  console.error("❌ [LOGIN FAILED] 디스코드 로그인 중 오류 발생!");
  console.error("에러 메시지:", err.message);
  console.error("에러 코드:", err.code);
});
// =====================================================
