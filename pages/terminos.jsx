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

export default function Terminos(){
  return(
    <div style={S.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Outfit:wght@300;400;500;600;700&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{background:#141210;}`}</style>
      <div style={S.wrap}>
        <div style={S.topbar}>
          <a href="/" style={S.logo}>✦ LuMane</a>
          <a href="/" style={S.volver}>← Volver</a>
        </div>

        <h1 style={S.h1}>Términos y Condiciones</h1>
        <div style={S.updated}>Última actualización: 13 de julio de 2026</div>

        <p style={S.intro}>
          Estos términos regulan el uso de lumane.online. Al crear una cuenta o usar el servicio,
          aceptas estas condiciones. Las escribimos claras y cortas, para que de verdad las puedas leer.
        </p>

        <div style={S.kicker}>01 · El servicio</div>
        <h2 style={S.h2}>Qué es LuMane</h2>
        <p style={S.p}>
          LuMane es una plataforma de cuidado capilar con inteligencia artificial: analiza tu tipo de
          cabello a partir de un cuestionario (y una foto opcional) y te entrega un diagnóstico y una
          rutina personalizada con recomendaciones de productos de tiendas de terceros.
        </p>
        <div style={S.box}>
          ⚕️ <span style={S.b}>Importante:</span> el análisis de LuMane es orientativo y de carácter
          estético. <span style={S.b}>No es un diagnóstico médico</span> ni sustituye la consulta con
          un dermatólogo o profesional de la salud. Si tienes una afección del cuero cabelludo,
          caída severa u otra condición, consulta a un profesional.
        </div>

        <div style={S.kicker}>02 · Suscripción</div>
        <h2 style={S.h2}>Planes, prueba gratis y renovación</h2>
        <ul style={S.ul}>
          <li style={S.li}>El análisis básico del tipo de cabello es <span style={S.b}>gratuito</span>. La rutina completa, la tienda y las funciones premium requieren <span style={S.b}>suscripción</span>.</li>
          <li style={S.li}>Los planes disponibles y sus precios se muestran siempre antes del pago (semanal, mensual o anual, en USD).</li>
          <li style={S.li}>La prueba gratuita de 7 días (cuando aplique) no genera cargos si cancelas antes de que termine. Al finalizar, la suscripción se renueva automáticamente según el plan elegido.</li>
          <li style={S.li}>Puedes <span style={S.b}>cancelar cuando quieras</span> desde tu cuenta; mantendrás el acceso hasta el final del periodo ya pagado.</li>
        </ul>

        <div style={S.kicker}>03 · Garantía</div>
        <h2 style={S.h2}>Garantía de 30 días</h2>
        <p style={S.p}>
          Si en tus primeros 30 días de suscripción no notas la diferencia, escríbenos a{" "}
          <a href="mailto:lumane.online@outlook.com" style={S.mail}>lumane.online@outlook.com</a> desde el correo de
          tu cuenta y te devolvemos el dinero de ese pago. Sin preguntas incómodas. La garantía aplica
          una vez por persona.
        </p>

        <div style={S.kicker}>04 · Pagos</div>
        <h2 style={S.h2}>Cómo se procesa tu pago</h2>
        <p style={S.p}>
          Los pagos se procesan de forma segura mediante <span style={S.b}>Stripe</span>{" "}
          (internacional) y <span style={S.b}>Wompi</span> (Colombia: Nequi, PSE, Bancolombia). LuMane
          no ve ni almacena los datos de tu tarjeta. Los precios pueden actualizarse; cualquier cambio
          se aplicará solo a partir de tu siguiente renovación y se comunicará con antelación.
        </p>

        <div style={S.kicker}>05 · Enlaces de afiliado</div>
        <h2 style={S.h2}>Recomendaciones de productos</h2>
        <p style={S.p}>
          Algunos enlaces a tiendas (Amazon, Sephora, iHerb, Druni, Mercado Libre y otras) son enlaces
          de afiliado: LuMane puede recibir una comisión por compras calificadas,{" "}
          <span style={S.b}>sin costo adicional para ti</span>. Las compras se realizan directamente en
          esas tiendas, bajo sus propios términos, precios, envíos y devoluciones. LuMane no vende ni
          envía esos productos.
        </p>

        <div style={S.kicker}>06 · Tu cuenta</div>
        <h2 style={S.h2}>Uso responsable</h2>
        <ul style={S.ul}>
          <li style={S.li}>Debes ser mayor de 18 años para crear una cuenta. Las rutinas infantiles están pensadas para ser gestionadas por un padre, madre o tutor.</li>
          <li style={S.li}>Eres responsable de mantener la confidencialidad de tu contraseña.</li>
          <li style={S.li}>No está permitido usar el servicio para fines ilegales, copiar masivamente el contenido o intentar vulnerar la seguridad de la plataforma.</li>
        </ul>

        <div style={S.kicker}>07 · Propiedad intelectual</div>
        <h2 style={S.h2}>Contenido de LuMane</h2>
        <p style={S.p}>
          La marca LuMane, el diseño, los textos y el sistema de análisis son propiedad de LuMane. Tu
          rutina personalizada es para tu uso personal. Las marcas de productos recomendados pertenecen
          a sus respectivos dueños.
        </p>

        <div style={S.kicker}>08 · Responsabilidad</div>
        <h2 style={S.h2}>Límites del servicio</h2>
        <p style={S.p}>
          Trabajamos para que LuMane esté siempre disponible y sus recomendaciones sean útiles, pero el
          servicio se ofrece "tal cual": no garantizamos resultados específicos, que dependen de cada
          persona y del uso constante de la rutina. Antes de usar un producto nuevo, revisa sus
          ingredientes y haz una prueba de sensibilidad, especialmente si tienes alergias.
        </p>

        <div style={S.kicker}>09 · Cambios y contacto</div>
        <h2 style={S.h2}>Actualizaciones de estos términos</h2>
        <p style={S.p}>
          Podemos actualizar estos términos; publicaremos la versión vigente en esta página con su
          fecha. Para cualquier duda, escríbenos a{" "}
          <a href="mailto:lumane.online@outlook.com" style={S.mail}>lumane.online@outlook.com</a>. Estos términos se
          rigen por la legislación española.
        </p>

        <div style={S.footer}>
          ¿Dudas? Escríbenos a <a href="mailto:lumane.online@outlook.com" style={S.mail}>lumane.online@outlook.com</a>
          <br/>✦ Hecho con 💛 en Barcelona · lumane.online · <a href="/privacidad" style={S.mail}>Política de Privacidad</a>
        </div>
      </div>
    </div>
  );
}
