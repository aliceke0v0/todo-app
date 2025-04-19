// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// 用你的 Supabase 專案 URL 和公開 API 密鑰來初始化
const supabaseUrl = 'https://xoqvgmntjvzwzqsmqvfg.supabase.co'; // 用你的 URL 替換
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvcXZnbW50anZ6d3pxc21xdmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDExNTIsImV4cCI6MjA1ODQ3NzE1Mn0.WjvMbOq1_jPFv5jNo6lM9GyPK6XD76Sf6_0iLYtmX4M'; // 用你的公開密鑰替換
export const supabase = createClient(supabaseUrl, supabaseKey);
