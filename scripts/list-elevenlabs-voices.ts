#!/usr/bin/env tsx
/**
 * List ElevenLabs Voices
 * Shows all available voices in your ElevenLabs account
 */

import { ElevenLabsClient } from 'elevenlabs';

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

async function listVoices() {
  console.log('🎤 Fetching ElevenLabs voices...\n');
  console.log('='.repeat(80));
  
  try {
    const response = await client.voices.getAll();
    
    console.log(`\nFound ${response.voices.length} voices:\n`);
    
    response.voices.forEach((voice, index) => {
      console.log(`${index + 1}. ${voice.name}`);
      console.log(`   Voice ID: ${voice.voice_id}`);
      console.log(`   Category: ${voice.category || 'N/A'}`);
      console.log(`   Labels: ${voice.labels ? Object.entries(voice.labels).map(([k, v]) => `${k}:${v}`).join(', ') : 'N/A'}`);
      console.log('');
    });
    
    console.log('='.repeat(80));
    console.log('\n🔍 Looking for "Nikky" or similar soft/sweet voices...\n');
    
    const nikkySimilar = response.voices.filter(v => 
      v.name.toLowerCase().includes('nik') || 
      v.name.toLowerCase().includes('nicole') ||
      (v.labels && (
        JSON.stringify(v.labels).toLowerCase().includes('soft') ||
        JSON.stringify(v.labels).toLowerCase().includes('sweet')
      ))
    );
    
    if (nikkySimilar.length > 0) {
      console.log('Possible matches:');
      nikkySimilar.forEach(voice => {
        console.log(`\n✨ ${voice.name}`);
        console.log(`   ID: ${voice.voice_id}`);
        console.log(`   Labels: ${voice.labels ? JSON.stringify(voice.labels, null, 2) : 'N/A'}`);
      });
    } else {
      console.log('No exact matches for "Nikky" found.');
      console.log('\nTry searching the Voice Library: https://elevenlabs.io/voice-library');
    }
    
  } catch (error) {
    console.error('❌ Error fetching voices:', error);
  }
}

listVoices();
