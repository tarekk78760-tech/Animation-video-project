// usage: node render.js out_dir [fps] [workers] [--stills t1,t2,...]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const {spawn}=require('child_process');
const dir=__dirname, out=path.resolve(process.argv[2]||'out');fs.mkdirSync(out,{recursive:true});
const FPS=30, LINES=JSON.parse(fs.readFileSync(dir+'/data/lines.json')), ENV=JSON.parse(fs.readFileSync(dir+'/data/env.json'));
const DUR=LINES[LINES.length-1].e+1.6, N=Math.ceil(DUR*FPS);
const stillsArg=process.argv.indexOf('--stills');
async function page(b){const p=await b.newPage({viewport:{width:1080,height:1920}});
 await p.goto('file://'+dir+'/index.html');await p.evaluate(([l,e,f])=>{window.LINES=l;window.ENV=e;window.FPS=f;},[LINES,ENV,FPS]);
 await p.evaluate(()=>document.fonts.ready);await p.evaluate(()=>renderFrame(0));await p.waitForTimeout(300);return p;}
(async()=>{const b=await chromium.launch();
 if(stillsArg>0){const p=await page(b);for(const t of process.argv[stillsArg+1].split(',').map(Number)){await p.evaluate(t=>renderFrame(t),t);await p.screenshot({path:`${out}/still_${t}.jpg`,type:'jpeg',quality:85});}await b.close();return;}
 const Wk=+(process.argv[3]||4), per=Math.ceil(N/Wk);const t0=Date.now();
 await Promise.all([...Array(Wk).keys()].map(async w=>{const p=await page(b);const a=w*per,z=Math.min(N,a+per);
  const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p',`${out}/seg${w}.mp4`]);
  for(let f=a;f<z;f++){await p.evaluate(t=>renderFrame(t),f/FPS);const buf=await p.screenshot({type:'jpeg',quality:94});
   if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));
   if(w===0&&(f-a)%100===0)console.log(`w0 ${f-a}/${z-a} ${((Date.now()-t0)/1000).toFixed(0)}s`);}
  ff.stdin.end();await new Promise(r=>ff.on('close',r));}));
 await b.close();
 fs.writeFileSync(`${out}/list.txt`,[...Array(Wk).keys()].map(w=>`file 'seg${w}.mp4'`).join('\n'));
 console.log('frames',N,'done',(Date.now()-t0)/1000);})();
