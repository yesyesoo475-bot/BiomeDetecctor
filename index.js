const express = require('express');
const app = express();

// 24�쒓컙 媛��숈쓣 �꾪븳 �� �쒕쾭
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
const TARGET_CATEGORY_ID = '1444681949913419777'; 

// 諛붿씠�대퀎 �ㅼ젙 �곗씠��
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
    everyone: true, 
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
  },
  // �뚯뒪�몄슜 WINDY 諛붿씠�� 異붽�
  WINDY: {
    name: 'WINDY',
    channelId: '1461348550758891717',
    everyone: true,
    key: 'biome started - windy'
  }
};

client.once('ready', () => {
  console.log(`�� 遊� 濡쒓렇�� �꾨즺: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // 1. 湲곕낯 �꾪꽣留� (�뱁썒, �꾨쿋��, 移댄뀒怨좊━ 泥댄겕)
  if (!message.webhookId || message.embeds.length === 0) return;
  if (message.channel.parentId !== TARGET_CATEGORY_ID) return;

  const originalEmbed = message.embeds[0];
  const description = (originalEmbed.description ?? '').toLowerCase();

  // 2. CONFIG�먯꽌 �ㅼ썙�� �쇱튂 �щ� �뺤씤
  const targetConfig = Object.values(CONFIG).find(conf => description.includes(conf.key));
  if (!targetConfig) return;

  try {
    const targetChannel = await client.channels.fetch(targetConfig.channelId);
    if (!targetChannel) return;

    // 3. 硫붿떆吏� 蹂몃Ц 援ъ꽦 (�먮툕由ъ썝 �� �먮뒗 ��븷 ��)
    let content = "";
    if (targetConfig.everyone) {
      content += "@everyone ";
    } else if (targetConfig.roleId) {
      content += `<@&${targetConfig.roleId}> `;
    }

    content += `**${targetConfig.name} Detected**`;

    // 4. 硫붿떆吏� �꾩넚
    await targetChannel.send({
      content: content,
      embeds: [originalEmbed.data],
      components: message.components
    });

    console.log(`[${new Date().toLocaleString()}]  ${targetConfig.name} �꾩넚 �꾨즺`);

  } catch (error) {
    console.error(`[�먮윭] ${targetConfig.name} 泥섎━ 以� �ㅻ쪟:`, error);
  }
});

client.login(TOKEN);
