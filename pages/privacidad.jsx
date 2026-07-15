import React from "react";

const S = {
  page:{minHeight:"100vh",background:"#141210",color:"#E8E2D8",fontFamily:"'Outfit',sans-serif",padding:"2.5rem 1.5rem 4rem"},
  wrap:{maxWidth:"680px",margin:"0 auto"},
  topbar:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"2.5rem"},
  logo:{display:"flex",alignItems:"center",gap:"0.6rem",fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:700,color:"#C8A46B",letterSpacing:"0.08em",textDecoration:"none"},
  volver:{border:"1px solid rgba(200,164,107,.35)",borderRadius:"2rem",padding:"0.45rem 1.2rem",color:"#E8E2D8",fontSize:"0.85rem",textDecoration:"none"},
  h1:{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,7vw,3rem)",fontWeight:700,color:"#FDFAF5",lineHeight:1.1,marginBottom:"0.6rem"},
  updated:{fontSize:"0.85rem",color:"rgba(232,226,216,.45)",marginBottom:"2rem"},
  intro:{fontSize:"1rem",lineHeight:1.85,color:"rgba(232,226,216,.8)",marginBottom:"2.5rem"},
  kicker:{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#C8A46B",marginBottom:"0.5rem",marginTop:"2.8rem"},
  h2:{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.5rem,5vw,2.1rem)",fontWeight:700,color:"#FDFAF5",marginBottom:"1rem",lineHeight:1.15},
  p:{fontSize:"1rem",lineHeight:1.85,color:"rgba(232,226,216,.8)",marginBottom:"1rem"},
  ul:{paddingLeft:"1.2rem",marginBottom:"1rem"},
  li:{fontSize:"1rem",lineHeight:1.85,color:"rgba(232,226,216,.8)",marginBottom:"0.8rem"},
  b:{color:"#FDFAF5",fontWeight:600},
  box:{background:"rgba(200,164,107,.07)",border:"1px solid rgba(200,164,107,.25)",borderRadius:"1rem",padding:"1.2rem 1.4rem",marginBottom:"1rem",fontSize:"1rem",lineHeight:1.85,color:"rgba(232,226,216,.85)"},
  mail:{color:"#C8A46B",textDecoration:"none",fontWeight:600},
  footer:{borderTop:"1px solid rgba(200,164,107,.15)",marginTop:"3.5rem",paddingTop:"1.8rem",textAlign:"center",fontSize:"0.85rem",color:"rgba(232,226,216,.5)",lineHeight:2},
};

export default function Privacidad(){
  return(
    <div style={S.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Outfit:wght@300;400;500;600;700&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{background:#141210;}`}</style>
      <div style={S.wrap}>
        <div style={S.topbar}>
          <a href="/" style={S.logo}>✦ LuMane</a>
          <a href="/" style={S.volver}>← Volver</a>
        </div>

        <h1 style={S.h1}>Política de Privacidad</h1>
        <div style={S.updated}>Última actualización: 13 de julio de 2026</div>

        <p style={S.intro}>
          En LuMane tu confianza es lo más valioso que tenemos. Esta política explica, en lenguaje
          claro y sin letra pequeña confusa, qué datos recopilamos, para qué los usamos y qué
          derechos tienes sobre ellos.
        </p>

        <div style={S.kicker}>01 · Responsable</div>
        <h2 style={S.h2}>Quién trata tus datos</h2>
        <p style={S.p}>
          El sitio lumane.online es operado por <span style={S.b}>LuMane</span> (responsable:
          Fernanda Hernández), con base en Barcelona, España. Para cualquier tema relacionado
          con tus datos puedes escribir a <a href="mailto:lumane.online@outlook.com" style={S.mail}>lumane.online@outlook.com</a>.
        </p>

        <div style={S.kicker}>02 · Datos que recopilamos</div>
        <h2 style={S.h2}>Qué información recibimos de ti</h2>
        <ul style={S.ul}>
          <li style={S.li}><span style={S.b}>Datos de registro:</span> tu correo electrónico y una contraseña cuando creas tu cuenta.</li>
          <li style={S.li}><span style={S.b}>Respuestas del cuestionario:</span> tus respuestas sobre tu tipo de cabello, objetivos y hábitos, usadas para personalizar tu rutina.</li>
          <li style={S.li}><span style={S.b}>Tu foto (opcional):</span> la fotografía de tu cabello que subes se procesa únicamente para el análisis con IA. <span style={S.b}>No se publica ni se comparte con terceros ajenos al análisis.</span></li>
          <li style={S.li}><span style={S.b}>Datos de navegación:</span> información técnica (páginas visitadas, dispositivo, interacciones) recogida mediante cookies y píxeles de medición.</li>
        </ul>

        <div style={S.kicker}>03 · Finalidad</div>
        <h2 style={S.h2}>Para qué usamos tus datos</h2>
        <ul style={S.ul}>
          <li style={S.li}>Ofrecerte el análisis capilar y recomendaciones personalizadas.</li>
          <li style={S.li}>Gestionar tu cuenta y tu suscripción.</li>
          <li style={S.li}>Enviarte tu resultado y consejos para tu tipo de cabello por correo.</li>
          <li style={S.li}>Medir el funcionamiento del sitio y mejorar la experiencia.</li>
          <li style={S.li}>Mostrar publicidad relevante y medir campañas (ver sección de cookies).</li>
          <li style={S.li}>Responder a tus consultas por correo.</li>
        </ul>

        <div style={S.kicker}>04 · Cookies y píxeles</div>
        <h2 style={S.h2}>Cookies, Google, Meta y Amazon</h2>
        <p style={S.p}>Usamos tecnologías de medición de terceros:</p>
        <ul style={S.ul}>
          <li style={S.li}><span style={S.b}>Google Analytics:</span> nos ayuda a entender cuántas personas visitan el sitio y cómo lo usan, de forma agregada.</li>
          <li style={S.li}><span style={S.b}>Píxel de Meta (Facebook/Instagram):</span> registra eventos como visitas a la página para medir y optimizar nuestra publicidad. Puedes gestionar tus preferencias de anuncios en la configuración de tu cuenta de Facebook o Instagram.</li>
          <li style={S.li}><span style={S.b}>Enlaces de afiliados (Amazon y otras tiendas):</span> al pulsar un enlace hacia una tienda, esa tienda instala sus propias cookies. LuMane puede recibir una comisión por compras calificadas, sin costo adicional para ti.</li>
        </ul>
        <p style={S.p}>Puedes borrar o bloquear cookies desde la configuración de tu navegador en cualquier momento.</p>

        <div style={S.kicker}>05 · Inteligencia Artificial</div>
        <h2 style={S.h2}>Cómo funciona el análisis con IA</h2>
        <p style={S.p}>
          Tus respuestas del cuestionario y tu foto (si decides subirla) se envían de forma segura a
          nuestro proveedor de inteligencia artificial (Anthropic) únicamente para generar tu
          diagnóstico y tu rutina. El análisis es orientativo y de carácter estético:{" "}
          <span style={S.b}>no constituye un diagnóstico médico</span>. Si tienes una afección del
          cuero cabelludo, consulta a un dermatólogo.
        </p>

        <div style={S.kicker}>06 · Pagos</div>
        <h2 style={S.h2}>Tus datos de pago</h2>
        <div style={S.box}>
          💳 Los pagos se procesan a través de <span style={S.b}>Stripe</span> (internacional) y{" "}
          <span style={S.b}>Wompi</span> (Colombia: Nequi, PSE, Bancolombia), plataformas de pago con
          sus propios sistemas de seguridad y sus propias políticas de privacidad.{" "}
          <span style={S.b}>LuMane nunca ve ni almacena los datos de tu tarjeta.</span>
        </div>

        <div style={S.kicker}>07 · Compartición</div>
        <h2 style={S.h2}>Con quién compartimos datos</h2>
        <p style={S.p}>
          No vendemos tus datos. Solo se comparten con los proveedores necesarios para operar el
          servicio: Stripe y Wompi (pagos), Anthropic (análisis con IA), Meta y Google (medición),
          Amazon y tiendas asociadas (afiliados), Resend (envío de correos) y nuestros proveedores de
          alojamiento y base de datos (Vercel y Upstash). Cada uno trata los datos según su propia
          política de privacidad.
        </p>

        <div style={S.kicker}>08 · Tus derechos</div>
        <h2 style={S.h2}>Control total sobre tus datos</h2>
        <p style={S.p}>
          De acuerdo con el Reglamento General de Protección de Datos (RGPD) y la normativa aplicable
          en tu país, tienes derecho a:
        </p>
        <ul style={S.ul}>
          <li style={S.li}><span style={S.b}>Acceder</span> a los datos que tenemos sobre ti.</li>
          <li style={S.li}><span style={S.b}>Corregirlos</span> si son inexactos.</li>
          <li style={S.li}><span style={S.b}>Eliminarlos</span> ("derecho al olvido").</li>
          <li style={S.li}><span style={S.b}>Oponerte</span> a su uso u obtener una copia (portabilidad).</li>
        </ul>
        <p style={S.p}>
          Para ejercer cualquiera de estos derechos, escribe a{" "}
          <a href="mailto:lumane.online@outlook.com" style={S.mail}>lumane.online@outlook.com</a> y te
          responderemos lo antes posible.
        </p>

        <div style={S.kicker}>09 · Conservación y menores</div>
        <h2 style={S.h2}>Cuánto tiempo y para quién</h2>
        <p style={S.p}>
          Conservamos tus datos mientras tengas una cuenta activa o mientras sea necesario para las
          finalidades descritas. LuMane está dirigido a personas{" "}
          <span style={S.b}>mayores de 18 años</span>. Las rutinas de cuidado infantil están pensadas
          para que un padre, madre o tutor legal las consulte y gestione: no recopilamos
          conscientemente datos directamente de menores.
        </p>

        <div style={S.kicker}>10 · Cambios</div>
        <h2 style={S.h2}>Actualizaciones de esta política</h2>
        <p style={S.p}>
          Si esta política cambia, publicaremos la versión actualizada en esta misma página con su
          nueva fecha. Los cambios importantes se comunicarán de forma visible.
        </p>

        <div style={S.footer}>
          ¿Dudas? Escríbenos a <a href="mailto:lumane.online@outlook.com" style={S.mail}>lumane.online@outlook.com</a>
          <br/>✦ Hecho con 💛 en Barcelona · lumane.online · <a href="/terminos" style={S.mail}>Términos y Condiciones</a>
        </div>
      </div>
    </div>
  );
}
