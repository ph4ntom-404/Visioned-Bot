const { SlashCommandBuilder } = require('discord.js');
const puppeteer = require('puppeteer');
const fs = require('node:fs')

async function runApifyActor() {
  const actorId = 'tiktok-scraper'; // Replace with your actor ID from Apify
  const apiKey = 'your-apify-api-key'; // Replace with your Apify API key

  const response = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs?token=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: {
        username: 'surelyram'  // The TikTok username you want to scrape
      }
    })
  });

  const data = await response.json();
  console.log('Actor run response:', data);

  return data;
}
runApifyActor();
async function fetchResults(runId) {
    const apiKey = 'your-apify-api-key'; // Replace with your Apify API key
    const response = await fetch('https://api.apify.com/v2/datasets/HX9YM6YXIb23j5eNo/items?attachment=true&clean=true&format=jsonl');
    const data = await response.json();
    console.log('Scraped data:', data);
  }
  
module.exports = {
  data: new SlashCommandBuilder()
    .setName('fetch')
    .setDescription('To fetch a TikTok profile'),
  async execute(message, args) {
    fetchResults();
  }
};