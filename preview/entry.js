import React from 'react';
import {createRoot} from 'react-dom/client';
import plugin from '../desktop/plugin.js';
const ctx={preview:true,rest:async(path,opts={})=>{
 const r=await fetch('/api'+path,{method:opts.method||'GET',headers:{'Content-Type':'application/json'},body:opts.body?JSON.stringify(opts.body):undefined});
 const data=await r.json();if(!r.ok)throw Error(typeof data.detail==='string'?data.detail:JSON.stringify(data.detail));return data;
},registerMany:items=>{const page=items.find(i=>i.area==='routes');createRoot(document.getElementById('root')).render(page.render());}};
plugin.register(ctx);
