import { useState } from "react";

/* ══════════════════════════════════════════════
   AFFILIATE STORES
══════════════════════════════════════════════ */
const STORES_DEFAULT = {
  amazon:  { name:"Amazon",      emoji:"📦", color:"#FF9900", active:true,  tag:"YOUR_AMAZON_TAG-20",  buildUrl:(q,t)=>`https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=${t}` },
  sephora: { name:"Sephora",     emoji:"🖤", color:"#E75480", active:true,  tag:"YOUR_SEPHORA_TAG",    buildUrl:(q)  =>`https://www.sephora.com/search?keyword=${encodeURIComponent(q)}` },
  iherb:   { name:"iHerb",       emoji:"🌿", color:"#5AAA46", active:true,  tag:"YOUR_IHERB_TAG",      buildUrl:(q,t)=>`https://www.iherb.com/search?kw=${encodeURIComponent(q)}&rcode=${t}` },
  walmart: { name:"Walmart",     emoji:"🛒", color:"#0071CE", active:false, tag:"YOUR_WALMART_TAG",    buildUrl:(q)  =>`https://www.walmart.com/search?q=${encodeURIComponent(q)}` },
  ulta:    { name:"Ulta Beauty", emoji:"💄", color:"#E8175D", active:false, tag:"YOUR_ULTA_TAG",       buildUrl:(q)  =>`https://www.ulta.com/search?searchterm=${encodeURIComponent(q)}` },
  target:  { name:"Target",      emoji:"🎯", color:"#CC0000", active:false, tag:"YOUR_TARGET_TAG",     buildUrl:(q)  =>`https://www.target.com/s?searchTerm=${encodeURIComponent(q)}` },
};

/* ══════════════════════════════════════════════
   HAIR TYPE SYSTEM — full classification
══════════════════════════════════════════════ */
const HAIR_SYSTEM = [
  // LACIO
  { id:"1A", group:"lacio",    label:"Tipo 1A — Lacio Ultra Fino",     emoji:"〰️", hue:38,  color:"#C8A878", desc:"El más liso y fino. Sin ninguna curva natural. Tiende a ser graso rápido y le falta volumen." },
  { id:"1B", group:"lacio",    label:"Tipo 1B — Lacio Normal",          emoji:"〰️", hue:42,  color:"#C4A060", desc:"Liso con algo de cuerpo y textura. El tipo lacio más común. Tiene movimiento natural." },
  { id:"1C", group:"lacio",    label:"Tipo 1C — Lacio Grueso",          emoji:"〰️", hue:46,  color:"#B8924A", desc:"Liso pero con mucho volumen y grosor. Resistente y propenso al frizz leve." },
  // ONDULADO
  { id:"2A", group:"ondulado", label:"Tipo 2A — Ondas Suaves",          emoji:"〜", hue:180, color:"#6AADA0", desc:"Ondas suaves en forma de S al final. Fácil de alisar o definir. Cabello fino y ligero." },
  { id:"2B", group:"ondulado", label:"Tipo 2B — Ondas Medianas",        emoji:"〜", hue:185, color:"#5A9C90", desc:"Ondas más definidas que empiezan desde la raíz. Algo de frizz en el ambiente húmedo." },
  { id:"2C", group:"ondulado", label:"Tipo 2C — Ondas Pronunciadas",    emoji:"〜", hue:190, color:"#4A8C80", desc:"Ondas muy marcadas casi rizos. Volumen alto y frizz intenso. Necesita más hidratación." },
  // RIZADO
  { id:"3A", group:"rizado",   label:"Tipo 3A — Rizos Grandes",         emoji:"🌀", hue:280, color:"#9A72C8", desc:"Rizos amplios y bien definidos del tamaño de un marcador. Brillantes y elásticos." },
  { id:"3B", group:"rizado",   label:"Tipo 3B — Rizos Medianos",        emoji:"🌀", hue:290, color:"#8A60B8", desc:"Rizos densos del grosor de un dedo. Más volumen y más propensos al frizz que el 3A." },
  { id:"3C", group:"rizado",   label:"Tipo 3C — Rizos Apretados",       emoji:"🌀", hue:300, color:"#7A4EA8", desc:"Rizos muy apretados del grosor de un lápiz. Mucho volumen y necesidad alta de hidratación." },
  // AFRO / COILY
  { id:"4A", group:"afro",     label:"Tipo 4A — Coils Definidos",       emoji:"✦",  hue:30,  color:"#C87840", desc:"Coils suaves y bien definidos con forma de S. El más húmedo de los tipos 4." },
  { id:"4B", group:"afro",     label:"Tipo 4B — Coils en Zigzag",       emoji:"✦",  hue:25,  color:"#B86830", desc:"Patrón en zigzag con poco brillo natural. Muy frágil y necesita máxima hidratación." },
  { id:"4C", group:"afro",     label:"Tipo 4C — Coils Ultra Apretados", emoji:"✦",  hue:20,  color:"#A85820", desc:"El más frágil y con más contracción (hasta 75%). Necesita nutrición intensiva constante." },
];

/* ══════════════════════════════════════════════
   ALL CATEGORIES for filter bar
══════════════════════════════════════════════ */
const FILTER_CATS = [
  { id:"all",     label:"Todos",           emoji:"✦"  },
  { id:"lacio",   label:"Lacio",           emoji:"〰️", sub:["1A","1B","1C"] },
  { id:"1A",      label:"1A — Ultra Fino", emoji:"〰️" },
  { id:"1B",      label:"1B — Normal",     emoji:"〰️" },
  { id:"1C",      label:"1C — Grueso",     emoji:"〰️" },
  { id:"ondulado",label:"Ondulado",        emoji:"〜", sub:["2A","2B","2C"] },
  { id:"2A",      label:"2A — Suave",      emoji:"〜" },
  { id:"2B",      label:"2B — Mediano",    emoji:"〜" },
  { id:"2C",      label:"2C — Pronunciado",emoji:"〜" },
  { id:"rizado",  label:"Rizado",          emoji:"🌀", sub:["3A","3B","3C"] },
  { id:"3A",      label:"3A — Grandes",    emoji:"🌀" },
  { id:"3B",      label:"3B — Medianos",   emoji:"🌀" },
  { id:"3C",      label:"3C — Apretados",  emoji:"🌀" },
  { id:"afro",    label:"Afro / Coily",    emoji:"✦",  sub:["4A","4B","4C"] },
  { id:"4A",      label:"4A — Coils",      emoji:"✦"  },
  { id:"4B",      label:"4B — Zigzag",     emoji:"✦"  },
  { id:"4C",      label:"4C — Ultra",      emoji:"✦"  },
  { id:"caspa",   label:"Caspa",           emoji:"❄️" },
  { id:"caida",   label:"Caída",           emoji:"🍂" },
  { id:"cuero",   label:"Cuero Cabelludo", emoji:"🔬" },
  { id:"regenerar",label:"Regeneración",   emoji:"🌱" },
  { id:"hombre",  label:"Hombre",          emoji:"💪" },
];

/* ══════════════════════════════════════════════
   PRODUCTS DATABASE
══════════════════════════════════════════════ */
const SHOP = [
  // ─── LACIO 1A ───
  { id:1,  cat:"1A", step:"Limpieza",    emoji:"🫧", hue:38, tag:"Esencial",   name:"Shampoo Voluminizador Ultrafino",   desc:"Limpieza sin peso que levanta la raíz y da cuerpo al cabello más fino y liso.",              sq:"volumizing shampoo fine straight hair",        howTo:"1. Aplica solo en el cuero cabelludo — no en los largos.\n2. Masajea 2 min con yemas de dedos.\n3. Deja resbalar el producto por los largos al enjuagar.\n4. Enjuaga con agua fría para dar brillo.\n5. Nunca aplicar en puntas — las aplana más." },
  { id:2,  cat:"1A", step:"Acondicionador",emoji:"💧",hue:40,tag:"-20%",       name:"Acondicionador Ligero Sin Peso",    desc:"Hidratación ultraligera que no aplana el cabello. Fórmula sin siliconas pesadas.",            sq:"lightweight conditioner fine hair no weight",  howTo:"1. Aplica SOLO de medios a puntas, nunca en raíz.\n2. Peina con los dedos.\n3. Deja actuar 2 min máximo.\n4. Enjuaga completamente con agua fría.\n5. Si aplanas el cabello, usa menos cantidad." },
  { id:3,  cat:"1A", step:"Tratamiento", emoji:"✨", hue:42, tag:"Bestseller",  name:"Sérum Volumen y Brillo 1A",         desc:"Sérum sin aceite que aporta brillo espejo y volumen a cabellos finos y lacios.",              sq:"hair serum volume shine fine straight",        howTo:"1. Aplica 1 gota en las palmas y frota.\n2. Distribuye solo en medios y puntas.\n3. No enjuagar.\n4. Usa secador con boquilla difusora apuntando hacia arriba para añadir volumen.\n5. Nunca aplicar en la raíz." },
  // ─── LACIO 1B ───
  { id:4,  cat:"1B", step:"Limpieza",    emoji:"🫧", hue:40, tag:"Bestseller",  name:"Shampoo Equilibrio Lacio",          desc:"Equilibra el sebo del cuero cabelludo manteniendo el brillo natural del cabello liso 1B.",    sq:"balancing shampoo straight normal hair",      howTo:"1. Aplica en cuero cabelludo mojado.\n2. Masajea en movimientos circulares 2 min.\n3. Distribuye espuma por los largos.\n4. Enjuaga completamente con agua tibia luego fría.\n5. Úsalo 2-3 veces por semana." },
  { id:5,  cat:"1B", step:"Mascarilla",  emoji:"🌿", hue:44, tag:"-22%",        name:"Mascarilla Suavidad Lacio 1B",      desc:"Hidratación media que mantiene el movimiento natural sin pesar el cabello 1B.",              sq:"hair mask straight normal hair smoothing",     howTo:"1. Aplica en cabello limpio y húmedo de medios a puntas.\n2. Peina con peine de dientes anchos.\n3. Deja actuar 10 min.\n4. Enjuaga con agua fría.\n5. Úsala 1 vez por semana." },
  { id:6,  cat:"1B", step:"Finalizador", emoji:"✨", hue:46, tag:"Nuevo",        name:"Sérum Anti-Frizz Lacio Espejo",     desc:"Controla el frizz y aporta brillo espejo duradero al cabello liso tipo 1B.",                sq:"anti frizz serum straight hair shine",        howTo:"1. Aplica 2 gotas en palmas y frota bien.\n2. Distribuye en cabello húmedo o seco de medios a puntas.\n3. No enjuagar.\n4. Sella con secador frío para potenciar el brillo.\n5. Reaplica en puntas si hay frizz durante el día." },
  // ─── LACIO 1C ───
  { id:7,  cat:"1C", step:"Limpieza",    emoji:"🫧", hue:46, tag:"Bestseller",  name:"Shampoo Domador Lacio Grueso",      desc:"Controla el volumen excesivo del cabello liso grueso y reduce el frizz intenso tipo 1C.",     sq:"smoothing shampoo thick straight coarse hair", howTo:"1. Aplica abundantemente en cuero cabelludo mojado.\n2. Masajea 3 min con presión media.\n3. Trabaja bien la espuma por los largos gruesos.\n4. Enjuaga completamente.\n5. Siempre seguir con acondicionador — el 1C lo necesita más que otros lacios." },
  { id:8,  cat:"1C", step:"Mascarilla",  emoji:"🍯", hue:48, tag:"-25%",        name:"Mascarilla Domadora Grueso 1C",     desc:"Keratina y aceite de aguacate que doman el volumen y aportan suavidad al liso grueso.",       sq:"keratin mask thick straight hair frizz control",howTo:"1. Aplica generosamente en cabello limpio y húmedo.\n2. Divide en 4 secciones para cubrir bien.\n3. Cubre con gorro de ducha 20 min con calor.\n4. Enjuaga con agua fría.\n5. Úsala 2 veces por semana en invierno, 1 vez en verano." },
  { id:9,  cat:"1C", step:"Finalizador", emoji:"💎", hue:50, tag:"Nuevo",        name:"Crema Alisadora Lacio Grueso",      desc:"Crema ligera que alisa, controla el volumen y aporta suavidad al 1C sin rigidez.",            sq:"smoothing cream thick coarse straight hair",   howTo:"1. Aplica en cabello húmedo por secciones.\n2. Distribuye de raíz a puntas.\n3. Peina con cepillo de paleta para alinear.\n4. Seca con secador y cepillo redondo para máximo alisado.\n5. Finaliza con 1 gota de aceite en las puntas." },
  // ─── ONDULADO 2A ───
  { id:10, cat:"2A", step:"Limpieza",    emoji:"🌊", hue:178, tag:"Esencial",   name:"Shampoo Suave Ondas 2A",            desc:"Limpia sin resecar las ondas suaves del 2A, respetando el patrón natural sin sulfatos fuertes.",sq:"gentle shampoo wavy 2a hair sulfate free",    howTo:"1. Aplica en cuero cabelludo mojado.\n2. Masajea suavemente — no frotar los largos ondulados.\n3. Deja resbalar al enjuagar.\n4. Enjuaga con agua fría.\n5. Para el 2A: lavar solo 2 veces por semana para no borrar el patrón de ondas." },
  { id:11, cat:"2A", step:"Definición",  emoji:"〜", hue:180, tag:"Bestseller",  name:"Gel Ligero Definidor 2A",           desc:"Gel ultraligero que define las ondas 2A sin crunch ni peso. Efecto natural todo el día.",     sq:"light defining gel wavy 2a no crunch",        howTo:"1. Aplica en cabello muy húmedo por secciones.\n2. Distribuye de raíz a puntas escrunching hacia arriba.\n3. No tocar mientras seca — activa el patrón.\n4. Si hay crunch al secar, disuelve con las palmas.\n5. Difusor a temperatura media o secado al aire." },
  { id:12, cat:"2A", step:"Hidratación", emoji:"💧", hue:182, tag:"-20%",        name:"Leave-In Ligero Ondas 2A",          desc:"Niebla hidratante sin peso que activa las ondas 2A y controla el frizz sin aplanaras.",       sq:"lightweight leave in spray wavy 2a",          howTo:"1. Pulveriza sobre cabello húmedo a 20 cm.\n2. Peina con dedos de raíz a puntas.\n3. Escruncha para activar las ondas.\n4. No enjuagar.\n5. También sirve para refrescar ondas al día siguiente con una pequeña cantidad sobre cabello ligeramente húmedo." },
  // ─── ONDULADO 2B ───
  { id:13, cat:"2B", step:"Limpieza",    emoji:"🫧", hue:185, tag:"Bestseller",  name:"Co-Wash Cremoso Ondas 2B",          desc:"Limpieza sin sulfatos que mantiene la hidratación necesaria para las ondas 2B más marcadas.", sq:"co wash wavy 2b sulfate free hydrating",      howTo:"1. Aplica generosamente en cuero cabelludo mojado.\n2. Masajea bien con las yemas.\n3. Distribuye como acondicionador por los largos.\n4. Deja actuar 2 min.\n5. Enjuaga completamente. Alterna con shampoo suave cada 2-3 lavados." },
  { id:14, cat:"2B", step:"Definición",  emoji:"〜", hue:187, tag:"-23%",        name:"Crema Definidora Ondas 2B",         desc:"Define las ondas 2B sin rigidez, añade hidratación y controla el frizz todo el día.",         sq:"curl cream defining wavy 2b medium hold",     howTo:"1. Aplica en secciones sobre cabello húmedo justo tras el acondicionador.\n2. Usa la técnica \"praying hands\" de raíz a puntas.\n3. Escruncha hacia arriba para activar.\n4. Seca con difusor en modo bajo o al aire.\n5. No peinar ni tocar hasta que esté completamente seco." },
  { id:15, cat:"2B", step:"Mascarilla",  emoji:"🌸", hue:190, tag:"Nuevo",       name:"Mascarilla Hidratante 2B",          desc:"Hidratación profunda semanal que nutre las ondas 2B y reduce el frizz ambiental.",             sq:"hair mask wavy 2b moisturizing frizz",        howTo:"1. Aplica tras el shampoo en cabello húmedo de medios a puntas.\n2. Divide en secciones con pinzas.\n3. Gorro de ducha 15 min con calor suave.\n4. Enjuaga con agua fría.\n5. Sigue con tu definidor habitual." },
  // ─── ONDULADO 2C ───
  { id:16, cat:"2C", step:"Limpieza",    emoji:"🫧", hue:192, tag:"Bestseller",  name:"Shampoo CGM Ondas 2C",              desc:"Shampoo del método Curly Girl para ondas 2C casi rizadas. Sin sulfatos, sin siliconas.",       sq:"CGM shampoo wavy 2c curly girl method",       howTo:"1. Aplica en cuero cabelludo mojado.\n2. Masajea 3 min con presión media.\n3. Enjuaga completamente con agua tibia.\n4. El cabello 2C necesita lavado cada 2-3 días máximo para no perder definición.\n5. Usa siempre acondicionador después." },
  { id:17, cat:"2C", step:"Definición",  emoji:"〜", hue:195, tag:"-25%",        name:"Mousse Definidora Ondas 2C",        desc:"Mousse de fijación media que define las ondas 2C con bounce y sin crunch.",                   sq:"mousse defining curl wavy 2c hold",           howTo:"1. Aplica en cabello muy húmedo la cantidad de una naranja en palma.\n2. Escruncha hacia arriba en secciones.\n3. Crea el \"cast\" (costra) — es normal, se disuelve al secar.\n4. Difusor a temperatura media hasta secar completamente.\n5. Disuelve el cast con las palmas para revelar las ondas." },
  { id:18, cat:"2C", step:"Tratamiento", emoji:"💎", hue:197, tag:"Nuevo",       name:"Proteína Ligera Ondas 2C",          desc:"Tratamiento proteico ligero para ondas 2C propensas a la rotura y pérdida de definición.",    sq:"light protein treatment wavy 2c curl",        howTo:"1. Aplica tras el shampoo en cabello húmedo.\n2. Deja actuar 5 min sin calor.\n3. Enjuaga con agua fría.\n4. Usa obligatoriamente acondicionador hidratante después para equilibrar.\n5. Máximo 1 vez cada 2 semanas — el exceso endurece las ondas." },
  // ─── RIZADO 3A ───
  { id:19, cat:"3A", step:"Limpieza",    emoji:"🌀", hue:275, tag:"Bestseller",  name:"Shampoo Suave Rizos 3A",            desc:"Limpia sin sulfatos preservando la definición y elasticidad de los rizos grandes 3A.",        sq:"sulfate free shampoo curly 3a big curls",     howTo:"1. Aplica en cuero cabelludo con masaje circular 2 min.\n2. No frotar los largos rizados — el frizz empieza aquí.\n3. Enjuaga suavemente con agua tibia.\n4. Finaliza con agua fría para cerrar la cutícula.\n5. Lava 2-3 veces/semana máximo para no resecar los rizos 3A." },
  { id:20, cat:"3A", step:"Acondicionador",emoji:"💧",hue:278,tag:"-24%",        name:"Acondicionador Rizos Brillantes 3A",desc:"Hidratación media que define y da brillo espejo a los rizos amplios 3A.",                   sq:"conditioner curly 3a shine definition",       howTo:"1. Aplica abundantemente de medios a puntas.\n2. Peina con peine de dientes anchos dentro del baño.\n3. Deja actuar 5 min.\n4. Enjuaga parcialmente (cold water rinse) para conservar algo de producto.\n5. Define inmediatamente mientras el cabello está chorreando." },
  { id:21, cat:"3A", step:"Definición",  emoji:"🌀", hue:282, tag:"Nuevo",       name:"Gel Definidor Rizos 3A",            desc:"Gel fijación media que define los rizos 3A con bounce y brillo natural sin rigidez.",          sq:"defining gel curly 3a hold bounce",           howTo:"1. Aplica en cabello muy húmedo en secciones.\n2. Usa la técnica \"praying hands\" + escrunching.\n3. No separar los rizos mientras secan.\n4. Difusor a temperatura baja-media hasta secar.\n5. Disuelve el cast solo cuando esté 100% seco." },
  { id:22, cat:"3A", step:"Mascarilla",  emoji:"🍯", hue:285, tag:"-22%",        name:"Mascarilla Hidratante 3A Semanal",  desc:"Hidratación profunda semanal para mantener los rizos 3A elásticos, brillantes y sin rotura.", sq:"deep conditioning mask curly 3a weekly",      howTo:"1. Aplica tras el shampoo en cabello húmedo por secciones.\n2. Usa pinzas para dividir y cubrir bien cada rizo.\n3. Gorro de ducha + calor 20 min.\n4. Enjuaga con agua fría.\n5. Define inmediatamente — no dejar secar sin producto." },
  // ─── RIZADO 3B ───
  { id:23, cat:"3B", step:"Limpieza",    emoji:"🌀", hue:288, tag:"Bestseller",  name:"Co-Wash Nutritivo 3B",              desc:"Limpieza con acondicionador que preserva los aceites naturales de los rizos 3B densos.",      sq:"co wash moisturizing curly 3b dense",         howTo:"1. Aplica en cuero cabelludo y masajea bien.\n2. Distribuye por todos los rizos.\n3. Deja actuar 3 min.\n4. Enjuaga completamente.\n5. Alterna con shampoo clarificante sin sulfatos 1 vez al mes para limpiar la acumulación de productos." },
  { id:24, cat:"3B", step:"Definición",  emoji:"🌀", hue:292, tag:"-26%",        name:"Crema + Gel Definidor 3B",          desc:"Combinación de crema hidratante y gel fijador para rizos 3B bien definidos todo el día.",      sq:"curl cream gel combination 3b curly medium",  howTo:"1. Aplica crema primero en cabello húmedo por secciones.\n2. Sella con gel encima sin enjuagar la crema.\n3. Técnica \"Squish to Condish\" para máxima definición.\n4. Difusor a temperatura baja hasta secar completamente.\n5. No tocar hasta que esté 100% seco." },
  { id:25, cat:"3B", step:"Aceite",      emoji:"🌿", hue:295, tag:"Nuevo",       name:"Aceite Sellante Rizos 3B",          desc:"Aceite de jojoba y argán que sella la humedad en los rizos 3B y previene el frizz ambiental.", sq:"sealing hair oil jojoba argan curly 3b",      howTo:"1. Aplica como último paso de la rutina en cabello húmedo.\n2. Solo 2-3 gotas de medios a puntas.\n3. No aplicar en raíz.\n4. Sirve para el método LOC (Liquid, Oil, Cream).\n5. Úsalo también en seco en las puntas para prevenir la rotura." },
  // ─── RIZADO 3C ───
  { id:26, cat:"3C", step:"Limpieza",    emoji:"🌀", hue:300, tag:"Bestseller",  name:"Shampoo Hidratante Rizos 3C",       desc:"Limpieza profunda sin sulfatos para los rizos apretados 3C que necesitan máxima hidratación.", sq:"moisturizing shampoo tight curls 3c",         howTo:"1. Divide el cabello en 4 secciones antes de lavar.\n2. Aplica en cada sección del cuero cabelludo.\n3. Masajea con presión media 3 min.\n4. Enjuaga sección por sección.\n5. El 3C se enreda fácil — nunca frotes con toalla, usa una camiseta de algodón." },
  { id:27, cat:"3C", step:"Hidratación", emoji:"💦", hue:303, tag:"-27%",        name:"Deep Conditioner 3C Intenso",       desc:"Acondicionador profundo que hidrata y define los rizos apretados 3C con elasticidad real.",   sq:"deep conditioner moisturizing tight curls 3c", howTo:"1. Aplica abundantemente tras el shampoo.\n2. Peina con peine de dientes anchos en cada sección.\n3. Gorro de ducha + calor 30 min para máxima penetración.\n4. Enjuaga con agua fría.\n5. Define inmediatamente — el 3C pierde humedad rápidamente." },
  { id:28, cat:"3C", step:"Definición",  emoji:"🌀", hue:306, tag:"Nuevo",       name:"Manteca Defini
