import React, { useState, useEffect } from "react";
const STORES = {
  amazon:  { name:"Amazon",  emoji:"📦", color:"#FF9900", active:true,  tag:"lumanehair-21", buildUrl:(q,t)=>`https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=${t}` },
  sephora: { name:"Sephora", emoji:"🖤", color:"#E75480", active:true,  tag:"", buildUrl:(q)=>`https://www.sephora.com/search?keyword=${encodeURIComponent(q)}` },
  iherb:   { name:"iHerb",   emoji:"🌿", color:"#5AAA46", active:true,  tag:"TU_CODIGO_IHERB", buildUrl:(q,t)=>`https://www.iherb.com/search?kw=${encodeURIComponent(q)}&rcode=${t}` },
  druni:   { name:"Druni",   emoji:"💜", color:"#6B1F8A", active:true,  tag:"", buildUrl:(q)=>`https://www.druni.es/buscar?q=${encodeURIComponent(q)}` },
};
const HAIR_SYSTEM = [
  { id:"1A", group:"lacio",    emoji:"〰️", hue:38,  desc:"Lacio ultra fino. Tiende a ser graso." },
  { id:"1B", group:"lacio",    emoji:"〰️", hue:42,  desc:"Lacio normal con movimiento natural." },
  { id:"1C", group:"lacio",    emoji:"〰️", hue:46,  desc:"Lacio grueso con volumen. Frizz leve." },
  { id:"2A", group:"ondulado", emoji:"〜",  hue:180, desc:"Ondas suaves en S. Fácil de definir." },
  { id:"2B", group:"ondulado", emoji:"〜",  hue:185, desc:"Ondas medianas desde la raíz." },
  { id:"2C", group:"ondulado", emoji:"〜",  hue:190, desc:"Ondas pronunciadas casi rizos." },
  { id:"3A", group:"rizado",   emoji:"🌀", hue:280, desc:"Rizos amplios y brillantes." },
  { id:"3B", group:"rizado",   emoji:"🌀", hue:290, desc:"Rizos medianos y densos." },
  { id:"3C", group:"rizado",   emoji:"🌀", hue:300, desc:"Rizos apretados tipo lápiz." },
  { id:"4A", group:"afro",     emoji:"✦",  hue:30,  desc:"Coils suaves en S." },
  { id:"4B", group:"afro",     emoji:"✦",  hue:25,  desc:"Coils zigzag. Muy frágil." },
  { id:"4C", group:"afro",     emoji:"✦",  hue:20,  desc:"Coils ultra apretados." },
];

const PRICE_LABELS = {
  eco: { label:"💚 Eco",     color:"#5A9A5A", bg:"rgba(90,154,90,.1)",   border:"rgba(90,154,90,.3)" },
  mid: { label:"💛 Medio",   color:"#B8920A", bg:"rgba(184,146,10,.1)",  border:"rgba(184,146,10,.3)" },
  lux: { label:"💎 Premium", color:"#C4687A", bg:"rgba(196,104,122,.1)", border:"rgba(196,104,122,.3)" },
};
