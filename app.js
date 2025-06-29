// app.js
const supabaseUrl = 'https://qcaklhpnbclsnflxwyko.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjYWtsaHBuYmNsc25mbHh3eWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5Mzg3OTAsImV4cCI6MjA2NTUxNDc5MH0.fErFdpTQQQBaN3yC2VQ0W_eeRUnc8ndtnvm6nhtuN0s';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);

// Export globally
window.supabaseClient = supabaseClient;

console.log("✅ Supabase Client initialized:", supabaseClient);