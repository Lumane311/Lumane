import React, { useState, useEffect } from "react";

const STORES = {
  amazon:        { name:"Amazon",          emoji:"📦", color:"#FF9900", active:true,  tag:"lumanehair-21", buildUrl:(q,t)=>`https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=${t}` },
  sephora:       { name:"Sephora",         emoji:"🖤", color:"#E75480", active:true,  tag:"", buildUrl:(q)=>`https://www.sephora.com/search?keyword=${encodeURIComponent(q)}` },
  iherb:         { name:"iHerb",           emoji:"🌿", color:"#5AAA46", active:true,  tag:"", buildUrl:(q)=>`https://www.iherb.com/search?kw=${encodeURIComponent(q)}` },
  druni:         { name:"Druni",           emoji:"💜", color:"#1A1A1A", active:true,  tag:"", buildUrl:(q)=>`https://www.druni.es/buscar?q=${encodeURIComponent(q)}` },
  mercadolibre:  { name:"Mercado Libre",   emoji:"🛒", color:"#FFE600", active:true,  tag:"", buildUrl:(q)=>`https://listado.mercadolibre.com.co/${encodeURIComponent(q)}` },
  surticosmeticos:{ name:"Surticosméticos",emoji:"💛", color:"#D4A017", active:true,  tag:"", buildUrl:(q)=>`https://surticosmeticos.com/search?q=${encodeURIComponent(q)}` },
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
  eco: { label:"💚 Eco",     color:"#A07A30", bg:"rgba(200,164,107,.1)",   border:"rgba(200,164,107,.3)" },
  mid: { label:"💛 Medio",   color:"#B8920A", bg:"rgba(184,146,10,.1)",  border:"rgba(184,146,10,.3)" },
  lux: { label:"💎 Premium", color:"#C8A46B", bg:"rgba(201,168,76,.1)", border:"rgba(201,168,76,.3)" },
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
  { id:"ninos",     label:"Niños",        emoji:"👶", sub:null },
];

const QUESTIONS = [
  { id:"quien",   icon:"👨‍👩‍👧", q:"¿Para quién buscas el cuidado capilar hoy?",
    opts:[{l:"Para mí",v:"adulto",i:"🧑"},{l:"Para mi hijo o hija",v:"nino",i:"👶"},{l:"Para mí y mi hijo/a",v:"ambos",i:"👨‍👩‍👧"}] },
  { id:"problema", icon:"😔", q:"¿Qué te pasa con tu cabello? (lo que más te molesta)",
    opts:[{l:"Tengo caspa y me pica la cabeza",v:"caspa",i:"❄️"},{l:"Se me cae mucho el cabello",v:"caida",i:"🍂"},{l:"Lo tengo muy seco, roto o maltratado",v:"dano",i:"💔"},{l:"Se esponja, tiene frizz y no lo controlo",v:"frizz",i:"⚡"},{l:"Sin volumen ni luminosidad — luce apagado",v:"brillo",i:"✨"},{l:"Piojos (para niños)",v:"piojos",i:"🔍"}] },
  { id:"goal",    icon:"🌟", q:"¿Qué sueñas lograr con tu cabello?",
    opts:[{l:"Que brille, se vea hidratado y suave",v:"hidratacion",i:"💧"},{l:"Que crezca fuerte y sano",v:"regenerar",i:"🌱"},{l:"Que mis rizos u ondas se definan bien",v:"definir",i:"🌀"},{l:"Que mi cuero cabelludo esté limpio y sano",v:"cuero",i:"🔬"}] },
  { id:"scalp",   icon:"🔬", q:"¿Cómo sientes tu cuero cabelludo normalmente?",
    opts:[{l:"Se pone graso al día siguiente de lavarlo",v:"graso",i:"🍃"},{l:"Se siente seco, tira o pica",v:"seco",i:"🏜️"},{l:"Se irrita fácil o es muy sensible",v:"sensible",i:"🌸"},{l:"Está bien, sin molestias",v:"normal",i:"✅"}] },
  { id:"damage",  icon:"🧪", q:"¿Le has hecho algo a tu cabello últimamente?",
    opts:[{l:"Lo tengo teñido o decolorado",v:"tinte",i:"🎨"},{l:"Me he hecho alisado o keratina",v:"quimico",i:"🧴"},{l:"Lo plancho o uso secador muy seguido",v:"calor",i:"🔥"},{l:"No, está completamente natural",v:"virgen",i:"🌱"}] },
  { id:"gender",  icon:"🌍", q:"¿Con qué género te identificas?",
    opts:[{l:"Mujer",v:"mujer",i:"👩"},{l:"Hombre",v:"hombre",i:"👨"},{l:"Prefiero no decirlo",v:"neutro",i:"🧑"}] },
];

const SUBTYPES = {
  lacio:   [{l:"1A — Ultrafino",v:"1A",i:"〰️"},{l:"1B — Liso normal",v:"1B",i:"〰️"},{l:"1C — Liso grueso",v:"1C",i:"〰️"}],
  ondulado:[{l:"2A — Ondas suaves",v:"2A",i:"〜"},{l:"2B — Ondas medianas",v:"2B",i:"〜"},{l:"2C — Ondas pronunciadas",v:"2C",i:"〜"}],
  rizado:  [{l:"3A — Rizos grandes",v:"3A",i:"🌀"},{l:"3B — Rizos medianos",v:"3B",i:"🌀"},{l:"3C — Rizos apretados",v:"3C",i:"🌀"}],
  afro:    [{l:"4A — Coils suaves",v:"4A",i:"✦"},{l:"4B — Coils zigzag",v:"4B",i:"✦"},{l:"4C — Ultra apretados",v:"4C",i:"✦"}],
};

const SHOP = [
  { id:1,  cat:"1A", step:"Limpieza",    emoji:"🫧", hue:38,  tag:"Esencial",  desc:"Limpieza sin peso que levanta la raíz del cabello fino.", sq:"volumizing shampoo fine straight hair", howTo:"1. Solo en cuero cabelludo.\n2. Masajea 2 min.\n3. Deja resbalar.\n4. Agua fría.\n5. Nunca en puntas.",
    prices:{eco:{price:6.99,name:"Shampoo Volumen Básico",brand:"Pantene"},mid:{price:14.99,name:"Shampoo Voluminizador 1A",brand:"OGX/Redken"},lux:{price:32.00,name:"Shampoo Volumen Pro",brand:"Kerastase"}} },
  { id:2,  cat:"1A", step:"Acondicionador",emoji:"💧",hue:40,  tag:"-20%",     desc:"Hidratación ultraligera que no aplana el cabello 1A.",     sq:"lightweight conditioner fine hair",        howTo:"1. Solo medios a puntas.\n2. Peina con dedos.\n3. 2 min.\n4. Agua fría.\n5. Nunca en raíz.",
    prices:{eco:{price:5.99,name:"Acondicionador Ligero",brand:"Dove"},mid:{price:13.99,name:"Acondicionador Sin Peso",brand:"OGX"},lux:{price:28.00,name:"Acondicionador Seda",brand:"Kerastase"}} },
  { id:3,  cat:"1B", step:"Limpieza",    emoji:"🫧", hue:42,  tag:"Bestseller",desc:"Equilibra el sebo y mantiene el brillo del lacio 1B.",      sq:"balancing shampoo straight normal hair",   howTo:"1. Cuero mojado.\n2. Circular 2 min.\n3. Espuma largos.\n4. Agua fría.\n5. 2-3x semana.",
    prices:{eco:{price:5.49,name:"Shampoo Liso Básico",brand:"Elvive"},mid:{price:12.99,name:"Shampoo Equilibrio Lacio",brand:"OGX"},lux:{price:29.00,name:"Shampoo Liso Perfecto",brand:"Kerastase"}} },
  { id:4,  cat:"1C", step:"Limpieza",    emoji:"🫧", hue:46,  tag:"Bestseller",desc:"Controla el volumen excesivo del liso grueso 1C.",           sq:"smoothing shampoo thick straight hair",    howTo:"1. Abundante cuero.\n2. Masajea 3 min.\n3. Trabaja espuma.\n4. Enjuaga bien.\n5. Siempre acondicionador.",
    prices:{eco:{price:5.99,name:"Shampoo Alisante Básico",brand:"Fructis"},mid:{price:13.99,name:"Shampoo Domador 1C",brand:"OGX"},lux:{price:31.00,name:"Shampoo Disciplina Pro",brand:"Kerastase"}} },
  { id:5,  cat:"2A", step:"Limpieza",    emoji:"🌊", hue:178, tag:"Esencial",  desc:"Limpia sin resecar las ondas suaves del tipo 2A.",           sq:"gentle shampoo wavy 2a sulfate free",      howTo:"1. Cuero cabelludo.\n2. No frotar largos.\n3. Deja resbalar.\n4. Agua fría.\n5. Solo 2x semana.",
    prices:{eco:{price:5.49,name:"Shampoo Suave 2A",brand:"Dove"},mid:{price:12.99,name:"Shampoo Ondas 2A",brand:"OGX"},lux:{price:28.00,name:"Shampoo Ondas Pro",brand:"DevaCurl"}} },
  { id:6,  cat:"2A", step:"Definición",  emoji:"〜", hue:180, tag:"Bestseller",desc:"Gel ultraligero que define las ondas 2A sin crunch.",         sq:"light defining gel wavy 2a",              howTo:"1. Muy húmedo secciones.\n2. Escrunching arriba.\n3. No tocar al secar.\n4. Disuelve crunch.\n5. Difusor media.",
    prices:{eco:{price:6.99,name:"Gel Definidor 2A",brand:"Eco Styler"},mid:{price:14.99,name:"Gel Ligero 2A",brand:"OGX"},lux:{price:30.00,name:"Gel Ondas Pro",brand:"DevaCurl"}} },
  { id:7,  cat:"2B", step:"Limpieza",    emoji:"🫧", hue:185, tag:"Bestseller",desc:"Sin sulfatos para mantener la hidratación de las ondas 2B.", sq:"co wash wavy 2b sulfate free",            howTo:"1. Generoso cuero.\n2. Masajea bien.\n3. Distribuye largos.\n4. 2 min.\n5. Enjuaga bien.",
    prices:{eco:{price:6.49,name:"Co-Wash 2B Básico",brand:"Cantu"},mid:{price:14.99,name:"Co-Wash Cremoso 2B",brand:"OGX"},lux:{price:29.00,name:"Co-Wash Nutritivo 2B",brand:"DevaCurl"}} },
  { id:8,  cat:"2B", step:"Definición",  emoji:"〜", hue:187, tag:"-23%",     desc:"Define ondas 2B sin rigidez. Hidrata y controla el frizz.",  sq:"curl cream defining wavy 2b",             howTo:"1. Húmedo tras acondicionador.\n2. Praying hands.\n3. Escruncha arriba.\n4. Difusor bajo.\n5. No tocar hasta seco.",
    prices:{eco:{price:7.49,name:"Crema Definidora 2B",brand:"Cantu"},mid:{price:15.99,name:"Crema Ondas 2B",brand:"Shea Moisture"},lux:{price:32.00,name:"Crema Pro 2B",brand:"DevaCurl"}} },
  { id:9,  cat:"2C", step:"Limpieza",    emoji:"🫧", hue:192, tag:"Bestseller",desc:"Método Curly Girl para ondas 2C. Sin sulfatos ni siliconas.", sq:"CGM shampoo wavy 2c curly girl",          howTo:"1. Cuero mojado.\n2. Masajea 3 min.\n3. Enjuaga tibia.\n4. Max 2-3 días.\n5. Siempre acondicionador.",
    prices:{eco:{price:6.49,name:"Shampoo CGM 2C",brand:"Cantu"},mid:{price:14.99,name:"Shampoo Curly Girl 2C",brand:"OGX"},lux:{price:30.00,name:"Shampoo CGM Pro",brand:"DevaCurl"}} },
  { id:10, cat:"3A", step:"Limpieza",    emoji:"🌀", hue:275, tag:"Bestseller",desc:"Sin sulfatos preservando la elasticidad de los rizos 3A.",   sq:"sulfate free shampoo curly 3a",           howTo:"1. Circular 2 min.\n2. No frotar largos.\n3. Enjuaga suave.\n4. Agua fría.\n5. 2-3x semana.",
    prices:{eco:{price:6.49,name:"Shampoo Rizos 3A",brand:"Cantu"},mid:{price:14.99,name:"Shampoo Suave 3A",brand:"OGX"},lux:{price:32.00,name:"Shampoo Rizos Pro",brand:"DevaCurl"}} },
  { id:11, cat:"3A", step:"Definición",  emoji:"🌀", hue:282, tag:"Nuevo",     desc:"Gel media fijación para rizos 3A con bounce y brillo.",      sq:"defining gel curly 3a bounce",            howTo:"1. Muy húmedo secciones.\n2. Praying hands.\n3. No separar.\n4. Difusor baja-media.\n5. Cast al 100% seco.",
    prices:{eco:{price:7.49,name:"Gel Rizos 3A",brand:"Eco Styler"},mid:{price:16.99,name:"Gel Definidor 3A",brand:"OGX"},lux:{price:34.00,name:"Gel Pro 3A",brand:"DevaCurl"}} },
  { id:12, cat:"3B", step:"Limpieza",    emoji:"🌀", hue:288, tag:"Bestseller",desc:"Limpieza con acondicionador para los aceites naturales 3B.",  sq:"co wash moisturizing curly 3b",           howTo:"1. Cuero y masajea.\n2. Distribuye rizos.\n3. 3 min.\n4. Enjuaga bien.\n5. Clarificante 1x mes.",
    prices:{eco:{price:6.49,name:"Co-Wash 3B",brand:"Cantu"},mid:{price:14.49,name:"Co-Wash Nutritivo 3B",brand:"Shea Moisture"},lux:{price:30.00,name:"Co-Wash Pro 3B",brand:"DevaCurl"}} },
  { id:13, cat:"3C", step:"Limpieza",    emoji:"🌀", hue:300, tag:"Bestseller",desc:"Sin sulfatos para rizos apretados 3C. Máxima hidratación.",  sq:"moisturizing shampoo tight curls 3c",      howTo:"1. Divide 4 secciones.\n2. Cuero cada sección.\n3. Masajea 3 min.\n4. Enjuaga.\n5. Nunca toalla, usa camiseta.",
    prices:{eco:{price:6.99,name:"Shampoo 3C",brand:"Cantu"},mid:{price:15.99,name:"Shampoo Hidratante 3C",brand:"Shea Moisture"},lux:{price:33.00,name:"Shampoo 3C Pro",brand:"DevaCurl"}} },
  { id:14, cat:"3C", step:"Hidratación", emoji:"💦", hue:303, tag:"-27%",     desc:"Acondicionador profundo que hidrata y define los rizos 3C.", sq:"deep conditioner tight curls 3c",         howTo:"1. Abundante tras shampoo.\n2. Peine ancho.\n3. Gorro + calor 30 min.\n4. Agua fría.\n5. Define inmediatamente.",
    prices:{eco:{price:7.49,name:"Deep Cond. 3C",brand:"Cantu"},mid:{price:16.99,name:"Deep Cond. Intenso 3C",brand:"Shea Moisture"},lux:{price:35.00,name:"Deep Cond. Luxe 3C",brand:"DevaCurl"}} },
  { id:15, cat:"4A", step:"Limpieza",    emoji:"✦",  hue:30,  tag:"Bestseller",desc:"Sin sulfatos que preserva la hidratación de los coils 4A.", sq:"sulfate free shampoo 4a coils",           howTo:"1. Divide 4 secciones.\n2. Cuero por sección.\n3. Masajea 3-4 min.\n4. Enjuaga tibia.\n5. Max 1-2x semana.",
    prices:{eco:{price:6.99,name:"Shampoo Coils 4A",brand:"Cantu"},mid:{price:15.49,name:"Shampoo Hidratante 4A",brand:"Shea Moisture"},lux:{price:32.00,name:"Shampoo 4A Pro",brand:"Camille Rose"}} },
  { id:16, cat:"4A", step:"Hidratación", emoji:"💧", hue:33,  tag:"-25%",     desc:"Hidratación intensiva para coils 4A. Método LOC recomendado.",sq:"deep conditioner 4a coils LOC",          howTo:"1. Húmedo sección a sección.\n2. Peine ancho.\n3. Gorro + calor 30-45 min.\n4. Agua fría.\n5. Leave-in inmediato.",
    prices:{eco:{price:7.99,name:"Acond. Profundo 4A",brand:"Cantu"},mid:{price:16.99,name:"Deep Cond. 4A",brand:"Shea Moisture"},lux:{price:34.00,name:"Deep Cond. Luxe 4A",brand:"Camille Rose"}} },
  { id:17, cat:"4B", step:"Limpieza",    emoji:"✦",  hue:25,  tag:"Bestseller",desc:"Co-wash ultra nutritivo para el patrón 4B en zigzag.",       sq:"co wash moisturizing 4b natural hair",     howTo:"1. Divide 8-10 secciones.\n2. Aplica y masajea.\n3. Solo presionar.\n4. Enjuaga sección.\n5. Alterna shampoo cada 2-3.",
    prices:{eco:{price:6.49,name:"Co-Wash 4B",brand:"Cantu"},mid:{price:14.99,name:"Co-Wash 4B Zigzag",brand:"Shea Moisture"},lux:{price:31.00,name:"Co-Wash 4B Pro",brand:"Camille Rose"}} },
  { id:18, cat:"4C", step:"Hidratación", emoji:"✦",  hue:20,  tag:"Bestseller",desc:"Hidratación máxima para el cabello 4C más frágil.",          sq:"deep moisture treatment 4c ultra dry",     howTo:"1. Divide 10-12 secciones.\n2. Aplica generoso húmedo.\n3. Gorro + calor 45 min.\n4. Agua fría.\n5. Leave-in inmediato.",
    prices:{eco:{price:8.49,name:"Tratamiento 4C",brand:"Cantu"},mid:{price:17.99,name:"Deep Moisture 4C",brand:"Shea Moisture"},lux:{price:38.00,name:"Tratamiento Luxe 4C",brand:"Camille Rose"}} },
  { id:19, cat:"caspa", step:"Shampoo",  emoji:"❄️", hue:210, tag:"Bestseller",desc:"Zinc y ketoconazol que eliminan la caspa desde la primera semana.",sq:"anti dandruff shampoo zinc ketoconazole",howTo:"1. Cuero mojado.\n2. Masajea 3-5 min.\n3. Deja 2 min.\n4. Enjuaga bien.\n5. 3x semana primeras 4 semanas.",
    prices:{eco:{price:5.49,name:"Anti-Caspa Básico",brand:"Head&Shoulders"},mid:{price:12.99,name:"Anti-Caspa Zinc",brand:"Nizoral"},lux:{price:28.00,name:"Anti-Caspa Pro",brand:"Ducray"}} },
  { id:20, cat:"caida", step:"Tónico",   emoji:"🍂", hue:90,  tag:"Bestseller",desc:"Cafeína y biotina que estimulan el folículo y reducen la caída.",sq:"hair loss tonic biotin caffeine",        howTo:"1. Zonas de caída.\n2. Circular 5 min.\n3. No enjuagar.\n4. Cada noche.\n5. Resultados 8-12 semanas.",
    prices:{eco:{price:7.99,name:"Tónico Anticaída",brand:"Alpecin"},mid:{price:16.99,name:"Tónico Biotina + Cafeína",brand:"Vichy"},lux:{price:35.00,name:"Tónico Anticaída Pro",brand:"Kerastase"}} },
  { id:21, cat:"cuero", step:"Exfoliante",emoji:"🔬",hue:160, tag:"Bestseller",desc:"Azúcar y ácido glicólico que eliminan células muertas.",       sq:"scalp scrub exfoliant glycolic acid",      howTo:"1. Cuero mojado antes shampoo.\n2. Circular 3-5 min.\n3. 2 min.\n4. Enjuaga y shampoo.\n5. 1x semana.",
    prices:{eco:{price:6.49,name:"Exfoliante Cuero",brand:"Garnier"},mid:{price:14.99,name:"Exfoliante Pro",brand:"Briogeo"},lux:{price:30.00,name:"Exfoliante Luxe",brand:"Christophe Robin"}} },
  { id:22, cat:"regenerar",step:"Mascarilla",emoji:"🌱",hue:120,tag:"Bestseller",desc:"Ricino, argán y mango que regeneran el cabello dañado.",    sq:"hair regenerating mask castor argan",      howTo:"1. Húmedo raíz a puntas.\n2. Divide secciones.\n3. Gorro + calor 25-30 min.\n4. Agua fría.\n5. 2x semana primeras 4 semanas.",
    prices:{eco:{price:6.99,name:"Mascarilla Reparadora",brand:"Garnier"},mid:{price:16.99,name:"Mascarilla Renacimiento",brand:"OGX"},lux:{price:38.00,name:"Mascarilla Pro",brand:"Olaplex"}} },
  { id:23, cat:"hombre", step:"Limpieza",emoji:"💪", hue:220, tag:"Bestseller",desc:"Shampoo + acondicionador para hombres activos. Frescura duradera.",sq:"2 in 1 shampoo conditioner men",       howTo:"1. Cabello mojado.\n2. Masajea 2-3 min.\n3. Distribuye largos.\n4. 1 min.\n5. Enjuaga bien.",
    prices:{eco:{price:5.49,name:"2-en-1 Hombre Básico",brand:"H&S Men"},mid:{price:12.99,name:"2-en-1 Active Fresh",brand:"American Crew"},lux:{price:28.00,name:"Shampoo Hombre Premium",brand:"Jack Black"}} },
  { id:24, cat:"hombre", step:"Anticaída",emoji:"⚡", hue:210, tag:"-20%",    desc:"Cafeína y zinc para frenar la caída masculina.",               sq:"hair loss tonic men caffeine zinc",        howTo:"1. Zonas de menor densidad.\n2. Circular 5 min.\n3. No enjuagar.\n4. Cada noche.\n5. Resultados 8-16 semanas.",
    prices:{eco:{price:8.99,name:"Tónico Anticaída Hombre",brand:"Alpecin"},mid:{price:18.99,name:"Tónico Men Forte",brand:"Vichy"},lux:{price:38.00,name:"Tónico Premium Hombre",brand:"Kerastase"}} },
  { id:25, cat:"cal", step:"Quelante",   emoji:"💧", hue:200, tag:"Esencial",  desc:"Elimina depósitos de cal del agua dura que apagan el brillo.", sq:"chelating shampoo hard water limescale",  howTo:"1. Generoso en mojado.\n2. Masajea 3-5 min.\n3. 2 min extra.\n4. Enjuaga bien.\n5. 1x semana.",
    prices:{eco:{price:7.99,name:"Shampoo Quelante Básico",brand:"Fructis"},mid:{price:16.99,name:"Shampoo Anti-Cal",brand:"Malibu C"},lux:{price:34.00,name:"Shampoo Quelante Pro",brand:"Olaplex"}} },
  { id:26, cat:"cal", step:"Filtro",     emoji:"🚿", hue:195, tag:"Bestseller",desc:"Filtra cloro y minerales del agua dura antes de tocar tu cabello.",sq:"shower filter hard water vitamin C",    howTo:"1. Instala sin herramientas.\n2. Cambia cartucho 3-6 meses.\n3. Diferencia desde el 1er lavado.\n4. Compatible todo cabezal.\n5. Reduce caída por cal hasta 60%.",
    prices:{eco:{price:14.99,name:"Filtro Ducha Básico",brand:"Aquasana"},mid:{price:29.99,name:"Filtro Vitamina C",brand:"AquaBliss"},lux:{price:59.99,name:"Filtro Ducha Pro",brand:"Jolie"}} },
  { id:27, cat:"cal", step:"Tratamiento",emoji:"⚗️", hue:205, tag:"-25%",    desc:"Vitamina C neutraliza minerales y restaura el brillo perdido.", sq:"vitamin C hair treatment hard water",      howTo:"1. Limpio húmedo.\n2. Masajea 3 min.\n3. Gorro 5-10 min.\n4. Agua fría.\n5. 1x semana intensivo.",
    prices:{eco:{price:8.99,name:"Vitamina C Cabello",brand:"Garnier"},mid:{price:17.99,name:"Tratamiento Anti-Cal",brand:"Malibu C"},lux:{price:38.00,name:"Tratamiento Pro",brand:"Olaplex"}} },
  { id:28, cat:"cal", step:"Mascarilla", emoji:"🍋", hue:55,  tag:"Bestseller",desc:"Vinagre de sidra y ácido málico disuelven depósitos de cal.",  sq:"apple cider vinegar hair mask hard water", howTo:"1. Limpio húmedo.\n2. Masajea bien.\n3. 10-15 min.\n4. Enjuaga bien.\n5. El olor desaparece. 1x semana.",
    prices:{eco:{price:5.99,name:"Mascarilla Vinagre",brand:"Garnier"},mid:{price:13.99,name:"Mascarilla ACV Anti-Cal",brand:"dpHUE"},lux:{price:28.00,name:"Mascarilla Ácido Málico",brand:"Briogeo"}} },
  { id:29, cat:"ninos", step:"Limpieza",    emoji:"👶", hue:160, tag:"Suave",     desc:"Shampoo ultrasuave sin lágrimas para cabello de niños. Fórmula hipoalergénica.", sq:"baby shampoo tear free gentle kids", howTo:"1. Mojar el cabello.\n2. Aplicar pequeña cantidad.\n3. Masajear suavemente.\n4. Enjuagar bien.\n5. Usar en cada baño.",
    prices:{eco:{price:4.99,name:"Shampoo Bebé Suave",brand:"Johnson's Baby"},mid:{price:9.99,name:"Shampoo Niños Sin Lágrimas",brand:"Mustela"},lux:{price:18.00,name:"Shampoo Infantil Premium",brand:"Burt's Bees Baby"}} },
  { id:30, cat:"ninos", step:"Rizos",       emoji:"🌀", hue:150, tag:"Bestseller", desc:"Define y suaviza los rizos de los más pequeños sin enredos.", sq:"kids curly hair detangling conditioner", howTo:"1. Tras shampoo, aplicar en húmedo.\n2. Peinar con dedos.\n3. 2-3 min.\n4. Enjuagar suave.\n5. Usar difusor a temperatura baja.",
    prices:{eco:{price:5.49,name:"Acond. Rizos Niños",brand:"Cantu Kids"},mid:{price:11.99,name:"Crema Rizos Infantil",brand:"Mixed Chicks Kids"},lux:{price:22.00,name:"Rizos Kids Premium",brand:"DevaCurl Li'l Ones"}} },
  { id:31, cat:"ninos", step:"Anti-Piojos", emoji:"🔍", hue:140, tag:"Esencial",   desc:"Tratamiento natural anti-piojos para niños. Sin productos agresivos.", sq:"lice treatment kids natural gentle", howTo:"1. Aplicar en cabello seco.\n2. Cubrir con gorro.\n3. Dejar 30-45 min.\n4. Peinar con liendrera.\n5. Lavar con shampoo suave.",
    prices:{eco:{price:7.99,name:"Anti-Piojos Natural",brand:"Paranix"},mid:{price:14.99,name:"Tratamiento Piojos Kids",brand:"Hedrin"},lux:{price:24.00,name:"Anti-Piojos Premium",brand:"Nit Free"}} },
  { id:32, cat:"ninos", step:"Cuero",       emoji:"🌱", hue:130, tag:"Nuevo",      desc:"Cuida el cuero cabelludo sensible de los niños. Previene la costra láctea.", sq:"kids scalp care sensitive baby cradle cap", howTo:"1. Aplicar en cuero húmedo.\n2. Masajear con yemas.\n3. Dejar 5 min.\n4. Enjuagar bien.\n5. Usar 2-3 veces por semana.",
    prices:{eco:{price:6.49,name:"Loción Cuero Bebé",brand:"Mustela"},mid:{price:13.99,name:"Sérum Cuero Infantil",brand:"Burt's Bees"},lux:{price:22.00,name:"Tratamiento Cuero Kids",brand:"Weleda"}} },
];

function ProductosRecomendados() {
  const prods = [
    { id:1, emoji:"🌿", nombre:"Aceite de Argán Puro",      marca:"OGX",          beneficio:"Brillo y nutrición intensa para todo tipo de cabello",    tag:"Más vendido", tagColor:"#5AAA46",
      amazon:"https://www.amazon.com/s?k=argan+oil+hair+OGX&tag=lumanehair-21",
      iherb:"https://www.iherb.com/search?kw=argan+oil+hair",
      sephora:"https://www.sephora.com/search?keyword=argan+oil+OGX",
      druni:"https://www.druni.es/buscar?q=aceite+argan+cabello" },
    { id:2, emoji:"💧", nombre:"Shampoo Sin Sulfatos",       marca:"Cantu",        beneficio:"Limpieza suave que respeta los rizos y ondas naturales",   tag:"CGM ✓",     tagColor:"#7B68EE",
      amazon:"https://www.amazon.com/s?k=cantu+sulfate+free+shampoo&tag=lumanehair-21",
      iherb:"https://www.iherb.com/search?kw=cantu+sulfate+free",
      sephora:"https://www.sephora.com/search?keyword=cantu+shampoo",
      druni:"https://www.druni.es/buscar?q=champu+sin+sulfatos" },
    { id:3, emoji:"🧴", nombre:"Mascarilla Reparadora",      marca:"Olaplex",      beneficio:"Reconstruye el cabello dañado por tinte o calor",          tag:"-30%",      tagColor:"#E75480",
      amazon:"https://www.amazon.com/s?k=olaplex+hair+mask&tag=lumanehair-21",
      iherb:"https://www.iherb.com/search?kw=olaplex+mask",
      sephora:"https://www.sephora.com/search?keyword=olaplex+mask",
      druni:"https://www.druni.es/buscar?q=olaplex+mascarilla" },
    { id:4, emoji:"🍂", nombre:"Tónico Anticaída Biotina",   marca:"Vichy Dercos", beneficio:"Cafeína y biotina que frenan la caída desde la raíz",      tag:"Clínico",   tagColor:"#2E86AB",
      amazon:"https://www.amazon.com/s?k=vichy+dercos+biotin&tag=lumanehair-21",
      iherb:"https://www.iherb.com/search?kw=hair+loss+biotin",
      sephora:"https://www.sephora.com/search?keyword=vichy+dercos",
      druni:"https://www.druni.es/buscar?q=vichy+dercos+anticaida" },
    { id:5, emoji:"🌀", nombre:"Crema Definidora de Rizos",  marca:"Shea Moisture",beneficio:"Define y humecta rizos 3A-3C sin efecto plástico",         tag:"Natural",   tagColor:"#5AAA46",
      amazon:"https://www.amazon.com/s?k=shea+moisture+curl+cream&tag=lumanehair-21",
      iherb:"https://www.iherb.com/search?kw=shea+moisture+curl",
      sephora:"https://www.sephora.com/search?keyword=shea+moisture+curl",
      druni:"https://www.druni.es/buscar?q=shea+moisture+rizos" },
    { id:6, emoji:"🚿", nombre:"Filtro Ducha Anti-Cal",      marca:"AquaBliss",    beneficio:"Filtra el cloro y la cal que destruye el cabello en Europa",tag:"Esencial",  tagColor:"#B8920A",
      amazon:"https://www.amazon.com/s?k=shower+filter+hard+water&tag=lumanehair-21",
      iherb:"https://www.iherb.com/search?kw=shower+filter",
      sephora:"https://www.sephora.com/search?keyword=shower+filter+hair",
      druni:"https://www.druni.es/buscar?q=filtro+ducha+cabello" },
  ];
  const tiendas = [
    { key:"amazon",  label:"Amazon",  emoji:"📦", bg:"#FF9900" },
    { key:"iherb",   label:"iHerb",   emoji:"🌿", bg:"#5AAA46" },
    { key:"sephora", label:"Sephora", emoji:"🖤", bg:"#E75480" },
    { key:"druni",   label:"Druni",   emoji:"💜", bg:"#1A1A1A" },
  ];
  return (
    <section style={{width:"100%",maxWidth:960,margin:"0 auto",padding:"3rem 1rem 2rem",fontFamily:"'Outfit',sans-serif"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <span style={{fontSize:11,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:"#C8A46B",marginBottom:8,display:"block"}}>✦ Selección LuMane</span>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,5vw,36px)",fontWeight:700,color:"#1A1A1A",margin:"0 0 8px 0"}}>Productos que recomendamos</h2>
        <p style={{fontSize:14,color:"#888",margin:0}}>Los más valorados · Amazon · iHerb · Sephora · Druni</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:18}}>
        {prods.map(function(p){
          return (
            <div key={p.id} style={{background:"#FDFAF5",border:"1.5px solid #f0e8ea",borderRadius:18,padding:"22px 18px 18px",display:"flex",flexDirection:"column",gap:10,boxShadow:"0 2px 16px rgba(201,168,76,0.08)",position:"relative"}}>
              <span style={{position:"absolute",top:14,right:14,background:p.tagColor+"22",color:p.tagColor,border:"1px solid "+p.tagColor+"44",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700}}>{p.tag}</span>
              <div style={{fontSize:40}}>{p.emoji}</div>
              <div>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#C8A46B"}}>{p.marca}</div>
                <div style={{fontSize:16,fontWeight:700,color:"#1a1a1a",margin:"3px 0"}}>{p.nombre}</div>
              </div>
              <p style={{fontSize:13,color:"#777",lineHeight:1.55,flexGrow:1,margin:0}}>{p.beneficio}</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:6}}>
                <a href={p.amazon} target="_blank" rel="noopener noreferrer" style={{background:"#FF9900",color:"#fff",borderRadius:10,padding:"9px 4px",fontSize:12,fontWeight:700,textDecoration:"none",textAlign:"center",display:"block"}}>📦 Amazon</a>
                <a href={p.iherb} target="_blank" rel="noopener noreferrer" style={{background:"#5AAA46",color:"#fff",borderRadius:10,padding:"9px 4px",fontSize:12,fontWeight:700,textDecoration:"none",textAlign:"center",display:"block"}}>🌿 iHerb</a>
                <a href={p.sephora} target="_blank" rel="noopener noreferrer" style={{background:"#E75480",color:"#fff",borderRadius:10,padding:"9px 4px",fontSize:12,fontWeight:700,textDecoration:"none",textAlign:"center",display:"block"}}>🖤 Sephora</a>
                <a href={p.druni} target="_blank" rel="noopener noreferrer" style={{background:"#1A1A1A",color:"#fff",borderRadius:10,padding:"9px 4px",fontSize:12,fontWeight:700,textDecoration:"none",textAlign:"center",display:"block"}}>💜 Druni</a>
              </div>
            </div>
          );
        })}
      </div>
      <p style={{textAlign:"center",fontSize:11,color:"#bbb",marginTop:20}}>
        * Algunos enlaces son de afiliado. LuMane puede recibir una pequeña comisión sin coste adicional para ti.
      </p>
    </section>
  );
}

function ReviewsSection() {
  const [reviews, setReviews] = React.useState([
    { id:1, nombre:"María G.", pais:"🇲🇽 México",    tipo:"3C", estrellas:5, texto:"¡Increíble! Por fin una app que entiende mi cabello rizado. La rutina que me dio cambió todo.", fecha:"Hace 2 días" },
    { id:2, nombre:"Valentina R.", pais:"🇨🇴 Colombia", tipo:"2B", estrellas:5, texto:"Llevaba años gastando dinero en productos que no funcionaban. LuMane me dio exactamente lo que necesitaba.", fecha:"Hace 5 días" },
    { id:3, nombre:"Andrea M.", pais:"🇪🇸 España",   tipo:"Cal", estrellas:5, texto:"El agua de Madrid me tenía el cabello horrible. Los productos anti-cal son una revolución total.", fecha:"Hace 1 semana" },
    { id:4, nombre:"Carlos P.", pais:"🇦🇷 Argentina",  tipo:"1C", estrellas:4, texto:"Muy buena página, fácil de usar y los productos que recomienda son reales y accesibles.", fecha:"Hace 1 semana" },
    { id:5, nombre:"Sofía L.", pais:"🇬🇹 Guatemala",  tipo:"4A", estrellas:5, texto:"Nunca pensé que habría una app que cubriera mi tipo de cabello afro. ¡Estoy emocionada!", fecha:"Hace 2 semanas" },
  ]);
  const [nombre, setNombre]     = React.useState("");
  const [pais, setPais]         = React.useState("");
  const [texto, setTexto]       = React.useState("");
  const [estrellas, setEstrellas] = React.useState(5);
  const [hover, setHover]       = React.useState(0);
  const [enviado, setEnviado]   = React.useState(false);

  const total = reviews.length;
  const promedio = (reviews.reduce((s,r)=>s+r.estrellas,0)/total).toFixed(1);

  function enviar() {
    if(!nombre.trim() || !texto.trim()) return;
    const nuevo = { id:Date.now(), nombre:nombre.trim(), pais:pais||"🌎", tipo:"", estrellas, texto:texto.trim(), fecha:"Ahora mismo" };
    setReviews(prev=>[nuevo,...prev]);
    setNombre(""); setPais(""); setTexto(""); setEstrellas(5); setEnviado(true);
    setTimeout(()=>setEnviado(false), 3000);
  }

  return (
    <section style={{background:"#F7F2EA",padding:"3rem 1.5rem",fontFamily:"'Outfit',sans-serif"}}>
      <div style={{maxWidth:760,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <span style={{fontSize:11,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:"#C8A46B",display:"block",marginBottom:6}}>✦ Opiniones reales</span>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,5vw,34px)",fontWeight:700,color:"#1A1A1A",margin:"0 0 8px 0"}}>Lo que dice nuestra comunidad</h2>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginTop:8}}>
            <div style={{display:"flex",gap:3}}>
              {[1,2,3,4,5].map(s=>(
                <span key={s} style={{fontSize:20,color:s<=Math.round(promedio)?"#FFB800":"#ddd"}}>★</span>
              ))}
            </div>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#C8A46B"}}>{promedio}</span>
            <span style={{fontSize:13,color:"#999"}}>({total} opiniones)</span>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14,marginBottom:32}}>
          {reviews.map(r=>(
            <div key={r.id} style={{background:"#FDFAF5",borderRadius:16,padding:"18px 16px",border:"1.5px solid #f0e8ea",boxShadow:"0 2px 12px rgba(201,168,76,0.06)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:"#1A1A1A"}}>{r.nombre}</div>
                  <div style={{fontSize:12,color:"#999",marginTop:2}}>{r.pais}{r.tipo?" · Tipo "+r.tipo:""}</div>
                </div>
                <div style={{display:"flex",gap:2}}>
                  {[1,2,3,4,5].map(s=>(
                    <span key={s} style={{fontSize:13,color:s<=r.estrellas?"#FFB800":"#ddd"}}>★</span>
                  ))}
                </div>
              </div>
              <p style={{fontSize:13,color:"#555",lineHeight:1.6,margin:0,fontStyle:"italic"}}>"{r.texto}"</p>
              <div style={{fontSize:11,color:"#bbb",marginTop:10}}>{r.fecha}</div>
            </div>
          ))}
        </div>

        <div style={{background:"#FDFAF5",borderRadius:20,padding:"28px 24px",border:"1.5px solid rgba(201,168,76,.2)",boxShadow:"0 4px 20px rgba(201,168,76,.08)"}}>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:"#1A1A1A",marginBottom:4}}>¿Ya usaste LuMane?</h3>
          <p style={{fontSize:13,color:"#999",marginBottom:20}}>Deja tu opinión y ayuda a otras personas a cuidar su cabello</p>

          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#1A1A1A",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>Tu calificación</div>
            <div style={{display:"flex",gap:6}}>
              {[1,2,3,4,5].map(s=>(
                <span key={s}
                  onMouseEnter={()=>setHover(s)}
                  onMouseLeave={()=>setHover(0)}
                  onClick={()=>setEstrellas(s)}
                  style={{fontSize:32,cursor:"pointer",color:s<=(hover||estrellas)?"#FFB800":"#ddd",transition:"color .15s"}}>★</span>
              ))}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <div>
              <label style={{fontSize:12,fontWeight:700,color:"#1A1A1A",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:6}}>Tu nombre *</label>
              <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Ej: María G."
                style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid rgba(201,168,76,.25)",fontFamily:"'Outfit',sans-serif",fontSize:14,color:"#1A1A1A",outline:"none",background:"#FDFAF5"}}/>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:700,color:"#1A1A1A",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:6}}>País</label>
              <input value={pais} onChange={e=>setPais(e.target.value)} placeholder="Ej: 🇲🇽 México"
                style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid rgba(201,168,76,.25)",fontFamily:"'Outfit',sans-serif",fontSize:14,color:"#1A1A1A",outline:"none",background:"#FDFAF5"}}/>
            </div>
          </div>

          <div style={{marginBottom:16}}>
            <label style={{fontSize:12,fontWeight:700,color:"#1A1A1A",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:6}}>Tu comentario *</label>
            <textarea value={texto} onChange={e=>setTexto(e.target.value)} placeholder="¿Qué te pareció LuMane? ¿Cómo te ayudó con tu cabello?"
              rows={3}
              style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid rgba(201,168,76,.25)",fontFamily:"'Outfit',sans-serif",fontSize:14,color:"#1A1A1A",outline:"none",background:"#FDFAF5",resize:"none"}}/>
          </div>

          {enviado?(
            <div style={{background:"rgba(200,164,107,.1)",border:"1px solid rgba(200,164,107,.3)",borderRadius:10,padding:"12px",textAlign:"center",fontSize:14,color:"#A07A30",fontWeight:600}}>
              🎉 ¡Gracias por tu opinión! Ya aparece arriba.
            </div>
          ):(
            <button onClick={enviar}
              style={{width:"100%",background:"linear-gradient(135deg,#1A1A1A,#A07A30)",color:"#fff",border:"none",padding:"12px",borderRadius:30,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",boxShadow:"0 6px 20px rgba(122,92,46,.3)"}}>
              ✨ Publicar mi opinión
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
html{-webkit-tap-highlight-color:transparent;scroll-behavior:smooth;}
body{font-family:'Outfit',sans-serif;background:#FDFAF5;color:#1A1A1A;overflow-x:hidden;}
.page-content{padding-bottom:5rem;}
.splash{position:fixed;inset:0;background:linear-gradient(160deg,#F5ECD8 0%,#E8D5B0 50%,#C8A46B 100%);display:flex;align-items:center;justify-content:center;z-index:9999;animation:splashOut 1.2s 3.5s ease-in-out forwards;}
@keyframes splashOut{0%{opacity:1}100%{opacity:0;pointer-events:none;}}
.splash-logo{font-family:'Cormorant Garamond',serif;font-size:3.8rem;font-weight:700;color:#2B2B2B;letter-spacing:0.15em;animation:fadeUp 0.6s ease both;}
.splash-tag{color:rgba(43,43,43,.7);font-size:0.78rem;letter-spacing:0.2em;text-transform:uppercase;animation:fadeUp 0.6s 0.3s ease both;margin-top:0.4rem;text-align:center;}
.splash-dot{width:8px;height:8px;border-radius:50%;background:rgba(43,43,43,.5);margin-top:2rem;animation:pulseDot 1s 0.5s ease infinite;}
@keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.6)}}
@keyframes pulsBtn{0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,.6);transform:scale(1)}50%{box-shadow:0 0 0 8px rgba(201,168,76,0);transform:scale(1.05)}}
@keyframes bannerShake{0%,100%{transform:translateX(0)}10%,30%,50%,70%{transform:translateX(-3px)}20%,40%,60%,80%{transform:translateX(3px)}}
@keyframes bannerGlow{0%,100%{box-shadow:0 4px 20px rgba(122,92,46,.4)}50%{box-shadow:0 4px 35px rgba(122,92,46,.8),0 0 20px rgba(201,168,76,.4)}}
@keyframes bannerBounce{0%,100%{transform:translateY(0)}25%{transform:translateY(-5px)}50%{transform:translateY(0)}75%{transform:translateY(-3px)}}
.fade{}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.spin{animation:rot 2s linear infinite;display:inline-block;}
@keyframes rot{to{transform:rotate(360deg)}}
.lift{transition:box-shadow .22s;}
.lift:hover{box-shadow:0 12px 36px rgba(201,168,76,.18);}
.sl{transition:box-shadow .16s;}
.sl:hover{box-shadow:0 4px 14px rgba(0,0,0,.1);}
button:active{opacity:.9;}
.bottom-nav{position:fixed;bottom:0;left:0;right:0;z-index:200;background:rgba(245,237,224,.97);backdrop-filter:blur(20px);border-top:1px solid #DDD4C8;display:flex;justify-content:space-around;align-items:center;padding:0.5rem 0 0.8rem;}
.bottom-nav-item{display:flex;flex-direction:column;align-items:center;gap:0.2rem;background:none;border:none;cursor:pointer;padding:0.3rem 1rem;border-radius:0.8rem;font-family:'Outfit',sans-serif;}
.bottom-nav-item.active{background:rgba(200,164,107,.12);}
.bottom-nav-icon{font-size:1.4rem;}
.bottom-nav-label{font-size:0.62rem;font-weight:600;letter-spacing:0.04em;color:#1A1A1A;opacity:0.5;}
.bottom-nav-item.active .bottom-nav-label{color:#C8A46B;opacity:1;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:rgba(201,168,76,.3);border-radius:3px;}
`;

function fallback(a){
  return {
    hairType:a.subtype||a.group||"2B",condition:"normal",scalp:a.scalp||"normal",
    title:"Tu Cabello Es Tu Identidad",
    summary:"Con la rutina adecuada, tu cabello brillará con todo su potencial natural.",
    score:{hidratacion:7,fuerza:6,brillo:7,salud_cuero:7},
    products:[
      {order:1,step:"Limpieza",name:"Shampoo suave sin sulfatos",sq:"gentle sulfate free shampoo",why:"Limpia sin agredir la fibra.",howToApply:"1. Cuero mojado.\n2. Masajea 2 min.\n3. Agua fría.",freq:"2-3x semana",tip:"Agua fría cierra la cutícula.",avoid:"Agua muy caliente."},
      {order:2,step:"Acondicionado",name:"Acondicionador hidratante",sq:"moisturizing conditioner",why:"Repone la humedad.",howToApply:"1. Medios a puntas.\n2. Peine ancho.\n3. 5 min.\n4. Agua fría.",freq:"Cada lavado",tip:"Con cabello chorreando.",avoid:"Aplicar en raíz."},
      {order:3,step:"Tratamiento",name:"Mascarilla nutritiva",sq:"weekly hair mask nourishing",why:"Repone nutrientes.",howToApply:"1. Limpio húmedo.\n2. Gorro 15 min.\n3. Agua fría.",freq:"1x semana",tip:"Antes de un evento especial.",avoid:"Exceso de proteína."},
      {order:4,step:"Leave-in",name:"Leave-in sin aclarado",sq:"leave in conditioner",why:"Protege y define.",howToApply:"1. Húmedo en secciones.\n2. No enjuagar.",freq:"Cada lavado",tip:"Antes del difusor.",avoid:"Exceso de producto."},
      {order:5,step:"Sellado",name:"Aceite finalizador",sq:"lightweight hair oil shine",why:"Sella la cutícula y brillo.",howToApply:"1. 1-2 gotas en palmas.\n2. Solo en puntas.",freq:"Diario",tip:"Menos es más.",avoid:"Raíz o cuero."},
    ],
    weeklyRoutine:["Días 1-2: Lavado completo","Días 3-4: Refrescar con leave-in","Días 5-6: Mascarilla + aceite","Día 7: Descanso"],
    ingredients:{buscar:["Karité","Aloe vera","Pantenol","Argán","Biotina"],evitar:["Sulfatos SLS","Alcohol desnaturalizado","Siliconas no solubles"]},
    lifestyle:["Duerme en funda de seda","Bebe 2 litros de agua al día","Masajea el cuero 5 min diarios"],
  };
}

// ─── HELPER: detectar país y elegir pasarela ───────────────
async function detectPaymentGateway() {
  try {
    const geoRes = await fetch('https://ipapi.co/json/');
    const geoData = await geoRes.json();
    return geoData.country_code === 'CO' ? 'wompi' : 'stripe';
  } catch (e) {
    return 'stripe'; // fallback a Stripe si falla la detección
  }
}

async function redirectToPayment(plan, gateway) {
  // NUEVO: enviamos el email para asociar el pago a la cuenta (webhooks)
  let email = '';
  try {
    const u = JSON.parse(localStorage.getItem('lumane_user')||'{}');
    email = u.email || localStorage.getItem('lumane_lead') || '';
  } catch (e) {}
  const endpoint = gateway === 'wompi' ? '/api/wompi-checkout' : '/api/checkout';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, email }),
  });
  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
    return true;
  }
  return false;
}

// ─── Verificación REAL de suscripción contra la base de datos ──
async function checkSubscriptionServer(email) {
  try {
    const r = await fetch('/api/check-subscription?email=' + encodeURIComponent(email));
    const d = await r.json();
    return d && d.status === 'active';
  } catch (e) {
    return null; // error de red: no cambiar nada
  }
}

function LoginPage({onSuccess, onRegister}) {
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [error, setError] = React.useState("");
  const [forgotSent, setForgotSent] = React.useState(false);
  const [forgotLoading, setForgotLoading] = React.useState(false);

  async function doForgot() {
    if (!email.trim()) { return; }
    setForgotLoading(true);
    try {
      await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      setForgotSent(true);
    } catch(e) {}
    setForgotLoading(false);
  }

  function doLogin(){
    setError("");
    if(!email.trim()||!pass.trim()){setError("Completa todos los campos.");return;}
    try {
      const user = JSON.parse(localStorage.getItem('lumane_user')||'{}');
      if(user.email===email.trim()&&user.password===pass){
        sessionStorage.setItem('lumane_session','1');
        onSuccess(email.trim());
      } else {
        setError("Correo o contraseña incorrectos.");
      }
    } catch(e){ setError("Error al iniciar sesión."); }
  }

  return (
    <div style={{minHeight:"85vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem 1.5rem 5rem",background:"#FDFAF5"}}>
      <div style={{maxWidth:"420px",width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:"1.8rem"}}>
          <div style={{fontSize:"2.5rem",marginBottom:"0.5rem"}}>✦</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,5vw,2.4rem)",fontWeight:700,color:"#1A1A1A",marginBottom:"0.4rem"}}>Bienvenida de vuelta</h1>
          <p style={{fontSize:"0.85rem",color:"#999"}}>Inicia sesión para acceder a tu cuenta</p>
        </div>
        <div style={{background:"#FDFAF5",borderRadius:"1.5rem",padding:"2rem",border:"1.5px solid rgba(201,168,76,.15)",boxShadow:"0 8px 32px rgba(201,168,76,.08)"}}>
          {error&&(
            <div style={{background:"rgba(200,50,50,.08)",border:"1px solid rgba(200,50,50,.25)",borderRadius:"0.75rem",padding:"0.8rem 1rem",fontSize:"0.82rem",color:"#AA3333",marginBottom:"1.2rem",textAlign:"center"}}>
              {error}
            </div>
          )}
          <div style={{marginBottom:"1rem"}}>
            <label style={{fontSize:"0.65rem",fontWeight:700,color:"#1A1A1A",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:"0.4rem"}}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              placeholder="tu@correo.com"
              style={{width:"100%",padding:"14px 16px",borderRadius:12,border:"1.5px solid rgba(201,168,76,.3)",fontFamily:"'Outfit',sans-serif",fontSize:16,color:"#1A1A1A",outline:"none",background:"#FDFAF5",boxSizing:"border-box"}}
            />
          </div>
          <div style={{marginBottom:"1.5rem"}}>
            <label style={{fontSize:"0.65rem",fontWeight:700,color:"#1A1A1A",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:"0.4rem"}}>Contraseña</label>
            <input
              type="password"
              value={pass}
              onChange={e=>setPass(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&doLogin()}
              placeholder="••••••••"
              style={{width:"100%",padding:"14px 16px",borderRadius:12,border:"1.5px solid rgba(201,168,76,.3)",fontFamily:"'Outfit',sans-serif",fontSize:16,color:"#1A1A1A",outline:"none",background:"#FDFAF5",boxSizing:"border-box"}}
            />
          </div>
          <button onClick={doLogin}
            style={{width:"100%",background:"linear-gradient(135deg,#1A1A1A,#A07A30)",color:"#fff",border:"none",padding:"1rem",borderRadius:"3rem",fontSize:"1rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",marginBottom:"1rem"}}>
            Entrar a mi cuenta →
          </button>
          {forgotSent ? (
            <div style={{background:"rgba(200,164,107,.1)",border:"1px solid rgba(200,164,107,.3)",borderRadius:"0.75rem",padding:"0.8rem",fontSize:"0.82rem",color:"#A07A30",marginBottom:"1rem",textAlign:"center"}}>
              ✅ Te enviamos un link a tu correo. Revisa tu bandeja de entrada.
            </div>
          ) : (
            <p style={{textAlign:"center",fontSize:"0.78rem",color:"#C8A46B",cursor:"pointer",marginBottom:"0.5rem"}} onClick={doForgot}>
              {forgotLoading ? "Enviando…" : "¿Olvidaste tu contraseña?"}
            </p>
          )}
          <p style={{textAlign:"center",fontSize:"0.78rem",color:"#999"}}>
            ¿No tienes cuenta?{" "}
            <span onClick={onRegister} style={{color:"#C8A46B",fontWeight:700,cursor:"pointer"}}>Suscríbete aquí</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({selectedPlan, onBack, onSuccess}) {
  const [regData, setRegData] = React.useState({nombre:"",apellido:"",nacimiento:"",email:"",password:"",confirm:""});
  const [regError, setRegError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function activatePaidRegister() {
    setLoading(true);
    try {
      const gateway = await detectPaymentGateway();
      const ok = await redirectToPayment(selectedPlan, gateway);
      if (!ok) {
        setRegError('Error al procesar el pago. Intenta de nuevo.');
        setLoading(false);
      }
    } catch(e) {
      setRegError('Error de conexión. Intenta de nuevo.');
      setLoading(false);
    }
  }

  async function doRegister(){
    setRegError("");
    if(!regData.nombre.trim()||!regData.email.trim()||!regData.password.trim()||!regData.nacimiento){
      setRegError("Completa todos los campos obligatorios."); return;
    }
    if(regData.password !== regData.confirm){
      setRegError("Las contraseñas no coinciden."); return;
    }
    if(regData.password.length < 6){
      setRegError("La contraseña debe tener al menos 6 caracteres."); return;
    }
    try {
      localStorage.setItem('lumane_user', JSON.stringify({
        nombre: regData.nombre.trim(),
        apellido: regData.apellido.trim(),
        nacimiento: regData.nacimiento,
        email: regData.email.trim(),
        password: regData.password,
      }));
      sessionStorage.setItem('lumane_session','1');
    } catch(e){}
    // Guardar usuario en KV para recuperación de contraseña
    try {
      fetch('/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: regData.nombre.trim(),
          apellido: regData.apellido.trim(),
          email: regData.email.trim(),
        }),
      }).catch(()=>{});
    } catch(e){}
    // Detectar país y redirigir a Wompi o Stripe
    activatePaidRegister();
  }

  return (
    <div style={{minHeight:"85vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem 1.5rem 5rem",background:"#FDFAF5"}}>
      <div style={{maxWidth:"480px",width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:"1.8rem"}}>
          <div style={{fontSize:"0.65rem",color:"#C8A46B",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.4rem"}}>✦ Paso 1 de 2</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,5vw,2.4rem)",fontWeight:700,color:"#1A1A1A",marginBottom:"0.4rem"}}>Crea tu cuenta</h1>
          <p style={{fontSize:"0.85rem",color:"#999"}}>Luego te llevaremos al pago seguro</p>
        </div>
        <div style={{background:"#FDFAF5",borderRadius:"1.5rem",padding:"2rem",border:"1.5px solid rgba(201,168,76,.15)",boxShadow:"0 8px 32px rgba(201,168,76,.08)"}}>
          {regError&&(
            <div style={{background:"rgba(200,50,50,.08)",border:"1px solid rgba(200,50,50,.25)",borderRadius:"0.75rem",padding:"0.8rem 1rem",fontSize:"0.82rem",color:"#AA3333",marginBottom:"1.2rem",textAlign:"center"}}>
              {regError}
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1rem"}}>
            <div>
              <label style={{fontSize:"0.65rem",fontWeight:700,color:"#1A1A1A",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:"0.4rem"}}>Nombre *</label>
              <input value={regData.nombre} onChange={e=>setRegData(p=>({...p,nombre:e.target.value}))} placeholder="Tu nombre"
                style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid rgba(201,168,76,.3)",fontFamily:"'Outfit',sans-serif",fontSize:15,color:"#1A1A1A",outline:"none",background:"#FDFAF5",boxSizing:"border-box"}}/>
            </div>
            <div>
              <label style={{fontSize:"0.65rem",fontWeight:700,color:"#1A1A1A",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:"0.4rem"}}>Apellido</label>
              <input value={regData.apellido} onChange={e=>setRegData(p=>({...p,apellido:e.target.value}))} placeholder="Tu apellido"
                style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid rgba(201,168,76,.3)",fontFamily:"'Outfit',sans-serif",fontSize:15,color:"#1A1A1A",outline:"none",background:"#FDFAF5",boxSizing:"border-box"}}/>
            </div>
          </div>
          <div style={{marginBottom:"1rem"}}>
            <label style={{fontSize:"0.65rem",fontWeight:700,color:"#1A1A1A",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:"0.4rem"}}>Fecha de nacimiento *</label>
            <input type="date" value={regData.nacimiento} onChange={e=>setRegData(p=>({...p,nacimiento:e.target.value}))}
              style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid rgba(201,168,76,.3)",fontFamily:"'Outfit',sans-serif",fontSize:15,color:"#1A1A1A",outline:"none",background:"#FDFAF5",boxSizing:"border-box"}}/>
          </div>
          <div style={{marginBottom:"1rem"}}>
            <label style={{fontSize:"0.65rem",fontWeight:700,color:"#1A1A1A",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:"0.4rem"}}>Correo electrónico *</label>
            <input type="email" value={regData.email} onChange={e=>setRegData(p=>({...p,email:e.target.value}))} placeholder="tu@correo.com"
              style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid rgba(201,168,76,.3)",fontFamily:"'Outfit',sans-serif",fontSize:15,color:"#1A1A1A",outline:"none",background:"#FDFAF5",boxSizing:"border-box"}}/>
          </div>
          <div style={{marginBottom:"1rem"}}>
            <label style={{fontSize:"0.65rem",fontWeight:700,color:"#1A1A1A",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:"0.4rem"}}>Contraseña * (mín. 6 caracteres)</label>
            <input type="password" value={regData.password} onChange={e=>setRegData(p=>({...p,password:e.target.value}))} placeholder="••••••••"
              style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid rgba(201,168,76,.3)",fontFamily:"'Outfit',sans-serif",fontSize:15,color:"#1A1A1A",outline:"none",background:"#FDFAF5",boxSizing:"border-box"}}/>
          </div>
          <div style={{marginBottom:"1.5rem"}}>
            <label style={{fontSize:"0.65rem",fontWeight:700,color:"#1A1A1A",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:"0.4rem"}}>Confirmar contraseña *</label>
            <input type="password" value={regData.confirm} onChange={e=>setRegData(p=>({...p,confirm:e.target.value}))} placeholder="••••••••"
              style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid rgba(201,168,76,.3)",fontFamily:"'Outfit',sans-serif",fontSize:15,color:"#1A1A1A",outline:"none",background:"#FDFAF5",boxSizing:"border-box"}}/>
          </div>
          <button onClick={doRegister} disabled={loading}
            style={{width:"100%",background:loading?"rgba(122,92,46,.4)":"linear-gradient(135deg,#1A1A1A,#A07A30)",color:"#fff",border:"none",padding:"1rem",borderRadius:"3rem",fontSize:"1rem",fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"'Outfit',sans-serif",marginBottom:"0.8rem"}}>
            {loading?"Redirigiendo al pago…":"🔒 Continuar al pago seguro →"}
          </button>
          <button onClick={onBack} style={{width:"100%",background:"transparent",color:"#C8A46B",border:"none",fontSize:"0.82rem",cursor:"pointer",fontFamily:"'Outfit',sans-serif",opacity:.6}}>
            ← Volver
          </button>
        </div>
        <p style={{textAlign:"center",fontSize:"0.68rem",color:"#bbb",marginTop:"1rem",lineHeight:1.5}}>
          🔒 Pago seguro · 🇨🇴 Colombia: Wompi (Nequi, PSE, Bancolombia) · 🌍 Internacional: Stripe
        </p>
      </div>
    </div>
  );
}

// Global store for price ranges - persists across re-renders
const cardRanges = {};
const cardOpen = {};
// Global store para el email del lead (evita perder el foco al escribir)
const leadStore = { email: "" };

function ShopCard({p, activeStores, openStore}){
  const [open,setOpen]=useState(cardOpen[p.id]||false);
  function changeOpen(val){ cardOpen[p.id]=val; setOpen(val); }
  const [range,setRange]=useState(cardRanges[p.id]||"mid");
  const sel=p.prices&&p.prices[range]?p.prices[range]:{};
  function changeRange(key){ cardRanges[p.id]=key; setRange(key); }
  return(
    <div style={{background:"#FDFAF5",borderRadius:"1rem",overflow:"hidden",border:"1.5px solid "+(open?"rgba(122,92,46,.3)":"rgba(201,168,76,.1)"),transition:"all .2s"}} className="lift">
      <div style={{height:"100px",background:"hsl("+p.hue+",40%,91%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.5rem",position:"relative"}}>
        {p.emoji}
        <span style={{position:"absolute",top:"0.45rem",right:"0.45rem",background:"#A07A30",color:"#fff",fontSize:"0.56rem",fontWeight:700,padding:"0.13rem 0.45rem",borderRadius:"2rem"}}>{p.tag}</span>
        <span style={{position:"absolute",bottom:"0.45rem",left:"0.45rem",background:"rgba(42,31,14,.7)",color:"#C9A84C",fontSize:"0.58rem",fontWeight:700,padding:"0.1rem 0.4rem",borderRadius:"2rem"}}>{p.cat}</span>
      </div>
      <div style={{padding:"0.85rem"}}>
        <div style={{fontSize:"0.58rem",color:"#C8A46B",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.18rem"}}>{p.step}</div>
        <p style={{fontSize:"0.74rem",opacity:.5,lineHeight:1.4,marginBottom:"0.65rem"}}>{p.desc}</p>
        {p.prices&&(
          <div style={{marginBottom:"0.7rem"}}>
            <div style={{display:"flex",gap:"0.4rem",marginBottom:"0.45rem"}}>
              {Object.entries(PRICE_LABELS).map(([key,pl])=>(
                <div key={key}
                  onClick={(e)=>{e.stopPropagation();e.preventDefault();changeRange(key);}}
                  style={{flex:1,padding:"0.6rem 0.2rem",borderRadius:"0.6rem",border:"2px solid "+(range===key?pl.color:"rgba(0,0,0,.12)"),background:range===key?pl.bg:"#fff",cursor:"pointer",textAlign:"center",minHeight:"44px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <div style={{fontSize:"0.65rem",fontWeight:700,color:range===key?pl.color:"#666"}}>{pl.label}</div>
                  <div style={{fontSize:"0.6rem",fontWeight:700,color:range===key?pl.color:"#999",marginTop:"0.08rem"}}>{"$"+(p.prices[key]&&p.prices[key].price?p.prices[key].price.toFixed(2):"")}</div>
                </div>
              ))}
            </div>
            <div style={{padding:"0.55rem 0.75rem",background:PRICE_LABELS[range].bg,border:"1px solid "+PRICE_LABELS[range].border,borderRadius:"0.6rem"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"0.9rem",fontWeight:700,color:"#1A1A1A"}}>{sel.name||""}</div>
              <div style={{fontSize:"0.66rem",opacity:.55}}>{sel.brand||""}</div>
            </div>
          </div>
        )}
        <button onClick={()=>changeOpen(!open)} style={{width:"100%",padding:"0.45rem",background:"rgba(201,168,76,.06)",border:"1px solid rgba(201,168,76,.15)",borderRadius:"0.6rem",cursor:"pointer",fontSize:"0.72rem",color:"#C8A46B",fontWeight:600,marginBottom:open?"0.65rem":0,fontFamily:"'Outfit',sans-serif"}}>
          {open?"▲ Ocultar":"▼ Ver instrucciones + Comprar"}
        </button>
        {open&&(
          <div className="fade">
            <div style={{fontSize:"0.76rem",lineHeight:1.65,opacity:.7,marginBottom:"0.75rem",background:"rgba(201,168,76,.04)",padding:"0.65rem",borderRadius:"0.5rem",whiteSpace:"pre-line"}}>{p.howTo}</div>
            <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap"}}>
              {activeStores.map(([key,s])=>(
                <button key={key} className="sl" onClick={()=>openStore((sel.name||"")+" "+(sel.brand||"")+" "+p.sq,key)} style={{display:"flex",alignItems:"center",gap:"0.3rem",padding:"0.32rem 0.75rem",borderRadius:"2rem",border:"1.5px solid "+s.color+"40",background:s.color+"0E",fontSize:"0.7rem",fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",color:"#1A1A1A"}}>
                  {s.emoji} {s.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LuMane(){
  const [page,setPage]               = useState("home");
  const [quizStep,setQuizStep]       = useState(0);
  const [answers,setAnswers]         = useState({});
  const [result,setResult]           = useState(null);
  const [loading,setLoading]         = useState(false);
  const [stores,setStores]           = useState(STORES);
  const [showStores,setShowStores]   = useState(false);
  const [expanded,setExpanded]       = useState(null);
  const [shopFilter,setShopFilter]   = useState("all");
  const [toast,setToast]             = useState(null);
  const [subStatus,setSubStatus]     = useState("none");
  const [showPaywall,setShowPaywall] = useState(false);
  const [subStep,setSubStep]         = useState(1);
  const [subEmail,setSubEmail]       = useState("");
  const [subCard,setSubCard]         = useState({num:"",exp:"",cvv:"",name:""});
  const [subLoading,setSubLoading]   = useState(false);
  const [selectedPlan,setSelectedPlan] = useState("monthly");
  const [countdown,setCountdown]     = useState(15*60);
  const [hairPhoto,setHairPhoto]     = useState(null);
  const [photoLoading,setPhotoLoading] = useState(false);
  // AUTH
  const [showLogin,setShowLogin]     = useState(false);
  const [loginEmail,setLoginEmail]   = useState("");
  const [loginPass,setLoginPass]     = useState("");
  const [loginError,setLoginError]   = useState("");
  const [regData,setRegData]         = useState({nombre:"",apellido:"",nacimiento:"",email:"",password:"",confirm:""});
  const [regError,setRegError]       = useState("");
  const [regStep,setRegStep]         = useState(1);

  // ── NUEVO: verificación REAL de suscripción contra el servidor ──
  useEffect(() => {
    let email = null;
    try {
      const u = JSON.parse(localStorage.getItem('lumane_user')||'{}');
      if (u.email) email = u.email;
      if (!email) {
        const lead = localStorage.getItem('lumane_lead');
        if (lead) email = lead;
      }
      if (email) leadStore.email = email;
      // Cache optimista mientras el servidor confirma
      const cached = localStorage.getItem('lumane_premium');
      if (cached === 'active') setSubStatus('active');
    } catch(e) {}

    async function verify(em) {
      const isActive = await checkSubscriptionServer(em);
      if (isActive === true) {
        setSubStatus('active');
        try { localStorage.setItem('lumane_premium', 'active'); } catch(e) {}
      } else if (isActive === false) {
        setSubStatus('none');
        try { localStorage.removeItem('lumane_premium'); } catch(e) {}
      }
      // isActive === null → error de red: no cambiamos nada
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      // Activación optimista (el webhook puede tardar unos segundos)
      setSubStatus('active');
      try { localStorage.setItem('lumane_premium', 'active'); } catch(e) {}
      setShowPaywall(false);
      window.history.replaceState({}, '', window.location.pathname);
      setPage('quiz'); setQuizStep(0); setAnswers({}); setResult(null);
      if (email) setTimeout(() => verify(email), 10000);
      return;
    }
    if (params.get('canceled') === 'true') {
      window.history.replaceState({}, '', window.location.pathname);
    }
    if (email) verify(email);
  }, []);

  useEffect(()=>{
    const t=setInterval(()=>setCountdown(c=>c>0?c-1:0),1000);
    return ()=>clearInterval(t);
  },[]);

  const PLANS = {
    weekly:  {id:"weekly",  label:"Semanal", price:"$2.99",  period:"/sem", savings:null,                      priceNum:2.99},
    monthly: {id:"monthly", label:"Mensual", price:"$9.99",  period:"/mes", savings:null,                      priceNum:9.99},
    annual:  {id:"annual",  label:"Anual",   price:"$59.99", period:"/año", savings:"Ahorra 50% · antes $120", priceNum:59.99},
  };

  function fmtCountdown(s){ return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0"); }
  function isSubscribed(){ return subStatus==="active"||subStatus==="trial"; }
  function requireSub(fn){ if(isSubscribed()){fn();return;} setShowPaywall(true);setSubStep(1); }
  function showToast(m){ setToast(m);setTimeout(()=>setToast(null),2500); }
  // ── NUEVO: el quiz ahora es GRATIS (es el imán de leads) ──
  function goQuiz(){ setQuizStep(0);setAnswers({});setResult(null);setHairPhoto(null);setPage("quiz"); }
  function goShop(filter){ requireSub(()=>{setShopFilter(filter||"all");setPage("shop");}); }
  function cancelSub(){
    setSubStatus("none");
    try { localStorage.removeItem('lumane_premium'); } catch(e) {}
    showToast("Suscripción cancelada");
  }

  // ── NUEVO: captura de lead antes de mostrar el análisis ──
  function saveLead(email){
    try { localStorage.setItem('lumane_lead', email); } catch(e) {}
    fetch('/api/save-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, source: 'quiz' }),
    }).catch(()=>{});
  }

  function startAnalysis(){
    const email = (leadStore.email || '').trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      showToast("📧 Escribe un correo válido para recibir tu análisis");
      return;
    }
    saveLead(email.toLowerCase());
    runAI(answers);
  }

  function doLogin(){
    setLoginError("");
    try {
      const user = JSON.parse(localStorage.getItem('lumane_user')||'{}');
      if(!loginEmail.trim()||!loginPass.trim()){setLoginError("Completa todos los campos.");return;}
      if(user.email===loginEmail.trim()&&user.password===loginPass){
        sessionStorage.setItem('lumane_session','1');
        setShowLogin(false);
        setLoginEmail(""); setLoginPass("");
        // Verificar contra el servidor si realmente tiene Premium
        checkSubscriptionServer(user.email).then(isActive=>{
          if(isActive===true){
            setSubStatus('active');
            try { localStorage.setItem('lumane_premium','active'); } catch(e) {}
          }
        });
      } else {
        setLoginError("Correo o contraseña incorrectos.");
      }
    } catch(e){ setLoginError("Error al iniciar sesión."); }
  }

  function doRegister(){
    setRegError("");
    if(!regData.nombre.trim()||!regData.email.trim()||!regData.password.trim()||!regData.nacimiento){
      setRegError("Completa todos los campos obligatorios."); return;
    }
    if(regData.password!==regData.confirm){
      setRegError("Las contraseñas no coinciden."); return;
    }
    if(regData.password.length<6){
      setRegError("La contraseña debe tener al menos 6 caracteres."); return;
    }
    try {
      localStorage.setItem('lumane_user', JSON.stringify({
        nombre: regData.nombre.trim(),
        apellido: regData.apellido.trim(),
        nacimiento: regData.nacimiento,
        email: regData.email.trim(),
        password: regData.password,
      }));
      sessionStorage.setItem('lumane_session','1');
    } catch(e){}
    activatePaid();
  }

  function handlePhotoUpload(e){
    const file = (e.target.files && e.target.files[0]) || (e.dataTransfer && e.dataTransfer.files[0]);
    if(!file){ return; }
    setPhotoLoading(true);
    setHairPhoto(null);
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const MAX = 900;
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;
        if(w === 0 || h === 0){ w = 800; h = 800; }
        if(w > MAX || h > MAX){
          if(w > h){ h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        URL.revokeObjectURL(objectUrl);
        setHairPhoto(dataUrl);
        setPhotoLoading(false);
      } catch(err) {
        URL.revokeObjectURL(objectUrl);
        const reader = new FileReader();
        reader.onload = (ev) => { setHairPhoto(ev.target.result); setPhotoLoading(false); };
        reader.onerror = () => { setPhotoLoading(false); };
        reader.readAsDataURL(file);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = (ev) => { setHairPhoto(ev.target.result); setPhotoLoading(false); };
      reader.onerror = () => { setPhotoLoading(false); };
      reader.readAsDataURL(file);
    };
    img.src = objectUrl;
  }

  // ─── WOMPI + STRIPE: detecta país y redirige ───────────────
  const activatePaid = async () => {
    setSubLoading(true);
    try {
      const gateway = await detectPaymentGateway();
      const ok = await redirectToPayment(selectedPlan, gateway);
      if (!ok) {
        alert('Error al procesar el pago. Intenta de nuevo.');
      }
    } catch (e) {
      alert('Error de conexión. Intenta de nuevo.');
    }
    setSubLoading(false);
  };

  function filterProducts(cat){
    if(cat==="all") return SHOP;
    const fc=FILTER_CATS.find(f=>f.id===cat);
    if(fc&&fc.sub) return SHOP.filter(p=>fc.sub.includes(p.cat));
    return SHOP.filter(p=>p.cat===cat);
  }

  function getQuizOpts(idx){
    return QUESTIONS[idx].opts;
  }

  function handleAnswer(qId,val){
    const next={...answers,[qId]:val};
    setAnswers(next);
    let ns=quizStep+1;
    if(ns<QUESTIONS.length) setQuizStep(ns);
    else setQuizStep(QUESTIONS.length);
  }

  // ── NUEVO: la IA ahora se ejecuta en el SERVIDOR (/api/analyze) ──
  async function runAI(ans){
    setLoading(true);setPage("result");
    try{
      const r=await fetch("/api/analyze",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ answers: ans, photo: hairPhoto }),
      });
      const d=await r.json();
      if(d && d.result){ setResult(d.result); }
      else{ setResult(fallback(ans)); }
    }catch{setResult(fallback(ans));}
    setLoading(false);
  }

  function openStore(query,key){
    const s=stores[key]; if(!s?.active) return;
    window.open(s.buildUrl(query,s.tag),"_blank","noopener");
    showToast("Abriendo "+s.name+"… 🛍️");
  }

  const [userCountry,setUserCountry] = useState(null);
  useEffect(()=>{
    fetch('https://ipapi.co/json/')
      .then(r=>r.json())
      .then(d=>setUserCountry(d.country_code))
      .catch(()=>setUserCountry(null));
  },[]);

  const activeStores = Object.entries(stores).filter(([key,s])=>{
    if(!s.active) return false;
    if(userCountry === 'CO'){
      return key === 'amazon' || key === 'mercadolibre' || key === 'surticosmeticos';
    }
    return key !== 'mercadolibre' && key !== 'surticosmeticos';
  });

  const CountdownBanner=()=>(
    <div style={{background:"linear-gradient(135deg,#1A1A1A,#2B2B2B)",padding:"0.65rem 1.2rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.8rem",flexWrap:"wrap",boxShadow:"0 4px 20px rgba(122,92,46,.4)",animation:"bannerGlow 3s ease-in-out infinite"}}>
      <span style={{color:"#fff",fontSize:"0.8rem",fontWeight:600}}>✨ Descubre tu tipo de cabello <strong>GRATIS</strong> · Rutina completa desde <strong>{"$2.99/sem"}</strong></span>
      <div style={{background:"rgba(0,0,0,.2)",borderRadius:"0.45rem",padding:"0.2rem 0.65rem",border:"1px solid rgba(255,255,255,.25)"}}>
        <span style={{fontFamily:"monospace",fontSize:"0.95rem",fontWeight:700,color:"#E8D4A0"}}>{fmtCountdown(countdown)}</span>
      </div>
      <button onClick={goQuiz} style={{background:"linear-gradient(135deg,#C8A46B,#B18C52)",color:"#fff",border:"none",padding:"0.28rem 0.95rem",borderRadius:"2rem",fontSize:"0.76rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",animation:"pulsBtn 1.5s ease-in-out infinite",boxShadow:"0 0 0 0 rgba(201,168,76,.5)"}}>
        Analizar gratis →
      </button>
    </div>
  );

  const PaywallModal=()=>(
    <div style={{position:"fixed",inset:0,background:"rgba(42,31,14,.75)",zIndex:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",backdropFilter:"blur(4px)"}}>
      <div style={{background:"#FDFAF5",borderRadius:"1.8rem",maxWidth:"460px",width:"100%",boxShadow:"0 40px 100px rgba(0,0,0,.4)",overflow:"hidden"}}>
        {subStep===1&&(
          <div>
            <div style={{background:"linear-gradient(135deg,#1A1A1A,#A07A30)",padding:"2rem",textAlign:"center",position:"relative"}}>
              <button onClick={()=>{setShowPaywall(false);setSubStep(1);}} style={{position:"absolute",top:"1rem",right:"1rem",background:"rgba(255,255,255,.15)",border:"none",color:"#fff",width:"28px",height:"28px",borderRadius:"50%",cursor:"pointer",fontSize:"0.85rem"}}>✕</button>
              <div style={{display:"inline-flex",alignItems:"center",gap:"0.4rem",background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",borderRadius:"2rem",padding:"0.28rem 0.8rem",marginBottom:"0.7rem"}}>
                <span style={{fontSize:"0.72rem",fontWeight:700,color:"#E8D4A0"}}>⏱️ Expira en <strong style={{fontFamily:"monospace",color:"#fff"}}>{fmtCountdown(countdown)}</strong></span>
              </div>
              <div style={{fontSize:"2rem",marginBottom:"0.3rem"}}>✦</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:700,color:"#fff",marginBottom:"0.3rem"}}>LuMane Premium</h2>
              <p style={{color:"rgba(255,255,255,.7)",fontSize:"0.82rem"}}>Rutina completa · Tienda · Análisis ilimitados</p>
            </div>
            <div style={{padding:"1.5rem"}}>
              <div style={{background:"rgba(201,168,76,.08)",border:"1.5px solid rgba(201,168,76,.25)",borderRadius:"1rem",padding:"0.9rem",marginBottom:"1.2rem",textAlign:"center"}}>
                <div style={{fontSize:"0.68rem",fontWeight:700,color:"#C8A46B",letterSpacing:"0.15em",textTransform:"uppercase"}}>🎁 7 días completamente gratis</div>
                <div style={{fontSize:"0.78rem",opacity:.6,marginTop:"0.2rem"}}>Sin cargos. Cancela cuando quieras.</div>
              </div>
              {Object.values(PLANS).map(plan=>(
                <button key={plan.id} onClick={()=>setSelectedPlan(plan.id)}
                  style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.8rem 1rem",borderRadius:"0.8rem",border:"2px solid "+(selectedPlan===plan.id?"#A07A30":"rgba(201,168,76,.2)"),background:selectedPlan===plan.id?"rgba(201,168,76,.07)":"#fff",cursor:"pointer",fontFamily:"'Outfit',sans-serif",marginBottom:"0.5rem"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}>
                    <div style={{width:"16px",height:"16px",borderRadius:"50%",border:"2px solid "+(selectedPlan===plan.id?"#A07A30":"#ccc"),background:selectedPlan===plan.id?"#A07A30":"transparent",flexShrink:0}}/>
                    <div style={{textAlign:"left"}}>
                      <div style={{fontWeight:700,fontSize:"0.85rem",color:"#1A1A1A"}}>{plan.label}{plan.id==="annual"&&<span style={{marginLeft:"0.4rem",background:"#FFD700",color:"#4A0070",fontSize:"0.6rem",fontWeight:700,padding:"0.1rem 0.4rem",borderRadius:"2rem"}}>⭐ Popular</span>}</div>
                      {plan.savings&&<div style={{fontSize:"0.64rem",color:"#A07A30",fontWeight:700}}>{plan.savings}</div>}
                    </div>
                  </div>
                  <div>
                    <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.35rem",fontWeight:700,color:selectedPlan===plan.id?"#A07A30":"#2A1F0E"}}>{plan.price}</span>
                    <span style={{fontSize:"0.68rem",opacity:.5}}>{plan.period}</span>
                  </div>
                </button>
              ))}
              <div style={{display:"flex",flexDirection:"column",gap:"0.35rem",margin:"0.8rem 0 1.2rem"}}>
                {["📋 Tu rutina personalizada completa de 5 pasos","🛍️ Tienda + Amazon, Sephora, iHerb, Druni","📸 Análisis con foto de tu cabello","💧 Guía agua calcárea Europa","🔄 Análisis ilimitados","🛡️ Garantía 30 días o te devolvemos el dinero"].map((b,i)=>(
                  <div key={i} style={{display:"flex",gap:"0.5rem",fontSize:"0.8rem",color:"#3A2810"}}>
                    <span style={{color:"#A07A30",fontWeight:700,flexShrink:0}}>✓</span>{b}
                  </div>
                ))}
              </div>
              <button onClick={()=>{setShowPaywall(false);setPage("register");setRegError("");setRegData({nombre:"",apellido:"",nacimiento:"",email:"",password:"",confirm:""});}} style={{width:"100%",background:"linear-gradient(135deg,#1A1A1A,#A07A30)",color:"#fff",border:"none",padding:"0.95rem",borderRadius:"3rem",fontSize:"0.97rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",marginBottom:"0.4rem"}}>
                Comenzar 7 días gratis →
              </button>
              <p style={{textAlign:"center",fontSize:"0.68rem",color:"#999",margin:"0 0 0.3rem"}}>
                🇨🇴 Colombia: Nequi · PSE · Bancolombia &nbsp;|&nbsp; 🌍 Internacional: Stripe
              </p>
              <p style={{textAlign:"center",fontSize:"0.68rem",opacity:.4,lineHeight:1.4}}>Sin cargos durante la prueba. Después {PLANS[selectedPlan].price}{PLANS[selectedPlan].period}.</p>
            </div>
          </div>
        )}
        {subStep===3&&(
          <div style={{padding:"3rem 2rem",textAlign:"center"}}>
            <div style={{fontSize:"3.5rem",marginBottom:"1rem"}}>🎉</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.9rem",fontWeight:700,color:"#1A1A1A",marginBottom:"0.5rem"}}>¡Bienvenida a Premium!</h2>
            <p style={{fontSize:"0.88rem",opacity:.7,lineHeight:1.65,marginBottom:"1.2rem"}}>Tu suscripción está activa. Disfruta todo LuMane sin límites.</p>
            <button onClick={()=>{setShowPaywall(false);setSubStep(1);}} style={{background:"linear-gradient(135deg,#1A1A1A,#A07A30)",color:"#fff",border:"none",padding:"0.85rem 2.2rem",borderRadius:"3rem",fontSize:"0.95rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>
              ¡Empezar ahora! ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const LoginModal=()=>(
    <div style={{position:"fixed",inset:0,background:"rgba(42,31,14,.85)",zIndex:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",backdropFilter:"blur(6px)"}}>
      <div style={{background:"#FDFAF5",borderRadius:"1.8rem",maxWidth:"400px",width:"100%",boxShadow:"0 40px 100px rgba(0,0,0,.4)",overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#1A1A1A,#A07A30)",padding:"2rem",textAlign:"center"}}>
          <div style={{fontSize:"2rem",marginBottom:"0.4rem"}}>✦</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:700,color:"#fff",marginBottom:"0.2rem"}}>Bienvenida de vuelta</h2>
          <p style={{color:"rgba(255,255,255,.7)",fontSize:"0.82rem"}}>Inicia sesión para acceder a tu cuenta</p>
        </div>
        <div style={{padding:"1.8rem"}}>
          {loginError&&<div style={{background:"rgba(200,50,50,.1)",border:"1px solid rgba(200,50,50,.3)",borderRadius:"0.6rem",padding:"0.7rem",fontSize:"0.78rem",color:"#AA3333",marginBottom:"1rem",textAlign:"center"}}>{loginError}</div>}
          <div style={{marginBottom:"0.9rem"}}>
            <label style={{fontSize:"0.65rem",fontWeight:700,color:"#1A1A1A",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:"0.4rem"}}>Correo electrónico</label>
            <input type="email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} placeholder="tu@correo.com"
              style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid rgba(201,168,76,.25)",fontFamily:"'Outfit',sans-serif",fontSize:15,color:"#1A1A1A",outline:"none",background:"#FDFAF5"}}/>
          </div>
          <div style={{marginBottom:"1.4rem"}}>
            <label style={{fontSize:"0.65rem",fontWeight:700,color:"#1A1A1A",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:"0.4rem"}}>Contraseña</label>
            <input type="password" value={loginPass} onChange={e=>setLoginPass(e.target.value)} placeholder="••••••••"
              onKeyDown={e=>e.key==='Enter'&&doLogin()}
              style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid rgba(201,168,76,.25)",fontFamily:"'Outfit',sans-serif",fontSize:15,color:"#1A1A1A",outline:"none",background:"#FDFAF5"}}/>
          </div>
          <button onClick={doLogin} style={{width:"100%",background:"linear-gradient(135deg,#1A1A1A,#A07A30)",color:"#fff",border:"none",padding:"1rem",borderRadius:"3rem",fontSize:"1rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",marginBottom:"1rem"}}>
            Entrar a mi cuenta →
          </button>
          <p style={{textAlign:"center",fontSize:"0.72rem",color:"#999"}}>
            ¿No tienes cuenta?{" "}
            <span onClick={()=>{setShowLogin(false);setShowPaywall(true);setSubStep(1);}} style={{color:"#C8A46B",fontWeight:700,cursor:"pointer"}}>Suscríbete aquí</span>
          </p>
        </div>
      </div>
    </div>
  );

  const StorePanel=()=>(
    <div style={{position:"fixed",inset:0,background:"rgba(42,31,14,.65)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}} onClick={()=>setShowStores(false)}>
      <div style={{background:"#FDFAF5",borderRadius:"1.5rem",padding:"1.8rem",maxWidth:"440px",width:"100%",boxShadow:"0 30px 80px rgba(0,0,0,.3)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:700}}>Tiendas Afiliadas</h2>
          <button onClick={()=>setShowStores(false)} style={{background:"none",border:"none",fontSize:"1.1rem",cursor:"pointer",color:"#999"}}>✕</button>
        </div>
        {Object.entries(stores).map(([key,s])=>(
          <div key={key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.75rem 0.9rem",marginBottom:"0.45rem",background:s.active?s.color+"12":"rgba(0,0,0,.03)",borderRadius:"0.75rem",border:"1px solid "+(s.active?s.color+"35":"transparent")}}>
            <div style={{display:"flex",alignItems:"center",gap:"0.65rem"}}>
              <span style={{fontSize:"1.2rem"}}>{s.emoji}</span>
              <div style={{fontWeight:600,fontSize:"0.85rem"}}>{s.name}</div>
            </div>
            <button onClick={()=>setStores(p=>({...p,[key]:{...p[key],active:!p[key].active}}))} style={{width:"44px",height:"24px",borderRadius:"12px",border:"none",cursor:"pointer",background:s.active?s.color:"#ddd",position:"relative",flexShrink:0}}>
              <span style={{position:"absolute",top:"2px",left:s.active?"22px":"2px",width:"20px",height:"20px",background:"#FDFAF5",borderRadius:"50%",transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const HomePage=()=>(
    <div>
      <div style={{position:"relative",minHeight:"88vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"3rem 1.5rem 2rem",textAlign:"center",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 70% at 50% 40%,rgba(122,92,46,.07) 0%,transparent 60%),#FDFAF5",zIndex:0}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:"580px"}} className="fade">
          <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",background:"rgba(200,164,107,.1)",border:"1px solid rgba(200,164,107,.3)",color:"#A07A30",fontSize:"0.72rem",fontWeight:700,padding:"0.32rem 1rem",borderRadius:"2rem",marginBottom:"1.2rem"}}>
            <span style={{width:"7px",height:"7px",background:"#5A9A5A",borderRadius:"50%"}}/>
            ✨ Análisis de tu tipo de cabello GRATIS
          </div>
          <div style={{display:"flex",gap:"0.5rem",justifyContent:"center",marginBottom:"1rem",flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:"0.4rem",background:"rgba(200,164,107,.12)",border:"1px solid rgba(201,168,76,.3)",borderRadius:"2rem",padding:"0.35rem 1rem"}}>
              <span>👩</span><span style={{fontSize:"0.75rem",fontWeight:700,color:"#C8A46B"}}>Para ella</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"0.4rem",background:"rgba(42,90,138,.12)",border:"1px solid rgba(42,90,138,.3)",borderRadius:"2rem",padding:"0.35rem 1rem"}}>
              <span>👨</span><span style={{fontSize:"0.75rem",fontWeight:700,color:"#2A5A8A"}}>Para él</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"0.4rem",background:"rgba(90,154,90,.12)",border:"1px solid rgba(90,154,90,.3)",borderRadius:"2rem",padding:"0.35rem 1rem"}}>
              <span>👶</span><span style={{fontSize:"0.75rem",fontWeight:700,color:"#3A7A3A"}}>Cuidado infantil</span>
            </div>
          </div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2.8rem,7vw,5rem)",lineHeight:1.02,fontWeight:700,color:"#1A1A1A",marginBottom:"1.2rem"}}>
            Tu cabello<br/><em style={{color:"#C8A46B",fontStyle:"italic"}}>es tu corona.</em><br/>
            <span style={{fontSize:"62%",fontWeight:300,fontStyle:"italic",color:"#1A1A1A",opacity:.75}}>Y merece lo mejor.</span>
          </h1>
          <div style={{background:"linear-gradient(135deg,rgba(201,168,76,.07),rgba(212,132,154,.11))",border:"1px solid rgba(201,168,76,.2)",borderRadius:"1.3rem",padding:"1.4rem 1.6rem",marginBottom:"2rem",maxWidth:"480px",margin:"0 auto 2rem"}}>
            <p style={{fontSize:"1rem",lineHeight:1.8,color:"#3A2810",fontWeight:400,marginBottom:"0.7rem"}}>
              <strong style={{fontWeight:700,color:"#C8A46B"}}>Sin importar tu raza, tu género ni tu textura</strong> — en LuMane creemos que cada cabello del mundo merece cuidado real, amor genuino y los mejores productos.
            </p>
            <p style={{fontSize:"0.88rem",lineHeight:1.75,color:"#1A1A1A",fontWeight:300}}>
              Desde coils 4C hasta lacio 1A — cubrimos los <strong style={{fontWeight:600}}>12 tipos de cabello</strong> con rutinas e instrucciones paso a paso. <em>Tu cabello tiene nombre, y tiene solución.</em>
            </p>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.7rem",marginBottom:"2.5rem"}}>
            <button onClick={goQuiz} style={{background:"linear-gradient(135deg,#1A1A1A,#A07A30)",color:"#fff",border:"none",padding:"1.05rem 2.6rem",borderRadius:"3rem",fontSize:"1rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",boxShadow:"0 10px 32px rgba(122,92,46,.35)"}}>
              ✨ Descubrir mi tipo de cabello GRATIS
            </button>
            <span style={{fontSize:"0.73rem",opacity:.45}}>🎁 Análisis gratis · Rutina completa desde {"$2.99/sem"} con 7 días de prueba</span>
          </div>
          <div style={{display:"flex",gap:"2rem",justifyContent:"center",flexWrap:"wrap"}}>
            {[{n:"12",l:"Tipos"},{n:"32+",l:"Productos"},{n:"7",l:"Días gratis"}].map(s=>(
              <div key={s.n}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:700,color:"#C8A46B",lineHeight:1}}>{s.n}</div>
                <div style={{fontSize:"0.62rem",textTransform:"uppercase",letterSpacing:"0.1em",opacity:.4}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{position:"relative",zIndex:1,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.45rem",maxWidth:"400px",margin:"2.5rem auto 0",width:"100%"}}>
          {HAIR_SYSTEM.map(t=>(
            <div key={t.id} className="lift" onClick={()=>{goShop(t.id);}} style={{padding:"0.65rem 0.35rem",borderRadius:"0.75rem",background:"hsl("+t.hue+",38%,93%)",border:"1px solid hsl("+t.hue+",32%,82%)",textAlign:"center",cursor:"pointer"}}>
              <div style={{fontSize:"1rem"}}>{t.emoji}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"0.78rem",fontWeight:700,color:"hsl("+t.hue+",55%,30%)"}}>{t.id}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"2.5rem 1.5rem",background:"#FDFAF5"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"1rem",maxWidth:"700px",margin:"0 auto"}}>
          <div className="lift" onClick={()=>{goShop("all");}} style={{background:"linear-gradient(135deg,rgba(201,168,76,.1),rgba(212,132,154,.15))",border:"1.5px solid rgba(201,168,76,.3)",borderRadius:"1.3rem",padding:"1.5rem",cursor:"pointer",textAlign:"center"}}>
            <div style={{fontSize:"2.5rem",marginBottom:"0.5rem"}}>👩</div>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:700,color:"#C8A46B",marginBottom:"0.4rem"}}>Cuidado Femenino</h3>
            <p style={{fontSize:"0.8rem",opacity:.65,lineHeight:1.5,marginBottom:"0.8rem"}}>Rutinas para todos los tipos — del lacio 1A al afro 4C.</p>
            <div style={{fontSize:"0.78rem",color:"#C8A46B",fontWeight:700}}>Ver rutinas femeninas →</div>
          </div>
          <div className="lift" onClick={()=>{goShop("hombre");}} style={{background:"linear-gradient(135deg,rgba(42,90,138,.1),rgba(74,106,154,.15))",border:"1.5px solid rgba(42,90,138,.3)",borderRadius:"1.3rem",padding:"1.5rem",cursor:"pointer",textAlign:"center"}}>
            <div style={{fontSize:"2.5rem",marginBottom:"0.5rem"}}>👨</div>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:700,color:"#2A5A8A",marginBottom:"0.4rem"}}>Cuidado Masculino</h3>
            <p style={{fontSize:"0.8rem",opacity:.65,lineHeight:1.5,marginBottom:"0.8rem"}}>Shampoo, anticaída y estilizado específico para hombre.</p>
            <div style={{fontSize:"0.78rem",color:"#2A5A8A",fontWeight:700}}>Ver productos masculinos →</div>
          </div>
          <div className="lift" onClick={()=>{goQuiz();}} style={{background:"linear-gradient(135deg,rgba(90,154,90,.1),rgba(120,184,120,.15))",border:"1.5px solid rgba(90,154,90,.3)",borderRadius:"1.3rem",padding:"1.5rem",cursor:"pointer",textAlign:"center"}}>
            <div style={{fontSize:"2.5rem",marginBottom:"0.5rem"}}>👶</div>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:700,color:"#3A7A3A",marginBottom:"0.4rem"}}>Cuidado Infantil</h3>
            <p style={{fontSize:"0.8rem",opacity:.65,lineHeight:1.5,marginBottom:"0.8rem"}}>Analizamos el cabello de tu hijo/a con IA y te damos la rutina perfecta para los más pequeños.</p>
            <div style={{fontSize:"0.78rem",color:"#3A7A3A",fontWeight:700}}>Analizar cabello de mi hijo/a →</div>
          </div>
        </div>
      </div>

      <div style={{padding:"3rem 1.5rem",background:"#F7F2EA"}}>
        <div style={{textAlign:"center",marginBottom:"1.8rem"}}>
          <div style={{fontSize:"0.65rem",color:"#C8A46B",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.4rem"}}>✦ Simple y rápido</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.6rem,4vw,2.3rem)",fontWeight:700}}>En 3 pasos tienes tu rutina</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:"1rem",maxWidth:"680px",margin:"0 auto"}}>
          {[{n:"1",emoji:"🔎",t:"Responde 6 preguntas",d:"La IA analiza tu tipo, textura y preocupaciones. Gratis."},{n:"2",emoji:"📸",t:"Sube foto (opcional)",d:"La IA ve tu cabello real para mayor precisión."},{n:"3",emoji:"🛍️",t:"Recibe tu rutina",d:"Paso a paso con productos en Amazon, iHerb, Sephora y Druni."}].map(s=>(
            <div key={s.n} style={{background:"#FDFAF5",borderRadius:"1.1rem",padding:"1.4rem",border:"1px solid rgba(200,164,107,.12)",textAlign:"center"}}>
              <div style={{width:"38px",height:"38px",borderRadius:"50%",background:"linear-gradient(135deg,#1A1A1A,#A07A30)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 0.7rem",color:"#fff",fontWeight:700,fontSize:"0.95rem"}}>{s.n}</div>
              <div style={{fontSize:"1.4rem",marginBottom:"0.4rem"}}>{s.emoji}</div>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"0.98rem",fontWeight:700,marginBottom:"0.3rem"}}>{s.t}</h3>
              <p style={{fontSize:"0.78rem",opacity:.6,lineHeight:1.5}}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"3rem 1.5rem",background:"linear-gradient(135deg,#2A1F0E,#1A1A1A,#2A5A8A)",textAlign:"center"}}>
        <div style={{maxWidth:"640px",margin:"0 auto"}}>
          <div style={{fontSize:"2.2rem",marginBottom:"0.8rem"}}>🌍</div>
          <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,.6)",fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:"0.6rem"}}>✦ Para toda nuestra comunidad</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.5rem,4vw,2.2rem)",fontWeight:700,color:"#FDFAF5",marginBottom:"1.2rem",lineHeight:1.4}}>
            Desde <em style={{color:"#C9A84C",fontStyle:"italic"}}>Centroamérica y el Caribe 🌴</em>, pasando por toda <em style={{color:"#C9A84C",fontStyle:"italic"}}>Sudamérica 🌎</em> y <em style={{color:"#C9A84C",fontStyle:"italic"}}>Norteamérica 🇺🇸</em>, hasta llegar a <em style={{color:"#90D4FF",fontStyle:"italic"}}>Europa 🇪🇺</em> — LuMane tiene la rutina perfecta para tu cabello.
          </h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"0.7rem",marginBottom:"1.5rem",maxWidth:"580px",margin:"0 auto 1.5rem"}}>
            {[
              {flag:"🌎",pais:"Latinoamérica",tip:"México · Colombia · Argentina · Perú · Guatemala y más"},
              {flag:"🇺🇸",pais:"Estados Unidos",tip:"Agua con cloro y minerales"},
              {flag:"🇪🇺",pais:"Europa",tip:"Agua calcárea en España, Bélgica, Francia y más"},
            ].map((p,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.15)",borderRadius:"0.9rem",padding:"0.8rem 0.6rem",textAlign:"center"}}>
                <div style={{fontSize:"1.6rem",marginBottom:"0.3rem"}}>{p.flag}</div>
                <div style={{fontSize:"0.78rem",fontWeight:700,color:"#fff",marginBottom:"0.15rem"}}>{p.pais}</div>
                <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,.55)",lineHeight:1.3}}>{p.tip}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>{goShop("cal");}} style={{background:"linear-gradient(135deg,#C9A84C,#A07A30)",color:"#fff",border:"none",padding:"0.85rem 2rem",borderRadius:"3rem",fontSize:"0.88rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",boxShadow:"0 8px 25px rgba(201,168,76,.4)"}}>
            Ver soluciones para mi región →
          </button>
        </div>
      </div>

      <div style={{padding:"3rem 1.5rem",background:"#FDFAF5"}}>
        <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
          <div style={{fontSize:"0.65rem",color:"#C8A46B",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.4rem"}}>✦ Para todos</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.5rem,4vw,2.2rem)",fontWeight:700}}>Del 1A al 4C — te cubrimos</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"0.75rem",maxWidth:"720px",margin:"0 auto 1.2rem"}}>
          {[{id:"lacio",emoji:"〰️",title:"Lacio",color:"#B8924A",sub:"1A · 1B · 1C"},{id:"ondulado",emoji:"〜",title:"Ondulado",color:"#5A9C90",sub:"2A · 2B · 2C"},{id:"rizado",emoji:"🌀",title:"Rizado",color:"#8A60B8",sub:"3A · 3B · 3C"},{id:"afro",emoji:"✦",title:"Afro/Coily",color:"#B86830",sub:"4A · 4B · 4C"}].map(g=>(
            <div key={g.id} className="lift" onClick={()=>{goShop(g.id);}} style={{padding:"1.1rem",borderRadius:"1rem",background:g.color+"10",border:"1.5px solid "+g.color+"30",cursor:"pointer",textAlign:"center"}}>
              <div style={{fontSize:"1.6rem",marginBottom:"0.35rem"}}>{g.emoji}</div>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"0.95rem",fontWeight:700,color:g.color,marginBottom:"0.15rem"}}>{g.title}</h3>
              <div style={{fontSize:"0.65rem",fontWeight:700,color:g.color,opacity:.65}}>{g.sub}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:"0.45rem",flexWrap:"wrap",justifyContent:"center"}}>
          {[{id:"caspa",emoji:"❄️",l:"Caspa"},{id:"caida",emoji:"🍂",l:"Caída"},{id:"cuero",emoji:"🔬",l:"Cuero"},{id:"regenerar",emoji:"🌱",l:"Regenerar"},{id:"cal",emoji:"💧",l:"Anti-Cal"},{id:"hombre",emoji:"💪",l:"Hombre"},{id:"ninos",emoji:"👶",l:"Niños"}].map(c=>(
            <button key={c.id} onClick={()=>{goShop(c.id);}} style={{display:"flex",alignItems:"center",gap:"0.35rem",padding:"0.38rem 0.85rem",borderRadius:"2rem",border:"1.5px solid rgba(201,168,76,.2)",background:"#FDFAF5",fontSize:"0.76rem",cursor:"pointer",fontFamily:"'Outfit',sans-serif",color:"#1A1A1A"}}>
              {c.emoji} {c.l}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:"2rem 1.5rem",background:"#FDFAF5"}}>
        <div style={{maxWidth:"620px",margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"0.8rem"}}>
          {[{emoji:"🎁",title:"Análisis gratis",desc:"Descubre tu tipo de cabello sin pagar nada."},{emoji:"🔒",title:"Pago 100% seguro",desc:"Stripe (internacional) · Wompi (Colombia: Nequi, PSE, Bancolombia)."},{emoji:"🛡️",title:"Garantía 30 días",desc:"Si no notas la diferencia, te devolvemos el dinero."},{emoji:"❌",title:"Sin permanencia",desc:"Cancela cuando quieras. Sin llamadas, sin formularios."}].map((f,i)=>(
            <div key={i} style={{background:"#FDFAF5",borderRadius:"1rem",padding:"1.1rem",border:"1px solid rgba(201,168,76,.1)",textAlign:"center"}}>
              <div style={{fontSize:"1.6rem",marginBottom:"0.4rem"}}>{f.emoji}</div>
              <div style={{fontWeight:700,fontSize:"0.82rem",marginBottom:"0.2rem",color:"#1A1A1A"}}>{f.title}</div>
              <div style={{fontSize:"0.72rem",opacity:.55,lineHeight:1.4}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:"#FDFAF5",padding:"1rem 0"}}>
        <ProductosRecomendados/>
      </div>

      <div style={{background:"linear-gradient(135deg,#2A1F0E,#1A1A1A)",padding:"4rem 1.5rem",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:"500px",height:"500px",borderRadius:"50%",border:"1px solid rgba(201,168,76,.1)",top:"-200px",left:"50%",transform:"translateX(-50%)"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:"500px",margin:"0 auto"}}>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,5vw,2.8rem)",fontWeight:700,color:"#FDFAF5",lineHeight:1.1,marginBottom:"0.8rem"}}>
            Tu mejor cabello<br/><em style={{color:"#C9A84C",fontStyle:"italic"}}>empieza hoy.</em>
          </h2>
          <p style={{color:"rgba(245,237,224,.6)",fontSize:"0.88rem",lineHeight:1.7,marginBottom:"1.5rem"}}>6 preguntas · Foto opcional · Análisis completamente gratis</p>
          <button onClick={goQuiz} style={{background:"linear-gradient(135deg,#A07A30,#C9A84C)",color:"#1A1A1A",border:"none",padding:"1rem 2.4rem",borderRadius:"3rem",fontSize:"0.97rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",boxShadow:"0 10px 35px rgba(201,168,76,.4)",marginBottom:"1.2rem"}}>
            Comenzar análisis gratuito ✨
          </button>
          {!isSubscribed()&&(
            <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",background:"rgba(201,168,76,.2)",border:"1px solid rgba(201,168,76,.4)",borderRadius:"2rem",padding:"0.38rem 1rem"}}>
              <span style={{fontSize:"0.8rem"}}>⏱️</span>
              <span style={{color:"#E8D4A0",fontSize:"0.8rem",fontWeight:600}}>Expira en <strong style={{fontFamily:"monospace",color:"#fff"}}>{fmtCountdown(countdown)}</strong></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const QuizPage=()=>{
    const allAnswered=quizStep>=QUESTIONS.length;
    if(allAnswered){
      return(
        <div style={{minHeight:"85vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"3rem 1.5rem",background:"#FDFAF5"}}>
          <div style={{maxWidth:"540px",width:"100%",textAlign:"center"}} className="fade">
            <div style={{display:"flex",gap:"0.3rem",marginBottom:"2.5rem"}}>
              {[...QUESTIONS,{}].map((_,i)=>(
                <div key={i} style={{flex:1,height:"4px",borderRadius:"2px",background:"linear-gradient(90deg,#1A1A1A,#A07A30)"}}/>
              ))}
            </div>
            <div style={{fontSize:"2.5rem",marginBottom:"0.8rem"}}>📸</div>
            <div style={{fontSize:"0.65rem",color:"#C8A46B",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.5rem"}}>Paso final</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.4rem,4vw,2rem)",fontWeight:700,marginBottom:"0.8rem",lineHeight:1.3,color:"#1A1A1A"}}>
              ¿Nos muestras tu cabello?<br/><em style={{fontStyle:"italic",color:"#C8A46B",fontSize:"85%"}}>La IA lo analizará para un resultado más exacto</em>
            </h2>
            <p style={{fontSize:"0.85rem",opacity:.6,lineHeight:1.7,marginBottom:"1.5rem",maxWidth:"400px",margin:"0 auto 1.5rem"}}>Sube una foto (opcional) y nuestra IA detectará el tipo exacto, la porosidad y lo que realmente necesita tu cabello.</p>
            <div style={{marginBottom:"1.5rem"}}>
              {photoLoading?(
                <div style={{padding:"2rem",border:"2px dashed rgba(201,168,76,.4)",borderRadius:"1.2rem",background:"rgba(201,168,76,.04)",textAlign:"center"}}>
                  <div style={{fontSize:"2rem"}} className="spin">✦</div>
                  <div style={{fontSize:"0.85rem",color:"#C8A46B",fontWeight:600,marginTop:"0.5rem"}}>Cargando foto…</div>
                </div>
              ):hairPhoto?(
                <div style={{textAlign:"center"}}>
                  <div style={{position:"relative",display:"inline-block"}}>
                    <img src={hairPhoto} alt="Tu cabello" style={{width:"220px",height:"220px",objectFit:"cover",borderRadius:"1.2rem",border:"3px solid #5A9A5A",boxShadow:"0 8px 28px rgba(200,164,107,.3)"}}/>
                    <button onClick={()=>setHairPhoto(null)} style={{position:"absolute",top:"-8px",right:"-8px",width:"30px",height:"30px",borderRadius:"50%",background:"#A07A30",border:"2px solid #fff",color:"#fff",cursor:"pointer",fontSize:"0.9rem",fontWeight:700}}>✕</button>
                  </div>
                  <div style={{marginTop:"0.8rem",fontSize:"0.9rem",color:"#A07A30",fontWeight:700}}>✅ ¡Foto lista! La IA analizará tu cabello</div>
                </div>
              ):(
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:"2.5rem",marginBottom:"0.8rem"}}>📷</div>
                  <div style={{fontWeight:700,fontSize:"1rem",color:"#C8A46B",marginBottom:"0.8rem"}}>Selecciona tu foto:</div>
                  <input
                    ref={el => { if(el) { el.onchange = handlePhotoUpload; el.oninput = handlePhotoUpload; } }}
                    type="file"
                    accept="image/*"
                    style={{display:"block",width:"100%",padding:"12px",borderRadius:"12px",border:"2px solid rgba(201,168,76,.4)",background:"#FDFAF5",fontFamily:"'Outfit',sans-serif",fontSize:"14px",color:"#1A1A1A",cursor:"pointer",marginBottom:"0.5rem"}}
                  />
                  <div style={{fontSize:"0.75rem",color:"#999"}}>JPG · PNG · HEIC</div>
                </div>
              )}
            </div>
            <div style={{marginBottom:"1.5rem",textAlign:"left",maxWidth:"400px",margin:"0 auto 1.5rem"}}>
              <label style={{fontSize:"0.65rem",fontWeight:700,color:"#1A1A1A",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:"0.4rem"}}>📧 Tu correo para recibir el análisis *</label>
              <input
                type="email"
                defaultValue={leadStore.email}
                onChange={e=>{leadStore.email=e.target.value;}}
                placeholder="tu@correo.com"
                style={{width:"100%",padding:"14px 16px",borderRadius:12,border:"1.5px solid rgba(201,168,76,.35)",fontFamily:"'Outfit',sans-serif",fontSize:16,color:"#1A1A1A",outline:"none",background:"#FDFAF5",boxSizing:"border-box"}}
              />
              <div style={{fontSize:"0.68rem",color:"#999",marginTop:"0.35rem"}}>🔒 Sin spam. Solo tu resultado y consejos para tu tipo de cabello.</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.7rem"}}>
              <button onClick={startAnalysis}
                style={{background:hairPhoto?"linear-gradient(135deg,#2A7A3A,#5AAA5A)":"linear-gradient(135deg,#1A1A1A,#A07A30)",color:"#fff",border:"none",padding:"1rem",borderRadius:"3rem",fontSize:"1rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",boxShadow:hairPhoto?"0 8px 24px rgba(42,122,58,.4)":"0 8px 24px rgba(122,92,46,.3)"}}>
                {hairPhoto?"📸 Analizar con mi foto GRATIS →":"✨ Analizar mi cabello GRATIS"}
              </button>
              {!hairPhoto&&(
                <button onClick={startAnalysis} style={{background:"transparent",color:"#C8A46B",border:"1.5px solid rgba(201,168,76,.3)",padding:"0.75rem",borderRadius:"3rem",fontSize:"0.85rem",cursor:"pointer",fontFamily:"'Outfit',sans-serif",opacity:.7}}>
                  Continuar sin foto →
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
    const currentQ={...QUESTIONS[quizStep],opts:getQuizOpts(quizStep)};
    return(
      <div style={{minHeight:"85vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"3rem 1.5rem",background:"#FDFAF5"}}>
        <div style={{maxWidth:"580px",width:"100%"}} className="fade">
          <div style={{display:"flex",gap:"0.3rem",marginBottom:"2.5rem"}}>
            {[...QUESTIONS,{}].map((_,i)=>(
              <div key={i} style={{flex:1,height:"4px",borderRadius:"2px",background:i<=quizStep?"linear-gradient(90deg,#1A1A1A,#A07A30)":"rgba(201,168,76,.13)",transition:"background .3s"}}/>
            ))}
          </div>
          <div style={{textAlign:"center",marginBottom:"0.5rem",fontSize:"1.9rem"}}>{currentQ.icon}</div>
          <div style={{textAlign:"center",fontSize:"0.65rem",color:"#C8A46B",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.6rem"}}>Pregunta {quizStep+1} de {QUESTIONS.length}</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.4rem,4vw,1.9rem)",fontWeight:600,textAlign:"center",marginBottom:"1.8rem",lineHeight:1.3,color:"#1A1A1A"}}>{currentQ.q}</h2>
          <div style={{display:"flex",flexDirection:"column",gap:"0.65rem"}}>
            {currentQ.opts.map(opt=>(
              <button key={opt.v} onClick={()=>handleAnswer(currentQ.id,opt.v)}
                style={{display:"flex",alignItems:"center",gap:"1rem",padding:"0.95rem 1.3rem",background:"#FDFAF5",border:"1.5px solid rgba(201,168,76,.16)",borderRadius:"0.85rem",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"0.88rem",color:"#1A1A1A",textAlign:"left"}}
                onMouseOver={e=>{e.currentTarget.style.borderColor="#A07A30";e.currentTarget.style.background="rgba(201,168,76,.05)";}}
                onMouseOut={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,.16)";e.currentTarget.style.background="#fff";}}>
                <span style={{fontSize:"1.3rem",minWidth:"2rem",textAlign:"center"}}>{opt.i}</span>
                <span style={{flex:1}}>{opt.l}</span>
                <span style={{color:"#C8A46B",opacity:.35}}>→</span>
              </button>
            ))}
          </div>
          {quizStep>0&&<button onClick={()=>setQuizStep(s=>s-1)} style={{display:"block",margin:"1.2rem auto 0",background:"none",border:"none",color:"#C8A46B",fontSize:"0.8rem",cursor:"pointer",fontFamily:"'Outfit',sans-serif",opacity:.65}}>← Anterior</button>}
        </div>
      </div>
    );
  };

  const ResultPage=()=>(
    <div style={{padding:"2rem 1.5rem 4rem",background:"#FDFAF5"}}>
      {loading?(
        <div style={{minHeight:"70vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1.5rem"}}>
          <div style={{fontSize:"3rem"}} className="spin">✦</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",color:"#C8A46B"}}>Analizando tu cabello…</h2>
          <p style={{opacity:.5,fontSize:"0.85rem"}}>La IA prepara tu rutina personalizada</p>
        </div>
      ):result&&(
        <div style={{maxWidth:"800px",margin:"0 auto"}} className="fade">
          <div style={{background:"linear-gradient(135deg,rgba(122,92,46,.07),rgba(201,168,76,.1))",border:"1px solid rgba(201,168,76,.2)",borderRadius:"1.6rem",padding:"2rem",textAlign:"center",marginBottom:"1.8rem"}}>
            <div style={{display:"inline-block",background:"rgba(200,164,107,.12)",border:"1px solid rgba(201,168,76,.3)",color:"#C8A46B",fontSize:"0.65rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",padding:"0.28rem 0.9rem",borderRadius:"2rem",marginBottom:"0.9rem"}}>✦ Tu análisis LuMane</div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.7rem,5vw,2.8rem)",fontWeight:700,color:"#1A1A1A",marginBottom:"0.7rem",lineHeight:1.1}}>{result.title}</h1>
            <div style={{display:"flex",gap:"0.45rem",justifyContent:"center",flexWrap:"wrap",marginBottom:"1rem"}}>
              {[{l:"Tipo",v:result.hairType},{l:"Condición",v:result.condition},{l:"Cuero",v:result.scalp}].map(t=>(
                <span key={t.l} style={{background:"#FDFAF5",border:"1px solid rgba(201,168,76,.2)",padding:"0.22rem 0.8rem",borderRadius:"2rem",fontSize:"0.7rem",color:"#1A1A1A",fontWeight:500}}>{t.l}: <strong style={{color:"#C8A46B"}}>{t.v}</strong></span>
              ))}
            </div>
            <p style={{maxWidth:"500px",margin:"0 auto",opacity:.7,lineHeight:1.75,fontSize:"0.9rem"}}>{result.summary}</p>
          </div>
          {isSubscribed()?(
            <div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:700,marginBottom:"1rem"}}>Tu rutina de 5 pasos</h2>
              <div style={{display:"flex",flexDirection:"column",gap:"0.65rem",marginBottom:"1.8rem"}}>
                {result.products&&result.products.map(function(p,i){
                  const isOpen=expanded===i;
                  return(
                    <div key={i} style={{background:"#FDFAF5",borderRadius:"1rem",border:"1.5px solid "+(isOpen?"rgba(122,92,46,.35)":"rgba(200,164,107,.12)"),overflow:"hidden"}}>
                      <button onClick={()=>setExpanded(isOpen?null:i)} style={{width:"100%",display:"flex",alignItems:"center",gap:"0.9rem",padding:"0.95rem 1.2rem",background:"none",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"'Outfit',sans-serif"}}>
                        <div style={{width:"36px",height:"36px",borderRadius:"50%",background:"hsl("+(i*55+20)+",45%,88%)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"#1A1A1A",fontSize:"0.8rem",flexShrink:0}}>{p.order}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:"0.6rem",color:"#C8A46B",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"0.1rem"}}>{p.step}</div>
                          <div style={{fontWeight:600,fontSize:"0.88rem",color:"#1A1A1A"}}>{p.name}</div>
                          <div style={{fontSize:"0.68rem",opacity:.45,marginTop:"0.06rem"}}>📅 {p.freq}</div>
                        </div>
                        <span style={{color:"#C8A46B",fontSize:"1rem",transition:"transform .22s",transform:isOpen?"rotate(180deg)":"none",flexShrink:0}}>⌄</span>
                      </button>
                      {isOpen&&(
                        <div style={{padding:"0 1.2rem 1.2rem",borderTop:"1px solid rgba(201,168,76,.08)"}} className="fade">
                          <div style={{padding:"0.8rem",background:"rgba(201,168,76,.05)",borderRadius:"0.65rem",margin:"0.8rem 0",fontSize:"0.8rem",lineHeight:1.6,color:"#1A1A1A"}}>
                            <strong style={{fontSize:"0.6rem",color:"#C8A46B",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:"0.25rem"}}>¿Por qué este producto?</strong>
                            {p.why}
                          </div>
                          <div style={{background:"rgba(122,92,46,.04)",border:"1px solid rgba(122,92,46,.1)",borderRadius:"0.65rem",padding:"0.9rem",fontSize:"0.82rem",lineHeight:1.8,whiteSpace:"pre-line",color:"#1A1A1A",marginBottom:"0.8rem"}}>{p.howToApply}</div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem",marginBottom:"0.9rem"}}>
                            <div style={{padding:"0.7rem",background:"rgba(90,154,90,.07)",borderRadius:"0.6rem",border:"1px solid rgba(90,154,90,.18)"}}>
                              <div style={{fontSize:"0.58rem",fontWeight:700,color:"#A07A30",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.2rem"}}>💡 Truco</div>
                              <p style={{fontSize:"0.76rem",opacity:.85,lineHeight:1.45}}>{p.tip}</p>
                            </div>
                            <div style={{padding:"0.7rem",background:"rgba(170,85,85,.06)",borderRadius:"0.6rem",border:"1px solid rgba(170,85,85,.16)"}}>
                              <div style={{fontSize:"0.58rem",fontWeight:700,color:"#AA5555",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.2rem"}}>⚠️ Evitar</div>
                              <p style={{fontSize:"0.76rem",opacity:.85,lineHeight:1.45}}>{p.avoid}</p>
                            </div>
                          </div>
                          <div style={{fontSize:"0.58rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",opacity:.4,marginBottom:"0.5rem"}}>🛍️ Comprar en</div>
                          <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
                            {activeStores.map(function([key,s]){
                              return(
                                <button key={key} className="sl" onClick={()=>openStore(p.sq||p.name,key)} style={{display:"flex",alignItems:"center",gap:"0.35rem",padding:"0.38rem 0.85rem",borderRadius:"2rem",border:"1.5px solid "+s.color+"40",background:s.color+"0E",fontSize:"0.75rem",fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",color:"#1A1A1A"}}>
                                  {s.emoji} {s.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{display:"flex",gap:"0.65rem",justifyContent:"center",flexWrap:"wrap"}}>
                <button onClick={()=>goShop("all")} style={{background:"linear-gradient(135deg,#1A1A1A,#A07A30)",color:"#fff",border:"none",padding:"0.8rem 1.8rem",borderRadius:"3rem",fontSize:"0.88rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Ver tienda →</button>
                <button onClick={goQuiz} style={{background:"transparent",color:"#C8A46B",border:"1.5px solid rgba(201,168,76,.4)",padding:"0.8rem 1.8rem",borderRadius:"3rem",fontSize:"0.88rem",cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Repetir análisis</button>
              </div>
            </div>
          ):(
            <div style={{background:"linear-gradient(135deg,#2A1F0E,#1A1A1A)",borderRadius:"1.6rem",padding:"2.2rem 1.8rem",textAlign:"center",boxShadow:"0 20px 60px rgba(42,31,14,.3)"}}>
              <div style={{fontSize:"2.2rem",marginBottom:"0.6rem"}}>🔒</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.5rem,4vw,2rem)",fontWeight:700,color:"#FDFAF5",marginBottom:"0.6rem",lineHeight:1.2}}>Tu rutina personalizada de 5 pasos <em style={{color:"#C9A84C",fontStyle:"italic"}}>ya está lista</em></h2>
              <p style={{color:"rgba(245,237,224,.65)",fontSize:"0.88rem",lineHeight:1.7,maxWidth:"420px",margin:"0 auto 1.3rem"}}>La IA ya diseñó tu rutina exacta para tu tipo {result.hairType}: qué productos usar, cómo aplicarlos paso a paso, con qué frecuencia y qué evitar.</p>
              <div style={{display:"flex",flexDirection:"column",gap:"0.4rem",maxWidth:"340px",margin:"0 auto 1.5rem",textAlign:"left"}}>
                {["📋 Rutina completa de 5 pasos para tu tipo "+(result.hairType||""),"🛍️ Productos exactos en 3 rangos de precio","📅 Instrucciones de aplicación paso a paso","💡 Trucos profesionales y errores a evitar","🔄 Análisis ilimitados cuando tu cabello cambie"].map((b,i)=>(
                  <div key={i} style={{display:"flex",gap:"0.5rem",fontSize:"0.83rem",color:"rgba(245,237,224,.85)"}}><span style={{color:"#C9A84C",fontWeight:700,flexShrink:0}}>✓</span>{b}</div>
                ))}
              </div>
              <button onClick={()=>{setShowPaywall(true);setSubStep(1);}} style={{background:"linear-gradient(135deg,#A07A30,#C9A84C)",color:"#1A1A1A",border:"none",padding:"1rem 2.4rem",borderRadius:"3rem",fontSize:"0.97rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",boxShadow:"0 10px 35px rgba(201,168,76,.4)",marginBottom:"0.8rem"}}>
                Desbloquear mi rutina — 7 días gratis →
              </button>
              <p style={{fontSize:"0.72rem",color:"rgba(245,237,224,.5)",lineHeight:1.5}}>🛡️ Garantía 30 días: si no notas la diferencia, te devolvemos el dinero.<br/>Cancela cuando quieras · desde {"$2.99/sem"}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const ShopPage=()=>{
    const filtered=filterProducts(shopFilter);
    return(
      <div style={{padding:"2.5rem 1.5rem 4rem",maxWidth:"980px",margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"1.8rem"}}>
          <div style={{fontSize:"0.65rem",color:"#C8A46B",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.4rem"}}>✦ Catálogo completo</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.4rem",fontWeight:700,color:"#1A1A1A"}}>Tienda LuMane</h1>
          <p style={{opacity:.45,marginTop:"0.35rem",fontSize:"0.84rem"}}>32+ productos · Tipos 1A al 4C · Para todas las razas y géneros</p>
        </div>
        <div style={{display:"flex",gap:"0.3rem",flexWrap:"wrap",marginBottom:"1.6rem"}}>
          {FILTER_CATS.map(f=>(
            <button key={f.id} onClick={()=>setShopFilter(f.id)} style={{padding:"0.3rem 0.72rem",borderRadius:"2rem",border:shopFilter===f.id?"1.5px solid #A07A30":"1.5px solid rgba(201,168,76,.15)",background:shopFilter===f.id?"rgba(201,168,76,.1)":"#fff",color:shopFilter===f.id?"#A07A30":"#2A1F0E",fontSize:"0.72rem",fontWeight:shopFilter===f.id?700:400,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>
              {f.emoji} {f.label}
            </button>
          ))}
        </div>
        <div style={{marginBottom:"0.75rem",fontSize:"0.75rem",opacity:.4}}>{filtered.length} productos</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"1rem"}}>
          {filtered.map(prod=><ShopCard key={prod.id} p={prod} activeStores={activeStores} openStore={openStore}/>)}
        </div>
      </div>
    );
  };

  const PricingPage=()=>(
    <div style={{padding:"3.5rem 1.5rem 5rem",background:"#FDFAF5",maxWidth:"720px",margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
        <div style={{fontSize:"0.65rem",color:"#C8A46B",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.4rem"}}>✦ Suscripción</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.9rem,5vw,2.8rem)",fontWeight:700,color:"#1A1A1A",marginBottom:"0.5rem",lineHeight:1.1}}>Cuida tu cabello<br/><em style={{fontStyle:"italic",color:"#C8A46B"}}>sin límites.</em></h1>
      </div>
      <div style={{background:"linear-gradient(135deg,#2A1F0E,#1A1A1A)",borderRadius:"1.8rem",padding:"2.2rem",marginBottom:"1.3rem",boxShadow:"0 20px 60px rgba(42,31,14,.3)"}}>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"0.8rem",marginBottom:"1.5rem"}}>
          <div>
            <div style={{fontSize:"0.65rem",color:"#C9A84C",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.35rem"}}>✦ Plan Premium</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:700,color:"#FDFAF5"}}>LuMane Premium</h2>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.6rem",fontWeight:700,color:"#C9A84C",lineHeight:1}}>{"$2.99"}</div>
            <div style={{fontSize:"0.7rem",color:"rgba(245,237,224,.45)"}}>desde /sem · 7 días gratis</div>
          </div>
        </div>
        <div style={{background:"rgba(201,168,76,.18)",border:"1px solid rgba(201,168,76,.35)",borderRadius:"0.9rem",padding:"1rem 1.3rem",marginBottom:"1.5rem",display:"flex",alignItems:"center",gap:"0.9rem"}}>
          <div style={{fontSize:"2rem"}}>🎁</div>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",fontWeight:700,color:"#C9A84C"}}>7 días completamente gratis</div>
            <div style={{fontSize:"0.77rem",color:"rgba(245,237,224,.6)",marginTop:"0.12rem"}}>Sin cargos. Cancela antes y no pagas nada.</div>
          </div>
        </div>
        {Object.values(PLANS).map(plan=>(
          <div key={plan.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.7rem 0",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
            <div style={{color:"rgba(245,237,224,.8)",fontSize:"0.85rem"}}>{plan.label}</div>
            <div style={{textAlign:"right"}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:700,color:"#C9A84C"}}>{plan.price}</span>
              <span style={{fontSize:"0.68rem",color:"rgba(245,237,224,.45)"}}>{plan.period}</span>
              {plan.savings&&<div style={{fontSize:"0.62rem",color:"#90D490",fontWeight:700}}>{plan.savings}</div>}
            </div>
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))",gap:"0.55rem",margin:"1.3rem 0"}}>
          {["📋 Rutina personalizada completa","🛍️ Tienda completa","📸 Análisis con foto","💧 Guía anti-cal","🔄 Análisis ilimitados","🛡️ Garantía 30 días"].map((f,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:"0.45rem",color:"rgba(245,237,224,.75)",fontSize:"0.8rem"}}>
              <span style={{color:"#C9A84C",fontWeight:700,flexShrink:0}}>✓</span>{f}
            </div>
          ))}
        </div>
        {!isSubscribed()?(
          <button onClick={()=>setShowPaywall(true)} style={{width:"100%",background:"linear-gradient(135deg,#A07A30,#C9A84C)",color:"#1A1A1A",border:"none",padding:"1rem",borderRadius:"3rem",fontSize:"0.97rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>
            Comenzar 7 días gratis →
          </button>
        ):(
          <div style={{background:"rgba(90,154,90,.18)",border:"1px solid rgba(90,154,90,.35)",borderRadius:"0.9rem",padding:"0.9rem",textAlign:"center"}}>
            <div style={{color:"#90D490",fontWeight:700,fontSize:"0.9rem"}}>✦ Premium activo</div>
          </div>
        )}
      </div>
      <p style={{textAlign:"center",fontSize:"0.75rem",color:"#999",lineHeight:1.6,marginBottom:"1rem"}}>🛡️ <strong>Garantía LuMane:</strong> si en 30 días no notas la diferencia en tu cabello, te devolvemos el dinero. Sin preguntas.</p>
      {isSubscribed()&&(
        <div style={{background:"rgba(170,85,85,.05)",border:"1px solid rgba(170,85,85,.16)",borderRadius:"0.9rem",padding:"1.1rem 1.3rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.8rem",marginTop:"1rem"}}>
          <div>
            <div style={{fontWeight:700,fontSize:"0.85rem",color:"#AA5555"}}>Cancelar suscripción</div>
            <div style={{fontSize:"0.75rem",opacity:.55,marginTop:"0.12rem"}}>Perderás el acceso premium.</div>
          </div>
          <button onClick={cancelSub} style={{background:"none",border:"1.5px solid rgba(170,85,85,.38)",color:"#AA5555",padding:"0.45rem 1.1rem",borderRadius:"2rem",fontSize:"0.8rem",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:600}}>Cancelar</button>
        </div>
      )}
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#FDFAF5"}}>
      <style>{CSS}</style>
      <div className="splash">
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem"}}>
          <div style={{width:"80px",height:"80px",borderRadius:"50%",background:"rgba(255,255,255,.15)",border:"2px solid rgba(255,255,255,.35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.4rem"}}>✦</div>
          <div className="splash-logo">LuMane</div>
          <div className="splash-tag">Cuidado capilar con inteligencia artificial</div>
          <div style={{display:"flex",gap:"0.45rem",marginTop:"0.4rem"}}>
            {["1A","2B","3C","4A"].map(t=>(
              <span key={t} style={{background:"rgba(255,255,255,.18)",color:"#fff",fontSize:"0.62rem",fontWeight:700,padding:"0.18rem 0.55rem",borderRadius:"2rem",letterSpacing:"0.08em"}}>{t}</span>
            ))}
          </div>
          <div className="splash-dot"/>
        </div>
      </div>
      {toast&&<div style={{position:"fixed",bottom:"6rem",left:"50%",transform:"translateX(-50%)",background:"#2A1F0E",color:"#FDFAF5",padding:"0.6rem 1.5rem",borderRadius:"2rem",fontSize:"0.84rem",zIndex:9999,boxShadow:"0 8px 28px rgba(0,0,0,.25)",whiteSpace:"nowrap"}}>{toast}</div>}
      {showStores&&<StorePanel/>}
      {showPaywall&&<PaywallModal/>}
      {showLogin&&<LoginModal/>}
      <div style={{position:"sticky",top:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.85rem 1.2rem",background:"rgba(245,237,224,.96)",backdropFilter:"blur(14px)",borderBottom:"1px solid rgba(201,168,76,.11)"}}>
        <div onClick={()=>setPage("home")} style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.45rem",fontWeight:700,color:"#C8A46B",cursor:"pointer",letterSpacing:"0.08em"}}>✦ LuMane</div>
        <div style={{display:"flex",gap:"0.45rem",alignItems:"center"}}>
          {isSubscribed()?(
            <div style={{background:"rgba(90,154,90,.12)",border:"1px solid rgba(200,164,107,.3)",color:"#A07A30",padding:"0.32rem 0.85rem",borderRadius:"2rem",fontSize:"0.73rem",fontWeight:700}}>
              ✦ Premium activo
            </div>
          ):(
            <button onClick={()=>setShowPaywall(true)} style={{background:"#1A1A1A",color:"#C8A46B",border:"1.5px solid #C8A46B",padding:"0.32rem 0.85rem",borderRadius:"2rem",fontSize:"0.73rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>🎁 7 días gratis</button>
          )}
          <button onClick={()=>setShowStores(true)} style={{background:"rgba(201,168,76,.09)",border:"1px solid rgba(201,168,76,.18)",color:"#C8A46B",padding:"0.32rem 0.65rem",borderRadius:"2rem",fontSize:"0.73rem",cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>⚙</button>
        </div>
      </div>
      {!isSubscribed()&&<CountdownBanner/>}
      <div className="page-content">
        {page==="home"     &&<HomePage/>}
        {page==="quiz"     &&<QuizPage/>}
        {page==="result"   &&<ResultPage/>}
        {page==="shop"     &&<ShopPage/>}
        {page==="pricing"  &&<PricingPage/>}
        {page==="login"    &&<LoginPage onSuccess={(em)=>{
          setPage('home');
          checkSubscriptionServer(em).then(isActive=>{
            if(isActive===true){
              setSubStatus('active');
              try { localStorage.setItem('lumane_premium','active'); } catch(e) {}
            }
          });
        }} onRegister={()=>setPage('home')} />}
        {page==="register" &&<RegisterPage selectedPlan={selectedPlan} onBack={()=>setPage('home')} onSuccess={()=>{setPage('quiz');}} />}
        <ReviewsSection/>
        <footer style={{background:"#2A1F0E",color:"rgba(245,237,224,.6)",padding:"2.2rem 2rem",textAlign:"center"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",color:"#C9A84C",marginBottom:"0.45rem",letterSpacing:"0.1em"}}>✦ LuMane</div>
          <p style={{fontSize:"0.78rem",lineHeight:1.6,maxWidth:"360px",margin:"0 auto"}}>Cuidado capilar con inteligencia artificial para cada tipo y textura.</p>
          {!isSubscribed()&&(
            <button onClick={goQuiz} style={{background:"linear-gradient(135deg,#1A1A1A,#A07A30)",color:"#fff",border:"none",padding:"0.5rem 1.3rem",borderRadius:"2rem",fontSize:"0.78rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",marginTop:"0.9rem"}}>
              ✨ Analizar mi cabello GRATIS
            </button>
          )}
          <p style={{fontSize:"0.63rem",marginTop:"0.7rem",opacity:.25}}>Los enlaces pueden incluir comisiones de afiliado · LuMane © 2026</p>
        </footer>
      </div>
      <nav className="bottom-nav">
        {[{id:"home",icon:"🏠",label:"Inicio"},{id:"quiz",icon:"🤖",label:"Analizar"},{id:"shop",icon:"🛍️",label:"Tienda"},{id:"pricing",icon:"✦",label:"Premium"}].map(item=>(
          <button key={item.id} className={"bottom-nav-item"+(page===item.id?" active":"")} onClick={()=>item.id==="quiz"?goQuiz():item.id==="shop"?goShop("all"):setPage(item.id)}>
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
