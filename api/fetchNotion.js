// fetchNotion.js
const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

async function fetchFlashcards() {
  const response = await notion.databases.query({ database_id: databaseId });
  return response.results.map(page => ({
    word: page.properties.word.title[0]?.plain_text || "",
    translation: page.properties.translation.rich_text[0]?.plain_text || "",
  }));
}

// For Vercel Serverless Function
module.exports = async (req, res) => {
  try {
    const cards = await fetchFlashcards();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
