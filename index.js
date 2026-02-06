const express = require('express');
const app = express();

// 1. 웹 서버를 먼저 실행 (Render가 서비스를 'Live'로 인식하게 함)
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot status: Checking...'));
app.listen(PORT, () => {
  console.log(`[Step 1] 웹 서버 가동 중 (포트: ${PORT})`);
});

const { Client, GatewayIntentBits } = require('discord.js');

// 2. 봇 설정
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 3. 토큰 값 직접 확인 로그
const TOKEN = process.env.TOKEN;

console.log("[Step 2] 토큰 확인 프로세스 시작...");

if (!TOKEN) {
  console.error("❌ 에러: TOKEN 환경변수가 텅 비어있습니다!");
} else {
  console.log(`📡 토큰 발견 (앞 글자 5개): ${TOKEN.substring(0, 5)}...`);
  
  // 4. 로그인 시도 및 에러 강제 포착
  console.log("[Step 3] 디스코드 API 로그인 시도...");
  
  client.login(TOKEN)
    .then(() => {
      console.log(`✅ 성공: ${client.user.tag} 계정으로 로그인되었습니다.`);
    })
    .catch((err) => {
      console.error("❌ 로그인 실패 상세 정보:");
      console.error(err); // 여기에 무조건 에러가 찍혀야 합니다.
    });
}

// 봇이 준비되었을 때 실행될 이벤트
client.once('ready', () => {
  console.log("🚀 봇이 모든 준비를 마쳤습니다!");
});
