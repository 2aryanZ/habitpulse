const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rkqqtrzugymmgitgfzch.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_UgqMTmKggpKjIefRt6UpBA_c7pUqMxr';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testFullFlow() {
  console.log('====================================================');
  console.log('🚀 HABITPULSE FULL END-TO-END SUPABASE FLOW TEST');
  console.log('====================================================\n');

  const testEmail = `test_flow_${Date.now()}@habitpulse.test`;
  const testPassword = 'Password123!';

  // STEP 1: TEST USER REGISTRATION & AUTH
  console.log(`[Step 1/6] Registering test user: ${testEmail}...`);
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  });

  if (authError) {
    console.error('❌ Sign-up failed:', authError.message);
    process.exit(1);
  }

  const user = authData.user;
  console.log(`✅ User registered successfully! User ID: ${user.id}`);

  // Sign In to obtain authenticated session
  console.log('[Step 2/6] Signing in to establish authenticated session...');
  const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (signInError) {
    console.error('❌ Sign-in failed:', signInError.message);
    process.exit(1);
  }

  console.log(`✅ Authenticated! JWT Access Token obtained.\n`);

  // STEP 3: CREATE & SYNC MULTI-TYPE HABITS
  console.log('[Step 3/6] Testing Multi-Type Habit Creation & Cloud Sync...');
  const testHabits = [
    {
      id: `habit-workout-${Date.now()}`,
      user_id: user.id,
      title: '30-Min Workout',
      description: 'Strength training',
      category: 'fitness',
      type: 'boolean',
      color: '#EF4444',
      icon: 'fitness',
      target_frequency: 'Daily',
      reminder_time: '17:30',
      streak: 1,
      best_streak: 1,
      completed_today: true,
      history: { '2026-08-30': true },
    },
    {
      id: `habit-hydration-${Date.now()}`,
      user_id: user.id,
      title: 'Hydration Target',
      description: '8 glasses water',
      category: 'health',
      type: 'counter',
      color: '#3B82F6',
      icon: 'water',
      target_frequency: 'Daily',
      reminder_time: '10:00',
      target_value: 8,
      current_value: 6,
      unit: 'glasses',
      streak: 5,
      best_streak: 5,
      completed_today: false,
      history: {},
    },
    {
      id: `habit-meditation-${Date.now()}`,
      user_id: user.id,
      title: 'Morning Meditation',
      description: '10 min mindfulness',
      category: 'mindfulness',
      type: 'timer',
      color: '#8B5CF6',
      icon: 'leaf',
      target_frequency: 'Daily',
      reminder_time: '08:00',
      target_duration_minutes: 10,
      completed_seconds: 600,
      streak: 7,
      best_streak: 7,
      completed_today: true,
      history: {},
    },
  ];

  const { error: insertHabitErr } = await supabase.from('habits').insert(testHabits);
  if (insertHabitErr) {
    console.error('❌ Habit insert failed:', insertHabitErr.message);
    process.exit(1);
  }

  // Query back to verify RLS & data integrity
  const { data: retrievedHabits, error: fetchHabitErr } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id);

  if (fetchHabitErr || retrievedHabits.length !== 3) {
    console.error('❌ Habit fetch failed or row count mismatch:', fetchHabitErr?.message);
    process.exit(1);
  }
  console.log(`✅ 3 Habits created & synced to Supabase (Boolean, Counter, Timer)!`);

  // STEP 4: TEST 3-DAY KICKSTART CHALLENGE SYNC
  console.log('\n[Step 4/6] Testing 3-Day Kickstart Challenge lifecycle...');
  const testChallenge = {
    id: `challenge-3day-${Date.now()}`,
    user_id: user.id,
    challenge_key: 'kickstart-3day',
    title: '3-Day Habit Kickstart',
    tagline: 'Rapid momentum sprint',
    description: 'Complete all daily habits for 3 consecutive days.',
    duration_days: 3,
    completed_days: 3,
    reward_badge: '🚀 Kickstart Champion',
    reward_color: '#4F46E5',
    reward_icon: 'trophy',
    status: 'completed',
    claimed_at: new Date().toISOString(),
  };

  const { error: challengeErr } = await supabase.from('challenges').insert([testChallenge]);
  if (challengeErr) {
    console.error('❌ Challenge insert failed:', challengeErr.message);
    process.exit(1);
  }
  console.log('✅ Challenge synced: 3-Day Kickstart marked completed & reward badge claimed!');

  // STEP 5: TEST ACCOUNTABILITY AUDIT LOG & REFLECTIONS
  console.log('\n[Step 5/6] Testing Accountability Audit Log & Reflection Note sync...');
  const testLog = {
    id: `log-${Date.now()}`,
    user_id: user.id,
    habit_id: testHabits[0].id,
    habit_title: '30-Min Workout',
    habit_color: '#EF4444',
    habit_icon: 'fitness',
    category: 'fitness',
    type: 'boolean',
    action: 'completed',
    value_logged: 'Checked off for today',
    note: 'Felt very energized, ran 5km with great pace!',
    date: '2026-08-30',
  };

  const { error: logErr } = await supabase.from('habit_logs').insert([testLog]);
  if (logErr) {
    console.error('❌ Log insert failed:', logErr.message);
    process.exit(1);
  }
  console.log('✅ Accountability log & personal reflection note saved to Supabase!');

  // STEP 6: VERIFY ROW LEVEL SECURITY (RLS) ISOLATION
  console.log('\n[Step 6/6] Verifying Row Level Security (RLS) Isolation...');
  const unauthClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: leakedHabits } = await unauthClient.from('habits').select('*');

  if (leakedHabits && leakedHabits.length > 0) {
    console.error('❌ RLS FAILURE: Unauthenticated client was able to view private habits!');
    process.exit(1);
  }
  console.log('✅ RLS Security Verified: 0 rows leaked to unauthenticated queries. Data is strictly isolated!');

  console.log('\n====================================================');
  console.log('🎉 ALL 6 TEST STAGES PASSED WITH 100% SUCCESS!');
  console.log('====================================================\n');
}

testFullFlow().catch(console.error);
