import path from 'node:path'
import { fileURLToPath } from 'node:url';
const dynamic = async () => {
  // Write your code here
  // Accept plugin name as CLI argument
  // Dynamically import plugin from plugins/ directory
  // Call run() function and print result
  // Handle missing plugin case

  
  const [inputModule] = process.argv.slice(2)

  if (!inputModule) {
    console.log('Plugin not found');
    process.exit(1);
  }

  const __fileName = fileURLToPath(import.meta.url);
  const __dirName = path.dirname(__fileName);
  const pluginPath = path.resolve(__dirName, 'plugins', `${inputModule}.js`)
  try {
    const plugin = await import(`file://${pluginPath}`)
    console.log(plugin.run())
    
  } catch (error) {
    console.log('Plugin not found');
    process.exit(1);
  }
};

await dynamic();
