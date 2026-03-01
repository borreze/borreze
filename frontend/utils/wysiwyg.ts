export const defaultContent = `
<h1 style="text-align: center">Guide complet du WYSIWYG — Toutes les fonctionnalités</h1>

<p style="text-align: center"><em>Un article de démonstration pour tester chaque élément disponible dans l'éditeur.</em></p>

<hr>

<h2>1. Mise en forme du texte</h2>

<p>
    L'éditeur supporte les styles de base : <strong>texte en gras</strong>, <em>texte en italique</em>,
    <u>texte souligné</u>, et <s>texte barré</s>. On peut bien sûr les <strong><em><u>combiner</u></em></strong> librement.
</p>

<h2>2. Titres</h2>

<h1>Titre de niveau 1</h1>
<h2>Titre de niveau 2</h2>
<h3>Titre de niveau 3</h3>

<p>Les titres permettent de structurer le contenu en sections claires et hiérarchisées.</p>

<h2>3. Alignement du texte</h2>

<p style="text-align: left">Ce paragraphe est aligné à <strong>gauche</strong> (comportement par défaut).</p>
<p style="text-align: center">Ce paragraphe est <strong>centré</strong>.</p>
<p style="text-align: right">Ce paragraphe est aligné à <strong>droite</strong>.</p>
<p style="text-align: justify">Ce paragraphe est <strong>justifié</strong>. Le texte est réparti uniformément sur toute la largeur de la colonne, ce qui donne un aspect plus formel et typographiquement soigné, souvent utilisé dans les documents imprimés ou les articles de presse.</p>

<h2>4. Listes</h2>

<p><strong>Liste à puces :</strong></p>
<ul>
    <li>Premier élément de liste non ordonnée</li>
    <li>Deuxième élément avec du <strong>texte gras</strong></li>
    <li>Troisième élément avec un <a href="https://example.com">lien</a></li>
</ul>

<p><strong>Liste numérotée :</strong></p>
<ol>
    <li>Étape une — installer les dépendances</li>
    <li>Étape deux — configurer l'éditeur</li>
    <li>Étape trois — intégrer le composant dans la page</li>
</ol>

<h2>5. Liens</h2>

<p>
    Voici un <a href="https://example.com" target="_blank">lien</a> qui s'ouvre dans un nouvel onglet.
    Les liens sont stylisés automatiquement et restent accessibles au clavier.
</p>

<h2>6. Citation</h2>

<blockquote>
    <p>La simplicité est la sophistication suprême. Un bon outil disparaît derrière l'usage qu'on en fait.</p>
</blockquote>

<p>Les citations permettent de mettre en valeur une pensée ou une référence externe.</p>

<h2>7. Ligne horizontale</h2>

<p>Une ligne de séparation visuelle entre deux sections :</p>

<hr>

<p>Le contenu reprend normalement après la ligne.</p>

<h2>8. Image redimensionnable</h2>

<p>L'image ci-dessous peut être redimensionnée en faisant glisser la poignée en bas à droite :</p>

<img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80" alt="Code sur un écran de développeur" style="width:480px;max-width:100%">

<h2>9. Tableau</h2>

<p>Les tableaux supportent le redimensionnement des colonnes et la sélection de cellules :</p>

<table>
    <thead>
        <tr>
            <th>Fonctionnalité</th>
            <th>Statut</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Gras / Italique</strong></td>
            <td>✅ Actif</td>
        </tr>
        <tr>
            <td><strong>Alignement</strong></td>
            <td>✅ Actif</td>
        </tr>
        <tr>
            <td><strong>Liens</strong></td>
            <td>✅ Actif</td>
        </tr>
        <tr>
            <td><strong>Images</strong></td>
            <td>✅ Actif</td>
        </tr>
        <tr>
            <td><strong>Tableaux</strong></td>
            <td>✅ Actif</td>
        </tr>
        <tr>
            <td><strong>Boutons</strong></td>
            <td>✅ Actif</td>
        </tr>
    </tbody>
</table>

<h2>10. Boutons</h2>

<p>Les boutons permettent d'appeler à l'action directement dans le contenu :</p>

<p>
    <a data-wybutton="" class="wy-btn wy-btn--primary" href="https://example.com">Bouton Primaire</a>
    <a data-wybutton="" class="wy-btn wy-btn--gray" href="https://example.com">Bouton Gris</a>
    <a data-wybutton="" class="wy-btn wy-btn--outline" href="https://example.com">Bouton Contours</a>
</p>

<hr>

<p style="text-align: center"><em>Fin de l'article de démonstration.</em></p>
`

export const nl2br = (str: string): string => {
    return str.replace(/\n/g, '<br />')
}

export const sanitizeHtml = (html: string): string => {
    // TODO replce by DOMPurify
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    doc.querySelectorAll('*').forEach((el) => {
            // Supprimer les attributs on*
            Array.from(el.attributes).forEach((attr) => {
              if (attr.name.startsWith('on')) el.removeAttribute(attr.name)
            })
            // Supprimer les href javascript:
            const href = el.getAttribute('href')
            if (href && /^javascript:/i.test(href.trim())) el.removeAttribute('href')
            // Supprimer les src data: (hors images légitimes)
            const src = el.getAttribute('src')
            if (src && /^data:(?!image\/(png|jpe?g|gif|webp|svg))/i.test(src.trim())) el.removeAttribute('src')
    })

    return doc.body.innerHTML
}   

