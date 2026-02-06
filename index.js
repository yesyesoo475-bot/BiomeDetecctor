const express = require('express');
const app = express();
const { Client, GatewayIntentBits } = require('discord.js');

// 1. 웹 서버 설정 (Render용)
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot status: Initializing...'));
app.listen(PORT, () => {
  console.log(`[1] Web server is live on port ${PORT}`);
});

// 2. 봇 클라이언트 생성
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// 3. 실행 함수 정의
async function startBot() {
  const TOKEN = process.env.TOKEN;
  
  if (!TOKEN) {
    console.error("❌ TOKEN is missing in environment variables!");
    return;
  }

  console.log("[2] Attempting to login to Discord...");

  try {
    // 타임아웃 20초 설정
    const loginPromise = client.login(TOKEN);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Login Timeout (20s)')), 20000)
    );

    // 로그인과 타임아웃 중 먼저 끝나는 쪽 실행
    await Promise.race([loginPromise, timeoutPromise]);
    console.log(`✅ [3] Success! Logged in as: ${client.user.tag}`);
  } catch (error) {
    console.error("❌ [4] Login failed or timed out:");
    console.error(error);
  }
}

// 봇 실행
startBot();

// 준비 완료 이벤트
client.once('ready', () => {
  console.log("🚀 Bot is ready and listening for events.");
});

// 에러 핸들러 추가 (비정상 종료 방지)
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
