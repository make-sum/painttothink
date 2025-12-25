#!/usr/bin/env node
/**
 * Direct deployment using Cloudflare Pages API with worker
 * Ensures all files are uploaded correctly
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const ACCOUNT_ID = '7d84a4241cd92238463580dd0e094bc7';
const PROJECT_NAME = 'paint';
const DIST_DIR = path.join(__dirname, 'dist');
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

console.log('🚀 Deploying to Cloudflare Pages (Direct Worker Method)...');
console.log('');

if (!API_TOKEN) {
  console.error('❌ CLOUDFLARE_API_TOKEN not set');
  process.exit(1);
}

// Create manifest of ALL files
function createManifest() {
  const manifest = [];
  
  function walkDir(dir, baseDir = dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath, baseDir);
      } else {
        const relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/');
        manifest.push({
          path: relativePath,
          size: stat.size
        });
      }
    });
  }
  
  walkDir(DIST_DIR);
  return manifest;
}

// Deploy with all files
async function deploy() {
  try {
    console.log('📋 Creating file manifest...');
    const manifest = createManifest();
    console.log(`✅ Found ${manifest.length} files`);
    console.log('');
    
    // Verify critical files
    const criticalFiles = ['index.html', 'assets/react-vendor-D6HrPQ9Y.js', 'assets/index-C70QvWGv.js'];
    criticalFiles.forEach(file => {
      const exists = manifest.some(m => m.path === file);
      if (exists) {
        console.log(`  ✅ ${file}`);
      } else {
        console.log(`  ❌ ${file} MISSING`);
      }
    });
    console.log('');
    
    // Create form data
    const form = new FormData();
    
    // Add manifest FIRST
    form.append('manifest', JSON.stringify(manifest));
    
    // Add ALL files
    console.log('📤 Uploading files...');
    let uploaded = 0;
    manifest.forEach(item => {
      const filePath = path.join(DIST_DIR, item.path);
      if (fs.existsSync(filePath)) {
        form.append('file', fs.createReadStream(filePath), {
          filename: item.path,
          contentType: 'application/octet-stream'
        });
        uploaded++;
      } else {
        console.warn(`⚠️  File not found: ${item.path}`);
      }
    });
    
    console.log(`✅ Uploaded ${uploaded} files`);
    console.log('');
    
    const options = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        ...form.getHeaders()
      }
    };
    
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.success) {
              console.log('✅ Deployment successful!');
              console.log('   Deployment ID:', response.result.id);
              console.log('   URL:', response.result.url);
              console.log('');
              console.log('🎉 Site should be live in 1-2 minutes!');
              resolve(response);
            } else {
              console.error('❌ Deployment failed:', JSON.stringify(response.errors, null, 2));
              reject(new Error('Deployment failed'));
            }
          } catch (e) {
            console.error('❌ Error parsing response:', e.message);
            console.log('Raw response:', data.substring(0, 1000));
            reject(e);
          }
        });
      });
      
      req.on('error', reject);
      form.pipe(req);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

deploy().catch((error) => {
  console.error('Deployment failed:', error);
  process.exit(1);
});

