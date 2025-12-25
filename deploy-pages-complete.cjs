const https = require('https');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const ACCOUNT_ID = '7d84a4241cd92238463580dd0e094bc7';
const PROJECT_NAME = 'paint';
const DIST_DIR = path.join(__dirname, 'dist');
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

console.log('🚀 Deploying to Cloudflare Pages...');
console.log('');

// Create manifest of files
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

// Create deployment
async function deploy() {
  try {
    console.log('📋 Creating file manifest...');
    const manifest = createManifest();
    console.log(`✅ Found ${manifest.length} files`);
    console.log('');
    
    // Create form data
    const form = new FormData();
    
    // Add manifest
    form.append('manifest', JSON.stringify(manifest));
    
    // Add files
    manifest.forEach(item => {
      const filePath = path.join(DIST_DIR, item.path);
      form.append('file', fs.createReadStream(filePath), {
        filename: item.path,
        contentType: 'application/octet-stream'
      });
    });
    
    console.log('📤 Uploading to Cloudflare Pages...');
    
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
              console.error('❌ Deployment failed:', response.errors);
              reject(new Error('Deployment failed'));
            }
          } catch (e) {
            console.error('❌ Error parsing response:', e.message);
            console.log('Raw response:', data.substring(0, 500));
            reject(e);
          }
        });
      });
      
      req.on('error', reject);
      form.pipe(req);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
    console.log('📋 Alternative: Deploy via Dashboard');
    console.log('1. Go to: https://dash.cloudflare.com');
    console.log('2. Workers & Pages → Pages → paint');
    console.log('3. Click "Upload assets"');
    console.log('4. Upload folder:', DIST_DIR);
    throw error;
  }
}

deploy().catch(() => {
  console.log('');
  console.log('💡 Tip: Deployment package created at:');
  console.log('   deployment-package.zip');
  console.log('   You can upload this zip file via the dashboard');
});
