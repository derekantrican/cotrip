const { getDb, run } = require('./server/db');

async function seed() {
  await getDb();

  // Create a trip spanning today (so it auto-opens)
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 2);
  const end = new Date(today);
  end.setDate(end.getDate() + 4);
  const fmt = d => d.toISOString().split('T')[0];

  run('INSERT INTO trips (title, start_date, end_date, cover_image) VALUES (?, ?, ?, ?)', [
    'Tokyo & Kyoto 2026',
    fmt(start),
    fmt(end),
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'
  ]);

  const d1 = fmt(start);
  const d2 = fmt(new Date(start.getTime() + 86400000));
  const d3 = fmt(new Date(start.getTime() + 86400000 * 2)); // today
  const d4 = fmt(new Date(start.getTime() + 86400000 * 3));
  const d5 = fmt(new Date(start.getTime() + 86400000 * 4));
  const d6 = fmt(new Date(start.getTime() + 86400000 * 5));
  const d7 = fmt(new Date(start.getTime() + 86400000 * 6));

  // Day 1: Travel day
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d1, '06:00', '08:00', 'Uber to Airport', 'Pickup at home, Terminal 1 drop-off', 'transportation'
  ]);
  run('INSERT INTO activities (trip_id, date, end_date, start_time, end_time, title, description, category, link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
    1, d1, d2, '10:30', '14:00', 'Flight SEA to NRT', 'United UA875\nSeat 24A (window)\nMeal: pre-ordered Asian vegetarian', 'transportation', 'https://mail.google.com/mail/u/0/#search/united+confirmation'
  ]);
  run('INSERT INTO activities (trip_id, date, end_date, title, description, category) VALUES (?, ?, ?, ?, ?, ?)', [
    1, d1, d4, 'Hotel Gracery Shinjuku', 'Booking #GRC-28491\n\nCheck-in: 3:00 PM\nCheck-out: 11:00 AM\n\n**Address:** 1-19-1 Kabukicho, Shinjuku', 'hotel'
  ]);

  // Day 2: First full day in Tokyo
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d2, '07:00', '08:00', 'Breakfast at Tsukiji Outer Market', 'Try the fresh sushi and tamagoyaki stalls', 'food'
  ]);
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d2, '09:00', '11:30', 'Senso-ji Temple & Asakusa', 'Walk through Nakamise-dori shopping street\n\n**Tips:**\n- Go early to avoid crowds\n- Get a fortune (omikuji) for 100 yen', 'sight-seeing'
  ]);
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d2, '12:00', '13:00', 'Ramen at Ichiran Shibuya', 'Solo booth ramen - customize your noodle firmness and broth richness', 'food'
  ]);
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d2, '14:00', '17:00', 'TeamLab Borderless', 'Digital art museum in Azabudai Hills\n\n**Note:** tickets are timed entry, arrive 10 min early', 'sight-seeing'
  ]);
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d2, '19:00', '21:00', 'Shibuya Sky Observation Deck', 'Sunset views from the rooftop - bring a jacket!', 'sight-seeing'
  ]);

  // Day 3: Today
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d3, '08:00', '09:00', 'Convenience store breakfast', '7-Eleven onigiri + coffee', 'food'
  ]);
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d3, '10:00', '12:00', 'Meiji Shrine & Harajuku', 'Walk through the forested path to the shrine, then explore Takeshita Street', 'sight-seeing'
  ]);
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d3, '13:00', '14:00', 'Lunch at Afuri (yuzu ramen)', 'Light and citrusy - good change from heavy tonkotsu', 'food'
  ]);
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d3, '15:00', '18:00', 'Akihabara exploration', 'Retro game shops, manga stores, maid cafes', 'sight-seeing'
  ]);
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d3, '20:00', '23:30', 'Golden Gai bar hopping', '6 tiny bars in Shinjuku - no cover if you buy a drink', 'food'
  ]);

  // Day 4: Travel to Kyoto
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d4, '09:00', '11:15', 'Shinkansen to Kyoto', 'Nozomi #225 from Tokyo Station\nCar 7, Seats 3A-3B\n\nGrab an ekiben (station bento) before boarding!', 'transportation'
  ]);
  run('INSERT INTO activities (trip_id, date, end_date, title, description, category) VALUES (?, ?, ?, ?, ?, ?)', [
    1, d4, d6, 'Kyoto Granbell Hotel', 'Booking #KGB-7192\n\nCheck-in: 2:00 PM\nCheck-out: 11:00 AM\n\nNear Kyoto Station', 'hotel'
  ]);
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d4, '13:00', '16:00', 'Fushimi Inari Shrine', 'Walk the thousand torii gates - go all the way to the top (2hr hike)', 'sight-seeing'
  ]);
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d4, '18:00', '19:30', 'Dinner in Pontocho Alley', 'Narrow lantern-lit alley along the river', 'food'
  ]);
  run('INSERT INTO activities (trip_id, date, end_date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
    1, d4, d5, '22:00', '06:00', 'Overnight bus to Nara & back', 'Willer Express night bus\nDeparts Kyoto Station 10 PM, arrives Nara 11 PM\nExplore deer park at dawn, returns to Kyoto by 6 AM', 'transportation'
  ]);

  // Day 5: Kyoto temples
  run('INSERT INTO activities (trip_id, date, end_date, start_time, end_time, title, description, category, link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
    1, d5, d6, null, null, 'JR Kansai Area Pass (2-day)', 'Covers unlimited travel on JR lines in Kansai region\nActivated today, valid through tomorrow\n\n**Pickup:** Kyoto Station JR office (show QR code)', 'transportation', 'https://www.westjr.co.jp/global/en/ticket/pass/kansai/'
  ]);
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d5, '06:30', '08:30', 'Arashiyama Bamboo Grove', 'Go at sunrise for empty paths and photos. Rent bikes nearby.', 'sight-seeing'
  ]);
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d5, '10:00', '11:30', 'Kinkaku-ji (Golden Pavilion)', 'The iconic gold temple reflecting in the pond', 'sight-seeing'
  ]);
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d5, '14:00', '16:00', 'Nishiki Market', 'The "Kitchen of Kyoto" - try matcha everything, pickles, and mochi', 'food'
  ]);

  // Day 6: Last day - head home
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d6, '09:00', '10:30', 'Kiyomizu-dera Temple', 'Mountain temple with panoramic city views', 'sight-seeing'
  ]);
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    1, d6, '12:00', '14:00', 'Shinkansen back to Tokyo', 'Nozomi #242 from Kyoto Station', 'transportation'
  ]);
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category, link) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
    1, d6, '17:00', '21:00', 'Flight NRT to SEA', 'United UA876\nCheck in online 24hrs before', 'transportation', 'https://www.united.com/en/us/manageres/mytrips'
  ]);

  // Past trip for the dashboard
  run('INSERT INTO trips (title, start_date, end_date, cover_image) VALUES (?, ?, ?, ?)', [
    'Portland Weekend',
    '2026-04-10',
    '2026-04-12',
    'https://images.unsplash.com/photo-1507245338956-18b5b4c4489b?w=800'
  ]);
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, category) VALUES (?, ?, ?, ?, ?, ?)', [
    2, '2026-04-10', '08:00', '11:00', 'Drive to Portland', 'transportation'
  ]);
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, category) VALUES (?, ?, ?, ?, ?, ?)', [
    2, '2026-04-10', '12:00', '13:00', 'Pine State Biscuits', 'food'
  ]);
  run('INSERT INTO activities (trip_id, date, start_time, end_time, title, category) VALUES (?, ?, ?, ?, ?, ?)', [
    2, '2026-04-11', '10:00', '14:00', "Powell's Books", 'sight-seeing'
  ]);

  console.log('Database seeded with sample trip data!');
  console.log(`Active trip: ${fmt(start)} to ${fmt(end)} (today is Day 3: ${fmt(today)})`);
}

seed().catch(e => console.error(e));
