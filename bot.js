const { createClient } = require('@supabase/supabase-js');
const { Telegraf } = require('telegraf');
const http = require('http');

// Supabase & Bot Setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = 6724939097;

// Admin စစ်ဆေးခြင်း
const isAdmin = (ctx, next) => {
    if (ctx.from.id === ADMIN_ID) return next();
    return ctx.reply("မင်းက Admin မဟုတ်ဘူးလေကွာ... 😎");
};

// Bot Commands
bot.command('top', isAdmin, async (ctx) => {
    const newName = ctx.message.text.split(' ').slice(1).join(' ');
    if (!newName) return ctx.reply('နာမည်ထည့်ဦးလေ။ ဥပမာ: /top Blitz_Fan');
    const { error } = await supabase.from('site_configs').update({ top_supporter: newName }).eq('id', 1);
    if (error) return ctx.reply('Error: ' + error.message);
    ctx.reply(`✅ Top Supporter ပြောင်းလိုက်ပြီ: ${newName}`);
});

bot.command('hero', isAdmin, async (ctx) => {
    const args = ctx.message.text.split(' ');
    const matches = args[1];
    const wr = args[2];
    const mmr = args[3];

    if (!matches || !wr || !mmr) return ctx.reply('အချက်အလက်စုံအောင်ထည့်ပါ။ ဥပမာ: /hero 173 61 2658');

    const { error } = await supabase.from('site_configs').update({ 
        hero_matches: matches, 
        hero_wr: wr, 
        hero_mmr: mmr 
    }).eq('id', 1);

    if (error) return ctx.reply('Error: ' + error.message);
    ctx.reply(`✅ Chou Stats Update ဖြစ်သွားပြီ!`);
});

// Render Error မတက်အောင် Port ဖွင့်ပေးခြင်း
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Blitz Bot is Online and Healthy!');
});

// Render ကပေးတဲ့ Port မှာ Listen လုပ်ခြင်း
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Bot ကို Polling နဲ့ပဲ အရင်စတင်ပါ (ဒါက ပိုလွယ်ပါတယ်)
bot.launch().then(() => console.log('Telegram Bot started!'));

// ပိတ်သွားခဲ့ရင် ပုံမှန်အတိုင်း ပြန်ပိတ်ရန်
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
