import React, { useState, useEffect } from "react";
const STORES = {
  amazon:  { name:"Amazon",  emoji:"📦", color:"#FF9900", active:true,  tag:"lumanehair-21", buildUrl:(q,t)=>`https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=${t}` },
  sephora: { name:"Sephora", emoji:"🖤", color:"#E75480", active:true,  tag:"", buildUrl:(q)=>`https://www.sephora.com/search?keyword=${encodeURIComponent(q)}` },
  iherb:   { name:"iHerb",   emoji:"🌿", color:"#5AAA46", active:true,  tag:"TU_CODIGO_IHERB", buildUrl:(q,t)=>`https://www.iherb.com/search?kw=${encodeURIComponent(q)}&rcode=${t}` },
  druni:   { name:"Druni",   emoji:"💜", color:"#6B1F8A", active:true,  tag:"", buildUrl:(q)=>`https://www.druni.es/buscar?q=${encodeURIComponent(q)}` },
};
