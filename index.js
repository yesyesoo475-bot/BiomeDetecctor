const express = require('express');
const app = express();
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

// ====== 바이옴 감지 카테고리 ======
const TARGET_CATEGORY_ID = '1444681949913419777';

// ====== 상인 감지 채널 ======
const MERCHANT_SOURCE_CHANNEL = '1465702991649833013';

// ====== 바이옴 설정 ======
const CONFIG = {

  AURORA: { 
    name: 'AURORA',
    channelId: '1459481518283165769', 
    roleId: '1459482724174925979',
    key: 'biome started - aurora'
  },

  SAND_STORM: {
    name: 'SAND STORM',
    channelId: '1469365395914756186',
    roleId: '1469365996493082889',
    key: 'biome started - sand storm'
  },

  HELL: {
    name: 'HELL',
    channelId: '1469365424373239913',
    roleId: '1469366063748747549',
    key: 'biome started - hell'
  },

  HEAVEN: {
    name: 'HEAVEN',
    channelId: '1469365445969707019',
    roleId: '1469366138092650527',
    key: 'biome started - heaven'
  },

  STARFALL: {
    name: 'STARFALL',
    channelId: '1469365472284774618',
    roleId: '1469366200038330512',
    key: 'biome started - starfall'
  },

  CORRUPTION: {
    name: 'CORRUPTION',
    channelId: '1469365500080554014',
    roleId: '1469366302807425219',
    key: 'biome started - corruption'
  },

  NULL: {
    name: 'NULL',
    channelId: '1469365519529541918',
    roleId: '1469366344087506965',
    key: 'biome started - null'
  },

  CYBERSPACE: {
    name: 'CYBERSPACE',
    channelId: '1446766069078560891',
    roleId: null,
    key: 'biome started - cyberspace'
  },

  DREAMSPACE: {
    name: 'DREAMSPACE',
    channelId: '1446784055524851793',
    roleId: null,
    key: 'biome started - dreamspace'
  },

  GLITCHED: { 
    name: 'GLITCHED',
    channelId: '1446783997010247862',
    roleId: null,
    key: 'biome started - glitched'
  }
};

// ====== 상인 설정 ======
const MERCHANT_CONFIG = {
  MARI: {
    name: 'Mari',
    key: 'merchant detected - mari',
    channelId: '1469698435484745819',
    roleId: '1469699013627351141'
  },
  JESTER: {
    name: 'Jester',
    key: 'merchant detected - jester',
    channelId: '1469698456426905640',
    roleId: '1469699118325694545'
  }
};

client.once('ready', () => {
  console.log(`봇 로그인됨: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.webhookId || message.embeds.length === 0) return;

  const embed = message.embeds[0];
  const description = (
    (embed.description ?? '') + ' ' + (embed.title ?? '')
  ).toLowerCase();

  // =========================
  // ===== 바이옴 감지 ======
  // =========================
  if (message.channel.parentId === TARGET_CATEGORY_ID) {

    const targetConfig = Object.values(CONFIG).find(conf =>
      description.includes(conf.key)
    );

    if (!targetConfig) return;

    try {
      const targetChannel = await client.channels.fetch(targetConfig.channelId);
      if (!targetChannel) return;

      let content = '';
      if (targetConfig.roleId) {
        content += `<@&${targetConfig.roleId}> `;
      }

      content += `**${targetConfig.name} Detected**`;

      await targetChannel.send({
        content: content,
        embeds: [embed],
        components: message.components
      });

      console.log(`${targetConfig.name} 전송 완료`);
    } catch (error) {
      console.error('바이옴 전송 에러:', error);
    }
  }

  // =========================
  // ===== 상인 감지 ======
  // =========================
  if (message.channelId === MERCHANT_SOURCE_CHANNEL) {

    const merchantConfig = Object.values(MERCHANT_CONFIG).find(conf =>
      description.includes(conf.key)
    );

    if (!merchantConfig) return;

    try {
      const targetChannel = await client.channels.fetch(merchantConfig.channelId);
      if (!targetChannel) return;

      const content =
        `<@&${merchantConfig.roleId}> ` +
        `**Merchant Detected - ${merchantConfig.name}**`;

      await targetChannel.send({
        content: content,
        embeds: [embed],
        components: message.components
      });

      console.log(`${merchantConfig.name} 상인 전송 완료`);
    } catch (error) {
      console.error('상인 전송 에러:', error);
    }
  }
});

client.login(TOKEN);
