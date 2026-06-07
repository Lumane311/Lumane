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
const FILTER_CATS = [
  { id:"all",       label:"Todos",        emoji:"✦",  sub:null },
  { id:"lacio",     label:"Lacio",        emoji:"〰️", sub:["1A","1B","1C"] },
  { id:"1A",        label:"1A",           emoji:"〰️", sub:null },
  { id:"1B",        label:"1B",           emoji:"〰️", sub:null },
  { id:"1C",        label:"1C",           emoji:"〰️", sub:null },
  { id:"ondulado",  label:"Ondulado",     emoji:"〜",  sub:["2A","2B","2C"] },
  { id:"2A",        label:"2A",           emoji:"〜",  sub:null },
  { id:"2B",        label:"2B",           emoji:"〜",  sub:null },
  { id:"2C",        label:"2C",           emoji:"〜",  sub:null },
  { id:"rizado",    label:"Rizado",       emoji:"🌀", sub:["3A","3B","3C"] },
  { id:"3A",        label:"3A",           emoji:"🌀", sub:null },
  { id:"3B",        label:"3B",           emoji:"🌀", sub:null },
  { id:"3C",        label:"3C",           emoji:"🌀", sub:null },
  { id:"afro",      label:"Afro/Coily",   emoji:"✦",  sub:["4A","4B","4C"] },
  { id:"4A",        label:"4A",           emoji:"✦",  sub:null },
  { id:"4B",        label:"4B",           emoji:"✦",  sub:null },
  { id:"4C",        label:"4C",           emoji:"✦",  sub:null },
  { id:"caspa",     label:"Caspa",        emoji:"❄️", sub:null },
  { id:"caida",     label:"Caída",        emoji:"🍂", sub:null },
  { id:"cuero",     label:"Cuero",        emoji:"🔬", sub:null },
  { id:"regenerar", label:"Regenerar",    emoji:"🌱", sub:null },
  { id:"hombre",    label:"Hombre",       emoji:"💪", sub:null },
  { id:"cal",       label:"Agua Cal",     emoji:"💧", sub:null },
];

const QUESTIONS = [
  { id:"gender",  icon:"🌍", q:"¿Con qué género te identificas?",
    opts:[{l:"Mujer",v:"mujer",i:"👩"},{l:"Hombre",v:"hombre",i:"👨"},{l:"No binario",v:"neutro",i:"🧑"}] },
  { id:"group",   icon:"〰️", q:"¿Cuál es el grupo general de tu cabello?",
    opts:[{l:"Lacio",v:"lacio",i:"〰️"},{l:"Ondulado",v:"ondulado",i:"〜"},{l:"Rizado",v:"rizado",i:"🌀"},{l:"Afro/Coily",v:"afro",i:"✦"}] },
  { id:"subtype", icon:"🔎", q:"¿Cuál describe mejor tu tipo específico?", opts:[] },
  { id:"scalp",   icon:"🔬", q:"¿Alguna preocupación con tu cuero cabelludo?",
    opts:[{l:"Caspa",v:"caspa",i:"❄️"},{l:"Cuero graso",v:"graso",i:"🍃"},{l:"Cuero sensible",v:"sensible",i:"🌸"},{l:"Todo bien",v:"normal",i:"✅"}] },
  { id:"concern", icon:"🎯", q:"¿Tu mayor preocupación capilar?",
    opts:[{l:"Caída excesiva",v:"caida",i:"🍂"},{l:"Frizz y volumen",v:"frizz",i:"⚡"},{l:"Cabello dañado",v:"dano",i:"💔"},{l:"Falta de brillo",v:"brillo",i:"✨"}] },
  { id:"damage",  icon:"🧪", q:"¿Tu cabello ha recibido tratamientos?",
    opts:[{l:"Tinte/decoloración",v:"tinte",i:"🎨"},{l:"Alisado/keratina",v:"quimico",i:"🧴"},{l:"Calor frecuente",v:"calor",i:"🔥"},{l:"Virgen y natural",v:"virgen",i:"🌱"}] },
];

const SUBTYPES = {
  lacio:   [{l:"1A — Ultrafino",v:"1A",i:"〰️"},{l:"1B — Liso normal",v:"1B",i:"〰️"},{l:"1C — Liso grueso",v:"1C",i:"〰️"}],
  ondulado:[{l:"2A — Ondas suaves",v:"2A",i:"〜"},{l:"2B — Ondas medianas",v:"2B",i:"〜"},{l:"2C — Ondas pronunciadas",v:"2C",i:"〜"}],
  rizado:  [{l:"3A — Rizos grandes",v:"3A",i:"🌀"},{l:"3B — Rizos medianos",v:"3B",i:"🌀"},{l:"3C — Rizos apretados",v:"3C",i:"🌀"}],
  afro:    [{l:"4A — Coils suaves",v:"4A",i:"✦"},{l:"4B — Coils zigzag",v:"4B",i:"✦"},{l:"4C — Ultra apretados",v:"4C",i:"✦"}],
};
