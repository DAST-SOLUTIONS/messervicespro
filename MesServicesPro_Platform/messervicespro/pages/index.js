import Head from 'next/head'
import { useState, useEffect } from 'react'

const PROS = [
  { id:1, initials:'PDP', bg:'#E8F0F7', color:'#1B3A5C', name:'Précision DP', tier:'featured', verified:true, service:'Estimation de coût', city:'Longueuil, QC', rating:5.0, reviews:42, tags:['ESCQ','ECC','AEÉCQ','Résidentiel','Commercial','Industriel'], desc:"Firme spécialisée en estimation depuis plus de 10 ans. Certifié ESCQ et ECC. Formateur agréé APCHQ, APECQ et Batimatech. Membre CA de l'AEÉCQ." },
  { id:2, initials:'BSQ', bg:'#EAF3DE', color:'#27500A', name:'BIM Solutions QC', tier:'featured', verified:true, service:'Modélisation BIM', city:'Montréal, QC', rating:4.9, reviews:31, tags:['Revit','Navisworks','Clash detection','Commercial'], desc:'Équipe spécialisée en modélisation BIM et coordination. Expertise en coordination MEP et clash detection pour projets commerciaux et institutionnels.' },
  { id:3, initials:'EP', bg:'#FFF0E8', color:'#994412', name:'EstimPro Inc.', tier:'pro', verified:true, service:'Estimation de coût', city:'Montréal, QC', rating:4.7, reviews:28, tags:['ESCQ','Commercial','Industriel'], desc:'Firme d\'estimation spécialisée en projets commerciaux et industriels. Approche méthodique et livrables structurés.' },
  { id:4, initials:'DP', bg:'#E6F1FB', color:'#0C447C', name:'DessinPro QC', tier:'pro', verified:true, service:'Dessin / MEP / Atelier', city:'Québec, QC', rating:4.8, reviews:19, tags:['AutoCAD','Revit','Mur-rideau','Atelier'], desc:'Experts en dessins d\'atelier pour mur-rideau, revêtements extérieurs et systèmes MEP. Livraisons rapides.' },
  { id:5, initials:'SP', bg:'#FAEEDA', color:'#633806', name:'ScanPro 3D', tier:'pro', verified:true, service:'Scan 3D / As-built', city:'Longueuil, QC', rating:4.8, reviews:14, tags:['Lidar','Nuage de points','As-built','Revit'], desc:'Relevés laser haute précision. Livraison de nuages de points et modèles as-built pour rénovations et agrandissements.' },
  { id:6, initials:'GPC', bg:'var(--gris)', color:'var(--gris-dark)', name:'GestionProjet.ca', tier:'starter', verified:false, service:'Gestion de projet', city:'Sherbrooke, QC', rating:4.3, reviews:8, tags:['Planning','MS Project','Résidentiel'], desc:'Gestionnaire de projets indépendant, 8 ans d\'expérience en construction résidentielle et légère.' },
]

const REVIEWS = [
  { author:'Construction Bélair Inc.', rating:5, text:'"Réactif, précis et vraiment professionnel. L\'estimation était détaillée et livrée avant l\'échéancier. On retravaillera ensemble."', tags:['Résidentiel','Multi-logements'] },
  { author:'Promotions Laval', rating:5, text:'"Délais respectés à la journée près. Livrable impeccable. Danny maîtrise parfaitement son domaine. Recommandé sans hésitation."', tags:['Commercial','Appel d\'offres'] },
  { author:'Entreprises Trépanier', rating:5, text:'"Expertise solide en estimations industrielles. Approche méthodique et transparente. On a pu faire confiance aux chiffres dès la première lecture."', tags:['Industriel'] },
]

const PROJECTS = [
  { name:'Complexe résidentiel — Brossard', pro:'Précision DP', service:'Estimation', pct:65, color:'var(--orange)', status:'En cours', statusClass:'badge-featured' },
  { name:'Rénovation commerciale — Laval', pro:'BIM Solutions QC', service:'Dessin d\'atelier', pct:30, color:'var(--bleu)', status:'Révision', statusClass:'badge-pro' },
  { name:'Entrepôt logistique — Longueuil', pro:'ScanPro 3D', service:'Relevé laser', pct:10, color:'var(--gris-dark)', status:'Devis reçu', statusClass:'badge-gray' },
]

function Stars({ n }) {
  return <span>{Array.from({length:5},(_,i)=><span key={i} style={{color: i<Math.floor(n) ? 'var(--orange)' : 'var(--gris-mid)'}}>★</span>)}</span>
}

function TierBadge({ tier }) {
  if (tier==='featured') return <span className="badge badge-featured">★ Featured</span>
  if (tier==='pro') return <span className="badge badge-pro">Pro</span>
  return <span className="badge badge-starter">Starter</span>
}

function NavIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="0" y="0" width="12" height="12" rx="2.5" fill="#fff"/>
      <rect x="14" y="0" width="14" height="14" rx="2.5" fill="var(--orange)"/>
      <rect x="0" y="14" width="14" height="14" rx="2.5" fill="rgba(255,255,255,0.25)"/>
      <rect x="17" y="17" width="11" height="11" rx="2" fill="rgba(255,255,255,0.45)"/>
    </svg>
  )
}

function CatIcon({ type }) {
  const icons = {
    estimation: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="1" y="1" width="11" height="11" rx="2" fill="var(--bleu)"/><rect x="14" y="1" width="11" height="11" rx="2" fill="var(--orange)"/><rect x="1" y="14" width="11" height="11" rx="2" fill="var(--orange)" opacity="0.3"/><rect x="14" y="14" width="11" height="11" rx="2" fill="var(--bleu)" opacity="0.5"/></svg>,
    dessin: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="1" y="19" width="24" height="6" rx="2" fill="var(--bleu)"/><rect x="5" y="12" width="16" height="5" rx="1.5" fill="var(--bleu)" opacity="0.5"/><rect x="10" y="5" width="6" height="5" rx="1.5" fill="var(--orange)"/></svg>,
    bim: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="3" y="3" width="8" height="8" rx="1.5" fill="var(--orange)" opacity="0.7"/><rect x="15" y="3" width="8" height="8" rx="1.5" fill="var(--bleu)" opacity="0.6"/><rect x="3" y="15" width="8" height="8" rx="1.5" fill="var(--bleu)" opacity="0.6"/><rect x="15" y="15" width="8" height="8" rx="1.5" fill="var(--orange)" opacity="0.7"/><circle cx="13" cy="13" r="3.5" fill="var(--bleu)"/></svg>,
    scan: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="9" stroke="var(--bleu)" strokeWidth="1.5" fill="none"/><circle cx="13" cy="13" r="2.5" fill="var(--orange)"/><line x1="13" y1="4" x2="13" y2="7" stroke="var(--bleu)" strokeWidth="1.5" strokeLinecap="round"/><line x1="13" y1="19" x2="13" y2="22" stroke="var(--bleu)" strokeWidth="1.5" strokeLinecap="round"/><line x1="4" y1="13" x2="7" y2="13" stroke="var(--bleu)" strokeWidth="1.5" strokeLinecap="round"/><line x1="19" y1="13" x2="22" y2="13" stroke="var(--bleu)" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    pm: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="2" y="5" width="22" height="16" rx="2.5" stroke="var(--bleu)" strokeWidth="1.5" fill="none"/><line x1="7" y1="10" x2="19" y2="10" stroke="var(--orange)" strokeWidth="1.5" strokeLinecap="round"/><line x1="7" y1="14" x2="14" y2="14" stroke="var(--bleu)" strokeWidth="1" strokeLinecap="round" opacity="0.5"/></svg>,
  }
  return icons[type] || null
}

export default function Home() {
  const [page, setPage] = useState('home')
  const [selectedPro, setSelectedPro] = useState(PROS[0])
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState({ show:false, msg:'', type:'' })
  const [annual, setAnnual] = useState(true)
  const [pricingTab, setPricingTab] = useState('pros')
  const [searchService, setSearchService] = useState('')
  const [searchRegion, setSearchRegion] = useState('Québec')
  let toastTimer = null

  function showToast(msg, type='blue') {
    clearTimeout(toastTimer)
    setToast({ show:true, msg, type })
    setTimeout(() => setToast(t => ({...t, show:false})), 3000)
  }

  function goTo(p, pro) {
    if (pro) setSelectedPro(pro)
    setPage(p)
    window.scrollTo({top:0, behavior:'smooth'})
  }

  const prices = {
    starter: annual ? 41 : 49,
    pro: annual ? 83 : 99,
    featured: annual ? 149 : 179,
    actif: annual ? 33 : 39,
    entreprise: annual ? 124 : 149,
    dPro: annual ? 107 : 129,
    dFeatured: annual ? 191 : 229,
  }

  const filteredPros = PROS.filter(p =>
    (!searchService || p.service.toLowerCase().includes(searchService.toLowerCase()) || searchService === '')
  )

  return (
    <>
      <Head>
        <title>MesServicesPro.ca — Les pros derrière les grands projets</title>
        <meta name="description" content="La plateforme québécoise qui regroupe les meilleurs experts en services professionnels impartis en construction." />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='14' height='14' rx='2' fill='%231B3A5C'/><rect x='16' width='16' height='16' rx='2' fill='%23E8651A'/><rect y='16' width='16' height='16' rx='2' fill='%23E8651A' opacity='.25'/><rect x='18' y='18' width='14' height='14' rx='2' fill='%231B3A5C' opacity='.45'/></svg>" />
      </Head>

      {/* NAV */}
      <nav className="nav">
        <div className="flex items-center gap-12">
          <div style={{cursor:'pointer', display:'flex', alignItems:'center', gap:10}} onClick={() => goTo('home')}>
            <NavIcon />
            <span className="nav-logo"><span className="m">Mes</span>ServicesPro<span style={{opacity:.4, fontSize:14}}>.ca</span></span>
          </div>
        </div>
        <div className="nav-links">
          <button className={`nav-link ${page==='home'?'active':''}`} onClick={() => goTo('home')}>Accueil</button>
          <button className={`nav-link ${page==='search'?'active':''}`} onClick={() => goTo('search')}>Trouver un pro</button>
          <button className={`nav-link ${page==='pricing'?'active':''}`} onClick={() => goTo('pricing')}>Abonnements</button>
          <button className={`nav-link ${page==='dashboard'?'active':''}`} onClick={() => goTo('dashboard')}>Tableau de bord</button>
        </div>
        <div className="nav-actions">
          <button className="btn btn-ghost" onClick={() => setModal('login')}>Se connecter</button>
          <button className="btn btn-primary" onClick={() => setModal('register')}>Rejoindre gratuitement</button>
        </div>
      </nav>

      {/* ===== HOME ===== */}
      {page === 'home' && (
        <>
          <div className="hero">
            <div className="hero-tag">Plateforme québécoise · Services professionnels impartis</div>
            <h1>Les pros derrière<br /><span>les grands projets.</span></h1>
            <p>Estimation · Dessin · BIM · Scan 3D · Gestion de projet. Tous vérifiés. Tous au même endroit.</p>
            <div className="search-bar">
              <select value={searchService} onChange={e => setSearchService(e.target.value)}>
                <option value="">Tous les services</option>
                <option>Estimation de coût</option>
                <option>Dessin / MEP / Atelier</option>
                <option>Modélisation BIM</option>
                <option>Scan 3D / As-built</option>
                <option>Gestion de projet</option>
              </select>
              <div className="search-divider" />
              <select value={searchRegion} onChange={e => setSearchRegion(e.target.value)}>
                <option>Québec</option>
                <option>Ontario</option>
                <option>Canada (tout)</option>
              </select>
              <div className="search-divider" />
              <input type="text" placeholder="Ville ou région..." />
              <button className="btn btn-primary" onClick={() => goTo('search')}>Rechercher</button>
            </div>
            <div className="hero-stats">
              {[['127','Professionnels vérifiés'],['5','Catégories'],['340+','Projets complétés'],['98%','Satisfaction client']].map(([v,l]) => (
                <div key={l}>
                  <div className="hero-stat-val">{v}</div>
                  <div className="hero-stat-lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <div className="section-title">Explorez par catégorie</div>
            <div className="section-sub">Des experts vérifiés dans chaque spécialité de la construction impartie</div>
            <div className="cats">
              {[
                {type:'estimation', name:'Estimation de coût', count:34},
                {type:'dessin', name:'Dessin / MEP / Atelier', count:28},
                {type:'bim', name:'Modélisation BIM', count:22},
                {type:'scan', name:'Scan 3D / As-built', count:19},
                {type:'pm', name:'Gestion de projet', count:24},
              ].map(c => (
                <div key={c.type} className="cat" onClick={() => goTo('search')}>
                  <div className="cat-icon"><CatIcon type={c.type} /></div>
                  <div className="cat-name">{c.name}</div>
                  <div className="cat-count">{c.count} professionnels</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{background:'var(--blanc)', padding:'60px 0'}}>
            <div className="section" style={{paddingTop:0, paddingBottom:0}}>
              <div className="section-title">Professionnels en vedette</div>
              <div className="section-sub">Nos membres Featured — vérifiés et hautement cotés</div>
              <div className="pros-list" style={{maxWidth:760}}>
                {PROS.filter(p => p.tier==='featured').map(pro => (
                  <div key={pro.id} className="pro-card featured" onClick={() => goTo('profile', pro)}>
                    <div className="pro-avatar" style={{background:pro.bg, color:pro.color}}>{pro.initials}</div>
                    <div className="pro-body">
                      <div className="pro-name-row">
                        <span className="pro-name">{pro.name}</span>
                        <TierBadge tier={pro.tier} />
                        {pro.verified && <span className="badge badge-verified">✓ Vérifié</span>}
                      </div>
                      <div className="pro-loc">{pro.service} · {pro.city}</div>
                      <div><Stars n={pro.rating} /><span className="pro-rating-text" style={{marginLeft:6}}>{pro.rating.toFixed(1)} ({pro.reviews} avis)</span></div>
                      <div className="tags mt-8">{pro.tags.map(t => <span key={t} className="tag tag-gray">{t}</span>)}</div>
                    </div>
                    <div className="pro-actions">
                      <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); goTo('profile', pro) }}>Voir le profil</button>
                      <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); showToast(`Message envoyé à ${pro.name} !`, 'orange') }}>Contacter</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-24"><button className="btn btn-secondary" onClick={() => goTo('search')}>Voir tous les professionnels →</button></div>
            </div>
          </div>

          <div className="section">
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:52, alignItems:'center'}}>
              <div>
                <div className="section-title">Pourquoi MesServicesPro.ca?</div>
                <div style={{marginTop:28, display:'flex', flexDirection:'column', gap:20}}>
                  {[
                    { icon:'#1B3A5C', bg:'var(--bleu-pale)', title:'Profils 100% vérifiés', desc:'Certifications validées, associations confirmées. Zéro imposteur sur la plateforme.' },
                    { icon:'var(--orange)', bg:'var(--orange-pale)', title:'Visibilité égale pour tous', desc:'Pas de favoritisme algorithmique. La qualité et les avis parlent d\'eux-mêmes.' },
                    { icon:'#27500A', bg:'#EAF3DE', title:'Gestion de projet intégrée', desc:'Devis, livrables, messagerie. Votre historique de projets reste sur la plateforme — c\'est votre actif.' },
                    { icon:'#1B3A5C', bg:'var(--bleu-pale)', title:'Réputation qui se bâtit', desc:'Chaque projet ajoute à votre score. Un actif qui grandit et qui vous différencie.' },
                  ].map(f => (
                    <div key={f.title} style={{display:'flex', gap:16, alignItems:'flex-start'}}>
                      <div style={{width:42, height:42, borderRadius:10, background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={f.icon} strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke={f.icon} strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </div>
                      <div>
                        <div style={{fontWeight:600, marginBottom:3}}>{f.title}</div>
                        <div className="text-sm text-muted">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:'var(--bleu)', borderRadius:'var(--radius-lg)', padding:36, color:'#fff'}}>
                <div style={{fontFamily:'var(--font-cond)', fontSize:28, fontWeight:700, marginBottom:10}}>Vous êtes un professionnel?</div>
                <div style={{fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.7, marginBottom:26}}>Rejoignez 127 experts vérifiés. Premier mois gratuit. Aucune carte de crédit requise.</div>
                {['Profil vérifié et badge de confiance','Accès à des donneurs d\'ouvrage qualifiés','Outils de gestion de projet inclus','Réputation portable et cumulable'].map(f => (
                  <div key={f} style={{display:'flex', alignItems:'center', gap:10, fontSize:13, color:'rgba(255,255,255,0.75)', marginBottom:10}}>
                    <span style={{color:'var(--orange)'}}>✓</span> {f}
                  </div>
                ))}
                <button className="btn btn-primary btn-lg w-full" style={{marginTop:22}} onClick={() => setModal('register')}>Créer mon profil pro →</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== SEARCH ===== */}
      {page === 'search' && (
        <>
          <div style={{background:'var(--bleu)', padding:'28px 32px'}}>
            <div style={{maxWidth:720, margin:'0 auto'}}>
              <div style={{fontFamily:'var(--font-cond)', fontSize:26, fontWeight:700, color:'#fff', marginBottom:16}}>Trouver un professionnel</div>
              <div className="search-bar" style={{maxWidth:'100%'}}>
                <select value={searchService} onChange={e => setSearchService(e.target.value)} style={{minWidth:180}}>
                  <option value="">Tous les services</option>
                  <option>Estimation de coût</option>
                  <option>Dessin / MEP / Atelier</option>
                  <option>Modélisation BIM</option>
                  <option>Scan 3D / As-built</option>
                  <option>Gestion de projet</option>
                </select>
                <div className="search-divider" />
                <select style={{minWidth:120}}>
                  <option>Québec</option><option>Ontario</option><option>Canada</option>
                </select>
                <div className="search-divider" />
                <input type="text" placeholder="Ville, région..." style={{minWidth:120}} />
                <button className="btn btn-primary">Chercher</button>
              </div>
            </div>
          </div>

          <div className="search-layout">
            <div className="filters">
              <div className="filter-section">
                <div className="filter-title">Type de membre</div>
                {['Featured','Pro','Starter'].map(t => (
                  <label key={t} className="filter-option"><input type="checkbox" defaultChecked={t!=='Starter'} />{t}</label>
                ))}
              </div>
              <div className="filter-section">
                <div className="filter-title">Note minimale</div>
                {['Tous','4.0+','4.5+','5.0 seulement'].map((r,i) => (
                  <label key={r} className="filter-option"><input type="radio" name="rating" defaultChecked={i===1} />{r}</label>
                ))}
              </div>
              <div className="filter-section">
                <div className="filter-title">Certifications</div>
                {['ESCQ','ECC','AEÉCQ','APCHQ','Revit certifié'].map(c => (
                  <label key={c} className="filter-option"><input type="checkbox" />{c}</label>
                ))}
              </div>
              <div className="filter-section">
                <div className="filter-title">Région</div>
                {['Montréal','Québec','Longueuil','Laval','Sherbrooke'].map(r => (
                  <label key={r} className="filter-option"><input type="checkbox" defaultChecked={true} />{r}</label>
                ))}
              </div>
            </div>

            <div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
                <div className="text-muted text-sm">{filteredPros.length} professionnels · {searchService || 'Tous les services'} · Québec</div>
                <select className="form-select" style={{width:'auto', fontSize:13, padding:'6px 10px'}}>
                  <option>Mieux cotés</option>
                  <option>Plus d'avis</option>
                  <option>Plus récents</option>
                </select>
              </div>
              <div className="pros-list">
                {filteredPros.map(pro => (
                  <div key={pro.id} className={`pro-card ${pro.tier==='featured'?'featured':''}`} onClick={() => goTo('profile', pro)}>
                    <div className="pro-avatar" style={{background:pro.bg, color:pro.color}}>{pro.initials}</div>
                    <div className="pro-body">
                      <div className="pro-name-row">
                        <span className="pro-name">{pro.name}</span>
                        <TierBadge tier={pro.tier} />
                        {pro.verified && <span className="badge badge-verified">✓ Vérifié</span>}
                      </div>
                      <div className="pro-loc">{pro.service} · {pro.city}</div>
                      <div><Stars n={pro.rating} /><span className="pro-rating-text" style={{marginLeft:6}}>{pro.rating.toFixed(1)} ({pro.reviews} avis)</span></div>
                      <div className="tags mt-8">{pro.tags.map(t => <span key={t} className="tag tag-gray">{t}</span>)}</div>
                    </div>
                    <div className="pro-actions">
                      <button className={`btn ${pro.tier==='featured'?'btn-primary':'btn-secondary'} btn-sm`} onClick={e => { e.stopPropagation(); goTo('profile', pro) }}>Voir profil</button>
                      {pro.tier !== 'starter' && <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); showToast(`Message envoyé à ${pro.name} !`, 'orange') }}>Contacter</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== PROFILE ===== */}
      {page === 'profile' && selectedPro && (
        <>
          <div style={{background:'var(--gris)', padding:'12px 32px', fontSize:13, color:'var(--texte-mid)'}}>
            <span style={{cursor:'pointer'}} onClick={() => goTo('search')}>← Retour aux résultats</span>
          </div>
          <div className="profile-layout">
            <div>
              <div className="profile-header">
                <div style={{display:'flex', gap:20, alignItems:'flex-start', marginBottom:20}}>
                  <div className="profile-avatar" style={{background:selectedPro.bg, color:selectedPro.color}}>{selectedPro.initials}</div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:8}}>
                      <span className="profile-name">{selectedPro.name}</span>
                      <TierBadge tier={selectedPro.tier} />
                      {selectedPro.verified && <span className="badge badge-verified">✓ Vérifié AEÉCQ</span>}
                    </div>
                    <div style={{fontSize:14, color:'var(--texte-mid)', marginBottom:10}}>{selectedPro.service} · {selectedPro.city}</div>
                    <div style={{display:'flex', alignItems:'center', gap:14}}>
                      <div><Stars n={selectedPro.rating} /><span className="pro-rating-text" style={{marginLeft:6}}>{selectedPro.rating.toFixed(1)} · {selectedPro.reviews} avis</span></div>
                      <div style={{fontSize:12, color:'var(--texte-mid)'}}>· Membre depuis 2024 · 47 projets complétés</div>
                    </div>
                  </div>
                </div>
                <p style={{fontSize:14, color:'var(--texte-mid)', lineHeight:1.75}}>{selectedPro.desc}</p>
              </div>

              <div className="profile-section">
                <h3>Services offerts</h3>
                <div className="tags">
                  {['Estimation résidentielle','Estimation commerciale','Estimation industrielle','Appels d\'offres','Analyse de soumissions','Formation APCHQ','Révision de budget'].map(s => (
                    <span key={s} className="tag tag-blue" style={{fontSize:12, padding:'5px 12px'}}>{s}</span>
                  ))}
                </div>
              </div>

              <div className="profile-section">
                <h3>Certifications vérifiées</h3>
                <div className="cert-grid">
                  {['Estimateur en construction qualifié (ESCQ)','Estimateur en construction certifié (ECC)','Formateur agréé APCHQ','Formateur agréé APECQ','Membre AEÉCQ (conseil d\'administration)','Formateur Batimatech'].map(c => (
                    <div key={c} className="cert-item"><div className="check-icon">✓</div>{c}</div>
                  ))}
                </div>
              </div>

              <div className="profile-section">
                <h3>Avis clients ({selectedPro.reviews})</h3>
                {REVIEWS.map(r => (
                  <div key={r.author} className="review-card">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
                      <div className="review-author">{r.author}</div>
                      <div><Stars n={r.rating} style={{fontSize:12}} /></div>
                    </div>
                    <div className="review-text">{r.text}</div>
                    <div className="tags mt-8">{r.tags.map(t => <span key={t} className="tag tag-gray">{t}</span>)}</div>
                  </div>
                ))}
                <button className="btn btn-secondary btn-sm mt-12">Voir tous les avis</button>
              </div>
            </div>

            <div>
              <div className="contact-card">
                <h3 style={{fontSize:12, fontWeight:600, marginBottom:10, opacity:.65}}>Contacter ce professionnel</h3>
                <div style={{fontSize:22, fontWeight:600, color:'#fff', marginBottom:4}}>Disponible</div>
                <div style={{fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:22}}>Répond généralement en moins de 24h</div>
                <button className="btn btn-primary w-full mb-8" onClick={() => setModal('contact')}>Envoyer un message</button>
                <button className="btn btn-ghost w-full" style={{fontSize:13}} onClick={() => showToast('Demande de devis envoyée !', 'orange')}>Demander un devis</button>
                <div style={{marginTop:22}}>
                  {[['Projets complétés','47'],['Taux de satisfaction','100%'],['Délai moyen','4.2 jours'],['Membre depuis','2024']].map(([l,v]) => (
                    <div key={l} className="stat-row">
                      <span style={{color:'rgba(255,255,255,0.55)'}}>{l}</span>
                      <span style={{fontWeight:600}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card mb-12">
                <div style={{fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--texte-mid)', marginBottom:12}}>Spécialités</div>
                <div className="tags">
                  {['Multi-logements','Commercial','Industriel','Résidentiel haut de gamme'].map(s => (
                    <span key={s} className="tag tag-orange">{s}</span>
                  ))}
                </div>
              </div>

              <div style={{background:'var(--gris)', borderRadius:'var(--radius-lg)', padding:18, fontSize:13, color:'var(--texte-mid)', lineHeight:1.6}}>
                <div style={{fontWeight:600, color:'var(--texte)', marginBottom:6}}>Vous avez déjà travaillé ensemble?</div>
                Laissez un avis et aidez les autres donneurs d'ouvrage à trouver les meilleurs pros.
                <div className="mt-10"><button className="btn btn-secondary btn-sm" onClick={() => showToast('Merci ! Votre avis a été soumis.')}>Laisser un avis</button></div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== DASHBOARD ===== */}
      {page === 'dashboard' && (
        <div className="dash-layout">
          <div className="dash-header">
            <div>
              <div style={{color:'rgba(255,255,255,0.55)', fontSize:13, marginBottom:4}}>Bienvenue sur votre espace</div>
              <div style={{fontFamily:'var(--font-cond)', fontSize:28, fontWeight:700, color:'#fff'}}>Construction Bélair Inc.</div>
              <div style={{marginTop:10, display:'flex', gap:8, alignItems:'center'}}>
                <span className="badge badge-pro" style={{fontSize:11}}>Client Actif</span>
                <span style={{fontSize:12, color:'rgba(255,255,255,0.4)'}}>Renouvellement dans 18 jours</span>
              </div>
            </div>
            <div style={{display:'flex', gap:8}}>
              <button className="btn btn-ghost btn-sm" onClick={() => goTo('search')}>Trouver un pro</button>
              <button className="btn btn-primary btn-sm" onClick={() => showToast('Nouveau projet créé !', 'orange')}>+ Nouveau projet</button>
            </div>
          </div>

          <div className="dash-metrics">
            {[
              {val:'3', lbl:'Projets actifs', delta:'+1 ce mois', color:'var(--bleu)'},
              {val:'12', lbl:'Projets complétés', delta:null, color:'var(--orange)'},
              {val:'7', lbl:'Pros consultés', delta:'+2 ce mois', color:'var(--bleu)'},
              {val:'4.8', lbl:'Votre score client', delta:null, color:'#27500A'},
            ].map(m => (
              <div key={m.lbl} className="metric">
                <div className="metric-val" style={{color:m.color}}>{m.val}</div>
                <div className="metric-lbl">{m.lbl}</div>
                {m.delta && <div className="metric-delta">{m.delta}</div>}
              </div>
            ))}
          </div>

          <div className="dash-grid">
            <div className="dash-card">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
                <h3 style={{margin:0}}>Projets en cours</h3>
                <button className="btn btn-secondary btn-sm">Voir tout</button>
              </div>
              {PROJECTS.map(p => (
                <div key={p.name} className="project-item">
                  <div className="project-icon" style={{background:'var(--bleu-pale)'}}>
                    <CatIcon type={p.service.includes('Estimation')?'estimation':p.service.includes('Dessin')?'dessin':'scan'} />
                  </div>
                  <div style={{flex:1}}>
                    <div className="project-name">{p.name}</div>
                    <div className="project-meta">Avec {p.pro} · {p.service}</div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width:`${p.pct}%`, background:p.color}} />
                    </div>
                    <div style={{fontSize:10, color:'var(--texte-mid)', marginTop:5}}>{p.pct}% complété</div>
                  </div>
                  <span className={`badge ${p.statusClass}`}>{p.status}</span>
                </div>
              ))}
            </div>

            <div>
              <div className="dash-card mb-16">
                <h3>Mes professionnels</h3>
                {PROS.slice(0,3).map(pro => (
                  <div key={pro.id} className="msg-item">
                    <div className="msg-avatar" style={{background:pro.bg, color:pro.color}}>{pro.initials}</div>
                    <div style={{flex:1}}>
                      <div className="msg-name">{pro.name}</div>
                      <div className="msg-preview text-xs text-muted">{pro.service} · {[4,2,1][PROS.indexOf(pro)]} projets</div>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => showToast(`Messagerie ${pro.name} ouverte !`, 'orange')}>Message</button>
                  </div>
                ))}
                <div className="mt-12">
                  <button className="btn btn-secondary btn-sm w-full" onClick={() => goTo('search')}>Trouver un nouveau pro →</button>
                </div>
              </div>

              <div className="dash-card">
                <h3>Messages récents</h3>
                {[
                  {name:'Précision DP', msg:'Voici la version préliminaire de l\'estimation...', time:'14h22', unread:true},
                  {name:'BIM Solutions QC', msg:'Plans révisés selon vos commentaires...', time:'Hier', unread:false},
                  {name:'ScanPro 3D', msg:'Disponible pour démarrer la semaine prochaine.', time:'Lundi', unread:false},
                ].map(m => (
                  <div key={m.name} className="msg-item" style={{cursor:'pointer'}}>
                    {m.unread ? <div className="unread-dot" /> : <div style={{width:8}} />}
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{display:'flex', justifyContent:'space-between'}}>
                        <div className="msg-name">{m.name}</div>
                        <div style={{fontSize:10, color:'var(--texte-mid)', flexShrink:0, marginLeft:8}}>{m.time}</div>
                      </div>
                      <div className="msg-preview" style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{m.msg}</div>
                    </div>
                  </div>
                ))}
                <div className="mt-12">
                  <button className="btn btn-secondary btn-sm w-full">Voir tous les messages</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== PRICING ===== */}
      {page === 'pricing' && (
        <div className="pricing-wrapper">
          <div style={{textAlign:'center', marginBottom:44}}>
            <div className="section-title" style={{marginBottom:8}}>Choisissez votre formule</div>
            <div style={{color:'var(--texte-mid)', fontSize:15}}>Abonnement sans engagement · Annulez à tout moment · Premier mois offert</div>
          </div>

          <div className="pricing-toggle">
            <span style={{fontSize:14, fontWeight:500}}>Mensuel</span>
            <button className={`toggle-track ${annual?'on':''}`} onClick={() => setAnnual(!annual)}>
              <div className="toggle-thumb" />
            </button>
            <span style={{fontSize:14, fontWeight:500}}>Annuel</span>
            <span className="saving-badge">2 mois gratuits</span>
          </div>

          <div className="pricing-tabs">
            {[['pros','Professionnels'],['clients','Donneurs d\'ouvrage'],['double','Bundles double']].map(([k,l]) => (
              <button key={k} className={`pricing-tab ${pricingTab===k?'active':''}`} onClick={() => setPricingTab(k)}>{l}</button>
            ))}
          </div>

          {pricingTab === 'pros' && (
            <div className="pricing-grid">
              {[
                { name:'Starter', price:prices.starter, desc:'Pour commencer à être visible. Idéal pour tester la plateforme.', cta:'Commencer', ctaClass:'btn-secondary', features:[['✓','Profil de base'],['✓','1 catégorie de service'],['✓','Coordonnées visibles'],['✓','Avis clients'],['✗','Badge vérifié'],['✗','Mise en avant'],['✗','Gestion documentaire'],['✗','Analytics']] },
                { name:'Pro', price:prices.pro, desc:'Profil complet, badge vérifié, outils de gestion. L\'essentiel pour croître.', cta:'Choisir Pro', ctaClass:'btn-primary', popular:true, features:[['✓','Profil complet + photo'],['✓','3 catégories de services'],['✓','Badge vérifié'],['✓','Messagerie intégrée'],['✓','Gestion documentaire'],['✓','Historique de projets'],['✗','Mise en avant'],['✗','Analytics avancés']] },
                { name:'Featured', price:prices.featured, desc:'Visibilité maximale. Apparaissez en tête des résultats dans votre catégorie.', cta:'Choisir Featured', ctaClass:'btn-primary', orange:true, features:[['✓','Tout ce qui est inclus dans Pro'],['✓','5 catégories de services'],['✓','Mise en avant algorithmique'],['✓','Badge Featured orange'],['✓','Analytics complets'],['✓','Priorité dans les recherches'],['✓','Support prioritaire'],['✓','Export de rapports']] },
              ].map(p => (
                <div key={p.name} className={`plan-card ${p.popular?'popular':''}`}>
                  {p.popular && <div className="popular-badge">Le plus populaire</div>}
                  <div className="plan-name">{p.name}</div>
                  <div className="plan-price">{p.price}$<span>/mois</span></div>
                  <div className="plan-desc">{p.desc}</div>
                  <button className={`btn ${p.ctaClass} w-full`} style={p.orange?{background:'var(--orange)'}:{}} onClick={() => showToast(`Inscription ${p.name} démarrée !`, p.orange?'orange':'blue')}>{p.cta}</button>
                  <div className="plan-divider" />
                  {p.features.map(([check, text]) => (
                    <div key={text} className="plan-feature">
                      <span className={check==='✓'?'plan-check':'plan-x'}>{check}</span>{text}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {pricingTab === 'clients' && (
            <div className="pricing-grid">
              {[
                { name:'Gratuit', price:'0', desc:'Explorez la plateforme. Parfait pour découvrir les professionnels disponibles.', cta:'Créer un compte', ctaClass:'btn-secondary', features:[['✓','Recherche de pros'],['✓','Consultation des profils'],['✓','Lecture des avis'],['✗','Accès aux coordonnées'],['✗','Messagerie directe'],['✗','Gestion de projets']] },
                { name:'Actif', price:prices.actif, desc:'Premier mois gratuit. Tout ce qu\'il faut pour gérer vos mandats impartis.', cta:'Essai gratuit 1 mois', ctaClass:'btn-primary', popular:true, features:[['✓','Accès aux coordonnées'],['✓','Messagerie directe'],['✓','3 projets actifs'],['✓','Historique de projets'],['✓','Dossiers documentaires'],['✗','Multi-utilisateurs'],['✗','Rapports et exports']] },
                { name:'Entreprise', price:prices.entreprise, desc:'Pour les équipes qui gèrent plusieurs projets simultanément.', cta:'Demander une démo', ctaClass:'btn-secondary', features:[['✓','Tout ce qui est inclus dans Actif'],['✓','Projets illimités'],['✓','Multi-utilisateurs (5+)'],['✓','Tableau de bord équipe'],['✓','Rapports et exports'],['✓','Support dédié'],['✓','Intégrations sur demande']] },
              ].map(p => (
                <div key={p.name} className={`plan-card ${p.popular?'popular':''}`}>
                  {p.popular && <div className="popular-badge">Recommandé</div>}
                  <div className="plan-name">{p.name}</div>
                  <div className="plan-price">{p.price}$<span>/mois</span></div>
                  <div className="plan-desc">{p.desc}</div>
                  <button className={`btn ${p.ctaClass} w-full`} onClick={() => showToast(p.popular?'Premier mois gratuit activé !':'Inscription démarrée !')}>{p.cta}</button>
                  <div className="plan-divider" />
                  {p.features.map(([check, text]) => (
                    <div key={text} className="plan-feature">
                      <span className={check==='✓'?'plan-check':'plan-x'}>{check}</span>{text}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {pricingTab === 'double' && (
            <div>
              <div style={{textAlign:'center', color:'var(--texte-mid)', fontSize:14, marginBottom:32}}>Pour les professionnels qui sont aussi donneurs d'ouvrage. Cumulez les deux côtés à prix réduit.</div>
              <div className="pricing-grid">
                <div className="plan-card">
                  <div className="plan-name">Double Pro</div>
                  <div className="plan-price">{prices.dPro}$<span>/mois</span></div>
                  <div className="plan-desc">Profil Pro + Accès Client Actif. La formule pour ceux qui donnent et reçoivent des mandats.</div>
                  <button className="btn btn-secondary w-full" onClick={() => showToast('Bundle Double Pro sélectionné !')}>Choisir Double Pro</button>
                  <div className="plan-divider" />
                  {[['✓','Tout Pro (profil, 3 catégories, badge)'],['✓','Tout Client Actif (coords, messagerie)'],['✓','3 projets actifs'],['✓','Économie : 9$/mois']].map(([c,t]) => (
                    <div key={t} className="plan-feature"><span className="plan-check">{c}</span>{t}</div>
                  ))}
                </div>
                <div className="plan-card popular">
                  <div className="popular-badge">Meilleure valeur</div>
                  <div className="plan-name">Double Featured</div>
                  <div className="plan-price">{prices.dFeatured}$<span>/mois</span></div>
                  <div className="plan-desc">Profil Featured + Accès Client Entreprise. Le maximum des deux mondes.</div>
                  <button className="btn btn-primary w-full" style={{background:'var(--orange)'}} onClick={() => showToast('Bundle Double Featured sélectionné !', 'orange')}>Choisir Double Featured</button>
                  <div className="plan-divider" />
                  {[['✓','Tout Featured (5 catégories, mise en avant)'],['✓','Tout Client Entreprise (multi-users)'],['✓','Projets illimités'],['✓','Économie : 99$/mois']].map(([c,t]) => (
                    <div key={t} className="plan-feature"><span className="plan-check">{c}</span>{t}</div>
                  ))}
                </div>
                <div />
              </div>
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-logo"><span>Mes</span>ServicesPro.ca</div>
            <p style={{fontSize:13, lineHeight:1.7, marginBottom:18}}>La plateforme québécoise qui regroupe les meilleurs experts en services professionnels impartis en construction.</p>
            <div style={{fontSize:12}}>© 2026 MesServicesPro Inc. Tous droits réservés.</div>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <a>Estimation de coût</a>
            <a>Dessin / MEP / Atelier</a>
            <a>Modélisation BIM</a>
            <a>Scan 3D / As-built</a>
            <a>Gestion de projet</a>
          </div>
          <div className="footer-col">
            <h4>Plateforme</h4>
            <a onClick={() => goTo('pricing')}>Abonnements</a>
            <a onClick={() => setModal('register')}>S'inscrire</a>
            <a>Comment ça marche</a>
            <a>Valider mon profil</a>
          </div>
          <div className="footer-col">
            <h4>À propos</h4>
            <a>Notre mission</a>
            <a>L'équipe</a>
            <a>Blog</a>
            <a>Nous joindre</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div>MesServicesPro.ca — Les pros derrière les grands projets.</div>
          <div style={{display:'flex', gap:20}}>
            <a>Politique de confidentialité</a>
            <a>Conditions d'utilisation</a>
            <a>Loi 25</a>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <div className={`modal-bg ${modal==='login'?'open':''}`}>
        <div className="modal">
          <button className="modal-close" onClick={() => setModal(null)}>×</button>
          <div style={{textAlign:'center', marginBottom:22}}>
            <div style={{fontFamily:'var(--font-cond)', fontSize:30, fontWeight:700}}><span style={{color:'var(--orange)'}}>Mes</span><span style={{color:'var(--bleu)'}}>ServicesPro</span></div>
          </div>
          <h2>Se connecter</h2>
          <p>Accédez à votre espace professionnel ou client.</p>
          <div className="form-group"><label className="form-label">Courriel</label><input className="form-input" type="email" placeholder="vous@exemple.com" /></div>
          <div className="form-group"><label className="form-label">Mot de passe</label><input className="form-input" type="password" placeholder="••••••••" /></div>
          <button className="btn btn-primary w-full" style={{marginTop:8}} onClick={() => { setModal(null); showToast('Connexion réussie ! Bienvenue.') }}>Se connecter</button>
          <div style={{textAlign:'center', marginTop:16, fontSize:13, color:'var(--texte-mid)'}}>Pas encore de compte ? <a style={{color:'var(--bleu)', fontWeight:600, cursor:'pointer'}} onClick={() => setModal('register')}>S'inscrire</a></div>
        </div>
      </div>

      <div className={`modal-bg ${modal==='register'?'open':''}`}>
        <div className="modal" style={{maxWidth:480}}>
          <button className="modal-close" onClick={() => setModal(null)}>×</button>
          <h2>Rejoindre MesServicesPro</h2>
          <p>Créez votre compte gratuitement. Premier mois offert, sans carte de crédit.</p>
          <div className="form-group">
            <label className="form-label">Je suis</label>
            <select className="form-select">
              <option>Un professionnel (je veux être visible)</option>
              <option>Un donneur d'ouvrage (je cherche des pros)</option>
              <option>Les deux à la fois</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Prénom</label><input className="form-input" placeholder="Danny" /></div>
            <div className="form-group"><label className="form-label">Nom</label><input className="form-input" placeholder="Pineault" /></div>
          </div>
          <div className="form-group"><label className="form-label">Entreprise</label><input className="form-input" placeholder="Précision DP" /></div>
          <div className="form-group"><label className="form-label">Courriel professionnel</label><input className="form-input" type="email" placeholder="danny@precisiondp.ca" /></div>
          <div className="form-group"><label className="form-label">Mot de passe</label><input className="form-input" type="password" placeholder="Minimum 8 caractères" /></div>
          <button className="btn btn-primary w-full" style={{marginTop:8}} onClick={() => { setModal(null); showToast('Compte créé ! Bienvenue sur MesServicesPro.ca', 'orange') }}>Créer mon compte gratuitement</button>
          <div style={{textAlign:'center', marginTop:12, fontSize:12, color:'var(--texte-mid)'}}>En créant un compte, vous acceptez nos conditions d'utilisation et la politique de confidentialité.</div>
        </div>
      </div>

      <div className={`modal-bg ${modal==='contact'?'open':''}`}>
        <div className="modal">
          <button className="modal-close" onClick={() => setModal(null)}>×</button>
          <h2>Contacter {selectedPro?.name}</h2>
          <p>Décrivez votre projet pour obtenir une réponse rapide.</p>
          <div className="form-group"><label className="form-label">Sujet</label><select className="form-select"><option>Demande de devis</option><option>Question générale</option><option>Disponibilité</option></select></div>
          <div className="form-group"><label className="form-label">Type de projet</label><select className="form-select"><option>Résidentiel</option><option>Commercial</option><option>Industriel</option><option>Autre</option></select></div>
          <div className="form-group"><label className="form-label">Message</label><textarea className="form-input" rows={4} placeholder="Décrivez votre projet, l'échéancier souhaité, et toute information pertinente..." /></div>
          <button className="btn btn-primary w-full" onClick={() => { setModal(null); showToast(`Message envoyé à ${selectedPro?.name} ! Réponse sous 24h.`, 'orange') }}>Envoyer le message</button>
        </div>
      </div>

      {/* TOAST */}
      <div className={`toast ${toast.show?'show':''} ${toast.type==='orange'?'orange':''}`}>
        {toast.msg}
      </div>
    </>
  )
}
