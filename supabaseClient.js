// supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'; // Using ES Module import

const supabaseUrl = 'https://vltutvyytoaqwikwxy.supabase.co';
const supabaseKey = 'JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxdmx0dXR2eXl0b2Fxd2lrd3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTQ5OTYsImV4cCI6MjA2MzczMDk5Nn0.vPT83mAeO2IDQSwfCZPUP5aFBpKXTQeArSpbfxzPhW0';

export const supabase = createClient(supabaseUrl, supabaseKey);
