const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(3000);

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN;

// ===== [수정 필요] ID 설정 섹션 =====
const TARGET_CATEGORY_ID = '1444681949913419777'; 

const CONFIG = {
  AURORA: {
    channelId: '1459481518283165769',
    roleId: '1459482724174925979',
    key: 'biome started - aurora'
  },
  CYBERSPACE: {
    channelId: '1446766069078560891', 
    key: 'biome started - cyberspace'
  },
  DREAMSPACE: {
    channelId: '1446784055524851793',
    key: 'biome started - dreamspace'
  },
  GLITCHED: {
    channelId: '1446783997010247862',
    key: 'biome started - glitched'
  }
};
// =================================

client.once('ready', () => {
  console.log(`봇 로그인됨: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // 웹후크가 아니고 임베드가 없으면 무시
  if (!message.webhookId || message.embeds.length === 0) return;

  // 지정된 카테고리가 아니면 무시
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

  // 매칭되는 바이옴이 없으면 무시
  if (!targetConfig) return;

  try {
    const targetChannel = await client.channels.fetch(targetConfig.channelId);
    if (!targetChannel) return;

    // 핑 설정 (역할 ID가 있는 경우에만)
    let content = "";
    if (targetConfig.roleId) {
      content = `<@&${targetConfig.roleId}>`;
    }

    // 원본 임베드 복제
    const newEmbed = EmbedBuilder.from(originalEmbed);

    // 실제 전송 부분!
    await targetChannel.send({
      content: content,
      embeds: [newEmbed]
    });

  } catch (error) {
    console.error('메시지 전송 에러:', error);
  }
});

client.login(TOKEN);