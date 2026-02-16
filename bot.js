const { createClient } = require('@supabase/supabase-js');
const { Telegraf } = require('telegraf');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = 6724939097;

const isAdmin = (ctx, next) => {
    if (ctx.from.id === ADMIN_ID) return next();
    return ctx.reply("မင်းက Admin မဟုတ်ဘူးလေကွာ... 😎");
};

bot.command('top', isAdmin, async (ctx) => {
    const newName = ctx.message.text.split(' ').slice(1).join(' ');
    if (!newName) return ctx.reply('နာမည်ထည့်ဦးလေ။ ဥပမာ: /top WaiYan');
    const { error } = await supabase.from('site_configs').update({ top_supporter: newName }).eq('id', 1);
    if (error) return ctx.reply('Error: ' + error.message);
    ctx.reply(`✅ Top Supporter ပြောင်းလိုက်ပြီ: ${newName}`);
});

bot.command('hero', isAdmin, async (ctx) => {
    const [_, matches, wr, mmr] = ctx.message.text.split(' ');
    const { error } = await supabase.from('site_configs').update({ hero_matches: matches, hero_wr: wr, hero_mmr: mmr }).eq('id', 1);
    if (error) return ctx.reply('Error: ' + error.message);
    ctx.reply(`✅ Chou Stats Update ဖြစ်သွားပြီ!`);
});

bot.launch();
