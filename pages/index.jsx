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
  { id:28, cat:"3C", step:"Definición",  emoji:"🌀", hue:306, tag:"Nuevo",       name:"Manteca Definidora Rizos 3C",       desc:"Manteca ligera que define y separa los rizos 3C apretados con fijación y suavidad.",          sq:"butter curl definer tight 3c springy",        howTo:"1. Aplica en secciones muy pequeñas sobre cabello muy húmedo.\n2. Distribuye de raíz a puntas con cuidado.\n3. Usa el método \"rake and shake\" para definir cada rizo.\n4. Seca con difusor a temperatura baja.\n5. Finaliza con un poco de aceite en las puntas para sellar." },
  // ─── AFRO 4A ───
  { id:29, cat:"4A", step:"Limpieza",    emoji:"✦",  hue:30,  tag:"Bestseller",  name:"Shampoo Hidratante Coils 4A",       desc:"Limpieza sin sulfatos que preserva la hidratación de los coils definidos 4A.",               sq:"sulfate free shampoo 4a coils hydrating",     howTo:"1. Divide en 4 secciones bien definidas con pinzas.\n2. Aplica en cuero cabelludo de cada sección.\n3. Masajea con yemas 3-4 min por sección.\n4. Enjuaga bien con agua tibia.\n5. El 4A se lava máximo 1-2 veces por semana para no perder hidratación." },
  { id:30, cat:"4A", step:"Hidratación", emoji:"💧", hue:33,  tag:"-25%",        name:"Acondicionador Profundo 4A",        desc:"Hidratación intensiva para los coils 4A. Método LOC recomendado tras la aplicación.",        sq:"deep conditioner 4a coils LOC method",        howTo:"1. Aplica generosamente sobre el cabello húmedo sección por sección.\n2. Peina con peine de dientes anchos de puntas a raíz.\n3. Gorro de ducha + calor 30-45 min.\n4. Enjuaga completamente con agua fría.\n5. Aplica inmediatamente leave-in para iniciar el método LOC." },
  { id:31, cat:"4A", step:"Definición",  emoji:"✦",  hue:36,  tag:"Nuevo",       name:"Crema Curl Definer 4A",             desc:"Crema de definición para coils 4A que aporta forma, brillo y fijación sin rigidez.",          sq:"curl definer cream 4a coily defined",         howTo:"1. Divide en secciones pequeñas.\n2. Aplica sobre cabello húmedo con técnica \"shingling\" (aplica y estira cada coil individualmente).\n3. No separar los coils mientras secan.\n4. Seca con difusor o al aire cubierto con un gorro de seda.\n5. Deshidrata los coils con aceite al día siguiente para el segundo día." },
  // ─── AFRO 4B ───
  { id:32, cat:"4B", step:"Limpieza",    emoji:"✦",  hue:25,  tag:"Bestseller",  name:"Co-Wash Nutritivo 4B Zigzag",       desc:"Co-wash ultra nutritivo para el patrón 4B en zigzag que pierde hidratación muy rápido.",     sq:"co wash moisturizing 4b zigzag natural hair",  howTo:"1. Divide en 8-10 secciones pequeñas.\n2. Aplica en cada sección y masajea bien.\n3. No frotar — solo presionar y distribuir.\n4. Enjuaga sección por sección.\n5. Alterna con shampoo suave cada 2-3 co-wash para limpiar bien el cuero cabelludo." },
  { id:33, cat:"4B", step:"Hidratación", emoji:"🍯", hue:28,  tag:"-28%",        name:"Manteca Karité Pura 4B",            desc:"Manteca de karité sin refinar que hidrata profundamente el cabello 4B más frágil.",           sq:"shea butter raw unrefined 4b natural hair",   howTo:"1. Calienta una pequeña cantidad entre las palmas hasta que se funda.\n2. Aplica sobre cabello húmedo sección a sección.\n3. Úsala como parte del método LOC: después del leave-in y antes de la crema.\n4. También sirve como pre-poo la noche antes de lavar.\n5. Nunca sobre cabello completamente seco — aplasta los coils." },
  { id:34, cat:"4B", step:"Peinado",     emoji:"🌻", hue:31,  tag:"Nuevo",       name:"Crema Twist para 4B",               desc:"Crema específica para twists en cabello 4B. Define, protege y da durabilidad al peinado.",    sq:"twist cream 4b protective style natural",     howTo:"1. Aplica sobre cabello húmedo completamente hidratado.\n2. Divide en secciones y aplica la crema uniformemente.\n3. Tuerce cada sección firmemente desde raíz a puntas.\n4. Deja secar completamente antes de soltar.\n5. Deshace con aceite en los dedos para evitar el frizz." },
  // ─── AFRO 4C ───
  { id:35, cat:"4C", step:"Hidratación", emoji:"✦",  hue:20,  tag:"Bestseller",  name:"Deep Moisture Treatment 4C",        desc:"Tratamiento de hidratación máxima para el cabello 4C más frágil y con mayor contracción.",    sq:"deep moisture treatment 4c ultra dry natural", howTo:"1. Divide en 10-12 secciones muy pequeñas.\n2. Aplica generosamente sobre cada sección mojada.\n3. Cubre con gorro de ducha y aplica calor 45 min para máxima penetración.\n4. Enjuaga con agua fría.\n5. Aplica leave-in inmediatamente — el 4C pierde el 70-75% de su longitud cuando seca." },
  { id:36, cat:"4C", step:"Aceite",      emoji:"🫒", hue:22,  tag:"-28%",        name:"Mezcla de Aceites 4C Máxima Nutrición",desc:"Argán + ricino + jojoba para sellar la humedad en el cabello 4C ultra seco.",            sq:"hair oil blend castor argan jojoba 4c seal",  howTo:"1. Mezcla los aceites en las palmas calentando con las manos.\n2. Aplica en el cuero cabelludo con masaje circular 5 min — estimula el crecimiento.\n3. Distribuye por todos los largos sección a sección.\n4. Úsalo como pre-poo la noche antes del lavado.\n5. También como sellante final en el método LOC o LOCO." },
  { id:37, cat:"4C", step:"Peinado",     emoji:"⚡", hue:24,  tag:"Nuevo",       name:"Crema Bantu Knots y Twist 4C",      desc:"Crema de máxima fijación para bantu knots, twists y wash & go en el 4C más apretado.",       sq:"twist cream bantu knots 4c maximum hold",     howTo:"1. Aplica sobre cabello muy húmedo bien hidratado.\n2. Divide en secciones muy pequeñas para mayor definición.\n3. Aplica crema en cada sección con \"shingling\" detallado.\n4. Haz el peinado elegido (twist, bantu knot, etc).\n5. Cubre con gorro de seda por la noche para conservar el estilo." },
  { id:38, cat:"4C", step:"Tratamiento", emoji:"🌱", hue:26,  tag:"-25%",        name:"Tratamiento Proteína + Hidratación 4C",desc:"Balance perfecto proteína-humedad para el 4C propenso a la rotura y daño extremo.",       sq:"protein moisture balance treatment 4c repair", howTo:"1. Aplica en cabello limpio y húmedo por secciones.\n2. Asegúrate de cubrir cada hebra.\n3. Calor 20-25 min con gorro.\n4. Enjuaga completamente.\n5. SIEMPRE sigue con hidratación intensa — la proteína sin humedad hace el 4C aún más frágil." },
  // ─── CASPA ───
  { id:39, cat:"caspa", step:"Shampoo",    emoji:"❄️", hue:210, tag:"Bestseller", name:"Shampoo Anti-Caspa Zinc Activo",    desc:"Piritionato de zinc y ketoconazol que eliminan la caspa de forma visible desde la primera semana.",sq:"anti dandruff shampoo zinc pyrithione ketoconazole",howTo:"1. Aplica en cuero cabelludo mojado.\n2. Masajea 3-5 min para que el zinc actúe.\n3. Deja actuar 2 min adicionales.\n4. Enjuaga completamente.\n5. Úsalo 3 veces/semana las primeras 4 semanas, luego 1-2 veces." },
  { id:40, cat:"caspa", step:"Sérum",      emoji:"🧴", hue:205, tag:"-22%",       name:"Sérum Anti-Hongo Cuero",            desc:"Ácido salicílico y árbol de té que eliminan la caspa y calman la irritación del cuero.",     sq:"scalp serum dandruff salicylic acid tea tree", howTo:"1. Aplica directamente en cuero cabelludo seco con el dosificador.\n2. Masajea con yemas 5 min.\n3. No enjuagar.\n4. Aplica cada noche.\n5. Si en 4 semanas no mejora, consulta a un dermatólogo." },
  { id:41, cat:"caspa", step:"Mascarilla", emoji:"🌿", hue:195, tag:"Nuevo",      name:"Mascarilla Calmante Anti-Caspa",    desc:"Arcilla blanca y aloe vera que calman el picor y reducen la descamación del cuero.",        sq:"scalp mask dandruff soothing clay aloe vera",  howTo:"1. Aplica en cuero cabelludo seco o levemente húmedo.\n2. Masajea suave 3 min.\n3. Deja actuar 20 min.\n4. Enjuaga con agua tibia y sigue con shampoo anti-caspa.\n5. Usa 1 vez/semana." },
  { id:42, cat:"caspa", step:"Tónico",     emoji:"💧", hue:200, tag:"-20%",       name:"Tónico Probiótico Anti-Caspa",      desc:"Probióticos que reequilibran la microbiota del cuero eliminando la caspa desde la raíz.",    sq:"probiotic scalp tonic dandruff microbiome",    howTo:"1. Agita bien el frasco.\n2. Aplica en secciones directamente en el cuero cabelludo.\n3. Masajea 3 min.\n4. No enjuagar.\n5. Aplica diariamente después del lavado durante el mes de tratamiento." },
  // ─── CAÍDA ───
  { id:43, cat:"caida", step:"Tónico",     emoji:"🍂", hue:90,  tag:"Bestseller", name:"Tónico Anticaída Biotina + Cafeína",desc:"Cafeína y biotina que estimulan el folículo, reducen la caída y densifican el cabello.",     sq:"hair loss tonic biotin caffeine minoxidil",    howTo:"1. Aplica directamente en zonas de mayor caída.\n2. Masajea en círculos 5 min para activar microcirculación.\n3. No enjuagar.\n4. Aplica cada noche antes de dormir.\n5. Resultados visibles entre las 8-12 semanas de uso constante." },
  { id:44, cat:"caida", step:"Shampoo",    emoji:"🌿", hue:95,  tag:"-24%",       name:"Shampoo Densificador Anti-Caída",  desc:"Taurina y bambú que fortalecen el cabello desde la raíz y reducen la caída visible.",        sq:"hair loss shampoo thickening caffeine taurine", howTo:"1. Aplica en cuero cabelludo mojado.\n2. Masajea 3 min con presión media.\n3. Deja actuar 2 min.\n4. Enjuaga completamente.\n5. Úsalo en cada lavado para resultados acumulativos." },
  { id:45, cat:"caida", step:"Vitaminas",  emoji:"💊", hue:100, tag:"-18%",       name:"Vitaminas Cabello Fuerza Total",    desc:"Biotina, zinc, vitamina D y hierro en cápsula diaria para cabello fuerte desde adentro.",    sq:"hair vitamins biotin zinc vitamin D supplement",howTo:"1. Toma 1 cápsula al día con el desayuno.\n2. Acompaña con agua abundante.\n3. No superar la dosis indicada.\n4. Efectos visibles en 60-90 días de uso continuo.\n5. Consulta a tu médico si tomas medicación." },
  // ─── CUERO CABELLUDO ───
  { id:46, cat:"cuero", step:"Exfoliante", emoji:"🔬", hue:160, tag:"Bestseller", name:"Exfoliante Cuero Cabelludo",        desc:"Scrub de azúcar y ácido glicólico que elimina células muertas y producto acumulado.",        sq:"scalp scrub exfoliant glycolic acid sugar",    howTo:"1. Aplica en cuero cabelludo mojado antes del shampoo.\n2. Masajea en círculos suaves 3-5 min.\n3. Deja actuar 2 min.\n4. Enjuaga bien y sigue con shampoo.\n5. Usa 1 vez/semana. Nunca a diario para no irritar." },
  { id:47, cat:"cuero", step:"Sérum",      emoji:"🧬", hue:165, tag:"-21%",       name:"Sérum Equilibrante Microbiota",     desc:"Prebióticos y niacinamida que equilibran la microbiota, reducen la grasa y el picor.",        sq:"scalp serum microbiome prebiotic niacinamide",  howTo:"1. Aplica en cuero cabelludo seco por secciones.\n2. Masajea con yemas 3 min.\n3. No enjuagar.\n4. Aplica mañana o noche.\n5. Compatible con cualquier rutina capilar." },
  { id:48, cat:"cuero", step:"Aceite",     emoji:"🌾", hue:170, tag:"Nuevo",      name:"Aceite Calmante Cuero Sensible",    desc:"Aceite de semilla de uva y lavanda que calma el cuero irritado y reduce el enrojecimiento.",  sq:"scalp oil sensitive soothing lavender grapeseed",howTo:"1. Calienta 4-5 gotas en las palmas.\n2. Aplica directamente en el cuero cabelludo.\n3. Masajea en círculos y luego longitudinales 5 min.\n4. Deja actuar 1 hora o toda la noche.\n5. Lava normalmente al día siguiente." },
  // ─── REGENERACIÓN ───
  { id:49, cat:"regenerar", step:"Mascarilla", emoji:"🌱", hue:120, tag:"Bestseller", name:"Mascarilla Renacimiento Capilar", desc:"Aceite de ricino, argán y mango que regenera el cabello más dañado desde la fibra.",          sq:"hair regenerating mask castor argan mango",    howTo:"1. Aplica generosamente en cabello limpio y húmedo de raíz a puntas.\n2. Divide en secciones para cubrir bien.\n3. Gorro + calor 25-30 min.\n4. Enjuaga con agua fría.\n5. Úsala 2 veces/semana las primeras 4 semanas para resultados dramáticos." },
  { id:50, cat:"regenerar", step:"Ampolla",    emoji:"⚗️", hue:125, tag:"-28%",       name:"Ampolla Queratina + Colágeno",   desc:"Queratina y colágeno marino que reconstruyen la fibra capilar en 1 solo uso visible.",          sq:"hair ampoule keratin collagen marine repair",  howTo:"1. Aplica el contenido completo en cabello húmedo.\n2. Masajea bien 3 min cubriendo toda la longitud.\n3. Calor 10 min.\n4. Enjuaga completamente.\n5. Úsala 1 vez/semana. Para muy dañado: 2 veces las primeras 3 semanas." },
  { id:51, cat:"regenerar", step:"Sérum",      emoji:"💎", hue:130, tag:"Nuevo",       name:"Sérum Reparador Puntas Abiertas", desc:"Silicona vegetal y argán que sellan las puntas abiertas y previenen la rotura diaria.",         sq:"split ends repair serum silicone free",        howTo:"1. Aplica 1-2 gotas solo en las puntas del cabello seco.\n2. No enjuagar.\n3. No aplicar en raíz.\n4. Úsalo a diario como último paso de tu rutina.\n5. Retrasa la necesidad de cortarte las puntas." },
  // ─── HOMBRE ───
  { id:52, cat:"hombre", step:"Limpieza",   emoji:"💪", hue:220, tag:"Bestseller", name:"2-en-1 Hombre Active Fresh",       desc:"Shampoo + acondicionador para hombres activos. Limpia, fortalece y da frescura duradera.",    sq:"2 in 1 shampoo conditioner men active fresh",  howTo:"1. Aplica en cabello mojado.\n2. Masajea con fuerza 2-3 min.\n3. Distribuye por los largos.\n4. Deja actuar 1 min como acondicionador.\n5. Enjuaga completamente." },
  { id:53, cat:"hombre", step:"Estilizado", emoji:"🪮", hue:215, tag:"Nuevo",      name:"Pomada Texturizadora Matt",         desc:"Fijación media con acabado mate natural. Para cualquier estilo masculino sin brillo artificial.", sq:"matte pomade men hair styling medium hold",  howTo:"1. Toma una cantidad del tamaño de una moneda.\n2. Calienta entre las palmas.\n3. Aplica en cabello seco o levemente húmedo.\n4. Modela con los dedos.\n5. Añade más para mayor fijación." },
  { id:54, cat:"hombre", step:"Anticaída",  emoji:"⚡", hue:210, tag:"-20%",       name:"Tónico Anticaída Men Forte",        desc:"Cafeína, saw palmetto y zinc para frenar la caída masculina y densificar el cabello.",         sq:"hair loss tonic men caffeine saw palmetto zinc",howTo:"1. Aplica en zonas de menor densidad.\n2. Masajea en círculos 5 min.\n3. No enjuagar.\n4. Aplica cada noche.\n5. Resultados visibles en 8-16 semanas de constancia." },
];

/* ══════════════════════════════════════════════
   QUIZ
══════════════════════════════════════════════ */
const QUESTIONS = [
  { id:"gender",   icon:"🌍", q:"¿Con qué género te identificas?",
    opts:[{l:"Mujer",v:"mujer",i:"👩"},{l:"Hombre",v:"hombre",i:"👨"},{l:"No binario / Prefiero no decir",v:"neutro",i:"🧑"}]},
  { id:"group",    icon:"〰️", q:"¿Cuál es el grupo general de tu cabello?",
    opts:[{l:"Lacio — completamente recto",v:"lacio",i:"〰️"},{l:"Ondulado — ondas suaves o en S",v:"ondulado",i:"〜"},{l:"Rizado — rizos definidos",v:"rizado",i:"🌀"},{l:"Afro / Coily — espiral muy apretado",v:"afro",i:"✦"}]},
  { id:"subtype",  icon:"🔎", q:"¿Cuál describe mejor TU tipo específico?",
    opts:[] }, // dinámico
  { id:"scalp",    icon:"🔬", q:"¿Tienes alguna preocupación con tu cuero cabelludo?",
    opts:[{l:"Caspa o descamación visible",v:"caspa",i:"❄️"},{l:"Cuero graso o con picazón",v:"graso",i:"🍃"},{l:"Cuero sensible o irritado",v:"sensible",i:"🌸"},{l:"Mi cuero cabelludo está bien",v:"normal",i:"✅"}]},
  { id:"concern",  icon:"🎯", q:"¿Cuál es tu mayor preocupación capilar?",
    opts:[{l:"Caída excesiva o cabello que adelgaza",v:"caida",i:"🍂"},{l:"Frizz y volumen descontrolado",v:"frizz",i:"⚡"},{l:"Cabello dañado que necesita regenerarse",v:"dano",i:"💔"},{l:"Falta de brillo, hidratación y vitalidad",v:"brillo",i:"✨"}]},
  { id:"damage",   icon:"🧪", q:"¿Tu cabello ha recibido tratamientos?",
    opts:[{l:"Tinte, balayage o decoloración",v:"tinte",i:"🎨"},{l:"Alisado, permanente o keratina",v:"quimico",i:"🧴"},{l:"Calor frecuente — plancha, secador",v:"calor",i:"🔥"},{l:"Cabello virgen y natural",v:"virgen",i:"🌱"}]},
];

const SUBTYPES = {
  lacio:   [{l:"1A — Ultrafino, muy liso, sin volumen",v:"1A",i:"〰️"},{l:"1B — Liso normal con algo de cuerpo",v:"1B",i:"〰️"},{l:"1C — Liso grueso con volumen alto",v:"1C",i:"〰️"}],
  ondulado:[{l:"2A — Ondas muy suaves al final",v:"2A",i:"〜"},{l:"2B — Ondas medianas desde la raíz",v:"2B",i:"〜"},{l:"2C — Ondas pronunciadas casi rizos",v:"2C",i:"〜"}],
  rizado:  [{l:"3A — Rizos grandes y brillantes",v:"3A",i:"🌀"},{l:"3B — Rizos medianos y densos",v:"3B",i:"🌀"},{l:"3C — Rizos apretados tipo lápiz",v:"3C",i:"🌀"}],
  afro:    [{l:"4A — Coils suaves en forma de S",v:"4A",i:"✦"},{l:"4B — Coils en zigzag, muy frágil",v:"4B",i:"✦"},{l:"4C — Coils ultra apretados, máxima contracción",v:"4C",i:"✦"}],
};

/* ══════════════════════════════════════════════
   GLOBAL CSS
══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Outfit',sans-serif;background:#FBF7F0;color:#1A1208;overflow-x:hidden;}
.fade{animation:fadeUp .45s ease both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.spin{animation:rot 2s linear infinite;display:inline-block;}
@keyframes rot{to{transform:rotate(360deg)}}
.lift{transition:transform .25s,box-shadow .25s;}
.lift:hover{transform:translateY(-5px);box-shadow:0 14px 42px rgba(184,118,42,.18);}
.sl{transition:transform .18s,box-shadow .18s;}
.sl:hover{transform:translateY(-2px);box-shadow:0 5px 16px rgba(0,0,0,.1);}
button:active{transform:scale(.97);}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-thumb{background:rgba(184,118,42,.3);border-radius:3px;}
`;

/* ══════════════════════════════════════════════
   FALLBACK
══════════════════════════════════════════════ */
function fallback(a){
  return {
    hairType: a.subtype || a.group || "2B",
    condition:"normal", scalp: a.scalp||"normal",
    title:"Tu Cabello Es Tu Identidad",
    summary:"Cada hebra de tu cabello cuenta tu historia. Con la rutina adecuada, lo harás brillar con todo su potencial natural.",
    score:{hidratacion:7,fuerza:6,brillo:7,salud_cuero:7},
    products:[
      {order:1,step:"Limpieza",name:"Shampoo suave sin sulfatos",sq:"gentle sulfate free shampoo",why:"Limpia sin agredir la fibra capilar ni el cuero cabelludo.",howToApply:"1. Aplica en cuero cabelludo mojado.\n2. Masajea 2 min con yemas.\n3. Deja resbalar por los largos.\n4. Enjuaga con agua fría.",freq:"2-3 veces/semana",tip:"Termina siempre con agua fría para cerrar la cutícula.",avoid:"Agua muy caliente — abre la cutícula y genera frizz."},
      {order:2,step:"Acondicionado",name:"Acondicionador hidratante profundo",sq:"moisturizing deep conditioner",why:"Repone la humedad perdida durante el lavado.",howToApply:"1. Aplica de medios a puntas.\n2. Peina con peine de dientes anchos.\n3. Deja actuar 5 min.\n4. Enjuaga con agua fría.",freq:"Cada lavado",tip:"Aplica con el cabello chorreando para mejor distribución.",avoid:"Aplicar en raíz — apelmaza y da aspecto graso."},
      {order:3,step:"Tratamiento semanal",name:"Mascarilla nutritiva reparadora",sq:"weekly hair mask repair nourishing",why:"Repone los nutrientes que el ambiente y el estilizado roba.",howToApply:"1. Aplica en cabello limpio y húmedo.\n2. Gorro de ducha + calor 15-20 min.\n3. Enjuaga con agua fría.",freq:"1 vez/semana",tip:"Úsala la noche anterior a una ocasión especial.",avoid:"Dejar demasiado tiempo en cabello con muchas proteínas."},
      {order:4,step:"Leave-in y definición",name:"Leave-in sin aclarado",sq:"leave in conditioner all hair types",why:"Protege de factores externos y define sin aclarado.",howToApply:"1. Aplica en cabello húmedo en secciones.\n2. De raíz a puntas.\n3. No enjuagar.\n4. Define y estila como desees.",freq:"Cada lavado",tip:"Aplica antes del difusor para protección térmica natural.",avoid:"Exceso de producto — puede apelmazar."},
      {order:5,step:"Sellado y protección",name:"Aceite finalizador ligero",sq:"lightweight hair finishing oil shine",why:"Sella la cutícula, aporta brillo y protege las puntas.",howToApply:"1. 1-2 gotas en palmas.\n2. Aplica solo en puntas.\n3. No aplicar en raíz.",freq:"A diario",tip:"Menos es más — empieza con 1 gota.",avoid:"Raíz o cuero cabelludo — causará aspecto graso."},
    ],
    weeklyRoutine:["Días 1-2: Lavado completo — shampoo, acondicionador, leave-in y definidor","Días 3-4: Refrescar con agua + leave-in","Días 5-6: Mascarilla nutritiva + aceite en puntas","Día 7: Descanso — recoge suavemente con accesorios sin metal"],
    ingredients:{buscar:["Manteca de karité","Aloe vera","Pantenol","Aceite de argán","Biotina"],evitar:["Sulfatos SLS/SLES","Alcohol desnaturalizado","Siliconas no solubles","Parabenos"]},
    lifestyle:["Duerme en funda de seda para reducir el frizz nocturno","Bebe 2 litros de agua al día","Masajea el cuero cabelludo 5 min diarios para activar el crecimiento"],
  };
}

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
export default function LuMane(){
  const [page,setPage]           = useState("home");
  const [step,setStep]           = useState(0);
  const [answers,setAnswers]     = useState({});
  const [result,setResult]       = useState(null);
  const [loading,setLoading]     = useState(false);
  const [stores,setStores]       = useState(STORES_DEFAULT);
  const [showStores,setShowStores]=useState(false);
  const [expanded,setExpanded]   = useState(null);
  const [shopFilter,setShopFilter]=useState("all");
  const [filterGroup,setFilterGroup]=useState(null);
  const [toast,setToast]         = useState(null);

  const activeStores = Object.entries(stores).filter(([,s])=>s.active);
  const showToast = m=>{setToast(m);setTimeout(()=>setToast(null),2500);};
  const goQuiz = ()=>{setStep(0);setAnswers({});setResult(null);setPage("quiz");};

  // Dynamic subtype options
  function getOpts(idx){
    if(idx===2) return SUBTYPES[answers.group]||[];
    return QUESTIONS[idx].opts;
  }

  function handleAnswer(qId,val){
    const next={...answers,[qId]:val};
    setAnswers(next);
    let nextStep=step+1;
    // skip subtype if no group yet
    if(nextStep===2 && !SUBTYPES[next.group]) nextStep=3;
    if(nextStep<QUESTIONS.length) setStep(nextStep);
    else runAI(next);
  }

  async function runAI(ans){
    setLoading(true); setPage("result");
    const prompt=`Eres tricóloga experta e inclusiva. Analiza a este/a cliente:
- Género: ${ans.gender}
- Grupo capilar: ${ans.group}
- Subtipo específico: ${ans.subtype||ans.group}
- Cuero cabelludo: ${ans.scalp}
- Preocupación: ${ans.concern}
- Tratamientos: ${ans.damage}

Genera análisis personalizado. SOLO JSON válido sin texto adicional:
{
  "hairType":"${ans.subtype||ans.group}",
  "condition":"seco|graso|normal|mixto",
  "scalp":"normal|caspa|graso|sensible",
  "title":"Nombre poético específico para este subtipo (máx 5 palabras)",
  "summary":"Descripción cálida y empoderada de 2-3 oraciones sobre este tipo específico de cabello",
  "score":{"hidratacion":0-10,"fuerza":0-10,"brillo":0-10,"salud_cuero":0-10},
  "products":[
    {"order":1,"step":"Limpieza","name":"nombre","sq":"search query english","why":"por qué ideal para ${ans.subtype||ans.group}","howToApply":"instrucciones numeradas detalladas específicas para este tipo","freq":"frecuencia","tip":"truco experto","avoid":"qué evitar"},
    {"order":2,"step":"Acondicionado",...},
    {"order":3,"step":"Tratamiento cuero cabelludo",...},
    {"order":4,"step":"Definición y estilizado",...},
    {"order":5,"step":"Sellado y protección",...}
  ],
  "weeklyRoutine":["Días 1-2: ...","Días 3-4: ...","Días 5-7: ..."],
  "ingredients":{"buscar":["i1","i2","i3","i4","i5"],"evitar":["i1","i2","i3"]},
  "lifestyle":["hábito específico para ${ans.subtype||ans.group} 1","hábito 2","hábito 3"]
}`;
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2500,messages:[{role:"user",content:prompt}]})
      });
      const d=await r.json();
      const txt=d.content.map(b=>b.text||"").join("");
      setResult(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    }catch{setResult(fallback(ans));}
    setLoading(false);
  }

  function openStore(query,key){
    const s=stores[key]; if(!s?.active) return;
    window.open(s.buildUrl(query,s.tag),"_blank","noopener");
    showToast(`Abriendo ${s.name}… 🛍️`);
  }

  function filterProducts(cat){
    if(cat==="all") return SHOP;
    const fc=FILTER_CATS.find(f=>f.id===cat);
    if(fc?.sub) return SHOP.filter(p=>fc.sub.includes(p.cat));
    return SHOP.filter(p=>p.cat===cat);
  }

  // ── STORE PANEL ──
  const StorePanel=()=>(
    <div style={{position:"fixed",inset:0,background:"rgba(26,18,8,.65)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}} onClick={()=>setShowStores(false)}>
      <div style={{background:"#FBF7F0",borderRadius:"1.5rem",padding:"2rem",maxWidth:"460px",width:"100%",boxShadow:"0 30px 80px rgba(0,0,0,.3)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"}}>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:700}}>Tiendas Afiliadas</h2>
          <button onClick={()=>setShowStores(false)} style={{background:"none",border:"none",fontSize:"1.2rem",cursor:"pointer",color:"#999"}}>✕</button>
        </div>
        <p style={{fontSize:"0.78rem",opacity:.55,marginBottom:"1.3rem",lineHeight:1.55}}>Activa las tiendas que quieres mostrar. Reemplaza YOUR_TAG con tu ID de afiliado real para ganar comisiones en cada compra.</p>
        {Object.entries(stores).map(([key,s])=>(
          <div key={key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.8rem 1rem",marginBottom:"0.5rem",background:s.active?`${s.color}12`:"rgba(0,0,0,.03)",borderRadius:"0.8rem",border:`1px solid ${s.active?s.color+"35":"transparent"}`}}>
            <div style={{display:"flex",alignItems:"center",gap:"0.7rem"}}>
              <span style={{fontSize:"1.3rem"}}>{s.emoji}</span>
              <div>
                <div style={{fontWeight:600,fontSize:"0.88rem"}}>{s.name}</div>
                <div style={{fontSize:"0.65rem",opacity:.4,fontFamily:"monospace"}}>{s.tag}</div>
              </div>
            </div>
            <button onClick={()=>setStores(p=>({...p,[key]:{...p[key],active:!p[key].active}}))}
              style={{width:"46px",height:"25px",borderRadius:"13px",border:"none",cursor:"pointer",background:s.active?s.color:"#ddd",position:"relative",flexShrink:0}}>
              <span style={{position:"absolute",top:"2.5px",left:s.active?"23px":"2.5px",width:"20px",height:"20px",background:"#fff",borderRadius:"50%",transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}}/>
            </button>
          </div>
        ))}
        <p style={{fontSize:"0.68rem",opacity:.3,marginTop:"0.8rem",textAlign:"center"}}>Los enlaces de afiliado generan comisión en cada compra.</p>
      </div>
    </div>
  );

  // ── NAV ──
  const Nav=()=>(
    <nav style={{position:"sticky",top:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.85rem 2rem",background:"rgba(251,247,240,.94)",backdropFilter:"blur(14px)",borderBottom:"1px solid rgba(184,118,42,.12)"}}>
      <div onClick={()=>setPage("home")} style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.55rem",fontWeight:700,color:"#B8762A",cursor:"pointer",letterSpacing:"0.08em"}}>✦ LuMane</div>
      <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",alignItems:"center"}}>
        {[{id:"home",l:"Inicio"},{id:"quiz",l:"Analizador IA"},{id:"shop",l:"Tienda"}].map(pg=>(
          <button key={pg.id} onClick={()=>pg.id==="quiz"?goQuiz():setPage(pg.id)}
            style={{background:page===pg.id?"rgba(184,118,42,.1)":"none",border:page===pg.id?"1px solid rgba(184,118,42,.3)":"1px solid transparent",color:"#1A1208",padding:"0.3rem 0.85rem",borderRadius:"2rem",fontSize:"0.78rem",letterSpacing:"0.07em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:500}}>
            {pg.l}
          </button>
        ))}
        <button onClick={()=>setShowStores(true)} style={{background:"#1A1208",color:"#FBF7F0",border:"none",padding:"0.3rem 0.85rem",borderRadius:"2rem",fontSize:"0.78rem",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:500}}>⚙ Tiendas</button>
      </div>
    </nav>
  );

  // ── HOME ──
  const HomePage=()=>(
    <div>
      <div style={{position:"relative",minHeight:"92vh",display:"flex",alignItems:"center",overflow:"hidden",padding:"5rem 3rem 3rem",flexWrap:"wrap",gap:"3rem",justifyContent:"space-between"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 65% 80% at 15% 55%,rgba(212,152,60,.14) 0%,transparent 55%),radial-gradient(ellipse 55% 55% at 85% 25%,rgba(184,118,42,.1) 0%,transparent 50%),#FBF7F0",zIndex:0}}/>
        <div style={{position:"absolute",width:"500px",height:"500px",borderRadius:"50%",border:"1px solid rgba(184,118,42,.07)",top:"-100px",right:"-80px",zIndex:0}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:"580px"}} className="fade">
          <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",background:"rgba(184,118,42,.1)",border:"1px solid rgba(184,118,42,.3)",color:"#B8762A",fontSize:"0.7rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",padding:"0.35rem 1rem",borderRadius:"2rem",marginBottom:"1.5rem"}}>
            <span style={{width:"7px",height:"7px",background:"#B8762A",borderRadius:"50%"}}/>
            Cuidado capilar personalizado con IA
          </div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2.8rem,6.5vw,5rem)",lineHeight:1.02,fontWeight:700,color:"#1A1208",marginBottom:"1.4rem"}}>
            Tu cabello<br/><em style={{fontStyle:"italic",color:"#B8762A"}}>es tu corona.</em><br/>
            <span style={{fontSize:"62%",fontWeight:300,fontStyle:"italic",color:"#4A3018",opacity:.75}}>Y merece lo mejor.</span>
          </h1>
          <div style={{background:"linear-gradient(135deg,rgba(184,118,42,.07),rgba(212,152,60,.11))",border:"1px solid rgba(184,118,42,.2)",borderRadius:"1.3rem",padding:"1.6rem 1.8rem",marginBottom:"2rem",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:"-15px",right:"1rem",fontFamily:"'Cormorant Garamond',serif",fontSize:"6rem",color:"rgba(184,118,42,.06)",lineHeight:1,pointerEvents:"none"}}>✦</div>
            <p style={{fontSize:"1.05rem",lineHeight:1.8,color:"#2A1A0A",fontWeight:400,marginBottom:"0.9rem"}}>
              <strong style={{fontWeight:700,color:"#B8762A"}}>Sin importar tu raza, tu género ni tu textura</strong> — en LuMane creemos que cada cabello del mundo merece cuidado real, amor genuino y los mejores productos.
            </p>
            <p style={{fontSize:"0.93rem",lineHeight:1.75,color:"#4A3018",fontWeight:300}}>
              Desde coils 4C hasta lacio 1A, desde ondas 2A hasta rizos 3C — cubrimos los <strong style={{fontWeight:600}}>12 tipos de cabello</strong> con rutinas, productos específicos e instrucciones paso a paso. <em>Tu cabello tiene nombre, y tiene solución.</em>
            </p>
          </div>
          <div style={{display:"flex",gap:"0.8rem",flexWrap:"wrap"}}>
            <button onClick={goQuiz} style={{background:"linear-gradient(135deg,#B8762A,#D4983C)",color:"#fff",border:"none",padding:"0.95rem 2.2rem",borderRadius:"3rem",fontSize:"0.97rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",boxShadow:"0 8px 28px rgba(184,118,42,.35)"}}
              onMouseOver={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 14px 38px rgba(184,118,42,.45)"}}
              onMouseOut={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 8px 28px rgba(184,118,42,.35)"}}>
              ✨ Descubrir mi rutina
            </button>
            <button onClick={()=>setPage("shop")} style={{background:"transparent",color:"#B8762A",border:"1.5px solid rgba(184,118,42,.4)",padding:"0.95rem 2.2rem",borderRadius:"3rem",fontSize:"0.97rem",cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Ver productos →</button>
          </div>
          <div style={{display:"flex",gap:"2.5rem",marginTop:"2.5rem",flexWrap:"wrap"}}>
            {[{n:"54+",l:"Productos"},{n:"12",l:"Tipos de cabello"},{n:"1A–4C",l:"Cobertura completa"}].map(s=>(
              <div key={s.n}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.2rem",fontWeight:700,color:"#B8762A",lineHeight:1}}>{s.n}</div>
                <div style={{fontSize:"0.68rem",textTransform:"uppercase",letterSpacing:"0.1em",opacity:.5,marginTop:"0.2rem"}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* TYPE GRID */}
        <div style={{position:"relative",zIndex:1,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.7rem",maxWidth:"380px"}}>
          {HAIR_SYSTEM.map((t,i)=>(
            <div key={t.id} className="lift" onClick={()=>{setPage("shop");setShopFilter(t.id);}}
              style={{padding:"0.9rem 0.7rem",borderRadius:"0.9rem",background:`hsl(${t.hue},38%,93%)`,border:`1px solid hsl(${t.hue},32%,82%)`,textAlign:"center",cursor:"pointer"}}>
              <div style={{fontSize:"1.4rem",marginBottom:"0.25rem"}}>{t.emoji}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"0.85rem",fontWeight:700,color:`hsl(${t.hue},55%,30%)`}}>{t.id}</div>
              <div style={{fontSize:"0.6rem",opacity:.55,marginTop:"0.1rem",lineHeight:1.3}}>{t.group}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TYPE GUIDE */}
      <div style={{padding:"4rem 2.5rem",background:"#F4EDE0"}}>
        <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
          <div style={{fontSize:"0.68rem",color:"#B8762A",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.5rem"}}>✦ Guía completa</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,4vw,2.8rem)",fontWeight:700,lineHeight:1.15}}>
            Los 12 tipos de cabello<br/><em style={{fontStyle:"italic",color:"#B8762A"}}>explicados para ti</em>
          </h2>
        </div>
        {[
          {group:"lacio",label:"Lacio",emoji:"〰️",color:"#B8924A",types:["1A","1B","1C"],desc:"El cabello lacio va del más fino y graso (1A) hasta el más grueso y voluminoso (1C). Cada subtipo necesita un cuidado muy diferente."},
          {group:"ondulado",label:"Ondulado",emoji:"〜",color:"#5A9C90",types:["2A","2B","2C"],desc:"Las ondas van de suaves y casi imperceptibles (2A) hasta pronunciadas y casi rizadas (2C). La clave es definición sin pesar."},
          {group:"rizado",label:"Rizado",emoji:"🌀",color:"#8A60B8",types:["3A","3B","3C"],desc:"Los rizos van de amplios y brillantes (3A) hasta apretados tipo lápiz (3C). Todos necesitan hidratación, pero en cantidades muy distintas."},
          {group:"afro",label:"Afro / Coily",emoji:"✦",color:"#B86830",types:["4A","4B","4C"],desc:"Los coils van de suaves en S (4A) hasta ultra apretados con 75% de contracción (4C). Son los más frágiles y necesitan la mayor nutrición."},
        ].map(g=>(
          <div key={g.group} style={{background:"#FBF7F0",borderRadius:"1.3rem",padding:"1.5rem 2rem",marginBottom:"1rem",border:`1px solid ${g.color}25`}}>
            <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1rem",flexWrap:"wrap"}}>
              <span style={{fontSize:"2rem"}}>{g.emoji}</span>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:700,color:g.color}}>{g.label}</h3>
              <div style={{display:"flex",gap:"0.4rem"}}>
                {g.types.map(t=>(
                  <button key={t} onClick={()=>{setPage("shop");setShopFilter(t);}}
                    style={{background:`${g.color}15`,border:`1px solid ${g.color}40`,color:g.color,padding:"0.2rem 0.7rem",borderRadius:"2rem",fontSize:"0.75rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <p style={{fontSize:"0.85rem",opacity:.7,lineHeight:1.6}}>{g.desc}</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"0.7rem",marginTop:"1rem"}}>
              {g.types.map(tid=>{
                const hs=HAIR_SYSTEM.find(h=>h.id===tid);
                return hs?(
                  <div key={tid} className="lift" onClick={()=>{setPage("shop");setShopFilter(tid);}}
                    style={{padding:"0.9rem 1rem",borderRadius:"0.8rem",background:`hsl(${hs.hue},38%,94%)`,border:`1px solid hsl(${hs.hue},32%,84%)`,cursor:"pointer"}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",fontWeight:700,color:`hsl(${hs.hue},55%,30%)`,marginBottom:"0.25rem"}}>{hs.id}</div>
                    <div style={{fontSize:"0.78rem",opacity:.75,lineHeight:1.4}}>{hs.desc}</div>
                  </div>
                ):null;
              })}
            </div>
          </div>
        ))}
      </div>

      {/* SPECIAL CONCERNS */}
      <div style={{padding:"4rem 2.5rem",background:"#FBF7F0"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:"0.68rem",color:"#B8762A",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.5rem"}}>✦ Cuidados especiales</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,4vw,2.6rem)",fontWeight:700}}>
            Porque tu cabello<br/><em style={{fontStyle:"italic",color:"#B8762A"}}>tiene necesidades únicas</em>
          </h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1rem"}}>
          {[
            {id:"caspa",    emoji:"❄️",title:"Caspa",           color:"#4A7FA5",desc:"Elimina la caspa de raíz, calma el picor y reequilibra el cuero cabelludo."},
            {id:"caida",    emoji:"🍂",title:"Caída Capilar",   color:"#6A9A3A",desc:"Fortalece el folículo, reduce la caída visible y densifica el cabello."},
            {id:"cuero",    emoji:"🔬",title:"Cuero Cabelludo", color:"#5A9A7A",desc:"Exfolia, equilibra y nutre la base de donde nace todo cabello sano."},
            {id:"regenerar",emoji:"🌱",title:"Regeneración",    color:"#7A8A3A",desc:"Reconstruye la fibra dañada y hazlo más hermoso que nunca."},
            {id:"hombre",   emoji:"💪",title:"Cabello Hombre",  color:"#4A6A9A",desc:"Productos y rutinas específicas para el cuidado capilar masculino."},
          ].map(c=>(
            <div key={c.id} className="lift" onClick={()=>{setPage("shop");setShopFilter(c.id);}}
              style={{padding:"1.8rem 1.4rem",borderRadius:"1.2rem",background:`${c.color}0D`,border:`1px solid ${c.color}28`,cursor:"pointer"}}>
              <div style={{fontSize:"2.2rem",marginBottom:"0.7rem"}}>{c.emoji}</div>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.15rem",fontWeight:700,marginBottom:"0.4rem",color:c.color}}>{c.title}</h3>
              <p style={{fontSize:"0.8rem",lineHeight:1.6,opacity:.72}}>{c.desc}</p>
              <div style={{marginTop:"0.8rem",fontSize:"0.75rem",color:c.color,fontWeight:600}}>Ver productos →</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{background:"linear-gradient(135deg,#1A1208,#3A2510)",padding:"5rem 3rem",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:"500px",height:"500px",borderRadius:"50%",border:"1px solid rgba(184,118,42,.1)",top:"-200px",left:"50%",transform:"translateX(-50%)"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:700,color:"#FBF7F0",lineHeight:1.15,marginBottom:"1rem"}}>
            Tu mejor cabello<br/><em style={{color:"#D4983C",fontStyle:"italic"}}>empieza hoy.</em>
          </h2>
          <p style={{color:"rgba(251,247,240,.6)",fontSize:"0.97rem",maxWidth:"480px",margin:"0 auto 2rem",lineHeight:1.75}}>
            Responde 6 preguntas y la IA de LuMane identifica tu subtipo exacto (del 1A al 4C) y te entrega la rutina perfecta.
          </p>
          <button onClick={goQuiz} style={{background:"linear-gradient(135deg,#B8762A,#F0C060)",color:"#1A1208",border:"none",padding:"1rem 2.5rem",borderRadius:"3rem",fontSize:"1rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",boxShadow:"0 10px 35px rgba(184,118,42,.4)"}}>
            Comenzar análisis gratuito ✨
          </button>
        </div>
      </div>
    </div>
  );

  // ── QUIZ ──
  const QuizPage=()=>{
    const currentQ={...QUESTIONS[step],opts:getOpts(step)};
    const total=QUESTIONS.length;
    return(
      <div style={{minHeight:"85vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"3rem 1.5rem",background:"#FBF7F0"}}>
        <div style={{maxWidth:"620px",width:"100%"}} className="fade">
          <div style={{display:"flex",gap:"0.35rem",marginBottom:"2.5rem"}}>
            {QUESTIONS.map((_,i)=>(
              <div key={i} style={{flex:1,height:"4px",borderRadius:"2px",background:i<=step?"linear-gradient(90deg,#B8762A,#D4983C)":"rgba(184,118,42,.14)",transition:"background .3s"}}/>
            ))}
          </div>
          <div style={{textAlign:"center",marginBottom:"0.5rem",fontSize:"2rem"}}>{currentQ.icon}</div>
          <div style={{textAlign:"center",fontSize:"0.68rem",color:"#B8762A",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.65rem"}}>
            Pregunta {step+1} de {total}
          </div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.5rem,4vw,2rem)",fontWeight:600,textAlign:"center",marginBottom:"1.8rem",lineHeight:1.3,color:"#1A1208"}}>
            {currentQ.q}
          </h2>
          <div style={{display:"flex",flexDirection:"column",gap:"0.7rem"}}>
            {currentQ.opts.map(opt=>(
              <button key={opt.v} onClick={()=>handleAnswer(currentQ.id,opt.v)}
                style={{display:"flex",alignItems:"center",gap:"1rem",padding:"1rem 1.4rem",background:"#fff",border:"1.5px solid rgba(184,118,42,.17)",borderRadius:"0.9rem",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"0.9rem",color:"#1A1208",textAlign:"left"}}
                onMouseOver={e=>{e.currentTarget.style.borderColor="#B8762A";e.currentTarget.style.background="rgba(184,118,42,.05)";e.currentTarget.style.transform="translateX(5px)";}}
                onMouseOut={e=>{e.currentTarget.style.borderColor="rgba(184,118,42,.17)";e.currentTarget.style.background="#fff";e.currentTarget.style.transform="none";}}>
                <span style={{fontSize:"1.35rem",minWidth:"2rem",textAlign:"center"}}>{opt.i}</span>
                <span style={{flex:1}}>{opt.l}</span>
                <span style={{color:"#B8762A",opacity:.4}}>→</span>
              </button>
            ))}
          </div>
          {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{display:"block",margin:"1.4rem auto 0",background:"none",border:"none",color:"#B8762A",fontSize:"0.83rem",cursor:"pointer",fontFamily:"'Outfit',sans-serif",opacity:.7}}>← Pregunta anterior</button>}
        </div>
      </div>
    );
  };

  // ── RESULT ──
  const ResultPage=()=>(
    <div style={{padding:"2rem 1.5rem 4rem",background:"#FBF7F0"}}>
      {loading?(
        <div style={{minHeight:"70vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1.5rem"}}>
          <div style={{fontSize:"3.5rem"}} className="spin">✦</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.9rem",color:"#B8762A"}}>Analizando tu cabello…</h2>
          <p style={{opacity:.5,fontSize:"0.88rem"}}>La IA prepara tu rutina personalizada</p>
        </div>
      ):result&&(
        <div style={{maxWidth:"840px",margin:"0 auto"}} className="fade">
          <div style={{background:"linear-gradient(135deg,rgba(184,118,42,.08),rgba(212,152,60,.13))",border:"1px solid rgba(184,118,42,.2)",borderRadius:"1.8rem",padding:"2.5rem 2rem",textAlign:"center",marginBottom:"2rem"}}>
            <div style={{display:"inline-block",background:"rgba(184,118,42,.12)",border:"1px solid rgba(184,118,42,.3)",color:"#B8762A",fontSize:"0.67rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",padding:"0.3rem 1rem",borderRadius:"2rem",marginBottom:"1rem"}}>✦ Tu análisis personalizado LuMane</div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,5vw,3rem)",fontWeight:700,color:"#1A1208",marginBottom:"0.8rem",lineHeight:1.1}}>{result.title}</h1>
            <div style={{display:"flex",gap:"0.5rem",justifyContent:"center",flexWrap:"wrap",marginBottom:"1.2rem"}}>
              {[{l:"Tipo",v:result.hairType},{l:"Condición",v:result.condition},{l:"Cuero",v:result.scalp}].map(t=>(
                <span key={t.l} style={{background:"#fff",border:"1px solid rgba(184,118,42,.22)",padding:"0.27rem 0.85rem",borderRadius:"2rem",fontSize:"0.73rem",color:"#4A3018",fontWeight:500}}>
                  {t.l}: <strong style={{color:"#B8762A"}}>{t.v}</strong>
                </span>
              ))}
            </div>
            <p style={{maxWidth:"540px",margin:"0 auto",opacity:.72,lineHeight:1.8,fontSize:"0.95rem"}}>{result.summary}</p>
            {result.score&&(
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"0.65rem",maxWidth:"400px",margin:"1.8rem auto 0",textAlign:"left"}}>
                {Object.entries(result.score).map(([k,v])=>(
                  <div key={k}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.7rem",marginBottom:"0.22rem",textTransform:"capitalize",fontWeight:500,opacity:.65}}>
                      <span>{k.replace(/_/g," ")}</span><span style={{color:"#B8762A"}}>{v}/10</span>
                    </div>
                    <div style={{height:"5px",background:"rgba(184,118,42,.14)",borderRadius:"3px",overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${v*10}%`,background:"linear-gradient(90deg,#B8762A,#D4983C)",borderRadius:"3px"}}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.65rem",fontWeight:700,marginBottom:"0.35rem"}}>Tu rutina de 5 pasos</h2>
          <p style={{fontSize:"0.8rem",opacity:.5,marginBottom:"1.1rem"}}>Toca cada paso para ver instrucciones detalladas y comprar en tu tienda favorita.</p>
          <div style={{display:"flex",flexDirection:"column",gap:"0.75rem",marginBottom:"2rem"}}>
            {result.products?.map((p,i)=>{
              const isOpen=expanded===i;
              return(
                <div key={i} style={{background:"#fff",borderRadius:"1.1rem",border:`1.5px solid ${isOpen?"rgba(184,118,42,.4)":"rgba(184,118,42,.13)"}`,overflow:"hidden",transition:"border-color .2s",boxShadow:isOpen?"0 8px 28px rgba(184,118,42,.09)":"none"}}>
                  <button onClick={()=>setExpanded(isOpen?null:i)}
                    style={{width:"100%",display:"flex",alignItems:"center",gap:"1rem",padding:"1.05rem 1.3rem",background:"none",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"'Outfit',sans-serif"}}>
                    <div style={{width:"38px",height:"38px",borderRadius:"50%",background:`hsl(${i*55+20},45%,88%)`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"#4A3018",fontSize:"0.82rem",flexShrink:0}}>{p.order}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:"0.63rem",color:"#B8762A",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"0.12rem"}}>{p.step}</div>
                      <div style={{fontWeight:600,fontSize:"0.92rem",color:"#1A1208"}}>{p.name}</div>
                      <div style={{fontSize:"0.72rem",opacity:.48,marginTop:"0.08rem"}}>📅 {p.freq}</div>
                    </div>
                    <span style={{color:"#B8762A",fontSize:"1.1rem",transition:"transform .25s",transform:isOpen?"rotate(180deg)":"none",flexShrink:0}}>⌄</span>
                  </button>
                  {isOpen&&(
                    <div style={{padding:"0 1.3rem 1.3rem",borderTop:"1px solid rgba(184,118,42,.09)"}} className="fade">
                      <div style={{padding:"0.85rem",background:"rgba(184,118,42,.06)",borderRadius:"0.7rem",margin:"0.85rem 0",fontSize:"0.83rem",lineHeight:1.6,color:"#4A3018"}}>
                        <strong style={{fontSize:"0.63rem",color:"#B8762A",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:"0.28rem"}}>¿Por qué este producto?</strong>
                        {p.why}
                      </div>
                      <strong style={{fontSize:"0.63rem",color:"#1A1208",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:"0.55rem"}}>📋 Cómo aplicarlo paso a paso</strong>
                      <div style={{background:"linear-gradient(135deg,rgba(184,118,42,.05),rgba(212,152,60,.08))",border:"1px solid rgba(184,118,42,.11)",borderRadius:"0.7rem",padding:"1rem 1.1rem",fontSize:"0.85rem",lineHeight:1.85,whiteSpace:"pre-line",color:"#1A1208",marginBottom:"0.9rem"}}>{p.howToApply}</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem",marginBottom:"1rem"}}>
                        <div style={{padding:"0.75rem",background:"rgba(90,154,90,.08)",borderRadius:"0.65rem",border:"1px solid rgba(90,154,90,.2)"}}>
                          <div style={{fontSize:"0.6rem",fontWeight:700,color:"#5A9A5A",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.25rem"}}>💡 Truco experto</div>
                          <p style={{fontSize:"0.79rem",opacity:.85,lineHeight:1.5}}>{p.tip}</p>
                        </div>
                        <div style={{padding:"0.75rem",background:"rgba(170,85,85,.07)",borderRadius:"0.65rem",border:"1px solid rgba(170,85,85,.18)"}}>
                          <div style={{fontSize:"0.6rem",fontWeight:700,color:"#AA5555",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.25rem"}}>⚠️ Evitar</div>
                          <p style={{fontSize:"0.79rem",opacity:.85,lineHeight:1.5}}>{p.avoid}</p>
                        </div>
                      </div>
                      <div style={{fontSize:"0.6rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",opacity:.45,marginBottom:"0.55rem"}}>🛍️ Comprar en</div>
                      <div style={{display:"flex",gap:"0.45rem",flexWrap:"wrap"}}>
                        {activeStores.map(([key,s])=>(
                          <button key={key} className="sl" onClick={()=>openStore(p.sq||p.name,key)}
                            style={{display:"flex",alignItems:"center",gap:"0.4rem",padding:"0.42rem 0.95rem",borderRadius:"2rem",border:`1.5px solid ${s.color}40`,background:`${s.color}0E`,fontSize:"0.78rem",fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",color:"#1A1208"}}>
                            {s.emoji} {s.name} <span style={{opacity:.4,fontSize:"0.65rem"}}>↗</span>
                          </button>
                        ))}
                        {activeStores.length===0&&<button onClick={()=>setShowStores(true)} style={{padding:"0.42rem 0.95rem",borderRadius:"2rem",border:"1px dashed rgba(184,118,42,.4)",background:"none",color:"#B8762A",fontSize:"0.76rem",cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>+ Activar tiendas</button>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(255px,1fr))",gap:"1rem",marginBottom:"2rem"}}>
            {result.weeklyRoutine&&(
              <div style={{background:"#fff",borderRadius:"1.1rem",padding:"1.4rem",border:"1px solid rgba(184,118,42,.13)"}}>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontWeight:700,marginBottom:"0.85rem"}}>📅 Rutina semanal</h3>
                {result.weeklyRoutine.map((d,i)=>(
                  <div key={i} style={{padding:"0.5rem 0",borderBottom:i<result.weeklyRoutine.length-1?"1px solid rgba(184,118,42,.08)":"none",fontSize:"0.81rem",lineHeight:1.55,opacity:.8}}>{d}</div>
                ))}
              </div>
            )}
            {result.ingredients&&(
              <div style={{background:"#fff",borderRadius:"1.1rem",padding:"1.4rem",border:"1px solid rgba(184,118,42,.13)"}}>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontWeight:700,marginBottom:"0.85rem"}}>🔬 Ingredientes clave</h3>
                <div style={{marginBottom:"0.85rem"}}>
                  <div style={{fontSize:"0.6rem",fontWeight:700,color:"#5A9A5A",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.4rem"}}>✓ Buscar</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"0.28rem"}}>
                    {result.ingredients.buscar?.map((ing,i)=>(
                      <span key={i} style={{background:"rgba(90,154,90,.1)",border:"1px solid rgba(90,154,90,.25)",padding:"0.18rem 0.62rem",borderRadius:"2rem",fontSize:"0.73rem",color:"#3A7A3A"}}>{ing}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{fontSize:"0.6rem",fontWeight:700,color:"#AA5555",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.4rem"}}>✗ Evitar</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"0.28rem"}}>
                    {result.ingredients.evitar?.map((ing,i)=>(
                      <span key={i} style={{background:"rgba(170,85,85,.07)",border:"1px solid rgba(170,85,85,.22)",padding:"0.18rem 0.62rem",borderRadius:"2rem",fontSize:"0.73rem",color:"#AA5555"}}>{ing}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {result.lifestyle&&(
              <div style={{background:"linear-gradient(135deg,rgba(184,118,42,.07),rgba(212,152,60,.1))",borderRadius:"1.1rem",padding:"1.4rem",border:"1px solid rgba(184,118,42,.18)"}}>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontWeight:700,marginBottom:"0.85rem"}}>🌙 Hábitos de vida</h3>
                {result.lifestyle.map((t,i)=>(
                  <div key={i} style={{display:"flex",gap:"0.5rem",marginBottom:"0.6rem",fontSize:"0.81rem",lineHeight:1.55,opacity:.85}}>
                    <span style={{color:"#B8762A",flexShrink:0}}>✦</span>{t}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{display:"flex",gap:"0.7rem",justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>setPage("shop")} style={{background:"linear-gradient(135deg,#B8762A,#D4983C)",color:"#fff",border:"none",padding:"0.85rem 2rem",borderRadius:"3rem",fontSize:"0.9rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Ver tienda completa →</button>
            <button onClick={goQuiz} style={{background:"transparent",color:"#B8762A",border:"1.5px solid rgba(184,118,42,.4)",padding:"0.85rem 2rem",borderRadius:"3rem",fontSize:"0.9rem",cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Repetir análisis</button>
          </div>
        </div>
      )}
    </div>
  );

  // ── SHOP ──
  function ShopCard({p}){
    const [open,setOpen]=useState(false);
    return(
      <div style={{background:"#fff",borderRadius:"1.1rem",overflow:"hidden",border:`1.5px solid ${open?"rgba(184,118,42,.35)":"rgba(184,118,42,.11)"}`,transition:"all .22s",boxShadow:open?"0 10px 32px rgba(184,118,42,.1)":"none"}} className="lift">
        <div style={{height:"125px",background:`hsl(${p.hue},40%,91%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"3rem",position:"relative"}}>
          {p.emoji}
          <span style={{position:"absolute",top:"0.55rem",right:"0.55rem",background:"#B8762A",color:"#fff",fontSize:"0.6rem",fontWeight:700,padding:"0.17rem 0.52rem",borderRadius:"2rem"}}>{p.tag}</span>
          <span style={{position:"absolute",bottom:"0.55rem",left:"0.55rem",background:"rgba(26,18,8,.7)",color:"#F0C060",fontSize:"0.62rem",fontWeight:700,padding:"0.15rem 0.5rem",borderRadius:"2rem"}}>{p.cat}</span>
        </div>
        <div style={{padding:"1rem"}}>
          <div style={{fontSize:"0.62rem",color:"#B8762A",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.25rem"}}>{p.step}</div>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.08rem",fontWeight:700,marginBottom:"0.35rem",color:"#1A1208"}}>{p.name}</h3>
          <p style={{fontSize:"0.79rem",opacity:.58,lineHeight:1.5,marginBottom:"0.75rem"}}>{p.desc}</p>
          <button onClick={()=>setOpen(!open)}
            style={{width:"100%",padding:"0.55rem",background:"rgba(184,118,42,.07)",border:"1px solid rgba(184,118,42,.18)",borderRadius:"0.65rem",cursor:"pointer",fontSize:"0.77rem",color:"#B8762A",fontWeight:600,marginBottom:open?"0.75rem":0,fontFamily:"'Outfit',sans-serif"}}>
            {open?"▲ Ocultar":"▼ Ver instrucciones + Comprar"}
          </button>
          {open&&(
            <div className="fade">
              <div style={{fontSize:"0.62rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",opacity:.45,marginBottom:"0.45rem"}}>📋 Cómo aplicar</div>
              <div style={{fontSize:"0.8rem",lineHeight:1.7,opacity:.73,marginBottom:"0.85rem",background:"rgba(184,118,42,.05)",padding:"0.75rem",borderRadius:"0.55rem",whiteSpace:"pre-line"}}>{p.howTo}</div>
              <div style={{fontSize:"0.62rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",opacity:.45,marginBottom:"0.45rem"}}>🛍️ Comprar en</div>
              <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
                {activeStores.map(([key,s])=>(
                  <button key={key} className="sl" onClick={()=>openStore(p.sq,key)}
                    style={{display:"flex",alignItems:"center",gap:"0.35rem",padding:"0.38rem 0.85rem",borderRadius:"2rem",border:`1.5px solid ${s.color}45`,background:`${s.color}0E`,fontSize:"0.75rem",fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",color:"#1A1208"}}>
                    {s.emoji} {s.name}
                  </button>
                ))}
                {activeStores.length===0&&<span style={{fontSize:"0.75rem",opacity:.4}}>Activa tiendas en ⚙</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const ShopPage=()=>{
    const filtered=filterProducts(shopFilter);
    const groupFilters=[
      {id:"all",l:"Todos",e:"✦"},
      {id:"lacio",l:"Lacio",e:"〰️"},{id:"1A",l:"1A",e:"〰️"},{id:"1B",l:"1B",e:"〰️"},{id:"1C",l:"1C",e:"〰️"},
      {id:"ondulado",l:"Ondulado",e:"〜"},{id:"2A",l:"2A",e:"〜"},{id:"2B",l:"2B",e:"〜"},{id:"2C",l:"2C",e:"〜"},
      {id:"rizado",l:"Rizado",e:"🌀"},{id:"3A",l:"3A",e:"🌀"},{id:"3B",l:"3B",e:"🌀"},{id:"3C",l:"3C",e:"🌀"},
      {id:"afro",l:"Afro",e:"✦"},{id:"4A",l:"4A",e:"✦"},{id:"4B",l:"4B",e:"✦"},{id:"4C",l:"4C",e:"✦"},
      {id:"caspa",l:"Caspa",e:"❄️"},{id:"caida",l:"Caída",e:"🍂"},{id:"cuero",l:"Cuero",e:"🔬"},{id:"regenerar",l:"Regenerar",e:"🌱"},{id:"hombre",l:"Hombre",e:"💪"},
    ];
    return(
      <div style={{padding:"3rem 1.5rem 4rem",maxWidth:"1000px",margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:"0.67rem",color:"#B8762A",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.5rem"}}>✦ Catálogo completo</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.6rem",fontWeight:700,color:"#1A1208"}}>Tienda LuMane</h1>
          <p style={{opacity:.5,marginTop:"0.4rem",fontSize:"0.88rem"}}>54+ productos · Tipos 1A al 4C · Para todas las razas y géneros</p>
        </div>
        <div style={{background:"linear-gradient(135deg,rgba(184,118,42,.09),rgba(212,152,60,.13))",borderRadius:"1.1rem",padding:"1rem 1.4rem",marginBottom:"1.8rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.8rem",border:"1px solid rgba(184,118,42,.18)"}}>
          <div>
            <div style={{fontWeight:700,fontSize:"0.9rem"}}>¿No sabes cuál necesitas? 🤔</div>
            <div style={{fontSize:"0.77rem",opacity:.55,marginTop:"0.12rem"}}>El analizador IA identifica tu subtipo exacto (1A–4C) y recomienda los productos perfectos</div>
          </div>
          <button onClick={goQuiz} style={{background:"#B8762A",color:"#fff",border:"none",padding:"0.58rem 1.2rem",borderRadius:"2rem",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'Outfit',sans-serif"}}>Analizar mi cabello ✨</button>
        </div>
        <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap",marginBottom:"1.8rem"}}>
          {groupFilters.map(f=>(
            <button key={f.id} onClick={()=>setShopFilter(f.id)}
              style={{padding:"0.35rem 0.8rem",borderRadius:"2rem",border:shopFilter===f.id?"1.5px solid #B8762A":"1.5px solid rgba(184,118,42,.16)",background:shopFilter===f.id?"rgba(184,118,42,.11)":"#fff",color:shopFilter===f.id?"#B8762A":"#1A1208",fontSize:"0.75rem",fontWeight:shopFilter===f.id?700:400,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .18s"}}>
              {f.e} {f.l}
            </button>
          ))}
        </div>
        <div style={{marginBottom:"0.8rem",fontSize:"0.78rem",opacity:.5}}>{filtered.length} productos encontrados</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:"1.1rem"}}>
          {filtered.map(prod=><ShopCard key={prod.id} p={prod}/>)}
        </div>
        {filtered.length===0&&<div style={{textAlign:"center",opacity:.4,padding:"4rem",fontSize:"0.88rem"}}>No hay productos en esta categoría.</div>}
      </div>
    );
  };

  return(
    <div style={{minHeight:"100vh",background:"#FBF7F0"}}>
      <style>{CSS}</style>
      {toast&&<div style={{position:"fixed",bottom:"2rem",left:"50%",transform:"translateX(-50%)",background:"#1A1208",color:"#FBF7F0",padding:"0.65rem 1.7rem",borderRadius:"2rem",fontSize:"0.87rem",zIndex:9999,boxShadow:"0 8px 30px rgba(0,0,0,.28)",whiteSpace:"nowrap"}}>{toast}</div>}
      {showStores&&<StorePanel/>}
      <Nav/>
      {page==="home"   &&<HomePage/>}
      {page==="quiz"   &&<QuizPage/>}
      {page==="result" &&<ResultPage/>}
      {page==="shop"   &&<ShopPage/>}
      <footer style={{background:"#1A1208",color:"rgba(251,247,240,.65)",padding:"2.5rem 2rem",textAlign:"center"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",color:"#D4983C",marginBottom:"0.5rem",letterSpacing:"0.1em"}}>✦ LuMane</div>
        <p style={{fontSize:"0.82rem",lineHeight:1.6,maxWidth:"420px",margin:"0 auto"}}>Cuidado capilar con inteligencia, amor y respeto por cada textura, raza y género del mundo.</p>
        <p style={{fontSize:"0.66rem",marginTop:"0.8rem",opacity:.3}}>Los enlaces de tiendas pueden incluir comisiones de afiliado · LuMane © 2026</p>
      </footer>
    </div>
  );
}
