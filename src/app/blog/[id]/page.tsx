import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  image: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "5 Tips voor een Ergonomische Werkplek",
    excerpt: "Ontdek hoe je jouw werkplek kunt optimaliseren voor betere gezondheid en productiviteit.",
    date: "15 januari 2025",
    readTime: "5 min",
    category: "Ergonomie",
    author: "DESKNA Team",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=1200&auto=format&fit=crop",
    tags: ["ergonomie", "werkplek", "gezondheid", "productiviteit"],
    content: `
      <p>Een ergonomische werkplek is essentieel voor je gezondheid en productiviteit. Of je nu thuis werkt of op kantoor, de juiste inrichting kan een wereld van verschil maken voor je welzijn.</p>

      <h2>1. Juiste Stoelhoogte</h2>
      <p>De hoogte van je stoel is cruciaal voor een goede houding. Je voeten moeten plat op de grond staan en je knieën moeten een hoek van ongeveer 90 graden maken.</p>
      
      <p>Als je voeten niet de grond raken, gebruik dan een voetensteun. Dit zorgt voor een betere houding en vermindert de druk op je onderrug.</p>

      <h2>2. Beeldschermhoogte Optimaliseren</h2>
      <p>De bovenkant van je beeldscherm moet op ooghoogte zijn of iets lager. Dit voorkomt dat je je nek moet buigen om naar het scherm te kijken.</p>
      
      <p>Gebruik een monitorarm of laptopstandaard om de juiste hoogte te bereiken. Voor laptopgebruikers is een externe monitor vaak de beste oplossing.</p>

      <h2>3. Toetsenbord en Muis Positionering</h2>
      <p>Plaats je toetsenbord en muis op dezelfde hoogte als je ellebogen. Je polsen moeten recht blijven tijdens het typen.</p>
      
      <p>Overweeg een ergonomisch toetsenbord of polssteun als je veel typt. Dit kan RSI-klachten voorkomen.</p>

      <h2>4. Verlichting en Reflectie</h2>
      <p>Zorg voor voldoende verlichting zonder schittering op je scherm. Natuurlijk licht is het beste, maar vermijd directe zonnestralen op je beeldscherm.</p>
      
      <p>Plaats je beeldscherm loodrecht op ramen om reflectie te voorkomen. Gebruik indien nodig een bureaulamp voor extra verlichting.</p>

      <h2>5. Regelmatige Pauzes</h2>
      <p>Zelfs met de perfecte opstelling is het belangrijk om regelmatig te bewegen. Langdurig zitten kan leiden tot verschillende gezondheidsklachten.</p>
      
      <p>Sta elke 30-60 minuten op, rek je uit en loop een rondje. Dit helpt bij de doorbloeding en voorkomt stijfheid. Gebruik een timer om jezelf eraan te herinneren.</p>

      <h2>Conclusie</h2>
      <p>Een ergonomische werkplek is een investering in je gezondheid. Door deze eenvoudige aanpassingen door te voeren, kun je rugpijn, nekklachten en andere werkgerelateerde problemen voorkomen.</p>
      
      <p>Begin vandaag nog met het optimaliseren van je werkplek. Je lichaam zal je dankbaar zijn!</p>
    `
  },
  {
    id: 2,
    title: "Zit-Sta Bureau: Waarom de Investering het Waard is",
    excerpt: "De voordelen van een zit-sta bureau en hoe het je werkdag kan transformeren.",
    date: "10 januari 2025",
    readTime: "7 min",
    category: "Productadvies",
    author: "DESKNA Team",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=1200&auto=format&fit=crop",
    tags: ["zit-sta bureau", "gezondheid", "productiviteit", "werkplek"],
    content: `
      <p>Een zit-sta bureau is meer dan alleen een trend - het is een revolutie voor je werkdag. Steeds meer mensen ontdekken de voordelen van afwisselend zitten en staan tijdens het werken.</p>

      <p>In dit artikel ontdek je waarom een zit-sta bureau een slimme investering is voor je gezondheid en productiviteit.</p>

      <h2>Gezondheidsvoordelen</h2>
      <p>Langdurig zitten wordt vaak "het nieuwe roken" genoemd vanwege de negatieve gevolgen voor je gezondheid. Een zit-sta bureau helpt deze problemen aan te pakken:</p>

      <h3>Verbeterde Doorbloeding</h3>
      <p>Staan activeert je spieren en verbetert de bloedcirculatie. Dit zorgt voor meer zuurstof naar je hersenen en kan je alertheid verhogen.</p>
      
      <p>Onderzoek toont aan dat mensen die regelmatig staan tijdens het werken een lagere kans hebben op hart- en vaatziekten.</p>

      <h3>Minder Rugklachten</h3>
      <p>Door af te wisselen tussen zitten en staan verminder je de druk op je onderrug. Dit kan bestaande rugpijn verlichten en toekomstige problemen voorkomen.</p>
      
      <p>Veel gebruikers ervaren al binnen enkele weken een significante verbetering van hun rugklachten.</p>

      <h3>Betere Houding</h3>
      <p>Staan moedigt een natuurlijke, rechte houding aan. Dit helpt bij het voorkomen van de "computernekhouding" die veel thuiswerkers ontwikkelen.</p>
      
      <p>Een goede houding heeft ook positieve effecten op je zelfvertrouwen en uitstraling.</p>

      <h2>Productiviteitsvoordelen</h2>
      <p>Naast de gezondheidsvoordelen kan een zit-sta bureau ook je productiviteit verhogen:</p>

      <h3>Verhoogde Energie</h3>
      <p>Veel gebruikers rapporteren meer energie gedurende de dag. Het afwisselen van houding houdt je lichaam actief en alert.</p>
      
      <p>Dit betekent minder middagdips en een consistentere energielevel gedurende de werkdag.</p>

      <h3>Betere Focus</h3>
      <p>De lichte fysieke activiteit van staan kan je concentratie verbeteren en creativiteit stimuleren.</p>
      
      <p>Sommige mensen vinden dat ze beter kunnen nadenken en problemen oplossen terwijl ze staan.</p>

      <h2>Tips voor Gebruik</h2>
      <p>Om optimaal te profiteren van je zit-sta bureau, volg deze praktische tips:</p>
      
      <ul>
        <li>Begin geleidelijk - start met 15-30 minuten staan per keer</li>
        <li>Wissel elke 30-60 minuten van houding</li>
        <li>Gebruik een anti-vermoeidheidsmat voor comfort</li>
        <li>Zorg voor goede schoenen met ondersteuning</li>
        <li>Luister naar je lichaam en pas aan waar nodig</li>
      </ul>

      <p>Het is belangrijk om niet te lang achter elkaar te staan. Afwisseling is de sleutel tot succes.</p>

      <h2>Conclusie</h2>
      <p>Een zit-sta bureau is een waardevolle investering in je gezondheid en welzijn. Hoewel de aanschafkosten hoger zijn dan een traditioneel bureau, zijn de lange termijn voordelen voor je gezondheid en productiviteit de investering meer dan waard.</p>
      
      <p>Begin vandaag nog met het onderzoeken van de mogelijkheden. Je toekomstige zelf zal je dankbaar zijn voor deze investering in je welzijn.</p>
    `
  },
  {
    id: 3,
    title: "De Perfecte Bureustoel Kiezen: Complete Gids",
    excerpt: "Alles wat je moet weten over het kiezen van de juiste bureustoel voor jouw behoeften.",
    date: "5 januari 2025",
    readTime: "10 min",
    category: "Koopadvies",
    author: "DESKNA Team",
    image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?q=80&w=1200&auto=format&fit=crop",
    tags: ["bureustoel", "ergonomie", "koopadvies", "comfort"],
    content: `
      <p>Het kiezen van de juiste bureustoel is een van de belangrijkste beslissingen die je kunt maken voor je werkplek. Een goede stoel ondersteunt je gezondheid, verhoogt je comfort en kan je productiviteit verbeteren.</p>

      <p>In deze uitgebreide gids leer je alles wat je moet weten om de perfecte bureustoel te kiezen voor jouw specifieke behoeften.</p>

      <h2>Waarom is een Goede Bureustoel Belangrijk?</h2>
      <p>De gemiddelde kantoorwerker zit 8-10 uur per dag. Een slechte stoel kan leiden tot verschillende gezondheidsproblemen:</p>
      
      <ul>
        <li>Rugpijn en nekklachten</li>
        <li>Slechte houding</li>
        <li>Verminderde concentratie</li>
        <li>Lange termijn gewrichtsproblemen</li>
      </ul>

      <p>Een investering in een goede bureustoel is daarom een investering in je gezondheid en welzijn.</p>
      
      <h2>Belangrijke Features om op te Letten</h2>
      
      <h3>1. Lendensteun</h3>
      <p>Een goede lendensteun is essentieel voor het behouden van de natuurlijke curve van je onderrug. Zoek naar stoelen met verstelbare lendensteun die je kunt aanpassen aan je lichaamsvorm.</p>
      
      <p>Zonder proper lendensteun kan je onderrug pijnlijk worden en kun je een slechte houding ontwikkelen.</p>

      <h3>2. Verstelbare Zithoogte</h3>
      <p>Je stoel moet gemakkelijk in hoogte verstelbaar zijn. Je voeten moeten plat op de grond staan met je knieën in een hoek van ongeveer 90 graden.</p>
      
      <p>Een pneumatische gasveer is de meest gebruikelijke en betrouwbare manier om de zithoogte te verstellen.</p>

      <h3>3. Armleuningen</h3>
      <p>Verstelbare armleuningen ondersteunen je armen en verminderen de spanning in je schouders en nek. Ze moeten in hoogte en breedte verstelbaar zijn.</p>
      
      <p>Goede armleuningen kunnen ook vooruit en achteruit bewegen om perfect aan te sluiten bij je bureau.</p>

      <h3>4. Zitdiepte en -breedte</h3>
      <p>De zitting moet breed genoeg zijn voor comfort en diep genoeg zodat je rug tegen de rugleuning rust, maar niet zo diep dat je knieën tegen de zitting drukken.</p>
      
      <p>Er moet ongeveer 2-4 cm ruimte zijn tussen de voorkant van de zitting en je knieën.</p>

      <h3>5. Materiaal en Ademendheid</h3>
      <p>Mesh stoelen bieden goede ventilatie, terwijl gestoffeerde stoelen meer comfort kunnen bieden. Kies gebaseerd op je persoonlijke voorkeur en klimaat.</p>
      
      <p>In warme omgevingen is mesh vaak de betere keuze, terwijl gestoffeerde stoelen meer luxe uitstralen.</p>
      
      <h2>Verschillende Types Bureaustoelen</h2>
      
      <h3>Ergonomische Stoelen</h3>
      <p>Ontworpen met de menselijke anatomie in gedachten. Vaak duurder maar bieden superieure ondersteuning voor lange werkdagen.</p>
      
      <p>Deze stoelen zijn de beste keuze voor mensen die dagelijks vele uren achter een bureau zitten.</p>

      <h3>Gaming Stoelen</h3>
      <p>Vaak stijlvol en comfortabel voor korte sessies, maar niet altijd de beste keuze voor 8+ uur werken per dag.</p>
      
      <p>Ze zien er spectaculair uit, maar missen vaak de ergonomische features die je nodig hebt voor kantoorwerk.</p>

      <h3>Executive Stoelen</h3>
      <p>Luxe uitstraling met leder bekleding. Goed voor representatie maar let op ergonomische features.</p>
      
      <p>Perfect voor vergaderruimtes en directiekamers, maar controleer altijd of ze ook ergonomisch verantwoord zijn.</p>

      <h3>Mesh Stoelen</h3>
      <p>Uitstekende ventilatie en vaak goede ergonomische ondersteuning. Ideaal voor warme omgevingen.</p>
      
      <p>De ademende eigenschappen maken ze populair in moderne kantoren en thuiswerkplekken.</p>
      
      <h2>Budget Overwegingen</h2>
      <p>Bureaustoelen variëren van €100 tot €1500+. Onthoud dat dit een investering is in je gezondheid:</p>

      <h3>Budget Range (€100-€300)</h3>
      <p>Basis ergonomische features, geschikt voor gelegenheidgebruik of korte werkdagen.</p>
      
      <p>In deze prijsklasse vind je eenvoudige stoelen die de basis functies bieden, maar mogelijk niet alle geavanceerde features hebben.</p>

      <h3>Mid-Range (€300-€700)</h3>
      <p>Goede ergonomische ondersteuning, duurzame materialen, geschikt voor dagelijks gebruik.</p>
      
      <p>Dit is vaak de sweet spot voor de meeste mensen - goede kwaliteit zonder de premium prijzen.</p>

      <h3>Premium (€700+)</h3>
      <p>Top ergonomische features, premium materialen, lange garantie. Ideaal voor intensief gebruik.</p>
      
      <p>Voor mensen die dagelijks 8+ uur achter een bureau zitten, is deze investering vaak de moeite waard.</p>
      
      <h2>Test Tips</h2>
      <p>Voordat je een bureustoel koopt, is het belangrijk om deze grondig te testen:</p>
      
      <ul>
        <li>Test de stoel minstens 15 minuten</li>
        <li>Controleer alle verstelmogelijkheden</li>
        <li>Let op de kwaliteit van wieltjes en gasveer</li>
        <li>Vraag naar garantie en retourbeleid</li>
        <li>Lees reviews van andere gebruikers</li>
      </ul>

      <p>Een korte test van een paar minuten is niet genoeg. Probeer verschillende houdingen en verstelmogelijkheden uit.</p>

      <h2>Onderhoud Tips</h2>
      <p>Om je investering te beschermen en de levensduur van je stoel te verlengen:</p>
      
      <ul>
        <li>Reinig regelmatig volgens instructies</li>
        <li>Controleer en draai schroeven indien nodig</li>
        <li>Smeer bewegende onderdelen jaarlijks</li>
        <li>Vervang onderdelen tijdig bij slijtage</li>
      </ul>

      <p>Goed onderhoud kan de levensduur van je stoel aanzienlijk verlengen en zorgt ervoor dat alle functies optimaal blijven werken.</p>

      <h2>Conclusie</h2>
      <p>De perfecte bureustoel is een persoonlijke keuze die afhangt van je lichaamsbouw, werkgewoonten en budget. Investeer de tijd om verschillende opties te testen en kies een stoel die je comfort en gezondheid ondersteunt voor jaren vooruit.</p>
      
      <p>Onthoud: een goede stoel is een investering in je welzijn, niet alleen een meubelstuk. Je rug, nek en algehele gezondheid zullen je dankbaar zijn voor deze zorgvuldige keuze.</p>
      
      <p>Begin vandaag nog met je zoektocht naar de perfecte bureustoel. Je toekomstige productieve en pijnvrije werkdagen wachten op je!</p>
    `
  }
];

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: post.id.toString(),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id.toString() === id);
  
  if (!post) {
    return {
      title: 'Blog Post Niet Gevonden | DESKNA',
    };
  }

  return {
    title: `${post.title} | DESKNA Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id.toString() === id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <div className="relative h-full flex items-end">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="mb-4">
              <Link 
                href="/blog" 
                className="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Terug naar blog
              </Link>
            </div>
            <div className="flex items-center space-x-4 text-sm text-white/80 mb-4">
              <span className="bg-white/20 px-3 py-1 rounded-full">{post.category}</span>
              <span>{post.date}</span>
              <span>{post.readTime}</span>
              <span>Door {post.author}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-5 prose-ul:text-gray-600 prose-ul:mb-5 prose-li:mb-2 prose-li:leading-relaxed">
          <div 
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Gerelateerde Artikelen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts
              .filter((p) => p.id !== post.id)
              .slice(0, 2)
              .map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`} className="group">
                  <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative bg-gray-100">
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">{relatedPost.category}</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700">
                        {relatedPost.title}
                      </h4>
                      <p className="text-gray-600">{relatedPost.excerpt}</p>
                    </div>
                  </article>
                </Link>
              ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Vragen over ergonomische werkplekken?
          </h3>
          <p className="text-gray-600 mb-6">
            Ons team staat klaar om je te helpen met persoonlijk advies.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Neem contact op
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

    </div>
  );
}
